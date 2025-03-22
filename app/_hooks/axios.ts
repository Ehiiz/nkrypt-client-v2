import Axios from "axios";
import { UserTokenStorage } from "../_utils/localStorage/userStorage";

export const axiosClient = Axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_MODE === "development"
      ? `${process.env.NEXT_PUBLIC_BASE_TEST_URL}/user`
      : `${process.env.NEXT_PUBLIC_BASE_LIVE_URL}/user`,
});

axiosClient.interceptors.request.use((config) => {
  const token = UserTokenStorage.getUserToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token} `;
  }

  if (!config.headers["Content-Type"]) {
    // Only set default if not already specified in the request
    config.headers["Content-Type"] = "application/json";
  }
  config.headers["Accept"] = "application/json";

  return config;
});
