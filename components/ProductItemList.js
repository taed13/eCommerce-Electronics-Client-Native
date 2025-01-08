/* eslint-disable react/prop-types */
import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { colors } from "../constants/color";
import { useNavigation } from "@react-navigation/native";

const ProductItemList = ({ item }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={[ProductItemListStyle.wrapper]} onPress={() => navigation.navigate("Info", { id: item._id })}>
      <View style={[ProductItemListStyle.container]}>
        <Image source={{ uri: item.product_images[0].url }} style={ProductItemListStyle.image} />
        <View style={[ProductItemListStyle.content]}>
          <Text style={[ProductItemListStyle.brand]}>{item.product_brand[0].title}</Text>
          <Text style={[ProductItemListStyle.name]}>{item.product_name}</Text>
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
          <Text style={[ProductItemListStyle.price]}>{item.product_price.toLocaleString()}₫</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductItemList;

const ProductItemListStyle = StyleSheet.create({
  image: {
    width: 120,
    height: 120,
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
    color: '#51919c',
    fontSize: 16,
    marginTop: 16,
    fontWeight: 500,
  },
  name: {
    fontSize: 18,
    fontWeight: 700,
    textAlign: "center",
  },
  price: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: 500,
  },
  sold: {
    fontSize: 12,
    color: "#999",
  },
});
