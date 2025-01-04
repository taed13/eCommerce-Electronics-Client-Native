import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import ListAdmin from "../screens/ListAdmin/ListAdmin";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo, Ionicons, AntDesign } from "@expo/vector-icons";
import ProductInfoScreen from "../screens/ProductInfoScreen";
import AddAddressScreen from "../screens/AddAddressScreen";
import AddressScreen from "../screens/AddressScreen";
import CartScreen from "../screens/CartScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProfileUserScreen from "../screens/ProfileUserScreen";
import HelpScreen from "../screens/HelpScreen";
import ConfirmationScreen from "../screens/ConfirmationScreen";
import OrderScreen from "../screens/OrderScreen";
import AccountScreen from "../screens/AccountScreen";
import SettingScreen from "../screens/SettingScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import AxiosProvider from "../providers/axiosProvider";
import Chat from "../screens/Chat";
import ChatHeader from "../components/ChatHeader";
import ChatMenu from "../components/ChatMenu";
import { View } from "react-native";
import OrderSummaryScreen from "../screens/OrderSummaryScreen";

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  function BottomTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "Trang chủ",
            tabBarLabelStyle: { color: "#008E97" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name="home" size={24} color="#008E97" />
              ) : (
                <AntDesign name="home" size={24} color="black" />
              ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Cá nhân",
            tabBarLabelStyle: { color: "#008E97" },
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="person" size={24} color="#008E97" />
              ) : (
                <Ionicons name="person-outline" size={24} color="black" />
              ),
          }}
        />

        <Tab.Screen
          name="Cart"
          component={CartScreen}
          options={{
            tabBarLabel: "Giỏ hàng",
            tabBarLabelStyle: { color: "#008E97" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <AntDesign name="shoppingcart" size={24} color="#008E97" />
              ) : (
                <AntDesign name="shoppingcart" size={24} color="black" />
              ),
          }}
        />

        <Tab.Screen
          name="Chat Với Admin"
          component={ListAdmin}
          options={{
            tabBarLabel: "Chat với Admin",
            tabBarLabelStyle: { color: "#008E97" },
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="chatbubbles" size={24} color="#008E97" />
              ) : (
                <Ionicons name="chatbubbles-outline" size={24} color="black" />
              ),
          }}
        />
      </Tab.Navigator>
    );
  }
  return (
    <NavigationContainer>
      <AxiosProvider>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
          <Stack.Screen name="Info" component={ProductInfoScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Address" component={AddAddressScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Add" component={AddressScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Confirm" component={ConfirmationScreen} options={{ headerShown: false }} />

          <Stack.Screen name="Order" component={OrderScreen} options={{ headerShown: false }} />
          <Stack.Screen
            name="OrderSummary"
            component={OrderSummaryScreen}
            options={{ headerShown: true, title: "Order Summary" }}
          />

          <Stack.Screen name="Account" component={AccountScreen} options={{ headerShown: false }} />

          <Stack.Screen name="Setting" component={SettingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ProfileUser" component={ProfileUserScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Help" component={HelpScreen} options={{ headerShown: false }} />
          <Stack.Screen
            name="Chat"
            component={Chat}
            options={({ route }) => ({
              headerTitle: () => <ChatHeader chatName={route?.params?.chatName} chatId={route?.params?.id} />,
              headerRight: () => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <ChatMenu chatName={route.params.chatName} chatId={route.params.id} />
                </View>
              ),
            })}
          />
        </Stack.Navigator>
      </AxiosProvider>
    </NavigationContainer>
  );
};

export default StackNavigator;
