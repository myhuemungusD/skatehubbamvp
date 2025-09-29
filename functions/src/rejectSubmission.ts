import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { authRequired } from "./authRequired";
import {
  RejectSubmissionInputSchema,
  RejectSubmissionOutput,
  SubmissionDoc,
} from "./schemas";

const db = getFirestore();

export const rejectSubmission = onCall(async (request) => {
  // Validate authentication and role
  const { uid: reviewerUid } = authRequired(request, ["mod", "admin"]);

  // Validate input
  const validatedData = RejectSubmissionInputSchema.parse(request.data);
  const { submissionId, rejectionReason } = validatedData;

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
          `Cannot reject submission with status: ${submission.status}`
        );
      }

      // 2. Prevent self-rejection
      if (submission.ownerUid === reviewerUid) {
        throw new HttpsError(
          "permission-denied",
          "Cannot reject your own submission"
        );
      }

      // 3. Update submission: status 'rejected', rejectedAt, reviewedAt, reviewedBy, rejectionReason
      const now = FieldValue.serverTimestamp();
      const updateData: any = {
        status: "rejected",
        rejectedAt: now,
        reviewedAt: now,
        reviewedBy: reviewerUid,
        updatedAt: now,
      };

      if (rejectionReason) {
        updateData.rejectionReason = rejectionReason;
      }

      transaction.update(submissionRef, updateData);

      // 4. Create approvals/{id} document (decision: rejected, pointsAwarded 0)
      const approvalRef = db.collection("approvals").doc();
      const approvalData: any = {
        id: approvalRef.id,
        submissionId,
        reviewedBy: reviewerUid,
        decision: "rejected",
        pointsAwarded: 0,
        reviewedAt: now,
      };

      if (rejectionReason) {
        approvalData.rejectionReason = rejectionReason;
      }

      transaction.set(approvalRef, approvalData);

      // Note: Rejection does NOT create an activity document per current product spec

      return {
        success: true,
        submissionId,
        message: rejectionReason 
          ? `Submission rejected: ${rejectionReason}`
          : "Submission rejected successfully",
      } as RejectSubmissionOutput;
    });

    return result;
  } catch (error) {
    console.error("Error rejecting submission:", error);
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    throw new HttpsError("internal", "Failed to reject submission");
  }
});