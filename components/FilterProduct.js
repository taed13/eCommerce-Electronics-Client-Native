/* eslint-disable react/prop-types */
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import React from "react";

import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";

const FilterProduct = ({ onPressFilter }) => {
  return (
    <>
      <View style={[FilterProductStyle.wrapper]}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={20} color="black" />
        </TouchableOpacity>

        <Text>Danh sách sản phẩm</Text>
        <TouchableOpacity onPress={onPressFilter}>
          <AntDesign name="filter" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default FilterProduct;

const FilterProductStyle = StyleSheet.create({
  wrapper: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
});
