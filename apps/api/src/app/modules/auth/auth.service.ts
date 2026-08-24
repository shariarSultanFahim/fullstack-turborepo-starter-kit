import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { JwtPayload, Secret } from "jsonwebtoken";

import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import { emailHelper } from "../../../helpers/emailHelper";
import { jwtHelper } from "../../../helpers/jwtHelper";
import { emailTemplate } from "../../../shared/emailTemplate";
import prisma from "../../../shared/prisma";
import { IAuthResetPassword, IChangePassword, ILoginData, IVerifyEmail } from "../../../types/auth";
import cryptoToken from "../../../util/cryptoToken";
import generateOTP from "../../../util/generateOTP";

//login
const loginUserFromDB = async (payload: ILoginData) => {
  const { email, password } = payload;
  const isExistUser = await prisma.user.findUnique({ where: { email } });
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //check verified and status
  if (!isExistUser.verified) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Please verify your account, then try to login again"
    );
  }

  //check user status
  if (isExistUser.status === "delete") {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "You don’t have permission to access this content.It looks like your account has been deactivated."
    );
  }

  //check match password
  if (password && !(await bcrypt.compare(password, isExistUser.password || ""))) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Password is incorrect!");
  }

  //create access token
  const accessToken = jwtHelper.createToken(
    { id: isExistUser.id, role: isExistUser.role, email: isExistUser.email },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expire_in as string
  );

  //create refresh token
  const refreshToken = jwtHelper.createToken(
    { id: isExistUser.id, role: isExistUser.role, email: isExistUser.email },
    config.jwt.jwt_refresh_secret as Secret,
    config.jwt.jwt_refresh_expire_in as string
  );

  return { accessToken, refreshToken };
};

//forget password
const forgetPasswordToDB = async (email: string) => {
  const isExistUser = await prisma.user.findUnique({ where: { email } });
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //send mail
  const otp = generateOTP();
  const value = {
    otp,
    email: isExistUser.email
  };
  const forgetPassword = emailTemplate.resetPassword(value);
  emailHelper.sendEmail(forgetPassword);

  //save to DB
  await prisma.user.update({
    where: { email },
    data: {
      authOneTimeCode: otp,
      authExpireAt: new Date(Date.now() + 3 * 60000)
    }
  });
};

//verify email
const verifyEmailToDB = async (payload: IVerifyEmail) => {
  const { email, oneTimeCode } = payload;
  const isExistUser = await prisma.user.findUnique({ where: { email } });
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  if (!oneTimeCode) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Please give the otp, check your email we send a code"
    );
  }

  if (isExistUser.authOneTimeCode !== oneTimeCode) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "You provided wrong otp");
  }

  const date = new Date();
  if (isExistUser.authExpireAt && date > isExistUser.authExpireAt) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Otp already expired, Please try again");
  }

  let message;
  let data;

  if (!isExistUser.verified) {
    await prisma.user.update({
      where: { id: isExistUser.id },
      data: {
        verified: true,
        authOneTimeCode: null,
        authExpireAt: null
      }
    });
    message = "Email verify successfully";
  } else {
    await prisma.user.update({
      where: { id: isExistUser.id },
      data: {
        authIsResetPassword: true,
        authOneTimeCode: null,
        authExpireAt: null
      }
    });

    //create token ;
    const createToken = cryptoToken();
    await prisma.resetToken.create({
      data: {
        userId: isExistUser.id,
        token: createToken,
        expireAt: new Date(Date.now() + 5 * 60000)
      }
    });
    message =
      "Verification Successful: Please securely store and utilize this code for reset password";
    data = createToken;
  }
  return { data, message };
};

//forget password
const resetPasswordToDB = async (token: string, payload: IAuthResetPassword) => {
  const { newPassword, confirmPassword } = payload;

  const isExistToken = await prisma.resetToken.findFirst({
    where: { token }
  });

  if (!isExistToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized");
  }

  const isExistUser = await prisma.user.findUnique({
    where: { id: isExistToken.userId }
  });

  if (!isExistUser?.authIsResetPassword) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "You don't have permission to change the password. Please click again to 'Forgot Password'"
    );
  }

  //validity check
  if (isExistToken.expireAt < new Date()) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Token expired, Please click again to the forget password"
    );
  }

  //check password
  if (newPassword !== confirmPassword) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "New password and Confirm password doesn't match!");
  }

  const hashPassword = await bcrypt.hash(newPassword, Number(config.bcrypt_salt_rounds));

  await prisma.user.update({
    where: { id: isExistToken.userId },
    data: {
      password: hashPassword,
      authIsResetPassword: false
    }
  });
};

const changePasswordToDB = async (user: JwtPayload, payload: IChangePassword) => {
  const { currentPassword, newPassword, confirmPassword } = payload;
  const isExistUser = await prisma.user.findUnique({ where: { id: user.id } });

  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //current password match
  if (currentPassword && !(await bcrypt.compare(currentPassword, isExistUser.password || ""))) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Password is incorrect");
  }

  //newPassword and current password
  if (currentPassword === newPassword) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Please give different password from current password"
    );
  }
  //new password and confirm password check
  if (newPassword !== confirmPassword) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Password and Confirm password doesn't matched");
  }

  //hash password
  const hashPassword = await bcrypt.hash(newPassword, Number(config.bcrypt_salt_rounds));

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashPassword }
  });
};

// resend otp
const resendOtpToDB = async (email: string) => {
  const isExistUser = await prisma.user.findUnique({ where: { email } });
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //generate new otp
  const otp = generateOTP();
  const values = {
    name: isExistUser.name,
    otp,
    email: isExistUser.email
  };

  const resendTemplate = emailTemplate.createAccount(values);
  emailHelper.sendEmail(resendTemplate);

  //save otp to DB
  await prisma.user.update({
    where: { id: isExistUser.id },
    data: {
      authOneTimeCode: otp,
      authExpireAt: new Date(Date.now() + 3 * 60000) // 3 minutes expiry
    }
  });

  return { message: "OTP resent successfully, please check your email" };
};

export const AuthService = {
  verifyEmailToDB,
  loginUserFromDB,
  forgetPasswordToDB,
  resetPasswordToDB,
  changePasswordToDB,
  resendOtpToDB
};
