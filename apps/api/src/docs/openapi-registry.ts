import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

// Extend Zod schemas with .openapi() metadata methods
extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

// Register Bearer Authentication Component
export const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
  description: "Enter your JWT Bearer token in the format: Bearer <token>"
});

/**
 * Standard Success Response Schema Generator mirroring sendResponse
 */
export const createSuccessResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T,
  options?: {
    description?: string;
    exampleMessage?: string;
  }
) => {
  return z
    .object({
      success: z.literal(true).openapi({ example: true }),
      statusCode: z.number().openapi({ example: 200 }),
      message: z.string().optional().openapi({ example: options?.exampleMessage || "Operation successful" }),
      pagination: z
        .object({
          page: z.number().openapi({ example: 1 }),
          limit: z.number().openapi({ example: 10 }),
          totalPage: z.number().openapi({ example: 1 }),
          total: z.number().openapi({ example: 1 })
        })
        .optional(),
      data: dataSchema
    })
    .openapi(options?.description || "SuccessResponse");
};

/**
 * Standard Error Response Schema Generator mirroring globalErrorHandler
 */
export const createErrorResponseSchema = (description?: string) => {
  return z
    .object({
      success: z.literal(false).openapi({ example: false }),
      message: z.string().openapi({ example: "Error message description" }),
      errorMessages: z
        .array(
          z.object({
            path: z.string().openapi({ example: "email" }),
            message: z.string().openapi({ example: "Email is required" })
          })
        )
        .openapi({
          example: [{ path: "email", message: "Email is required" }]
        }),
      stack: z.string().optional().openapi({ example: "Error: ...\\n    at ..." })
    })
    .openapi(description || "ErrorResponse");
};
