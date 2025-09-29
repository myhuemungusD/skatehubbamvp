"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveSubmission = void 0;
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-admin/firestore");
const authRequired_1 = require("./authRequired");
const schemas_1 = require("./schemas");
const db = (0, firestore_1.getFirestore)();
exports.approveSubmission = (0, https_1.onCall)(async (request) => {
    // Validate authentication and role
    const { uid: reviewerUid } = (0, authRequired_1.authRequired)(request, ["mod", "admin"]);
    // Validate input
    const validatedData = schemas_1.ApproveSubmissionInputSchema.parse(request.data);
    const { submissionId } = validatedData;
    try {
        // Run transaction to ensure consistency
        const result = await db.runTransaction(async (transaction) => {
            // 1. Validate submission exists and status == 'pending'
            const submissionRef = db.collection("submissions").doc(submissionId);
            const submissionDoc = await transaction.get(submissionRef);
            if (!submissionDoc.exists) {
                throw new https_1.HttpsError("not-found", "Submission not found");
            }
            const submission = submissionDoc.data();
            if (submission.status !== "pending") {
                throw new https_1.HttpsError("failed-precondition", `Cannot approve submission with status: ${submission.status}`);
            }
            // 2. Prevent acting on own submission
            if (submission.ownerUid === reviewerUid) {
                throw new https_1.HttpsError("permission-denied", "Cannot approve your own submission");
            }
            // 3. Fetch challenge.points (default 0 if missing)
            const challengeRef = db.collection("challenges").doc(submission.challengeId);
            const challengeDoc = await transaction.get(challengeRef);
            let points = 0;
            if (challengeDoc.exists) {
                const challenge = challengeDoc.data();
                points = challenge.points || 0;
            }
            // 4. Update submission: status 'approved', approvedAt, reviewedAt, reviewedBy
            const now = firestore_1.FieldValue.serverTimestamp();
            transaction.update(submissionRef, {
                status: "approved",
                approvedAt: now,
                reviewedAt: now,
                reviewedBy: reviewerUid,
                updatedAt: now,
            });
            // 5. Increment users/{ownerUid}.totalPoints (merge create if missing)
            const userRef = db.collection("users").doc(submission.ownerUid);
            transaction.set(userRef, {
                uid: submission.ownerUid,
                totalPoints: firestore_1.FieldValue.increment(points),
            }, { merge: true });
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
            };
        });
        return result;
    }
    catch (error) {
        console.error("Error approving submission:", error);
        if (error instanceof https_1.HttpsError) {
            throw error;
        }
        throw new https_1.HttpsError("internal", "Failed to approve submission");
    }
});
//# sourceMappingURL=approveSubmission.js.map