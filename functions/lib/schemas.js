"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityDocSchema = exports.ApprovalDocSchema = exports.UserDocSchema = exports.ChallengeDocSchema = exports.SubmissionDocSchema = exports.RejectSubmissionOutputSchema = exports.ApproveSubmissionOutputSchema = exports.RejectSubmissionInputSchema = exports.ApproveSubmissionInputSchema = void 0;
const zod_1 = require("zod");
/* ---------- INPUT SCHEMAS ---------- */
exports.ApproveSubmissionInputSchema = zod_1.z.object({
    submissionId: zod_1.z.string().min(1, "Submission ID is required"),
});
exports.RejectSubmissionInputSchema = zod_1.z.object({
    submissionId: zod_1.z.string().min(1, "Submission ID is required"),
    rejectionReason: zod_1.z.string().optional(),
});
/* ---------- OUTPUT SCHEMAS ---------- */
exports.ApproveSubmissionOutputSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    submissionId: zod_1.z.string(),
    pointsAwarded: zod_1.z.number(),
    message: zod_1.z.string(),
});
exports.RejectSubmissionOutputSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    submissionId: zod_1.z.string(),
    message: zod_1.z.string(),
});
/* ---------- INTERNAL DOCUMENT SCHEMAS ---------- */
exports.SubmissionDocSchema = zod_1.z.object({
    id: zod_1.z.string(),
    ownerUid: zod_1.z.string(),
    challengeId: zod_1.z.string(),
    status: zod_1.z.enum(["pending", "approved", "rejected"]),
    createdAt: zod_1.z.any(), // Firestore Timestamp
    updatedAt: zod_1.z.any().optional(),
    reviewedAt: zod_1.z.any().optional(),
    reviewedBy: zod_1.z.string().optional(),
    approvedAt: zod_1.z.any().optional(),
    rejectedAt: zod_1.z.any().optional(),
    rejectionReason: zod_1.z.string().optional(),
});
exports.ChallengeDocSchema = zod_1.z.object({
    id: zod_1.z.string(),
    points: zod_1.z.number().default(0),
    // Add other challenge fields as needed
});
exports.UserDocSchema = zod_1.z.object({
    uid: zod_1.z.string(),
    totalPoints: zod_1.z.number().default(0),
    // Add other user fields as needed
});
exports.ApprovalDocSchema = zod_1.z.object({
    id: zod_1.z.string(),
    submissionId: zod_1.z.string(),
    reviewedBy: zod_1.z.string(),
    decision: zod_1.z.enum(["approved", "rejected"]),
    pointsAwarded: zod_1.z.number(),
    reviewedAt: zod_1.z.any(), // Firestore Timestamp
    rejectionReason: zod_1.z.string().optional(),
});
exports.ActivityDocSchema = zod_1.z.object({
    id: zod_1.z.string(),
    type: zod_1.z.literal("submission-approved"),
    userId: zod_1.z.string(),
    submissionId: zod_1.z.string(),
    pointsAwarded: zod_1.z.number(),
    createdAt: zod_1.z.any(), // Firestore Timestamp
});
//# sourceMappingURL=schemas.js.map