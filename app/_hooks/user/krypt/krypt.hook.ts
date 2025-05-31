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

  static checkBalance = async (body: {
    amount: number;
  }): Promise<IApiResponse<{ valid: boolean } | null>> => {
    try {
      const res = await axiosClient.post(`/krypt/stake/valid`, body);

      return await res.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to confirm balance";

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

  static async searchYouTube(query: string, maxResults: number = 5) {
    try {
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            key: "AIzaSyATw_J0rBSzyJeIh77skZ7GEwJpfixQURc",
            q: query,
            part: "snippet",
            type: "video",
            maxResults,
          },
        }
      );

      const results = response.data.items.map((item: any) => ({
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        videoId: item.id.videoId,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        thumbnail: item.snippet.thumbnails.default.url,
      }));

      console.log(results);
      return results;
    } catch (error: any) {
      console.error(
        "YouTube Search Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
}
