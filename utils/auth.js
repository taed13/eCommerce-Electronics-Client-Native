import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAuthToken = async () => {
    try {
        const token = await AsyncStorage.getItem("authToken");
        if (token !== null) {
            return token;
        } else {
            console.log("No token found");
            return null;
        }
    } catch (error) {
        console.error("Error fetching token", error);
        return null;
    }
};
