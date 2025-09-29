import { initializeApp } from "firebase-admin/app";

// Initialize Firebase Admin
initializeApp();

// Export Cloud Functions
export { approveSubmission } from "./approveSubmission";
export { rejectSubmission } from "./rejectSubmission";