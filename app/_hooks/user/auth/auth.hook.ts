/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IRequestAuthAccountVerification,
  IRequestCompleteSetup,
  IResponseAuthCompleteSetup,
} from "./auth.interface";
import {
  IRequestAuth,
  IRequestAuthEmailVerification,
  IRequestAuthResetPassword,
  IResponseAuthEmailVerification,
  IResponseAuthLogin,
  IResponseAuthResetPassword,
  IResponseAuthSignup,
} from "./auth.interface";
import { IApiResponse } from "../../response.interface";
import axios from "axios";
import { axiosClient } from "../../axios";
import { UserTokenStorage } from "@/app/_utils/localStorage/userStorage";

export class StudentAuthHook {
  private static getToken = () => {
    return UserTokenStorage.getUserToken();
  };
  static signIn = async (
    body: IRequestAuth
  ): Promise<IApiResponse<IResponseAuthLogin | null>> => {
    try {
      const res = await axiosClient.post("/auth/signin", body);

      return await res.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || error.message || "Failed to login";

        return {
          success: false,
          status: "error",
          message: errorMessage,
          data: null,
        };
      }

      return error;
    }
  };

  static signUp = async (
    body: IRequestAuth
  ): Promise<IApiResponse<IResponseAuthSignup | null>> => {
    try {
      const res = await axiosClient.post("/auth/signup", body);

      return res.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || error.message || "Failed to sign up";

        return {
          success: false,
          status: "error",
          message: errorMessage,
          data: null,
        };
      }
      return error;
    }
  };

  static verifyEmail = async (
    body: IRequestAuthEmailVerification
  ): Promise<IApiResponse<IResponseAuthEmailVerification | null>> => {
    try {
      const res = await axiosClient.post("/auth/verify-email", body);

      return await res.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to verify email";

        return {
          success: false,
          status: "error",
          message: errorMessage,
          data: null,
        };
      }
      return error;
    }
  };

  static verifyAccount = async (
    body: IRequestAuthAccountVerification
  ): Promise<IApiResponse<IResponseAuthEmailVerification | null>> => {
    try {
      const res = await axiosClient.post("/auth/verify-account", body);

      return await res.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to verify account";

        return {
          success: false,
          status: "error",
          message: errorMessage,
          data: null,
        };
      }
      return error;
    }
  };

  static resetPassword = async (
    body: IRequestAuthResetPassword
  ): Promise<IApiResponse<IResponseAuthResetPassword | null>> => {
    try {
      const res = await axiosClient.post("/auth/reset-password", body);

      return await res.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to reset password";

        return {
          success: false,
          status: "error",
          message: errorMessage,
          data: null,
        };
      }
      return error;
    }
  };

  static completeSetup = async (
    body: IRequestCompleteSetup
  ): Promise<IApiResponse<IResponseAuthCompleteSetup | null>> => {
    try {
      const res = await axiosClient.post("/auth/complete-setup", body);

      return await res.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to complete setup";

        return {
          success: false,
          status: "error",
          message: errorMessage,
          data: null,
        };
      }
      return error;
    }
  };

  static changePassword = async (body: {
    newPassword: string;
    oldPassword: string;
  }): Promise<IApiResponse<IResponseAuthResetPassword | null>> => {
    try {
      const res = await axiosClient.post("/auth/change-password", body);

      return await res.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to change password";

        return {
          success: false,
          status: "error",
          message: errorMessage,
          data: null,
        };
      }
      return error;
    }
  };
}
