import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import ListAdmin from "../screens/ListAdmin/ListAdmin";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, AntDesign, FontAwesome5, Feather } from "@expo/vector-icons";
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
import ProductListScreen from "../screens/ProductListScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarStyle: {
        height: 90,
        paddingTop: 3,
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.15)",
        borderTopWidth: 1,
        borderTopColor: "#bbb",
      },
      tabBarLabel: ({ focused }) => {
        let label;
        switch (route.name) {
          case "Home":
            label = "Trang chủ";
            break;
          case "ProductList":
            label = "Cửa hàng";
            break;
          case "Profile":
            label = "Cá nhân";
            break;
          case "Cart":
            label = "Giỏ hàng";
            break;
          case "Chat":
            label = "Chat";
            break;
        }
        return (
          <Text style={{ color: focused ? "#008E97" : "black", fontWeight: focused ? "700" : "500", fontSize: 14, height: 20 }}>
            {label}
          </Text>
        );
      },
      tabBarIcon: ({ focused }) => {
        let iconName;
        let IconComponent;
        switch (route.name) {
          case "Home":
            IconComponent = AntDesign;
            iconName = "home";
            break;
          case "ProductList":
            IconComponent = Feather;
            iconName = "shopping-bag";
            break;
          case "Profile":
            IconComponent = AntDesign;
            iconName = "user";
            break;
          case "Cart":
            IconComponent = AntDesign;
            iconName = "shoppingcart";
            break;
          case "Chat":
            IconComponent = Ionicons;
            iconName = "chatbubbles-outline";
            break;
        }
        return <IconComponent name={iconName} size={24} color={focused ? "#008E97" : "black"} />;
      },
    })}
    initialRouteName="Home"
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Tab.Screen name="ProductList" component={ProductListScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Chat" component={ListAdmin} options={{ headerShown: false }} />
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
        options={{ headerShown: false, title: "Tổng quan đơn hàng" }}
      />
      <Stack.Screen
        name="OrderSuccess"
        component={OrderSuccessScreen}
        options={{
          headerLeft: () => null,
          headerTitle: "Đặt hàng thành công",
          headerBackVisible: false,
          headerStyle: {
            backgroundColor: "#f0f0f0",
          },
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="ChatDetail"
        component={Chat}
        options={({ route }) => ({
          headerLeft: () => <View></View>,
          headerTitle: () => <ChatHeader chatName={route?.params?.chatName} />,
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
