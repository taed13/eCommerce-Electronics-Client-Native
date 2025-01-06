import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useUserAsyncStore = () => {
    const [userAsyncStore, setUserAsyncStore] = useState(null);
    const [loading, setLoading] = useState(true);

    const setDataForUserAsyncStore = useCallback(async (data) => {
        try {
            const storedData = await AsyncStorage.getItem("userAsyncStore");
            const parsedData = storedData ? JSON.parse(storedData) : null;

            if (JSON.stringify(parsedData) !== JSON.stringify(data)) {
                await AsyncStorage.setItem("userAsyncStore", JSON.stringify(data));
                setUserAsyncStore(data);
            }
        } catch (error) {
            console.error("Error saving user data:", error);
        }
    }, []);

    useEffect(() => {
        const getUserAsyncStore = async () => {
            try {
                const storedData = await AsyncStorage.getItem("userAsyncStore");
                if (storedData) {
                    setUserAsyncStore(JSON.parse(storedData));
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        getUserAsyncStore();
    }, []);

    return { userAsyncStore, setDataForUserAsyncStore, loading };
};
