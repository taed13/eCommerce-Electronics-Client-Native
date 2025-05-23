/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState, useRef, useContext } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet, Modal, Pressable } from "react-native";
import { useSelector } from "react-redux";
import Entypo from "@expo/vector-icons/Entypo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

import Loading from "../components/Loading";
import { CheckoutItem } from "../components/CheckoutItem";

import { useCreateOrder, usePurchase } from "../api/checkout";
import { useApplyDiscount, useCalculateShippingFee } from "../api/discount";

import { convertCartData, getSessionId } from "../utils/common";
import { PURCHASE_RESPONSE } from "../config/common";
import { colors } from "../constants/color";
import HeaderSearchInput from "../components/HeaderSearchInput";
import AddressBottomModal from "../components/AddressBottomModal";
import { UserType } from "../UserContext";
import { useGetUserAddresses } from "../api/user";

const FREE_SHIPPING_THRESHOLD = 9990000;

const OrderSummaryScreen = ({ route }) => {
  const { cartData } = route.params;
  console.log('cartData', cartData)

  const currentUser = useSelector((state) => state.user.currentUser);
  const { userId, setUserId } = useContext(UserType);
  const { data: addresses, refetch } = useGetUserAddresses(userId);

  const defaultAddress = addresses?.data?.addresses?.find(
    (address) => address.default === true
  );

  const calculatedAddress = useRef(null);
  const navigate = useNavigation();
  const insets = useSafeAreaInsets();

  const { apply, isLoading: isApplying } = useApplyDiscount();
  const { calculate } = useCalculateShippingFee();

  const { mutate: calculateFee, isLoading: isCalculatingShippingFee, error: shippingError } = useCalculateShippingFee();

  const [isOpenPayment, setIsOpenPayment] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountError, setDiscountError] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddress, setSelectedAdress] = useState("");


  const myAddress = currentUser ? currentUser.addresses.filter((item) => item.default === true) : undefined;

  // useEffect(() => {
  //   if (myAddress?.[0] && calculatedAddress.current !== myAddress[0]) {
  //     handleCalculateShippingFee();
  //     calculatedAddress.current = myAddress[0];
  //   }
  // }, [myAddress]);

  // useEffect(() => {
  //   if (myAddress?.[0] && !shippingFee) {
  //     handleCalculateShippingFee();
  //   }
  // }, [myAddress, shippingFee]);

  const {
    mutate: mutateCreateOrder,
    isPending: isPendingCreateOrder,
    data: createOrderData,
    error: errorCreateOrder,
  } = useCreateOrder();

  const {
    mutate: mutatePurchase,
    isPending: isPendingPurchase,
    data: dataPurchase,
    error: erorrPurchase,
  } = usePurchase();

  const total = cartData?.cart_products
    ? cartData?.cart_products?.reduce((sum, item) => {
      return sum + Number(item?.price) * Number(item?.quantity);
    }, 0)
    : 0;

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError("Vui lòng nhập mã giảm giá!");
      return;
    }
    setDiscountError(null);

    const cartTotal = cartData?.cart_products?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

    const categoryIds = [
      ...new Set(
        cartData?.cart_products?.flatMap(
          (item) => item.productId?.product_category?.map((category) => category._id) || []
        )
      ),
    ];

    const brandIds = [
      ...new Set(
        cartData?.cart_products?.flatMap((item) => item.productId?.product_brand?.map((brand) => brand._id) || [])
      ),
    ];

    const payload = {
      discountCode: discountCode.trim(),
      cartTotal,
      categoryIds,
      brandIds,
    };

    const result = await apply(payload);

    if (result?.data?.discountAmount) {
      setAppliedDiscount(result?.data);
      setDiscountError(null);
    } else {
      setAppliedDiscount(null);
      setDiscountError(result?.error || "Mã giảm giá không hợp lệ!");
    }
  };

  // const handleCalculateShippingFee = useCallback(async () => {
  //   if (!myAddress?.[0]) {
  //     alert("Vui lòng chọn địa chỉ giao hàng.");
  //     return;
  //   }

  //   const payload = {
  //     provinceName: myAddress[0].province.name,
  //     districtName: myAddress[0].district.full_name,
  //     wardName: myAddress[0].ward.full_name,
  //   };

  //   try {
  //     const result = await calculate(payload);

  //     if (result?.data?.total) {
  //       setShippingFee(result.data.total);
  //     } else {
  //       setShippingFee(0);
  //     }
  //   } catch (err) {
  //     console.error("Error calculating shipping fee:", err);
  //     alert("Lỗi khi tính phí vận chuyển. Vui lòng thử lại!");
  //   }
  // }, [myAddress]);

  useEffect(() => {
    if (total >= FREE_SHIPPING_THRESHOLD) {
      setShippingFee(0);
    } else if (defaultAddress && calculatedAddress.current !== defaultAddress) {
      handleCalculateShippingFee();
      calculatedAddress.current = defaultAddress;
    }
  }, [total, defaultAddress]);

  const handleCalculateShippingFee = useCallback(() => {
    if (!defaultAddress) {
      alert("Vui lòng chọn địa chỉ giao hàng.");
      return;
    }

    const payload = {
      provinceName: defaultAddress.province.name,
      districtName: defaultAddress.district.full_name,
      wardName: defaultAddress.ward.full_name,
    };

    calculateFee(payload, {
      onSuccess: (data) => {
        setShippingFee(data.data.total || 0);
      },
      onError: (err) => {
        console.error("Error calculating shipping fee:", err);
        alert("Lỗi khi tính phí vận chuyển. Vui lòng thử lại!");
        setShippingFee(0);
      },
    });
  }, [defaultAddress]);

  const totalAfterDiscount = appliedDiscount ? appliedDiscount.total : total;

  const hanldeCheckout = async () => {
    const prepareOrderData = {
      discountCode: appliedDiscount?.discountCode,
      cartTotal: total,
      order_shipping: defaultAddress || [],
      order_items: convertCartData(cartData?.cart_products),
      paymentInfo: {
        paymentMethod: "Credit Card",
        paymentStatus: "Pending",
      },
      checkoutInfo: {
        totalPrice: total + shippingFee,
        totalPriceAfterDiscount: totalAfterDiscount + shippingFee,
        feeShip: shippingFee,
        discountApplied: appliedDiscount?.discountAmount || 0,
      },
      estimatedDeliveryDate: new Date(),
      // order_status: "Ordered",
      trackingNumber: `TRK${Math.floor(Math.random() * 1000000)}`,
    };

    mutateCreateOrder(prepareOrderData, {
      onSuccess: (data) => {
        console.log("Order created successfully:", data);
        Toast.show({
          type: "success",
          text1: "Đặt hàng thành công",
          text2: "Bạn sẽ được chuyển đến trang thanh toán.",
        });
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: "Lỗi đặt hàng",
          text2: error?.response?.data?.message || "Có lỗi xảy ra khi đặt hàng.",
        });
      },
    });
  };

  const hanldeClose = () => {
    setIsOpenPayment(false);
  };

  useEffect(() => {
    if (erorrPurchase) {
      setIsOpenPayment(false);
      return;
    }
    if (dataPurchase) {
      setIsOpenPayment(true);
      return;
    }
  }, [erorrPurchase, dataPurchase]);

  useEffect(() => {
    if (errorCreateOrder) {
      return;
    }
    if (createOrderData) {
      mutatePurchase({
        orderId: createOrderData._id,
        type: "mobile",
      });
      return;
    }
  }, [createOrderData, errorCreateOrder]);

  return (
    <>
      <View style={{ flex: 1, backgroundColor: "white", marginTop: 47 }}>
        <ScrollView style={OrderSummaryScreenStyle.content} stickyHeaderIndices={[0]}>
          <View>
            <HeaderSearchInput />
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
          <View style={[OrderSummaryScreenStyle.container]}>
            <View>
              {cartData?.cart_products &&
                cartData?.cart_products.map((item, index) => {
                  return <CheckoutItem item={item} key={item._id || index} />;
                })}
            </View>

            <View style={[OrderSummaryScreenStyle.discountWrapper, OrderSummaryScreenStyle.wrapper]}>
              <TextInput
                style={OrderSummaryScreenStyle.discountInput}
                placeholder="Nhập mã giảm giá (nếu có)"
                value={discountCode}
                onChangeText={(text) => setDiscountCode(text)}
              />
              <TouchableOpacity onPress={handleApplyDiscount} style={OrderSummaryScreenStyle.applyBtn}>
                <Text style={OrderSummaryScreenStyle.applyText}>{isApplying ? "Đang áp dụng..." : "Áp dụng"}</Text>
              </TouchableOpacity>
            </View>

            {discountError && <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>{discountError}</Text>}

            <View style={[OrderSummaryScreenStyle.wrapper]}>
              <Text style={OrderSummaryScreenStyle.titleSummary}>Tổng quan đơn hàng</Text>

              <View style={OrderSummaryScreenStyle.summaryItem}>
                <Text style={OrderSummaryScreenStyle.label}>Tổng tiền ban đầu: </Text>
                <Text>₫{total.toLocaleString()}</Text>
              </View>

              <View style={OrderSummaryScreenStyle.summaryItem}>
                <Text style={OrderSummaryScreenStyle.label}>Giảm giá: </Text>
                <Text style={{ color: appliedDiscount ? "green" : "black" }}>
                  {appliedDiscount ? `-₫${appliedDiscount.discountAmount.toLocaleString()}` : "₫0"}
                </Text>
              </View>

              <View style={OrderSummaryScreenStyle.summaryItem}>
                <Text style={OrderSummaryScreenStyle.label}>Phí vận chuyển: </Text>
                {isCalculatingShippingFee ? (
                  <Text>Đang tính...</Text>
                ) : (
                  <Text>₫{shippingFee.toLocaleString()}</Text>
                )}
              </View>

              <View style={OrderSummaryScreenStyle.summaryItem}>
                <Text style={[OrderSummaryScreenStyle.label]}>Tổng cộng: </Text>
                <Text style={{ fontWeight: "bold" }}>
                  ₫{(appliedDiscount ? appliedDiscount.total + shippingFee : total + shippingFee).toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={[SafeAreaViewStyle(insets).btnCheckout]}>
          <TouchableOpacity
            onPress={hanldeCheckout}
            disabled={!cartData?.cart_products?.length}
            style={{
              backgroundColor: cartData?.cart_products?.length ? colors.btn : "#ccc",
              paddingVertical: 16,
              borderRadius: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Thanh toán</Text>
          </TouchableOpacity>
        </View>
      </View>
      {(isPendingCreateOrder || isPendingPurchase) && <Loading />}
      <Modal visible={isOpenPayment}>
        <View style={SafeAreaViewStyle(insets).webView}>
          <View style={WebviewStyle.wrapper}>
            <TouchableOpacity onPress={hanldeClose}>
              <Ionicons name="arrow-back" size={28} color="black" />
            </TouchableOpacity>
            <Text style={WebviewStyle.text}>Payment</Text>
            <TouchableOpacity onPress={hanldeClose}>
              <MaterialIcons name="cancel" size={28} color="black" />
            </TouchableOpacity>
          </View>
          {dataPurchase?.url ? (
            <WebView
              style={{ flex: 1 }}
              source={{
                uri: dataPurchase?.url,
              }}
              onNavigationStateChange={(navigation) => {
                if (navigation.url === PURCHASE_RESPONSE.success) {
                  // setIsOpenPayment(false)
                  const sessionID = getSessionId(dataPurchase?.url);
                  navigate.navigate("OrderSuccess", { sessionID });
                  Toast.show({
                    type: "success",
                    text1: "Thanh toán thành công.",
                  });
                  setIsOpenPayment(false);
                  return;
                }
                if (navigation.url === PURCHASE_RESPONSE.cancel) {
                  setIsOpenPayment(false);
                  Toast.show({
                    type: "error",
                    text1: "Thanh toán thất bại.",
                  });
                  return;
                }
              }}
            />
          ) : (
            <View style={WebviewStyle.notFound}>
              <Text>Payment Not Found</Text>
              <MaterialIcons name="hourglass-empty" size={48} color="black" />
            </View>
          )}
        </View>
      </Modal>

      <AddressBottomModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        addresses={addresses?.data?.addresses}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAdress}
        refetchUserData={refetch}
      />
    </>
  );
};

export default OrderSummaryScreen;

const OrderSummaryScreenStyle = StyleSheet.create({
  container: {
    gap: 8,
  },
  userInfor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  discountWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  discountInput: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 18,
    borderColor: colors.darkGray,
  },
  applyBtn: {
    paddingHorizontal: 24,
    backgroundColor: colors.btn,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 100,
    borderRadius: 32,
  },
  applyText: {
    fontSize: 14,
    color: "white",
    fontWeight: 600,
  },
  wrapper: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  titleSummary: {
    fontSize: 18,
    fontWeight: 600,
    paddingVertical: 8,
    alignSelf: "center",
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontWeight: 300,
  },
  content: {
    flex: 1,
  },
  btnCheckout: {
    backgroundColor: colors.btn,
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  btnCheckoutText: {
    color: "white",
    fontWeight: 600,
    fontSize: 16,
  },
});

const SafeAreaViewStyle = (insets) =>
  StyleSheet.create({
    btnCheckout: {
      paddingBottom: insets.bottom + 16,
      paddingHorizontal: 16,
      backgroundColor: "white",
      paddingTop: 8,
    },
    webView: {
      paddingBottom: insets.bottom + 16,
      paddingTop: insets.top + 8,
      flex: 1,
      paddingHorizontal: 16,
    },
  });

const WebviewStyle = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: 500,
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
});
