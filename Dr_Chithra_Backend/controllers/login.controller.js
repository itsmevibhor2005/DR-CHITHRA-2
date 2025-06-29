// controllers/authController.js
import admin from "../config/firebase.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// 🔐 Initialize Firebase Admin SDK only once

// 🔑 Login controller for admin (email/password hardcoded)
// TEMPORARY - for testing only
export const loginAdmin = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    throw new ApiErrors(400, "ID token required");
  }

  // Skip admin verification temporarily
  const response = new ApiResponse(
    200,
    { token: idToken },
    "Login successful (admin check bypassed)"
  );
  res.status(200).json(response);
});

// 🚪 Logout: revoke all refresh tokens for the user
export const logoutAdmin = asyncHandler(async (req, res) => {
  const uid = req.user.uid; // You must use verifyToken middleware before this

  await admin.auth().revokeRefreshTokens(uid);

  const response = new ApiResponse(
    200,
    null,
    "Logout successful. Token has been revoked."
  );

  res.status(200).json(response);
});
