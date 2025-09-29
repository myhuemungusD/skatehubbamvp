import { getFunctions, httpsCallable } from "firebase/functions";
import { z } from "zod";

// Import the firebase app instance
import "../firebase"; // This ensures firebase is initialized

// Get functions instance - this will use the firebase app from ../firebase
const functions = getFunctions();

/* ---------- INPUT/OUTPUT SCHEMAS ---------- */

const ApproveSubmissionInputSchema = z.object({
  submissionId: z.string().min(1, "Submission ID is required"),
});

const RejectSubmissionInputSchema = z.object({
  submissionId: z.string().min(1, "Submission ID is required"),
  rejectionReason: z.string().optional(),
});

const ApproveSubmissionOutputSchema = z.object({
  success: z.boolean(),
  submissionId: z.string(),
  pointsAwarded: z.number(),
  message: z.string(),
});

const RejectSubmissionOutputSchema = z.object({
  success: z.boolean(),
  submissionId: z.string(),
  message: z.string(),
});

export type ApproveSubmissionInput = z.infer<typeof ApproveSubmissionInputSchema>;
export type RejectSubmissionInput = z.infer<typeof RejectSubmissionInputSchema>;
export type ApproveSubmissionOutput = z.infer<typeof ApproveSubmissionOutputSchema>;
export type RejectSubmissionOutput = z.infer<typeof RejectSubmissionOutputSchema>;

/* ---------- CLOUD FUNCTION WRAPPERS ---------- */

/**
 * Approve a submission with role-based authorization
 * Validates input and output with Zod schemas
 */
export async function approveSubmission(
  data: ApproveSubmissionInput
): Promise<ApproveSubmissionOutput> {
  // Validate input
  const validatedInput = ApproveSubmissionInputSchema.parse(data);
  
  // Call Cloud Function
  const callable = httpsCallable(functions, "approveSubmission");
  const result = await callable(validatedInput);
  
  // Validate and return output
  return ApproveSubmissionOutputSchema.parse(result.data);
}

/**
 * Reject a submission with role-based authorization
 * Validates input and output with Zod schemas
 */
export async function rejectSubmission(
  data: RejectSubmissionInput
): Promise<RejectSubmissionOutput> {
  // Validate input
  const validatedInput = RejectSubmissionInputSchema.parse(data);
  
  // Call Cloud Function
  const callable = httpsCallable(functions, "rejectSubmission");
  const result = await callable(validatedInput);
  
  // Validate and return output
  return RejectSubmissionOutputSchema.parse(result.data);
}

/* ---------- ERROR HANDLING UTILITIES ---------- */

export interface CloudFunctionError {
  code: string;
  message: string;
  details?: any;
}

/**
 * Type guard to check if an error is a Cloud Function error
 */
export function isCloudFunctionError(error: any): error is CloudFunctionError {
  return error && typeof error.code === "string" && typeof error.message === "string";
}

/**
 * Extract user-friendly error message from Cloud Function errors
 */
export function getErrorMessage(error: any): string {
  if (isCloudFunctionError(error)) {
    switch (error.code) {
      case "unauthenticated":
        return "Please sign in to perform this action.";
      case "permission-denied":
        return "You don't have permission to perform this action.";
      case "not-found":
        return "The requested submission was not found.";
      case "failed-precondition":
        return error.message || "This action cannot be performed at this time.";
      default:
        return error.message || "An error occurred while processing your request.";
    }
  }
  
  if (error instanceof z.ZodError) {
    return "Invalid input data: " + error.errors.map(e => e.message).join(", ");
  }
  
  return error?.message || "An unexpected error occurred.";
}