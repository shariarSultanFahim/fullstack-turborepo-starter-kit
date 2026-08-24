import process from "process";

import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload, Secret } from "jsonwebtoken";

import config from "../../../config";
import { jwtHelper } from "../../../helpers/jwtHelper";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";

type ProcessEnv = {
  FRONTEND_OAUTH_CALLBACK_URL?: string;
  GOOGLE_OAUTH_CLIENT_ID?: string;
  GOOGLE_OAUTH_CLIENT_SECRET?: string;
};

const env = process.env as unknown as ProcessEnv;

/**
 * OAuth Controller
 * Handles OAuth authentication callbacks and token generation
 */

/**
 * Google OAuth Callback Handler
 * Called after Google verifies the user
 * Generates JWT tokens for authenticated user
 */
type OAuthUser = {
  _id: { toString(): string };
  role?: string;
  email: string;
};

const googleCallback = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as OAuthUser | undefined;

  if (!user) {
    return sendResponse(res, {
      success: false,
      statusCode: StatusCodes.UNAUTHORIZED,
      message: "Authentication failed"
    });
  }

  const userId = user._id.toString();
  const userRole = user.role || "USER";

  // Generate JWT tokens
  const accessToken = jwtHelper.createToken(
    {
      id: userId,
      role: userRole,
      email: user.email
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expire_in as string
  );

  const refreshToken = jwtHelper.createToken(
    {
      id: userId,
      role: userRole,
      email: user.email
    },
    config.jwt.jwt_refresh_secret as Secret,
    config.jwt.jwt_refresh_expire_in as string
  );

  // Redirect to frontend with tokens
  // In production, redirect to your frontend OAuth success page with tokens
  const frontendCallbackUrl =
    env.FRONTEND_OAUTH_CALLBACK_URL || "http://localhost:3000/auth/callback";
  const redirectUrl = `${frontendCallbackUrl}?accessToken=${accessToken}&refreshToken=${refreshToken}&userId=${userId}`;

  return res.redirect(redirectUrl);
});

/**
 * Get Current User Profile
 * Returns the currently authenticated user's profile
 */
const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload & {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };

  if (!user) {
    return sendResponse(res, {
      success: false,
      statusCode: StatusCodes.UNAUTHORIZED,
      message: "User not authenticated"
    });
  }

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User profile retrieved successfully",
    data: user
  });
});

/**
 * OAuth Status Check
 * Returns information about configured OAuth providers
 */
const getOAuthStatus = catchAsync(async (req: Request, res: Response) => {
  const providers = {
    google: {
      configured: !!(env.GOOGLE_OAUTH_CLIENT_ID && env.GOOGLE_OAUTH_CLIENT_SECRET),
      name: "Google"
    }
    // Future providers can be added here
    // facebook: {
    //   configured: !!process.env.FACEBOOK_OAUTH_CLIENT_ID,
    //   name: 'Facebook',
    // },
  };

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "OAuth provider status retrieved",
    data: providers
  });
});

export const OAuthController = {
  googleCallback,
  getProfile,
  getOAuthStatus
};
