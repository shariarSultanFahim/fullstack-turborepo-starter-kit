import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

import config from "../../../config";
import { USER_ROLES } from "../../../enums/user";
import ApiError from "../../../errors/ApiError";
import { emailHelper } from "../../../helpers/emailHelper";
import { emailTemplate } from "../../../shared/emailTemplate";
import prisma from "../../../shared/prisma";
import unlinkFile from "../../../shared/unlinkFile";
import generateOTP from "../../../util/generateOTP";

const getAllUsersToDB = async (query: Record<string, unknown>) => {
  const { searchTerm, page, limit, sort, ...filterData } = query;

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const where: Prisma.UserWhereInput = {};

  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm as string, mode: "insensitive" } },
      { email: { contains: searchTerm as string, mode: "insensitive" } },
      { contact: { contains: searchTerm as string, mode: "insensitive" } }
    ];
  }

  if (Object.keys(filterData).length > 0) {
    where.AND = Object.keys(filterData).map((key) => ({
      [key]: filterData[key]
    }));
  }

  let orderBy = {};
  if (sort) {
    const sortStr = sort as string;
    const isDesc = sortStr.startsWith("-");
    const field = isDesc ? sortStr.substring(1) : sortStr;
    orderBy = { [field]: isDesc ? "desc" : "asc" };
  } else {
    orderBy = { createdAt: "desc" };
  }

  const result = await prisma.user.findMany({
    where,
    skip,
    take: limitNumber,
    orderBy
  });

  const total = await prisma.user.count({ where });
  const totalPage = Math.ceil(total / limitNumber);

  return {
    result,
    meta: {
      total,
      limit: limitNumber,
      page: pageNumber,
      totalPage
    }
  };
};

const createUserToDB = async (payload: Prisma.UserCreateInput) => {
  payload.role = USER_ROLES.USER;

  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, Number(config.bcrypt_salt_rounds));
  }

  const createUser = await prisma.user.create({ data: payload });
  if (!createUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create user");
  }

  const otp = generateOTP();
  const values = {
    name: createUser.name,
    otp: otp,
    email: createUser.email
  };
  const createAccountTemplate = emailTemplate.createAccount(values);
  emailHelper.sendEmail(createAccountTemplate);

  await prisma.user.update({
    where: { id: createUser.id },
    data: {
      authOneTimeCode: otp,
      authExpireAt: new Date(Date.now() + 3 * 60000)
    }
  });

  return createUser;
};

const getUserProfileFromDB = async (user: JwtPayload) => {
  const { id } = user;
  const isExistUser = await prisma.user.findUnique({ where: { id } });
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

const updateProfileToDB = async (user: JwtPayload, payload: Prisma.UserUpdateInput) => {
  const { id } = user;
  const isExistUser = await prisma.user.findUnique({ where: { id } });
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  if (payload.image && isExistUser.image) {
    unlinkFile(isExistUser.image);
  }

  const updateDoc = await prisma.user.update({
    where: { id },
    data: payload
  });

  return updateDoc;
};

const deleteAccountFromDB = async (user: JwtPayload) => {
  const { id } = user;
  const isExistUser = await prisma.user.findUnique({ where: { id } });
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  if (isExistUser.image) {
    unlinkFile(isExistUser.image);
  }

  const deleteDoc = await prisma.user.delete({ where: { id } });
  return deleteDoc;
};

export const UserService = {
  getAllUsersToDB,
  createUserToDB,
  getUserProfileFromDB,
  updateProfileToDB,
  deleteAccountFromDB
};
