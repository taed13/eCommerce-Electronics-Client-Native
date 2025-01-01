import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { APP_CONFIG } from "../config/common";

export const getConfig = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    return token ? token : null;
  } catch (err) {
    console.error("Error retrieving auth token:", err);
    return null;
  }
};

const axiosInstance = axios.create({
  baseURL: APP_CONFIG.BASE_URL,
  headers: {
    Accept: "application/json",
  },
  timeout: 60 * 1000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getConfig();

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
