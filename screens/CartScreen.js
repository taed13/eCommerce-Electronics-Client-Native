import { Text, View, ScrollView, Pressable, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Checkbox } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Swipeable } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import { CartItem } from "../components/CartItem";
import Loading from "../components/Loading";

import { colors } from "../config/constants";

import { useGetMyCart, useDeleteProductFromCart, useEmptyCart } from "../api/cart";
import { useGetCurrentUser } from "../api/user";
import AddressBottomModal from "../components/AddressBottomModal";
import Toast from "react-native-toast-message";

const CartScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const { data, isLoading, refetch, error } = useGetMyCart();
  const { data: currentUserData, isLoading: isLoadingUser, refetch: refetchUserData } = useGetCurrentUser();
  const { mutate: emptyCart, isLoading: isEmptying } = useEmptyCart();
  const { mutate: deleteProductFromCart, isLoading: isDeleting } = useDeleteProductFromCart();

  const defaultAddress =
    currentUserData?.data?.addresses?.find((address) => address.default === true) || undefined;

  const [searchValue, setSearchValue] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddress, setSelectedAdress] = useState("");

  const inputRef = useRef(null);

  const listItems = useMemo(() => {
    if (!Array.isArray(data?.data?.cart_products)) return [];
    return data?.data?.cart_products.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [data, searchValue]);

  const handleSelectItem = (itemId) => {
    setSelectedItems((prevSelected) => {
      const newSelectedItems = prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId];

      setSelectAll(newSelectedItems.length === listItems.length);

      return newSelectedItems;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const allItemIds = listItems.map((item) => item._id);
      setSelectedItems(allItemIds);
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteItem = (itemId) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?",
      [
        { text: "Không", style: "cancel" },
        {
          text: "Có",
          onPress: () => {
            deleteProductFromCart(
              itemId,
              {
                onSuccess: () => {
                  Toast.show({
                    type: "success",
                    text1: "Thành công",
                    text2: "Sản phẩm khỏi giỏ hàng!",
                  })
                  refetch();
                },
                onError: (error) => {
                  Toast.show({
                    type: "error",
                    text1: "Lỗi",
                    text2: error.message,
                  })
                  refetch();
                },
              }
            );
          },
        },
      ]
    );
  };

  const handleClearCart = () => {
    if (listItems.length === 0) {
      alert("Giỏ hàng trống, không có sản phẩm để xóa.");
      return;
    }

    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xóa tất cả các sản phẩm trong giỏ hàng?",
      [
        { text: "Không", style: "cancel" },
        {
          text: "Có",
          onPress: () => {
            emptyCart(undefined, {
              onSuccess: () => {
                Toast.show({
                  type: "success",
                  text1: "Thành công",
                  text2: "Giỏ hàng trống!",
                });
                setSelectAll(false); // Reset trạng thái "Chọn tất cả"
                setSelectedItems([]); // Reset danh sách sản phẩm đã chọn
                refetch(); // Làm mới danh sách giỏ hàng
              },
              onError: (error) => {
                Toast.show({
                  type: "error",
                  text1: "Lỗi",
                  text2: error.message || "Không thể làm trống giỏ hàng!",
                });
                refetch(); // Làm mới danh sách để đảm bảo trạng thái chính xác
              },
            });
          },
        },
      ]
    );
  };

  const renderRightActions = (itemId) => (
    <Animated.View style={{ backgroundColor: "red", flex: 1 }}>
      <Pressable
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: 80,
          height: "100%",
          borderRadius: 8,
        }}
        onPress={() => handleRemoveItem(itemId)}
      >
        <AntDesign name="delete" size={24} color="white" />
        <Text style={{ color: "white", fontWeight: "bold" }}>Xóa</Text>
      </Pressable>
    </Animated.View>
  );

  const renderCartList = useMemo(() => {
    if (listItems.length > 0) {
      return (
        <View style={CartListStyle.orderList}>
          {listItems.map((item) => (
            <GestureHandlerRootView key={item._id}>
              <Swipeable
                renderRightActions={() => renderRightActions(item._id)}
                overshootRight={false}
              >
                <CartItem
                  item={item}
                  isChecked={selectedItems.includes(item._id)}
                  onToggleCheckbox={() => handleSelectItem(item._id)}
                  onDelete={() => {
                    handleDeleteItem(item._id);
                  }}
                />
              </Swipeable>
            </GestureHandlerRootView>
          ))}
        </View>
      );
    }
    return (
      <View style={CartListStyle.empty}>
        <AntDesign name="inbox" size={50} color="black" />
        <Text style={CartListStyle.emptyText}>Không có sản phẩm nào trong giỏ hàng!</Text>
      </View>
    );
  }, [listItems, selectedItems]);

  useFocusEffect(() => {
    if (!error) {
      refetch();
    }
  });

  useEffect(() => {
    if (currentUserData?.data?.addresses) {
      const updatedDefaultAddress = currentUserData?.data?.addresses.find((address) => address.default === true) || null;
      setSelectedAdress(updatedDefaultAddress);
    }
  }, [currentUserData]);

  const handleProceedOrder = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để đặt hàng!");
      return;
    }

    const selectedProducts = listItems.filter((item) => selectedItems.includes(item._id));
    navigation.navigate("OrderSummary", { cartData: { cart_products: selectedProducts } });
  };

  return (
    <>
      <View style={[WrapperContentStyle(insets.bottom, insets.top).content]}>
        <View style={{ backgroundColor: "#131921", padding: 10, flexDirection: "row", alignItems: "center" }}>
          <Pressable style={{ flexDirection: "row", alignItems: "center", backgroundColor: "white", borderRadius: 50, height: 40, flex: 1, paddingHorizontal: 10, }} onPress={() => { inputRef.current.focus(); }}>
            <AntDesign style={{ paddingRight: 5, }} name="search1" size={20} color="black" />
            <TextInput
              placeholder="Tìm kiếm sản phẩm trong giỏ hàng"
              value={searchValue}
              onChangeText={(text) => setSearchValue(text)}
              style={{
                fontSize: 16,
                flex: 1,
              }}
            />
          </Pressable>
        </View>
        {/* Add shipping address */}
        <>
          <Pressable onPress={() => setModalVisible(!modalVisible)} style={{ flexDirection: "row", alignItems: "center", gap: 5, padding: 10, backgroundColor: "#425768", }}>
            <Ionicons name="location-outline" size={24} color="white" />
            <Pressable onPress={() => setModalVisible(!modalVisible)} style={{ flex: 1 }}>
              {defaultAddress ? (
                <Text style={{ fontSize: 17, fontWeight: "500", color: "white" }} numberOfLines={1} ellipsizeMode="tail">
                  Giao hàng đến {defaultAddress.district?.full_name}, {defaultAddress.province?.name}
                </Text>
              ) : (
                <Text style={{ fontSize: 17, fontWeight: "500", color: "white" }}>Thêm địa chỉ giao hàng</Text>
              )}
            </Pressable>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="white" />
          </Pressable>
        </>

        {/* Checkbox Chọn Tất Cả */}
        <Pressable onPress={handleSelectAll} style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
          <Checkbox.Android
            status={selectAll ? "checked" : "unchecked"}
            color={colors.primary}
            uncheckedColor={colors.grey}
            size={20}
          />
          <Text style={{ fontSize: 16 }}>Chọn tất cả sản phẩm</Text>
        </Pressable>
        <ScrollView style={{ flex: 1 }}>{renderCartList}</ScrollView>

        <TouchableOpacity
          onPress={handleProceedOrder}
          style={{
            backgroundColor: selectedItems.length === 0 ? "#aaa" : '#232f3e',
            paddingVertical: 16,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
            marginTop: 10,
          }}
          disabled={selectedItems.length === 0}
        >
          <Text style={{ fontSize: 15, color: 'white', fontWeight: '700' }}>{`Tiến hành đặt hàng (${selectedItems.length}) sản phẩm`}</Text>
        </TouchableOpacity>
        {selectAll && selectedItems.length > 0 && (
          <TouchableOpacity
            onPress={handleClearCart}
            style={{
              backgroundColor: "red",
              paddingVertical: 16,
              borderRadius: 12,
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 10,
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 15, color: 'white', fontWeight: '700' }}>
              Xóa tất cả sản phẩm
            </Text>
          </TouchableOpacity>
        )}


        <AddressBottomModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          addresses={currentUserData?.data?.addresses || []}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAdress}
          refetchUserData={refetchUserData}
        />
      </View>
      {isLoading && <Loading />}
    </>
  );
};

export default CartScreen;

const WrapperContentStyle = (paddingBottom = 0, paddingTop = 0) =>
  StyleSheet.create({
    content: {
      paddingBottom: paddingBottom + 16,
      paddingTop,
      backgroundColor: "white",
      flex: 1,
    },
  });

const CartListStyle = StyleSheet.create({
  orderList: {
    gap: 8,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  empty: {
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 500,
  },
});
