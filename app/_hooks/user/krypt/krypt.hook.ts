/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { axiosClient } from "../../axios";
import { IApiResponse } from "../../response.interface";
import {
  IReponseFormattedKrypt,
  IRequestComment,
  IRequestCreateKrypt,
  IRequestPublishKrypt,
  IRequestUnlockKrypt,
  IResponseCreateKrypt,
  IResponseUnlockKrypt,
} from "./krypt.interface";

export class UserKryptService {
  static createKrypt = async (
    body: IRequestCreateKrypt
  ): Promise<IApiResponse<IResponseCreateKrypt | null>> => {
    try {
      const res = await axiosClient.post("/krypt", body);

      return await res.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to create krypt";

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

  static unlockKrypt = async (
    body: IRequestUnlockKrypt & { id: string }
  ): Promise<IApiResponse<IResponseUnlockKrypt | null>> => {
    try {
      const { id, ...request } = body;
      const res = await axiosClient.post(`/krypt/${body.id}`, request);

      return await res.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to unlock krypt";

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

  static publishKrypt = async (
    body: IRequestPublishKrypt & { id: string }
  ): Promise<IApiResponse<IReponseFormattedKrypt | null>> => {
    try {
      const { id, ...request } = body;
      const res = await axiosClient.patch(`/krypt/${body.id}`, request);

      return await res.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to publish krypt";

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

  static updateKrypt = async (
    body: IRequestCreateKrypt & { id: string }
  ): Promise<IApiResponse<IReponseFormattedKrypt | null>> => {
    try {
      const { id, ...request } = body;
      const res = await axiosClient.put(`/krypt/${body.id}`, request);

      return await res.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to update krypt";

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

  static commentOnKrypt = async (
    body: IRequestComment & { id: string }
  ): Promise<IApiResponse<IReponseFormattedKrypt | null>> => {
    try {
      const { id, ...request } = body;
      const res = await axiosClient.post(`/krypt/${body.id}/comments`, request);

      return await res.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to comment on krypt";

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
