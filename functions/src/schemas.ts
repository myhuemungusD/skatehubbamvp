import { z } from "zod";

/* ---------- INPUT SCHEMAS ---------- */

export const ApproveSubmissionInputSchema = z.object({
  submissionId: z.string().min(1, "Submission ID is required"),
});

export const RejectSubmissionInputSchema = z.object({
  submissionId: z.string().min(1, "Submission ID is required"),
  rejectionReason: z.string().optional(),
});

export type ApproveSubmissionInput = z.infer<typeof ApproveSubmissionInputSchema>;
export type RejectSubmissionInput = z.infer<typeof RejectSubmissionInputSchema>;

/* ---------- OUTPUT SCHEMAS ---------- */

export const ApproveSubmissionOutputSchema = z.object({
  success: z.boolean(),
  submissionId: z.string(),
  pointsAwarded: z.number(),
  message: z.string(),
});

export const RejectSubmissionOutputSchema = z.object({
  success: z.boolean(),
  submissionId: z.string(),
  message: z.string(),
});

export type ApproveSubmissionOutput = z.infer<typeof ApproveSubmissionOutputSchema>;
export type RejectSubmissionOutput = z.infer<typeof RejectSubmissionOutputSchema>;

/* ---------- INTERNAL DOCUMENT SCHEMAS ---------- */

export const SubmissionDocSchema = z.object({
  id: z.string(),
  ownerUid: z.string(),
  challengeId: z.string(),
  status: z.enum(["pending", "approved", "rejected"]),
  createdAt: z.any(), // Firestore Timestamp
  updatedAt: z.any().optional(),
  reviewedAt: z.any().optional(),
  reviewedBy: z.string().optional(),
  approvedAt: z.any().optional(),
  rejectedAt: z.any().optional(),
  rejectionReason: z.string().optional(),
});

export const ChallengeDocSchema = z.object({
  id: z.string(),
  points: z.number().default(0),
  // Add other challenge fields as needed
});

export const UserDocSchema = z.object({
  uid: z.string(),
  totalPoints: z.number().default(0),
  // Add other user fields as needed
});

export const ApprovalDocSchema = z.object({
  id: z.string(),
  submissionId: z.string(),
  reviewedBy: z.string(),
  decision: z.enum(["approved", "rejected"]),
  pointsAwarded: z.number(),
  reviewedAt: z.any(), // Firestore Timestamp
  rejectionReason: z.string().optional(),
});

export const ActivityDocSchema = z.object({
  id: z.string(),
  type: z.literal("submission-approved"),
  userId: z.string(),
  submissionId: z.string(),
  pointsAwarded: z.number(),
  createdAt: z.any(), // Firestore Timestamp
});

export type SubmissionDoc = z.infer<typeof SubmissionDocSchema>;
export type ChallengeDoc = z.infer<typeof ChallengeDocSchema>;
export type UserDoc = z.infer<typeof UserDocSchema>;
export type ApprovalDoc = z.infer<typeof ApprovalDocSchema>;
export type ActivityDoc = z.infer<typeof ActivityDocSchema>;