import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import prisma from "../../shared/prisma";
import config from "../index";

/**
 * Google OAuth 2.0 Strategy
 * Configures Passport to use Google as an OAuth provider
 * Creates or updates user profile on successful authentication
 *
 * Note: Strategy will only be initialized if credentials are configured
 */

let googleStrategy: GoogleStrategy | null = null;

// Only initialize strategy if credentials are provided
if (config.oauth.google.clientID && config.oauth.google.clientSecret) {
  googleStrategy = new GoogleStrategy(
    {
      clientID: config.oauth.google.clientID,
      clientSecret: config.oauth.google.clientSecret,
      callbackURL: config.oauth.google.callbackURL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, displayName, emails, photos } = profile;
        const email = emails?.[0]?.value;

        if (!email) {
          return done(new Error("No email provided by Google"));
        }

        // Find or create user
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          // Create new user from Google profile
          user = await prisma.user.create({
            data: {
              email,
              name: displayName || "User",
              role: "USER",
              firstName: displayName?.split(" ")[0] || "User",
              lastName: displayName?.split(" ").slice(1).join(" ") || "",
              avatar: photos?.[0]?.value,
              provider: "google",
              providerId: id,
              verified: true, // Google verified the email
              status: "active",
              contact: "",
              location: ""
            }
          });
        } else {
          // Update existing user with Google provider info if not set
          if (!user.providerId) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                provider: "google",
                providerId: id,
                avatar: !user.avatar && photos?.[0]?.value ? photos[0].value : user.avatar
              }
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  );
}

export { googleStrategy };
