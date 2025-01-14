/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { APP_CONFIG } from "../config/common";
import { useNavigation } from "@react-navigation/native";

const AxiosContext = createContext(null);

const AxiosProvider = ({ children }) => {
  const navigation = useNavigation();

  const [axiosClient] = useState(() =>
    axios.create({
      baseURL: APP_CONFIG.BASE_URL,
      headers: {
        Accept: "application/json",
      },
      timeout: 60 * 1000,
    })
  );

  const refreshTokenRequest = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token found");

      const response = await axios.post(`${APP_CONFIG.BASE_URL}/user/refresh-token`, {
        refreshToken,
      });

      const { accessToken } = response.data;
      await AsyncStorage.setItem("authToken", accessToken);
      return accessToken;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return null;
    }
  };

  useEffect(() => {
    const requestInterceptor = axiosClient.interceptors.request.use(
      async (config) => {
        try {
          const token = await AsyncStorage.getItem("authToken");
          if (token) {
            config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
          }
        } catch (error) {
          console.error("Failed to retrieve token:", error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const statusCode = error?.response?.status;

        if (statusCode === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const newAccessToken = await refreshTokenRequest();

          if (newAccessToken) {
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosClient(originalRequest);
          } else {
            await AsyncStorage.removeItem("authToken");
            await AsyncStorage.removeItem("refreshToken");
            navigation.navigate("Login");
            return Promise.reject(new Error("Session expired. Please login again."));
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosClient.interceptors.request.eject(requestInterceptor);
      axiosClient.interceptors.response.eject(responseInterceptor);
    };
  }, [axiosClient, navigation]);

  return <AxiosContext.Provider value={{ axiosClient }}>{children}</AxiosContext.Provider>;
};

export const useAxiosClient = () => {
  const context = useContext(AxiosContext);
  if (!context || !context.axiosClient) {
    throw new Error("useAxiosClient must be used within an AxiosProvider");
  }
  return context.axiosClient;
};

export default AxiosProvider;
