import { Text, View, ScrollView, Pressable, TextInput, StyleSheet } from "react-native";
import React, { useMemo, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useGetMyCart } from "../api/cart";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "../components/Header";
import { CartItem } from "../components/CartItem";
import Loading from "../components/Loading";
import { colors } from "../config/constants";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const CartScreen = () => {
  const [searchValue, setSearchValue] = useState("");
  const { data, isLoading, refetch, error } = useGetMyCart();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const listItems = useMemo(() => {
    if (!Array.isArray(data?.data?.cart_products)) return [];
    return data?.data?.cart_products.filter((item) => item.name.toLowerCase().includes(searchValue.toLowerCase()));
  }, [data, searchValue]);

  const renderCartList = useMemo(() => {
    if (listItems.length > 0) {
      return (
        <View style={CartListStyle.orderList}>
          {listItems.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
        </View>
      );
    }
    return (
      <View style={CartListStyle.empty}>
        <AntDesign name="inbox" size={54} color="black" />
        <Text style={CartListStyle.emptyText}>Cart is empty</Text>
      </View>
    );
  }, [listItems]);

  useFocusEffect(() => {
    if (!error) {
      refetch();
    }
  });

  return (
    <>
      <View style={[WrapperContentStyle(insets.bottom, insets.top).content]}>
        <Header title="Giỏ hàng" />
        <View
          style={{
            backgroundColor: colors.primary,
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
            <TextInput
              placeholder="Tìm kiếm sản phẩm trong giỏ hàng"
              value={searchValue}
              onChangeText={(text) => setSearchValue(text)}
            />
          </Pressable>

          <Feather name="mic" size={24} color="black" />
        </View>

        <View style={{ padding: 10, flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "400" }}>Tổng cộng: </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{data?.cart_count_product ?? 0}</Text>
        </View>
        <ScrollView style={{ flex: 1 }}>{renderCartList}</ScrollView>

        <Pressable
          onPress={() => {
            data?.data &&
              navigation.navigate("OrderSummary", {
                cartData: data?.data,
              });
          }}
          style={{
            backgroundColor: colors.primary,
            padding: 10,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
            marginTop: 10,
          }}
        >
          <Text>{`Tiến hành đặt hàng (${data?.data?.cart_products?.length ?? 0}) sản phẩm`}</Text>
        </Pressable>
      </View>
      {isLoading && <Loading />}
    </>
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

const CartListStyle = StyleSheet.create({
  orderList: {
    gap: 8,
  },
  empty: {
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 500,
  },
});
