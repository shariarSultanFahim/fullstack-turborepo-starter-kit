import express, { Router } from "express";
import passport from "passport";

import auth from "../../middlewares/auth";
import { OAuthController } from "./oauth.controller";

/**
 * OAuth Routes
 * Handles OAuth login initiation, callbacks, and profile retrieval
 * Supports multiple providers through a clean, extensible structure
 */

const router: Router = express.Router();

/**
 * Google OAuth Routes
 */

// Initiate Google OAuth login
// Redirects user to Google login page
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

// Google OAuth callback
// Called by Google after user authorization
// Generates JWT tokens and redirects to frontend
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/v1/oauth/login-failed",
    session: true
  }),
  OAuthController.googleCallback
);

/**
 * Profile Routes
 */

// Get authenticated user profile
// Requires valid JWT token
router.get("/profile", auth(), OAuthController.getProfile);

/**
 * OAuth Status Route
 */

// Check which OAuth providers are configured
router.get("/status", OAuthController.getOAuthStatus);

/**
 * Error Handling
 */

// Login failure redirect
router.get("/login-failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "OAuth login failed",
    error: "Authentication was not successful"
  });
});

export const OAuthRoutes = router;
