/* eslint-disable react/prop-types */
import React, { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { colors } from "../constants/color";
import Checkbox from "expo-checkbox";
import { useState } from "react";
export const CartItem = ({ item, isChecked, onValueChange }) => {
  const [checked, setChecked] = useState(isChecked);
  return (
    <View style={CartItemStyle.container}>
      <Checkbox
        style={CartItemStyle.checkbox}
        value={checked}
        onValueChange={(value) => {
          setChecked(value);
          onValueChange(item._id, value);
        }}
      />
      <TouchableOpacity style={CartItemStyle.wrapper}>
        <View style={[CartItemStyle.item]}>
          <Image source={{ uri: item.productId.product_images[0].url }} style={CartItemStyle.image} />
          <View>
            <Text>{item.name}</Text>
            <View style={CartItemStyle.star}>
              <Text>{item.productId.product_totalRating}</Text>
              <AntDesign name="star" size={16} color={colors.yellow} />
            </View>
          </View>
        </View>
        <View style={CartItemStyle.infor}>
          <Text style={CartItemStyle.price}>{item.price} đ</Text>
          <Text style={CartItemStyle.quantity}>x {item.quantity}</Text>
        </View>
        <View style={CartItemStyle.total}>
          <Text>Total:</Text>
          <Text style={CartItemStyle.totalPrice}>{Number(item.price) * Number(item.quantity)}</Text>
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
    gap: 8,
  },
  checkbox: {
    marginLeft: 8,
    padding: 8,
    width: 16,
    height: 16,
  },
  wrapper: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "white",
  },
  status: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.gray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: colors.gray,
  },
  item: {
    marginTop: 6,
    flexDirection: "row",
    gap: 8,
  },
  itemName: {
    fontSize: 18,
  },
  infor: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  price: {
    marginLeft: 108,
    fontSize: 20,
  },
  quantity: {
    color: colors.orange,
  },
  totalPrice: {
    fontSize: 20,
    color: colors.red,
  },
  total: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 8,
    justifyContent: "flex-end",
    gap: 8,
  },
  divider: {
    borderBottomWidth: 1,
    marginTop: 4,
    borderBottomColor: colors.gray,
  },
  star: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
