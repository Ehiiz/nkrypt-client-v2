/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { axiosClient } from "../../axios";
import { IApiResponse } from "../../response.interface";

export class UserProfileHook {
  static followOrUnfollowUser = async (body: {
    id: string;
  }): Promise<IApiResponse<boolean | null>> => {
    try {
      const res = await axiosClient.post(`/profile/${body.id}`);

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
