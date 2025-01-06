import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import StackNavigator from "./StackNavigator";
import AxiosProvider from "../providers/axiosProvider";

const RootStackNavigator = () => {
    const Stack = createNativeStackNavigator();
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(null);

    const checkAuth = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            setUserToken(token);
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
                <ActivityIndicator size="large" color="#008E97" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <AxiosProvider>
                <Stack.Navigator>
                    {userToken ? (
                        <Stack.Screen name="MainApp" component={StackNavigator} options={{ headerShown: false }} />
                    ) : (
                        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                    )}
                    <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                </Stack.Navigator>
            </AxiosProvider>
        </NavigationContainer>
    );
};

export default RootStackNavigator;
