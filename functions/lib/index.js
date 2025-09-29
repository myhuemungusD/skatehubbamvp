"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectSubmission = exports.approveSubmission = void 0;
const app_1 = require("firebase-admin/app");
// Initialize Firebase Admin
(0, app_1.initializeApp)();
// Export Cloud Functions
var approveSubmission_1 = require("./approveSubmission");
Object.defineProperty(exports, "approveSubmission", { enumerable: true, get: function () { return approveSubmission_1.approveSubmission; } });
var rejectSubmission_1 = require("./rejectSubmission");
Object.defineProperty(exports, "rejectSubmission", { enumerable: true, get: function () { return rejectSubmission_1.rejectSubmission; } });
//# sourceMappingURL=index.js.map