/* eslint-disable react/prop-types */
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import React from "react";

import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";

const FilterProduct = ({ onPressFilter }) => {
  return (
    <>
      <View style={[FilterProductStyle.wrapper]}>
        <View style={{ width: 24, height: 24 }}></View>
        <Text style={{ fontWeight: 'bold', fontSize: 22, }}>Cửa hàng</Text>
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
    paddingVertical: 18,
    paddingHorizontal: 16,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
});
