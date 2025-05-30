import AsyncStorage from "@react-native-async-storage/async-storage";
import { APP_CONFIG } from "../config/common";

// export const base_url =
//   "https://e-commerce-electronics-server-ruddy.vercel.app/api/";
export const base_url = APP_CONFIG.BASE_URL;

const getTokenFromLocalStorage = AsyncStorage.getItem("authToken");
console.log("getTokenFromLocalStorage", getTokenFromLocalStorage);

export const authMiddleware = {
  headers: {
    Authorization: `Bearer ${getTokenFromLocalStorage}`,
    Accept: "application/json",
  },
};

export const config = {
  headers: {
    Authorization: `Bearer ${getTokenFromLocalStorage}`,
    Accept: "application/json",
  },
};

export const getConfig = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    return token ? token : null;
  } catch (err) {
    console.error("Error retrieving auth token:", err);
    return null;
  }
};
