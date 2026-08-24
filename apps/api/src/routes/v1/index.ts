import express from "express";

import { AuthRoutes } from "../../app/modules/auth/auth.route";
import { OAuthRoutes } from "../../app/modules/passport/oauth.route";
import { UserRoutes } from "../../app/modules/user/user.route";

const router = express.Router();

const apiRoutes = [
  {
    path: "/user",
    route: UserRoutes
  },
  {
    path: "/auth",
    route: AuthRoutes
  },
  {
    path: "/oauth",
    route: OAuthRoutes
  }
];

apiRoutes.forEach((route) => router.use(route.path, route.route));

export const V1Routes = router;
export default router;
