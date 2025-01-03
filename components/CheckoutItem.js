/* eslint-disable react/prop-types */
import React, { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { colors } from "../constants/color";
export const CheckoutItem = ({ item }) => {
  return (
    <View style={CheckoutItemStyle.container}>
      <TouchableOpacity style={CheckoutItemStyle.wrapper}>
        <View style={[CheckoutItemStyle.item]}>
          <Image source={{ uri: item.productId.product_images[0].url }} style={CheckoutItemStyle.image} />
          <View>
            <Text>{item.name}</Text>
            <View style={CheckoutItemStyle.star}>
              <Text>{item.productId.product_totalRating}</Text>
              <AntDesign name="star" size={16} color={colors.yellow} />
            </View>
          </View>
        </View>
        <View style={CheckoutItemStyle.infor}>
          <Text style={CheckoutItemStyle.price}>{item.price} đ</Text>
          <Text style={CheckoutItemStyle.quantity}>x {item.quantity}</Text>
        </View>
        {/* <View style={CheckoutItemStyle.total}>
          <Text>Total:</Text>
          <Text style={CheckoutItemStyle.totalPrice}>{Number(item.price) * Number(item.quantity)}</Text>
        </View>
        <View style={CheckoutItemStyle.divider} /> */}
      </TouchableOpacity>
    </View>
  );
};

const CheckoutItemStyle = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    overflow: "hidden",
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
    flex: 1,
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
