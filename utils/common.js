import React from "react";
import { FontAwesome5, Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
import { STATUS_SHIPPING } from "../constants/status";

export const generateIconStatus = (type, size = 24, color = "black") => {
  switch (type) {
    case STATUS_SHIPPING.processing:
      return <MaterialIcons name="import-export" size={size} color={color} />;
    case STATUS_SHIPPING.ordered:
      return <Ionicons name="checkmark-done" size={size} color={color} />;
    case STATUS_SHIPPING.delivered:
      return <FontAwesome5 name="shipping-fast" size={size} color={color} />;
    case STATUS_SHIPPING.shipped:
      return <AntDesign name="home" size={size} color={color} />;
    default:
      return <MaterialIcons name="cancel-presentation" size={size} color={color} />;
  }
};

export const strippedString = (value) => {
  return value.replace(/<\/?p>/g, "");
};
