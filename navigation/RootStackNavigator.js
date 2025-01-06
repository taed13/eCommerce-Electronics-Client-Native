import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import StackNavigator from "./StackNavigator";
import AxiosProvider from "../providers/axiosProvider";
import Loading from "../components/Loading";

const RootStackNavigator = () => {
    const Stack = createNativeStackNavigator();
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(null);

    const checkAuth = async () => {
        setIsLoading(true);
        try {
            const token = await AsyncStorage.getItem("authToken");
            setUserToken(token ?? null);
        } catch (error) {
            console.error("Error checking token", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Loading />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <AxiosProvider>
                <Stack.Navigator initialRouteName={userToken ? "MainApp" : "Login"}>
                    <Stack.Screen name="MainApp" component={StackNavigator} options={{ headerShown: false }} />
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                </Stack.Navigator>
            </AxiosProvider>
        </NavigationContainer>
    );
};

export default RootStackNavigator;
