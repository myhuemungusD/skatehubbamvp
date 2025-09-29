import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { authRequired } from "./authRequired";
import {
  ApproveSubmissionInputSchema,
  ApproveSubmissionOutput,
  SubmissionDoc,
  ChallengeDoc,
} from "./schemas";

const db = getFirestore();

export const approveSubmission = onCall(async (request) => {
  // Validate authentication and role
  const { uid: reviewerUid } = authRequired(request, ["mod", "admin"]);

  // Validate input
  const validatedData = ApproveSubmissionInputSchema.parse(request.data);
  const { submissionId } = validatedData;

  try {
    // Run transaction to ensure consistency
    const result = await db.runTransaction(async (transaction) => {
      // 1. Validate submission exists and status == 'pending'
      const submissionRef = db.collection("submissions").doc(submissionId);
      const submissionDoc = await transaction.get(submissionRef);

      if (!submissionDoc.exists) {
        throw new HttpsError("not-found", "Submission not found");
      }

      const submission = submissionDoc.data() as SubmissionDoc;

      if (submission.status !== "pending") {
        throw new HttpsError(
          "failed-precondition",
          `Cannot approve submission with status: ${submission.status}`
        );
      }

      // 2. Prevent acting on own submission
      if (submission.ownerUid === reviewerUid) {
        throw new HttpsError(
          "permission-denied",
          "Cannot approve your own submission"
        );
      }

      // 3. Fetch challenge.points (default 0 if missing)
      const challengeRef = db.collection("challenges").doc(submission.challengeId);
      const challengeDoc = await transaction.get(challengeRef);
      
      let points = 0;
      if (challengeDoc.exists) {
        const challenge = challengeDoc.data() as ChallengeDoc;
        points = challenge.points || 0;
      }

      // 4. Update submission: status 'approved', approvedAt, reviewedAt, reviewedBy
      const now = FieldValue.serverTimestamp();
      transaction.update(submissionRef, {
        status: "approved",
        approvedAt: now,
        reviewedAt: now,
        reviewedBy: reviewerUid,
        updatedAt: now,
      });

      // 5. Increment users/{ownerUid}.totalPoints (merge create if missing)
      const userRef = db.collection("users").doc(submission.ownerUid);
      transaction.set(
        userRef,
        {
          uid: submission.ownerUid,
          totalPoints: FieldValue.increment(points),
        },
        { merge: true }
      );

      // 6. Create approvals/{id} audit document
      const approvalRef = db.collection("approvals").doc();
      transaction.set(approvalRef, {
        id: approvalRef.id,
        submissionId,
        reviewedBy: reviewerUid,
        decision: "approved",
        pointsAwarded: points,
        reviewedAt: now,
      });

      // 7. Create activity/{id} (type: submission-approved)
      const activityRef = db.collection("activity").doc();
      transaction.set(activityRef, {
        id: activityRef.id,
        type: "submission-approved",
        userId: submission.ownerUid,
        submissionId,
        pointsAwarded: points,
        createdAt: now,
      });

      return {
        success: true,
        submissionId,
        pointsAwarded: points,
        message: `Submission approved successfully. ${points} points awarded.`,
      } as ApproveSubmissionOutput;
    });

    return result;
  } catch (error) {
    console.error("Error approving submission:", error);
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    throw new HttpsError("internal", "Failed to approve submission");
  }
});