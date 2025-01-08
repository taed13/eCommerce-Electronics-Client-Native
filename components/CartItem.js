/* eslint-disable react/prop-types */
import React, { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Checkbox } from "react-native-paper";

import { colors } from "../constants/color";

export const CartItem = ({ item, isChecked, onToggleCheckbox }) => {

  return (
    <View style={CartItemStyle.container}>
      <Checkbox.Android
        status={isChecked ? "checked" : "unchecked"}
        onPress={onToggleCheckbox}
        color={colors.checkboxPrimary}
        uncheckedColor={colors.gray}
        style={CartItemStyle.checkbox}
      />

      <TouchableOpacity style={CartItemStyle.wrapper} onPress={onToggleCheckbox}>
        <View style={[CartItemStyle.item]}>
          <Image source={{ uri: item.productId.product_images[0].url }} style={CartItemStyle.image} />
          <View style={CartItemStyle.details}>
            <Text style={CartItemStyle.itemName}>{item.name}</Text>
            <View style={CartItemStyle.star}>
              <Text>{item.productId.product_totalRating}</Text>
              <AntDesign name="star" size={16} color={colors.yellow} />
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Text style={{ color: '#888' }}>{item.product_color[0].name}</Text>
                <View style={{ backgroundColor: item.product_color[0].code, border: "1px solid #ccc", width: 20, height: 20, borderRadius: 10, justifyContent: "center", alignItems: "center" }} />
              </View>
            </View>
          </View>
        </View>
        <View style={CartItemStyle.infor}>
          <Text style={CartItemStyle.price}>đ{item.price.toLocaleString()}</Text>
          <Text style={CartItemStyle.quantity}>x {item.quantity}</Text>
        </View>
        <View style={CartItemStyle.total}>
          <Text style={CartItemStyle.totalLabel}>Tổng cộng:</Text>
          <Text style={CartItemStyle.totalPrice}>
            đ{(Number(item.price) * Number(item.quantity)).toLocaleString()}
          </Text>
        </View>
        <View style={CartItemStyle.divider} />
      </TouchableOpacity>
    </View>
  );
};

const CartItemStyle = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    marginRight: 10,
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  details: {
    flex: 1,
  },
  itemName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  star: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  infor: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.teal,
  },
  quantity: {
    fontSize: 16,
    color: colors.orange,
  },
  total: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.red,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    marginTop: 8,
  },
});
