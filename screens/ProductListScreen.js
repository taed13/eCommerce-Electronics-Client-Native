import { ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput } from "react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetAllProduct } from "../api/product";
import ProductItemList from "../components/ProductItemList";
import FilterProduct from "../components/FilterProduct";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import { getUniqueData } from "../utils/common";
import { colors } from "../constants/color";
import { DEFAULT_VALUE_FILTER } from "../constants/common";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const ProductListScreen = () => {
  const insets = useSafeAreaInsets();
  const { data } = useGetAllProduct();
  const bottomSheetModalRef = useRef(null);
  const [filterValues, setFilterValues] = useState(DEFAULT_VALUE_FILTER);

  const finalData = useMemo(() => {
    if (!data) return [];

    const result = [];
    const addedIds = new Set();

    data.forEach((item) => {
      const price = item.product_after_price || item.product_price;
      let isPriceValid = true;

      switch (filterValues.priceRange) {
        case "under5m":
          isPriceValid = price <= 5000000;
          break;
        case "under10m":
          isPriceValid = price <= 10000000;
          break;
        case "under20m":
          isPriceValid = price <= 20000000;
          break;
        case "under30m":
          isPriceValid = price <= 30000000;
          break;
        case "above30m":
          isPriceValid = price > 30000000;
          break;
        default:
          isPriceValid = true;
      }

      const isBrandValid = filterValues.brand.length === 0 || filterValues.brand.includes(item.product_brand[0]._id);
      const isCategoryValid = filterValues.category.length === 0 || filterValues.category.includes(item.product_category[0]._id);
      const isTagValid = filterValues.tag.length === 0 || item.product_tags.some(tag => filterValues.tag.includes(tag._id));
      const isColorValid = filterValues.color.length === 0 || item.product_color.some(color => filterValues.color.includes(color._id));

      if (isPriceValid && isBrandValid && isCategoryValid && isTagValid && isColorValid) {
        if (!addedIds.has(item._id)) {
          result.push(item);
          addedIds.add(item._id);
        }
      }
    });

    return result;
  }, [filterValues, data]);

  const hanldeOpenFilter = () => {
    bottomSheetModalRef.current?.present();
  };

  const dataUnique = getUniqueData(data);

  const handleReset = () => {
    setFilterValues(DEFAULT_VALUE_FILTER);
  };

  const handleApply = () => {
    bottomSheetModalRef.current.close();
  };

  const handlePressBrand = useCallback((item, key) => {
    setFilterValues((prev) => {
      const selected = prev[key];
      const isSelected = selected.includes(item._id);

      if (isSelected) {
        return {
          ...prev,
          [key]: selected.filter((id) => id !== item._id),
        };
      }

      return {
        ...prev,
        [key]: [...selected, item._id],
      };
    });
  }, []);

  const renderBrand = useMemo(() => {
    return (
      <View style={BottomSheetStyle.filterContainer}>
        <View>
          <Text style={BottomSheetStyle.label}>Khoảng giá (VNĐ)</Text>
          <View style={BottomSheetStyle.priceRangeContainer}>
            <TouchableOpacity
              style={[
                BottomSheetStyle.priceRangeButton,
                filterValues.priceRange === "under5m" && BottomSheetStyle.priceRangeButtonActive,
              ]}
              onPress={() => setFilterValues((prev) => ({ ...prev, priceRange: "under5m" }))}
            >
              <Text style={filterValues.priceRange === "under5m" ? BottomSheetStyle.priceTextActive : {}}>Dưới 5tr</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                BottomSheetStyle.priceRangeButton,
                filterValues.priceRange === "under10m" && BottomSheetStyle.priceRangeButtonActive,
              ]}
              onPress={() => setFilterValues((prev) => ({ ...prev, priceRange: "under10m" }))}
            >
              <Text style={filterValues.priceRange === "under10m" ? BottomSheetStyle.priceTextActive : {}}>Dưới 10tr</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                BottomSheetStyle.priceRangeButton,
                filterValues.priceRange === "under20m" && BottomSheetStyle.priceRangeButtonActive,
              ]}
              onPress={() => setFilterValues((prev) => ({ ...prev, priceRange: "under20m" }))}
            >
              <Text style={filterValues.priceRange === "under20m" ? BottomSheetStyle.priceTextActive : {}}>Dưới 20tr</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                BottomSheetStyle.priceRangeButton,
                filterValues.priceRange === "under30m" && BottomSheetStyle.priceRangeButtonActive,
              ]}
              onPress={() => setFilterValues((prev) => ({ ...prev, priceRange: "under30m" }))}
            >
              <Text style={filterValues.priceRange === "under30m" ? BottomSheetStyle.priceTextActive : {}}>Dưới 30tr</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                BottomSheetStyle.priceRangeButton,
                filterValues.priceRange === "above30m" && BottomSheetStyle.priceRangeButtonActive,
              ]}
              onPress={() => setFilterValues((prev) => ({ ...prev, priceRange: "above30m" }))}
            >
              <Text style={filterValues.priceRange === "above30m" ? BottomSheetStyle.priceTextActive : {}}>Trên 30tr</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Text style={BottomSheetStyle.label}>Hãng</Text>
          <View style={BottomSheetStyle.brand}>
            {dataUnique.brands.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handlePressBrand(item, "brand")}
                style={[
                  BottomSheetStyle.btnBrand,
                  filterValues.brand.includes(item._id) && BottomSheetStyle.btnBrandActive,
                ]}
              >
                <Text style={[filterValues.brand.includes(item._id) && BottomSheetStyle.btnTextActive]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View>
          <Text style={BottomSheetStyle.label}>Category</Text>
          <View style={BottomSheetStyle.brand}>
            {dataUnique.categories.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handlePressBrand(item, "category")}
                  style={[
                    BottomSheetStyle.btnBrand,
                    filterValues.category === item._id && BottomSheetStyle.btnBrandActive,
                  ]}
                >
                  <Text style={[filterValues.category === item._id && BottomSheetStyle.btnTextActive]}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View>
          <Text style={BottomSheetStyle.label}>Tag</Text>
          <View style={BottomSheetStyle.brand}>
            {dataUnique.tags.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handlePressBrand(item, "tag")}
                  style={[BottomSheetStyle.btnBrand, filterValues.tag === item._id && BottomSheetStyle.btnBrandActive]}
                >
                  <Text style={[filterValues.tag === item._id && BottomSheetStyle.btnTextActive]}>{item.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View>
          <Text style={BottomSheetStyle.label}>Color</Text>
          <View style={BottomSheetStyle.brand}>
            {dataUnique.colors.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handlePressBrand(item, "color")}
                  style={[BottomSheetStyle.btnColor, { backgroundColor: item.code }]}
                >
                  {filterValues.color === item._id && <Feather name="check" size={20} color={colors.darkGray} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    );
  }, [filterValues, dataUnique, handlePressBrand]);

  return (
    <View style={ViewSafeArea(insets).container}>
      <FilterProduct onPressFilter={hanldeOpenFilter} />
      <ScrollView style={ProductListScreenStyle.container}>
        <View style={[ProductListScreenStyle.list]}>
          {finalData.length > 0 ? (
            finalData.map((item, index) => {
              return <ProductItemList key={index} item={item} />;
            })
          ) : (
            <View style={ProductListScreenStyle.empty}>
              <MaterialCommunityIcons name="flask-empty-remove-outline" size={48} color="black" />
              <Text>Không có sản phẩm phù hợp với bộ lọc</Text>
              <TouchableOpacity style={ProductListScreenStyle.btnReset} onPress={handleReset}>
                <Text>Xoá bộ lọc</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        backdropComponent={(props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} opacity={1} />}
      >
        <BottomSheetView style={BottomSheetStyle.content}>
          <BottomSheetScrollView contentContainerStyle={{ flex: 1 }}>
            <View style={[ViewSafeArea(insets).filter]}>
              <View>{renderBrand}</View>
              <View style={BottomSheetStyle.btnActionWrapper}>
                <TouchableOpacity style={[BottomSheetStyle.btnAction]} onPress={handleReset}>
                  <Text style={[BottomSheetStyle.btnActionText]}>Xoá bộ lọc</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[BottomSheetStyle.btnAction, BottomSheetStyle.btnApply]} onPress={handleApply}>
                  <Text style={[BottomSheetStyle.btnActionText, BottomSheetStyle.btnApplyText]}>Áp dụng bộ lọc</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

export default ProductListScreen;

const ViewSafeArea = (insets) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: insets.top + 0,
      paddingHorizontal: 16,
    },
    filter: {
      paddingBottom: insets.bottom + 16,
      paddingHorizontal: 16,
    },
  });

const ProductListScreenStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  item: {
    flex: 1,
  },
  empty: {
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingVertical: 20,
    flex: 1,
  },
  btnReset: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 36,
    paddingVertical: 12,
  },
});

const BottomSheetStyle = StyleSheet.create({
  content: {
    minHeight: 300,
    flex: 1,
  },
  btnActionWrapper: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 16,
  },
  btnAction: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btnActionText: {
    fontWeight: 500,
    fontSize: 16,
  },
  btnApply: {
    backgroundColor: '#008E97',
  },
  btnApplyText: {
    color: "white",
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 500,
  },
  filterContainer: {
    gap: 16,
  },
  brand: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    rowGap: 10,
  },
  btnColor: {
    borderRadius: 999,
    width: 30,
    height: 30,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btnBrand: {
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "30%",
    height: 32,
    borderWidth: 1,
  },
  btnBrandActive: {
    backgroundColor: '#008E97',
  },
  btnTextActive: {
    color: "white",
    fontWeight: 500,
  },
  priceRangeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },
  priceRangeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  priceRangeButtonActive: {
    backgroundColor: "#008E97",
    borderColor: "#008E97",
  },
  priceTextActive: {
    color: "white",
    fontWeight: "bold",
  },
});
