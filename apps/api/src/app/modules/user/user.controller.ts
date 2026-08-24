/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import catchAsync from "../../../shared/catchAsync";
import { getSingleFilePath } from "../../../shared/getFilePath";
import sendResponse from "../../../shared/sendResponse";
import { UserService } from "./user.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsersToDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Users retrieved successfully",
    pagination: result.meta,
    data: result.result
  });
});

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { ...userData } = req.body;
  const result = await UserService.createUserToDB(userData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User created successfully",
    data: result
  });
});

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const result = await UserService.getUserProfileFromDB(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Profile data retrieved successfully",
    data: result
  });
});

//update profile
const updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as any;
  let image = getSingleFilePath(req.files as Record<string, Express.Multer.File[]>, "image");

  const data = {
    image,
    ...req.body
  };
  const result = await UserService.updateProfileToDB(user, data);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Profile updated successfully",
    data: result
  });
});

const deleteAccount = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  await UserService.deleteAccountFromDB(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User deleted successfully"
  });
});

export const UserController = {
  getAllUsers,
  createUser,
  getUserProfile,
  updateProfile,
  deleteAccount
};
