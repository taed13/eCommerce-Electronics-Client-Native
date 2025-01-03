import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "./redux/CartReducer";
import productReducer from "./feature/products/productSlice";
import userReducer from "./feature/users/userSlice";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { APP_CONFIG } from "./config/common";

const axiosClient = axios.create({
    baseURL: APP_CONFIG.BASE_URL,
    headers: {
        Accept: "application/json",
    },
    timeout: 60 * 1000,
});

axiosClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error?.response?.status === 401) {
            await AsyncStorage.removeItem("authToken");
            console.error("Session expired. Redirecting to login.");
        }
        return Promise.reject(error);
    }
);

export default configureStore({
    reducer: {
        cart: CartReducer,
        product: productReducer,
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: {
                extraArgument: { axiosClient },
            },
        }),
});
