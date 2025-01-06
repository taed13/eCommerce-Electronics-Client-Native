import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import ListAdmin from "../screens/ListAdmin/ListAdmin";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo, Ionicons, AntDesign, FontAwesome5 } from "@expo/vector-icons";
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
import Chat from "../screens/Chat";
import ChatHeader from "../components/ChatHeader";
import ChatMenu from "../components/ChatMenu";
import { View, Text } from "react-native";
import OrderSummaryScreen from "../screens/OrderSummaryScreen";
import OrderSuccessScreen from "../screens/OrderSuccessScreen";
import EditAddressScreen from "../screens/EditAddressScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabs = () => (
  <Tab.Navigator initialRouteName="Home">
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarLabel: ({ focused }) => (
          <Text style={{ color: focused ? "#008E97" : "black", fontWeight: focused ? "700" : "500", fontSize: 14 }}>
            Trang chủ
          </Text>
        ),
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
      name="Cá nhân"
      component={ProfileScreen}
      options={{
        tabBarLabel: ({ focused }) => (
          <Text style={{ color: focused ? "#008E97" : "black", fontWeight: focused ? "700" : "500", fontSize: 14 }}>
            Cá nhân
          </Text>
        ),
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
        tabBarLabel: ({ focused }) => (
          <Text style={{ color: focused ? "#008E97" : "black", fontWeight: focused ? "700" : "400", fontSize: 14 }}>
            Giỏ hàng
          </Text>
        ),
        headerShown: false,
        tabBarIcon: ({ focused }) =>
          focused ? (
            <FontAwesome5 name="shopping-cart" size={21} color="#008E97" />
          ) : (
            <AntDesign name="shoppingcart" size={24} color="black" />
          ),
      }}
    />
    <Tab.Screen
      name="Chat"
      component={ListAdmin}
      options={{
        tabBarLabel: ({ focused }) => (
          <Text style={{ color: focused ? "#008E97" : "black", fontWeight: focused ? "700" : "500", fontSize: 14 }}>
            Chat
          </Text>
        ),
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

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={BottomTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Chat" component={ListAdmin} options={{ headerShown: false }} />
      <Stack.Screen name="Info" component={ProductInfoScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Address" component={AddAddressScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Confirm" component={ConfirmationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Order" component={OrderScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Setting" component={SettingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProfileUser" component={ProfileUserScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Account" component={AccountScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Help" component={HelpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Add" component={AddressScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EditAddress" component={EditAddressScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="OrderSummary"
        component={OrderSummaryScreen}
        options={{ headerShown: true, title: "Tổng quan đơn hàng" }}
      />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} options={{ headerShown: true }} />
      <Stack.Screen
        name="ChatDetail"
        component={Chat}
        options={({ route }) => ({
          headerTitle: () => <ChatHeader chatName={route?.params?.chatName} chatId={route?.params?._id} />,
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ChatMenu chatName={route.params.chatName} chatId={route.params._id} />
            </View>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
