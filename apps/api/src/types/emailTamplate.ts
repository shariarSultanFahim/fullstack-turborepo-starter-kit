export type ICreateAccount = {
  name: string;
  email: string;
  otp: number;
};

export type IResetPassword = {
  email: string;
  otp: number;
};

export type IReportStatusEmail = {
  email: string;
  decision: "resolved" | "dismissed";
  explanation: string;
  productName?: string;
  productId?: string;
  productDetails?: string;
};
