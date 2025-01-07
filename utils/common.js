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

export const convertCartData = (data) => {
  return data.map((item) => {
    return {
      productId: item?.productId?._id,
      product_colors: item.product_color.map((color) => ({
        code: color.code,
        name: color.name,
      })),
      quantity: item.quantity,
      name: item.name,
      price: item.price,
      _id: item._id,
    };
  });
};

export const getUniqueBrands = (data) => {
  if (!data) return [];

  const allBrandsWithIds = data.map((item) => item.product_brand[0]);

  const idSet = new Set();
  const uniqueBrands = [];

  allBrandsWithIds.forEach((brand) => {
    if (!idSet.has(brand._id)) {
      idSet.add(brand._id);
      uniqueBrands.push(brand);
    }
  });

  return uniqueBrands;
};

export const getUniqueCategory = (data) => {
  if (!data) return [];

  const allCategoryWithIds = data.map((item) => item.product_category[0]);

  const idSet = new Set();
  const uniqueCategory = [];

  allCategoryWithIds.forEach((category) => {
    if (!idSet.has(category._id)) {
      idSet.add(category._id);
      uniqueCategory.push(category);
    }
  });

  return uniqueCategory;
};

export const getUniqueTags = (data) => {
  if (!data) return [];

  const tags = data.map((item) => item.product_tags);
  const flattenedData = tags.flat();

  const uniqueTagsMap = new Map();

  flattenedData.forEach((item) => {
    if (!uniqueTagsMap.has(item._id)) {
      uniqueTagsMap.set(item._id, item);
    }
  });

  const uniqueTags = Array.from(uniqueTagsMap.values());

  return uniqueTags;
};

export const getUniqueColors = (data) => {
  if (!data) return [];

  const colors = data.map((item) => item.product_color);
  const flattenedData = colors.flat();

  const uniqueColorsMap = new Map();

  flattenedData.forEach((item) => {
    if (!uniqueColorsMap.has(item._id)) {
      uniqueColorsMap.set(item._id, item);
    }
  });

  const uniqueColors = Array.from(uniqueColorsMap.values());

  return uniqueColors;
};

export const getUniqueData = (data) => {
  return {
    brands: getUniqueBrands(data),
    categories: getUniqueCategory(data),
    colors: getUniqueColors(data),
    tags: getUniqueTags(data),
  };
};

export const getSessionId = (url) => {
  return url.split("/pay/")[1];
};
