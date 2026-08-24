import express from "express";

import { V1Routes } from "./v1";

const router = express.Router();

const versionRoutes = [
  {
    path: "/v1",
    route: V1Routes
  }
  // Future API versions can be added here without touching v1:
  // {
  //   path: "/v2",
  //   route: V2Routes
  // }
];

versionRoutes.forEach((version) => router.use(version.path, version.route));

export { V1Routes };
export default router;
