import AsyncStorage from "@react-native-async-storage/async-storage";

export const base_url = "http://192.168.1.35:5001/api/";
// export const base_url = "https://e-commerce-electronics-server.vercel.app/api/";

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
