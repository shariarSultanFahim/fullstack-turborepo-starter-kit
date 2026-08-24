import bcrypt from "bcrypt";

import config from "../config";
import { USER_ROLES } from "../enums/user";
import { errorLogger, logger } from "../shared/logger";
import prisma from "../shared/prisma";

export const seedSuperAdmin = async () => {
  try {
    if (!config.super_admin.email || !config.super_admin.password) {
      logger.info("ℹ️ Super Admin credentials not provided in .env, skipping seed.");
      return;
    }

    const isExistSuperAdmin = await prisma.user.findFirst({
      where: {
        email: config.super_admin.email as string,
        role: USER_ROLES.SUPER_ADMIN
      }
    });

    if (!isExistSuperAdmin) {
      const saltRounds = Number(config.bcrypt_salt_rounds) || 10;
      const hashedPassword = await bcrypt.hash(config.super_admin.password as string, saltRounds);

      await prisma.user.create({
        data: {
          name: "Administrator",
          email: config.super_admin.email as string,
          role: USER_ROLES.SUPER_ADMIN,
          password: hashedPassword,
          verified: true
        }
      });
      logger.info("✨ Super Admin account has been successfully created!");
    }
  } catch (error) {
    errorLogger.error(
      "⚠️ Failed to seed Super Admin (run prisma migrate if table is missing):",
      error
    );
  }
};
