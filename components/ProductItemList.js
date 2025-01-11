import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { colors } from "../constants/color";
import { useNavigation } from "@react-navigation/native";
import SoldOut from "../assets/sold-out-png-4.png";

const ProductItemList = ({ item }) => {
  const navigation = useNavigation();

  const discountLabel = item.product_after_price
    ? item.discount.discount_type === "percentage"
      ? `-${item.discount.discount_value}%`
      : `-${item.discount.discount_value.toLocaleString()}₫`
    : null;

  return (
    <TouchableOpacity
      style={[ProductItemListStyle.wrapper]}
      onPress={() => navigation.navigate("Info", { id: item._id })}
      disabled={item.product_quantity === 0} // Vô hiệu hóa nút nếu hết hàng
    >
      <View style={[ProductItemListStyle.container]}>
        <Image source={{ uri: item.product_images[0].url }} style={ProductItemListStyle.image} />
        {discountLabel && (
          <View style={ProductItemListStyle.discountTag}>
            <Text style={ProductItemListStyle.discountText}>{discountLabel}</Text>
          </View>
        )}
        <View style={[ProductItemListStyle.content]}>
          <Text style={[ProductItemListStyle.brand]}>{item.product_brand[0].title}</Text>
          <Text
            style={[ProductItemListStyle.name]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.product_name}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <AntDesign name="star" size={20} color={colors.yellow} />
              <Text style={{ marginLeft: 5, fontSize: 14, color: "#666" }}>
                {item?.product_totalRating?.toFixed(1) || 0}/5
              </Text>
            </View>
            {item?.product_sold !== 0 &&
              <Text style={ProductItemListStyle.sold}>
                Đã bán {item?.product_sold}
              </Text>}
          </View>
          {item.product_after_price ? (
            <View style={ProductItemListStyle.priceContainer}>
              <Text style={ProductItemListStyle.newPrice}>{item.product_after_price.toLocaleString()}₫</Text>
              <Text style={ProductItemListStyle.originalPrice}>Giá gốc: {item.product_price.toLocaleString()}₫</Text>
            </View>
          ) : (
            <Text style={[ProductItemListStyle.price]}>{item.product_price.toLocaleString()}₫</Text>
          )}
        </View>
        {item.product_quantity === 0 && (
          <View style={ProductItemListStyle.soldOutCard}>
            <Image source={SoldOut} style={ProductItemListStyle.soldOutImage} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ProductItemList;

const ProductItemListStyle = StyleSheet.create({
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  wrapper: {
    width: "48%",
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    gap: 8,
  },
  content: {
    gap: 8,
  },
  brand: {
    textAlign: "center",
    color: "#51919c",
    fontSize: 16,
    marginTop: 16,
    fontWeight: "500",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  priceContainer: {
    alignItems: "center",
  },
  newPrice: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "700",
    color: "#d32f2f",
  },
  originalPrice: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "400",
    color: "#999",
    textDecorationLine: "line-through",
  },
  price: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "500",
  },
  sold: {
    fontSize: 12,
    color: "#999",
  },
  discountTag: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#d32f2f",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
  soldOutCard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    zIndex: 10,
  },
  soldOutImage: {
    width: 180,
    height: 180,
    resizeMode: "contain",
  },
});
