import { CallableRequest } from "firebase-functions/v2/https";
import { HttpsError } from "firebase-functions/v2/https";

/**
 * Auth + role guard for Cloud Functions
 * Validates that user is authenticated and has required role(s)
 */
export function authRequired(
  request: CallableRequest,
  requiredRoles: string[] = ["mod", "admin"]
): { uid: string; roles: string[] } {
  // Ensure user is authenticated
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required");
  }

  const { uid } = request.auth;
  
  // Get custom claims (roles)
  const customClaims = request.auth.token;
  let userRoles: string[] = [];

  // Handle both single role and roles array
  if (customClaims.role) {
    userRoles = Array.isArray(customClaims.role) ? customClaims.role : [customClaims.role];
  }
  if (customClaims.roles) {
    const additionalRoles = Array.isArray(customClaims.roles) ? customClaims.roles : [customClaims.roles];
    userRoles = [...userRoles, ...additionalRoles];
  }

  // Check if user has at least one required role
  const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
  
  if (!hasRequiredRole) {
    throw new HttpsError(
      "permission-denied", 
      `Access denied. Required roles: ${requiredRoles.join(", ")}. User roles: ${userRoles.join(", ")}`
    );
  }

  return { uid, roles: userRoles };
}