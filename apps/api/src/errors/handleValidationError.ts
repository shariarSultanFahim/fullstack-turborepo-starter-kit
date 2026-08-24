import { Prisma } from "@prisma/client";

import { IErrorMessage } from "../types/errors.types";

const handleValidationError = (error: Prisma.PrismaClientValidationError) => {
  const errorMessages: IErrorMessage[] = [
    {
      path: "",
      message: error.message
    }
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: "Validation Error",
    errorMessages
  };
};

export default handleValidationError;
