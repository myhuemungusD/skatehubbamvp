"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRequired = authRequired;
const https_1 = require("firebase-functions/v2/https");
/**
 * Auth + role guard for Cloud Functions
 * Validates that user is authenticated and has required role(s)
 */
function authRequired(request, requiredRoles = ["mod", "admin"]) {
    // Ensure user is authenticated
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "Authentication required");
    }
    const { uid } = request.auth;
    // Get custom claims (roles)
    const customClaims = request.auth.token;
    let userRoles = [];
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
        throw new https_1.HttpsError("permission-denied", `Access denied. Required roles: ${requiredRoles.join(", ")}. User roles: ${userRoles.join(", ")}`);
    }
    return { uid, roles: userRoles };
}
//# sourceMappingURL=authRequired.js.map