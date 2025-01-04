/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet, Modal } from "react-native";
import { convertCartData } from "../utils/common";
import { useSelector } from "react-redux";
import { useCreateOrder, usePurchase } from "../api/checkout";
import Loading from "../components/Loading";
import { CheckoutItem } from "../components/CheckoutItem";
import { colors } from "../constants/color";
import Entypo from "@expo/vector-icons/Entypo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const OrderSummaryScreen = ({ route }) => {
  const { cartData } = route.params;
  const insets = useSafeAreaInsets();
  const [isOpenPayment, setIsOpenPayment] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);

  const myAddress = currentUser ? currentUser.addresses.filter((item) => item.default === true) : undefined;

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

  const hanldeCheckout = async () => {
    const prepareOrderData = {
      discountCode: undefined,
      cartTotal: total,
      order_shipping: myAddress ? myAddress[0] : [],
      order_items: convertCartData(cartData?.cart_products),
      paymentInfo: {
        paymentMethod: "Credit Card",
        paymentStatus: "Pending",
      },
      checkoutInfo: {
        totalPrice: total,
        totalPriceAfterDiscount: total,
        feeShip: 0,
        discountApplied: undefined,
      },
      estimatedDeliveryDate: new Date(),
      order_status: "Ordered",
      trackingNumber: `TRK${Math.floor(Math.random() * 1000000)}`,
    };

    await mutateCreateOrder(prepareOrderData);
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
      console.log("okoko", dataPurchase?.url);
      return;
    }
  }, [erorrPurchase, dataPurchase]);

  useEffect(() => {
    if (errorCreateOrder) {
      return;
    }
    if (createOrderData) {
      mutatePurchase({
        items: { data: cartData },
        shippingInfo: myAddress[0],
        orderId: createOrderData._id,
        type: "mobile",
      });
      return;
    }
  }, [createOrderData, errorCreateOrder]);

  return (
    <>
      <View style={{ flex: 1 }}>
        <ScrollView style={OrderSummaryScreenStyle.content}>
          <View style={[OrderSummaryScreenStyle.container]}>
            <View style={[OrderSummaryScreenStyle.wrapper]}>
              <View style={OrderSummaryScreenStyle.userInfor}>
                <Entypo name="location" size={16} color="black" />
                {myAddress && <Text>{`${myAddress[0].firstname} (${myAddress[0].mobileNo})`}</Text>}
              </View>

              {myAddress && (
                <Text>{`${myAddress[0].street}, ${myAddress[0].ward.full_name}, ${myAddress[0].district.full_name}, ${myAddress[0].province.name}`}</Text>
              )}
            </View>
            <View>
              {cartData?.cart_products &&
                cartData?.cart_products?.map((item, index) => {
                  return <CheckoutItem item={item} key={index} />;
                })}
            </View>
            <View style={[OrderSummaryScreenStyle.discountWrapper, OrderSummaryScreenStyle.wrapper]}>
              <TextInput style={OrderSummaryScreenStyle.discountInput} placeholder="Enter your discount code" />
              <TouchableOpacity style={OrderSummaryScreenStyle.applyBtn}>
                <Text style={OrderSummaryScreenStyle.applyText}>Apply</Text>
              </TouchableOpacity>
            </View>
            <View style={[OrderSummaryScreenStyle.wrapper]}>
              <Text style={OrderSummaryScreenStyle.titleSummary}>Order Summary</Text>
              <View style={OrderSummaryScreenStyle.summaryItem}>
                <Text style={OrderSummaryScreenStyle.label}>Subtotal: </Text>
                <Text>{total}</Text>
              </View>
              <View style={OrderSummaryScreenStyle.summaryItem}>
                <Text style={OrderSummaryScreenStyle.label}>Shipping: </Text>
                <Text>{total}</Text>
              </View>
              <View style={OrderSummaryScreenStyle.summaryItem}>
                <Text style={[OrderSummaryScreenStyle.label]}>Total: </Text>
                <Text>{total}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={[SafeAreaViewStyle(insets).btnCheckout]}>
          <TouchableOpacity onPress={hanldeCheckout} style={[OrderSummaryScreenStyle.btnCheckout]}>
            <Text style={OrderSummaryScreenStyle.btnCheckoutText}>Checkout</Text>
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
            />
          ) : (
            <View style={WebviewStyle.notFound}>
              <Text>Payment Not Found</Text>
              <MaterialIcons name="hourglass-empty" size={48} color="black" />
            </View>
          )}
        </View>
      </Modal>
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
    fontSize: 16,
    fontWeight: 600,
    paddingVertical: 8,
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
    backgroundColor: colors.red,
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
