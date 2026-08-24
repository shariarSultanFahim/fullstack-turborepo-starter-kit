import { z } from "zod";

import {
  bearerAuth,
  createErrorResponseSchema,
  createSuccessResponseSchema,
  registry
} from "../../../docs/openapi-registry";
import { AuthValidation } from "./auth.validation";

// ============================================================================
// 1. Request Schemas (Extending existing schemas with OpenAPI metadata)
// ============================================================================

export const LoginRequestSchema = AuthValidation.createLoginZodSchema.shape.body.openapi({
  description: "User login payload",
  example: {
    email: "user@example.com",
    password: "Password123!"
  }
});

export const VerifyEmailRequestSchema =
  AuthValidation.createVerifyEmailZodSchema.shape.body.openapi({
    description: "Email verification with OTP payload",
    example: {
      email: "user@example.com",
      oneTimeCode: 123456
    }
  });

export const ForgetPasswordRequestSchema =
  AuthValidation.createForgetPasswordZodSchema.shape.body.openapi({
    description: "Request password reset OTP via email",
    example: {
      email: "user@example.com"
    }
  });

export const ResetPasswordRequestSchema =
  AuthValidation.createResetPasswordZodSchema.shape.body.openapi({
    description: "Set new password using reset authorization token",
    example: {
      newPassword: "NewSecurePassword123!",
      confirmPassword: "NewSecurePassword123!"
    }
  });

export const ChangePasswordRequestSchema =
  AuthValidation.createChangePasswordZodSchema.shape.body.openapi({
    description: "Change current password for authenticated user",
    example: {
      currentPassword: "OldPassword123!",
      newPassword: "NewSecurePassword123!",
      confirmPassword: "NewSecurePassword123!"
    }
  });

// ============================================================================
// 2. Response Data Schemas
// ============================================================================

export const LoginResponseDataSchema = z
  .object({
    accessToken: z.string().openapi({
      description: "Short-lived JWT Access Token",
      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }),
    refreshToken: z.string().openapi({
      description: "Long-lived JWT Refresh Token",
      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    })
  })
  .openapi("LoginResponseData");

export const GenericMessageResponseDataSchema = z
  .any()
  .optional()
  .openapi("GenericMessageResponseData");

// ============================================================================
// 3. Register Auth Routes with OpenAPIRegistry
// ============================================================================

// POST /auth/login
registry.registerPath({
  method: "post",
  path: "/auth/login",
  summary: "User Login",
  description: "Authenticates a user with email and password, returning JWT access and refresh tokens.",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: LoginRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: "User logged in successfully",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(LoginResponseDataSchema, {
            exampleMessage: "User logged in successfully."
          })
        }
      }
    },
    400: {
      description: "Validation error or bad request",
      content: {
        "application/json": {
          schema: createErrorResponseSchema()
        }
      }
    },
    404: {
      description: "User not found",
      content: {
        "application/json": {
          schema: createErrorResponseSchema()
        }
      }
    }
  }
});

// POST /auth/verify-email
registry.registerPath({
  method: "post",
  path: "/auth/verify-email",
  summary: "Verify Email with OTP",
  description: "Verifies user email using the one-time code sent upon registration or request.",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: VerifyEmailRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: "Email verified successfully",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(GenericMessageResponseDataSchema, {
            exampleMessage: "Email verified successfully"
          })
        }
      }
    },
    400: {
      description: "Invalid or expired OTP",
      content: {
        "application/json": {
          schema: createErrorResponseSchema()
        }
      }
    }
  }
});

// POST /auth/forget-password
registry.registerPath({
  method: "post",
  path: "/auth/forget-password",
  summary: "Request Password Reset OTP",
  description: "Sends a one-time verification code to the registered email address for password recovery.",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: ForgetPasswordRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: "OTP sent to email",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(GenericMessageResponseDataSchema, {
            exampleMessage: "Please check your email. We have sent you a one-time passcode (OTP)."
          })
        }
      }
    },
    404: {
      description: "User not found",
      content: {
        "application/json": {
          schema: createErrorResponseSchema()
        }
      }
    }
  }
});

// POST /auth/reset-password
registry.registerPath({
  method: "post",
  path: "/auth/reset-password",
  summary: "Reset Password",
  description: "Resets the user's password using the token provided in the Authorization header.",
  tags: ["Auth"],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: ResetPasswordRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: "Password reset successfully",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(GenericMessageResponseDataSchema, {
            exampleMessage: "Your password has been successfully reset."
          })
        }
      }
    },
    400: {
      description: "Passwords do not match or token is invalid",
      content: {
        "application/json": {
          schema: createErrorResponseSchema()
        }
      }
    }
  }
});

// POST /auth/change-password
registry.registerPath({
  method: "post",
  path: "/auth/change-password",
  summary: "Change Password",
  description: "Changes the authenticated user's password given their current password.",
  tags: ["Auth"],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: ChangePasswordRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: "Password changed successfully",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(GenericMessageResponseDataSchema, {
            exampleMessage: "Your password has been successfully changed"
          })
        }
      }
    },
    401: {
      description: "Unauthorized - invalid credentials or missing token",
      content: {
        "application/json": {
          schema: createErrorResponseSchema()
        }
      }
    }
  }
});

// POST /auth/resend-otp
registry.registerPath({
  method: "post",
  path: "/auth/resend-otp",
  summary: "Resend Verification OTP",
  description: "Resends a new one-time verification code to the authenticated user's email address.",
  tags: ["Auth"],
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: "OTP resent successfully",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(GenericMessageResponseDataSchema, {
            exampleMessage: "OTP sent successfully"
          })
        }
      }
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: createErrorResponseSchema()
        }
      }
    }
  }
});
