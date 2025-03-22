/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import { axiosClient } from "./axios";

export const fetchUser = async (
  baseURL: string,
  queryParams: string = ""
): Promise<any> => {
  const response: AxiosResponse = await axiosClient.get(
    `${baseURL}${queryParams}`
  );
  return response.data.data;
};
