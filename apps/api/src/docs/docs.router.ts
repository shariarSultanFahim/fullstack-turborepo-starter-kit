import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import swaggerUi from "swagger-ui-express";

import config from "../config";
import { generateOpenApiDocument } from "./generate-openapi";

const router = express.Router();

let openApiDocument: ReturnType<typeof generateOpenApiDocument> | null = null;

const getDocument = () => {
  if (!openApiDocument || config.node_env === "development") {
    openApiDocument = generateOpenApiDocument();
  }
  return openApiDocument;
};

// Route guard middleware for docs
const docsGuard = (_req: Request, res: Response, next: () => void) => {
  if (!config.enable_api_docs) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: "API Documentation is disabled in this environment."
    });
  }
  next();
};

router.use(docsGuard);

// Raw OpenAPI JSON spec endpoint
router.get("/docs.json", (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(getDocument());
});

// Swagger UI Explorer endpoint
router.use(
  "/docs",
  swaggerUi.serve,
  (req: Request, res: Response, next: () => void) => {
    const doc = getDocument();
    swaggerUi.setup(doc, {
      customSiteTitle: `${config.branding.projectName || "Express"} API Documentation`,
      customCss: ".swagger-ui .topbar { display: none }",
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true
      }
    })(req, res, next);
  }
);

export const DocsRoutes = router;
