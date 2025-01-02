import React, { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { generateIconStatus } from "../utils/common";
import { colors } from "../constants/color";

export const OrderItem = (item) => {
  const Icon = generateIconStatus(item.item.order_status, 30, colors.darkGray);
  return (
    <TouchableOpacity style={OrderItemStyle.wrapper}>
      <View style={OrderItemStyle.status}>
        {Icon}
        <Text>{item.item.order_status}</Text>
      </View>
      <View style={[OrderItemStyle.item]}>
        <Image
          source={{ uri: item.item.order_items[0].productId.product_images[0].url }}
          style={OrderItemStyle.image}
        />
        <View>
          <Text style={OrderItemStyle.itemName}>{item.item.order_items[0].productId.product_name}</Text>
          <Text>{item.item.order_items[0].product_colors[0].name}</Text>
        </View>
      </View>
      <View style={OrderItemStyle.infor}>
        <Text style={OrderItemStyle.price}>{item.item.order_items[0].price} đ</Text>
        <Text style={OrderItemStyle.quantity}>x {item.item.order_items[0].quantity}</Text>
      </View>
      <View style={OrderItemStyle.total}>
        <Text>Total:</Text>{" "}
        <Text style={OrderItemStyle.totalPrice}>{item.item.checkoutInfo.totalPriceAfterDiscount}</Text>
      </View>
      <View style={OrderItemStyle.divider} />
    </TouchableOpacity>
  );
};

const OrderItemStyle = StyleSheet.create({
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
});
