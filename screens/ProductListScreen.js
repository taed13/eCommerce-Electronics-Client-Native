import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

    if (!filterValues.brand && !filterValues.category && !filterValues.tag && !filterValues.color) {
      return data;
    }

    const result = [];
    const addedIds = new Set();

    data.forEach((item) => {
      if (
        (filterValues.brand && item.product_brand[0]._id === filterValues.brand) ||
        (filterValues.category && item.product_category[0]._id === filterValues.category) ||
        (filterValues.tag && item.product_tags.includes(filterValues.tag)) ||
        (filterValues.color && item.product_color.includes(filterValues.color))
      ) {
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
    setFilterValues((pre) => {
      if (pre[key] === item._id) {
        return {
          ...pre,
          [key]: undefined,
        };
      }
      return { ...pre, [key]: item._id };
    });
  }, []);

  const renderBrand = useMemo(() => {
    return (
      <View style={BottomSheetStyle.filterContainer}>
        <View>
          <Text style={BottomSheetStyle.label}>Hãng</Text>
          <View style={BottomSheetStyle.brand}>
            {dataUnique.brands.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handlePressBrand(item, "brand")}
                  style={[
                    BottomSheetStyle.btnBrand,
                    filterValues.brand === item._id && BottomSheetStyle.btnBrandActive,
                  ]}
                >
                  <Text style={[filterValues.brand === item._id && BottomSheetStyle.btnTextActive]}>{item.title}</Text>
                </TouchableOpacity>
              );
            })}
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
                <Text>Reset filter</Text>
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
                  <Text style={[BottomSheetStyle.btnActionText]}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[BottomSheetStyle.btnAction, BottomSheetStyle.btnApply]} onPress={handleApply}>
                  <Text style={[BottomSheetStyle.btnActionText, BottomSheetStyle.btnApplyText]}>Apply filter</Text>
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
      paddingBottom: insets.bottom + 0,
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
    backgroundColor: colors.red,
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
    backgroundColor: colors.red,
  },
  btnTextActive: {
    color: "white",
    fontWeight: 500,
  },
});
