import {
  ApproveSubmissionInputSchema,
  RejectSubmissionInputSchema,
  ApproveSubmissionOutputSchema,
  RejectSubmissionOutputSchema,
} from "../src/schemas";

describe("Schemas", () => {
  describe("ApproveSubmissionInputSchema", () => {
    it("should validate valid input", () => {
      const validInput = { submissionId: "sub123" };
      expect(() => ApproveSubmissionInputSchema.parse(validInput)).not.toThrow();
    });

    it("should reject empty submission ID", () => {
      const invalidInput = { submissionId: "" };
      expect(() => ApproveSubmissionInputSchema.parse(invalidInput)).toThrow();
    });

    it("should reject missing submission ID", () => {
      const invalidInput = {};
      expect(() => ApproveSubmissionInputSchema.parse(invalidInput)).toThrow();
    });
  });

  describe("RejectSubmissionInputSchema", () => {
    it("should validate valid input with reason", () => {
      const validInput = {
        submissionId: "sub123",
        rejectionReason: "Does not meet requirements",
      };
      expect(() => RejectSubmissionInputSchema.parse(validInput)).not.toThrow();
    });

    it("should validate valid input without reason", () => {
      const validInput = { submissionId: "sub123" };
      expect(() => RejectSubmissionInputSchema.parse(validInput)).not.toThrow();
    });

    it("should reject empty submission ID", () => {
      const invalidInput = { submissionId: "" };
      expect(() => RejectSubmissionInputSchema.parse(invalidInput)).toThrow();
    });
  });

  describe("ApproveSubmissionOutputSchema", () => {
    it("should validate valid output", () => {
      const validOutput = {
        success: true,
        submissionId: "sub123",
        pointsAwarded: 100,
        message: "Submission approved successfully",
      };
      expect(() => ApproveSubmissionOutputSchema.parse(validOutput)).not.toThrow();
    });

    it("should reject invalid output", () => {
      const invalidOutput = {
        success: true,
        submissionId: "sub123",
        // missing pointsAwarded
        message: "Submission approved successfully",
      };
      expect(() => ApproveSubmissionOutputSchema.parse(invalidOutput)).toThrow();
    });
  });

  describe("RejectSubmissionOutputSchema", () => {
    it("should validate valid output", () => {
      const validOutput = {
        success: true,
        submissionId: "sub123",
        message: "Submission rejected successfully",
      };
      expect(() => RejectSubmissionOutputSchema.parse(validOutput)).not.toThrow();
    });

    it("should reject invalid output", () => {
      const invalidOutput = {
        success: true,
        // missing submissionId
        message: "Submission rejected successfully",
      };
      expect(() => RejectSubmissionOutputSchema.parse(invalidOutput)).toThrow();
    });
  });
});