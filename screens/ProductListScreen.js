import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetAllProduct } from "../api/product";
import ProductItemList from "../components/ProductItemList";
import FilterProduct from "../components/FilterProduct";
import BottomSheet, { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

const ProductListScreen = () => {
  const insets = useSafeAreaInsets();
  const { data } = useGetAllProduct();
  const bottomSheetModalRef = useRef(null);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  const hanldeOpenFilter = () => {
    bottomSheetModalRef.current?.present();
  };
  // console.log(data);
  return (
    <View style={ViewSafeArea(insets).container}>
      <FilterProduct onPressFilter={hanldeOpenFilter} />
      <ScrollView style={ProductListScreenStyle.container}>
        <View style={[ProductListScreenStyle.list]}>
          {data &&
            data.map((item, index) => {
              return <ProductItemList key={index} item={item} />;
            })}
        </View>
      </ScrollView>
      <BottomSheetModal ref={bottomSheetModalRef} onChange={handleSheetChanges} snapPoints={["80%"]}>
        <BottomSheetView style={BottomSheetStyle.content}>
          <Text>Awesome 🎉</Text>
          <Text>Awesome 🎉</Text>
          <Text>Awesome 🎉</Text>
          <Text>Awesome 🎉</Text>
          <Text>Awesome 🎉</Text>
          <Text>Awesome 🎉</Text>
          <Text>Awesome 🎉</Text>
          <Text>Awesome 🎉</Text>
          <Text>Awesome 🎉</Text>
          <Text>Awesome 🎉</Text>
          <Text>Awesome 🎉</Text>
          <Text>Awesome 🎉</Text>
          <Text>Awesome 🎉</Text>
          <Text>Awesome 🎉</Text>
          <Text>Awesome 🎉</Text>
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
});

const BottomSheetStyle = StyleSheet.create({
  content: {
    backgroundColor: "red",
  },
});
