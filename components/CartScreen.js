import { Text, View, ScrollView, Pressable, TextInput, StyleSheet } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
// import { useDispatch } from "react-redux";
// import { decrementQuantity, incementQuantity, removeFromCart } from "../redux/CartReducer";
import { useNavigation } from "@react-navigation/native";
import { useGetMyCart } from "../api/cart";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "../components/Header";

const CartScreen = () => {
  // const dispatch = useDispatch();
  const { data, isLoading, error } = useGetMyCart();
  console.log(111, { data, isLoading, error });
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // const increaseQuantity = (item) => {
  //   dispatch(incementQuantity(item));
  // };
  // const decreaseQuantity = (item) => {
  //   dispatch(decrementQuantity(item));
  // };
  // const deleteItem = (item) => {
  //   dispatch(removeFromCart(item));
  // };
  return (
    <View style={[WrapperContentStyle(insets.bottom, insets.top).content]}>
      <Header />
      <View
        style={{
          backgroundColor: "#00CED1",
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 7,
            gap: 10,
            backgroundColor: "white",
            borderRadius: 3,
            height: 38,
            flex: 1,
          }}
        >
          <AntDesign style={{ paddingLeft: 10 }} name="search1" size={22} color="black" />
          <TextInput placeholder="Search Amazon.in" />
        </Pressable>

        <Feather name="mic" size={24} color="black" />
      </View>

      <View style={{ padding: 10, flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "400" }}>Subtotal : </Text>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>{data?.cart_count_product ?? 0}</Text>
      </View>
      <ScrollView style={{ flex: 1, backgroundColor: "red" }}>
        <View></View>
      </ScrollView>

      <Pressable
        onPress={() => navigation.navigate("Confirm")}
        style={{
          backgroundColor: "#FFC72C",
          padding: 10,
          borderRadius: 5,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
          marginTop: 10,
        }}
      >
        <Text>{`Proceed to Buy (${data?.cart_count_product ?? 0}) items`}</Text>
      </Pressable>
    </View>
  );
};

export default CartScreen;

const WrapperContentStyle = (paddingBottom = 0, paddingTop = 0) =>
  StyleSheet.create({
    content: {
      paddingBottom: paddingBottom + 16,
      paddingTop,
      backgroundColor: "white",
      flex: 1,
      paddingHorizontal: 8,
    },
  });

// const MainContentStyle = StyleSheet.create({
//   orderList: {
//     gap: 8,
//   },
// });
