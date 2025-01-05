import { Text, View, ScrollView, Pressable, TextInput, StyleSheet } from "react-native";
import React, { useMemo, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Checkbox } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { CartItem } from "../components/CartItem";
import Loading from "../components/Loading";

import { colors } from "../config/constants";

import { useGetMyCart } from "../api/cart";

const CartScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const { data, isLoading, refetch, error } = useGetMyCart();

  const [searchValue, setSearchValue] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const listItems = useMemo(() => {
    if (!Array.isArray(data?.data?.cart_products)) return [];
    return data?.data?.cart_products.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [data, searchValue]);

  const handleSelectItem = (itemId) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const allItemIds = listItems.map((item) => item._id);
      setSelectedItems(allItemIds);
    }
    setSelectAll(!selectAll);
  };

  const renderCartList = useMemo(() => {
    if (listItems.length > 0) {
      return (
        <View style={CartListStyle.orderList}>
          {listItems.map((item) => (
            <CartItem
              key={item._id}
              item={item}
              isChecked={selectedItems.includes(item._id)}
              onToggleCheckbox={() => handleSelectItem(item._id)}
            />
          ))}
        </View>
      );
    }
    return (
      <View style={CartListStyle.empty}>
        <AntDesign name="inbox" size={50} color="black" />
        <Text style={CartListStyle.emptyText}>Không có sản phẩm nào trong giỏ hàng!</Text>
      </View>
    );
  }, [listItems, selectedItems]);

  useFocusEffect(() => {
    if (!error) {
      refetch();
    }
  });

  const handleProceedOrder = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để đặt hàng!");
      return;
    }
  
    const selectedProducts = listItems.filter((item) => selectedItems.includes(item._id));
    navigation.navigate("OrderSummary", { cartData: { cart_products: selectedProducts } });
  };  

  return (
    <>
      <View style={[WrapperContentStyle(insets.bottom, insets.top).content]}>
        <View style={{ backgroundColor: "#131921", padding: 10, flexDirection: "row", alignItems: "center" }}>

          <Pressable style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 3, gap: 10, backgroundColor: "white", borderRadius: 50, height: 40, flex: 1, }}>
            <AntDesign style={{ paddingLeft: 10 }} name="search1" size={22} color="black" />
            <TextInput
              placeholder="Tìm kiếm sản phẩm trong giỏ hàng"
              value={searchValue}
              onChangeText={(text) => setSearchValue(text)}
            />
          </Pressable>
        </View>

        {/* Checkbox Chọn Tất Cả */}
        <Pressable onPress={handleSelectAll} style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
          <Checkbox.Android
            status={selectAll ? "checked" : "unchecked"}
            color={colors.primary}
            uncheckedColor={colors.grey}
            size={20}
          />
          <Text style={{ fontSize: 16 }}>Chọn tất cả sản phẩm</Text>
        </Pressable>
        <ScrollView style={{ flex: 1 }}>{renderCartList}</ScrollView>

        <Pressable
          onPress={handleProceedOrder}
          style={{
            backgroundColor: selectedItems.length === 0 ? "#ccc" : colors.primary,
            padding: 10,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
            marginTop: 10,
          }}
          disabled={selectedItems.length === 0}
        >
          <Text>{`Tiến hành đặt hàng (${selectedItems.length}) sản phẩm`}</Text>
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
    },
  });

const CartListStyle = StyleSheet.create({
  orderList: {
    gap: 8,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
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
