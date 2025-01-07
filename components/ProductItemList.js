/* eslint-disable react/prop-types */
import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { colors } from "../constants/color";

const ProductItemList = ({ item }) => {
  const renderStar = useMemo(() => {
    const filledStars = Array.from({ length: item.product_totalRating ?? 0 }, (_, i) => (
      <AntDesign key={`filled-${i}`} name="star" size={16} color={colors.yellow} />
    ));

    const emptyStars = Array.from({ length: 5 - item.product_totalRating }, (_, i) => (
      <AntDesign key={`empty-${i}`} name="staro" size={16} color={colors.yellow} />
    ));

    return <View style={{ flexDirection: "row" }}>{[...filledStars, ...emptyStars]}</View>;
  }, [item.product_totalRating]);
  return (
    <TouchableOpacity style={[ProductItemListStyle.wrapper]}>
      <View style={[ProductItemListStyle.container]}>
        <Image source={{ uri: item.product_images[0].url }} style={ProductItemListStyle.image} />
        <View>{renderStar}</View>
        <View style={[ProductItemListStyle.content]}>
          <Text style={[ProductItemListStyle.brand]}>{item.product_brand[0].title}</Text>
          <Text style={[ProductItemListStyle.name]}>{item.product_name}</Text>
          <Text style={[ProductItemListStyle.price]}>{item.product_price} đ</Text>
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
    color: colors.red,
    fontSize: 16,
    marginTop: 16,
    fontWeight: 500,
  },
  name: {
    fontSize: 14,
    fontWeight: 500,
  },
  price: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: 500,
  },
});
