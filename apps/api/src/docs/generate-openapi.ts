import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

import config from "../config";
import { registry } from "./openapi-registry";

// Ensure all module OpenAPI definitions are imported and registered
import "../app/modules/auth/auth.openapi";

export const generateOpenApiDocument = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: `${config.branding.projectName || "NextJS & ExpressJS"} API Docs`,
      version: "1.0.0",
      description:
        "Comprehensive REST API documentation generated directly from Zod validation schemas."
    },
    servers: [
      {
        url: "/api/v1",
        description: "API Version 1 Base Path"
      }
    ]
  });
};
