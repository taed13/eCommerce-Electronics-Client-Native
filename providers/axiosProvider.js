/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { APP_CONFIG } from "../config/common";
import { useNavigation } from "@react-navigation/native";

const AxiosContext = createContext(null);

const AxiosProvider = ({ children }) => {
  const navigate = useNavigation();
  const [axiosClient] = useState(() =>
    axios.create({
      baseURL: APP_CONFIG.BASE_URL,
      headers: {
        Accept: "application/json",
      },
      timeout: 60 * 1000,
    })
  );

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
        const statusCode = error?.response?.status;
        if (statusCode === 401) {
          try {
            await AsyncStorage.removeItem("authToken");
            navigate.navigate("Login");
          } catch (removeError) {
            console.error("Failed to remove token:", removeError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosClient.interceptors.request.eject(requestInterceptor);
      axiosClient.interceptors.response.eject(responseInterceptor);
    };
  }, [axiosClient]);

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
