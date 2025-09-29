"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectSubmission = void 0;
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-admin/firestore");
const authRequired_1 = require("./authRequired");
const schemas_1 = require("./schemas");
const db = (0, firestore_1.getFirestore)();
exports.rejectSubmission = (0, https_1.onCall)(async (request) => {
    // Validate authentication and role
    const { uid: reviewerUid } = (0, authRequired_1.authRequired)(request, ["mod", "admin"]);
    // Validate input
    const validatedData = schemas_1.RejectSubmissionInputSchema.parse(request.data);
    const { submissionId, rejectionReason } = validatedData;
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
                throw new https_1.HttpsError("failed-precondition", `Cannot reject submission with status: ${submission.status}`);
            }
            // 2. Prevent self-rejection
            if (submission.ownerUid === reviewerUid) {
                throw new https_1.HttpsError("permission-denied", "Cannot reject your own submission");
            }
            // 3. Update submission: status 'rejected', rejectedAt, reviewedAt, reviewedBy, rejectionReason
            const now = firestore_1.FieldValue.serverTimestamp();
            const updateData = {
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
            const approvalData = {
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
            };
        });
        return result;
    }
    catch (error) {
        console.error("Error rejecting submission:", error);
        if (error instanceof https_1.HttpsError) {
            throw error;
        }
        throw new https_1.HttpsError("internal", "Failed to reject submission");
    }
});
//# sourceMappingURL=rejectSubmission.js.map