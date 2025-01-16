import { View, ScrollView, StyleSheet, Text, Pressable, Image, SafeAreaView, Platform, Alert } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HeaderSearchInput from "../components/HeaderSearchInput";
import Loading from "../components/Loading";
import { useGetOrderById, useCancelOrder, useReorderOrder } from "../api/order";
import Separator from "../components/Separator";
import Toast from "react-native-toast-message";

const OrderScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { orderId } = route.params;

  const { data: orderData, isLoading, error } = useGetOrderById(orderId);
  const { mutate: cancelOrder, isLoading: isCancelling } = useCancelOrder();
  const { mutate: reorder, isLoading: isReordering } = useReorderOrder();

  if (isLoading) return <Loading />;
  if (error) return <Text style={styles.noOrdersText}>Failed to fetch order details!</Text>;

  const order = orderData?.data;

  const isCancellable =
    order?.order_status?.toLowerCase() !== "cancelled" &&
    order?.order_status?.toLowerCase() !== "delivered";

  const isReorderable = ["shipped", "delivered", "cancelled"].includes(
    order?.order_status?.toLowerCase()
  );

  const handleCancelOrder = () => {
    Alert.alert(
      "Xác nhận huỷ đơn hàng",
      "Bạn có chắc chắn muốn huỷ đơn hàng này?",
      [
        { text: "Không", style: "cancel" },
        {
          text: "Có",
          onPress: () => {
            cancelOrder(orderId, {
              onSuccess: () => {
                Alert.alert("Thành công", "Đơn hàng đã được huỷ thành công!");
                navigation.goBack();
              },
              onError: (err) => {
                Alert.alert("Lỗi", err.message || "Không thể huỷ đơn hàng.");
              },
            });
          },
        },
      ]
    );
  };

  const handleReorder = () => {
    Alert.alert("Xác nhận mua lại", "Bạn có chắc chắn muốn đặt lại đơn hàng này?", [
      { text: "Không", style: "cancel" },
      {
        text: "Có",
        onPress: () => {
          reorder(orderId, {
            onSuccess: () => {
              Toast.show({
                type: "success",
                text1: "Thành công",
                text2: "Sản phẩm được thêm lại vào giỏ hàng!",
              })
              navigation.navigate("Cart");
            },
            onError: (err) => {
              Alert.alert("Lỗi", err.message || "Không thể thêm lại sản phẩm.");
            },
          });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", marginTop: Platform.OS === "android" ? 40 : 0 }}>
      <ScrollView style={[WrapperContentStyle(insets.bottom).content]} stickyHeaderIndices={[0]}>
        <View>
          <HeaderSearchInput />
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Chi tiết đơn hàng</Text>
        </View>
        <View style={styles.containerDefault}>
          <View style={styles.orderInfoRow}>
            {/* Column for labels */}
            <View style={styles.labelsColumn}>
              <Text style={styles.label}>Ngày đặt hàng</Text>
              <Text style={styles.label}>Mã đơn hàng</Text>
              <Text style={styles.label}>Tổng đơn hàng</Text>
            </View>
            {/* Column for values */}
            <View style={styles.valuesColumn}>
              <Text style={styles.valueCreatedAt}>{new Date(order.createdAt).toLocaleDateString() || "19-Sep-2020"}</Text>
              <Text style={styles.value}>{order.order_code || "403-4464234-9909962"}</Text>
              <Text style={styles.valueTotalPayment}>đ{order.checkoutInfo.totalPriceAfterDiscount?.toLocaleString() || "Không có"}</Text>
            </View>
          </View>

          {/* Cancel button */}
          {/* Hiển thị nút "Huỷ đơn hàng" nếu trạng thái cho phép */}
          {isCancellable && (
            <View style={styles.cancelContainer}>
              <Pressable
                style={styles.cancelButton}
                onPress={handleCancelOrder}
                disabled={isCancelling}
              >
                <Text style={styles.cancelText}>
                  {isCancelling ? "Đang huỷ..." : "Huỷ đơn hàng"}
                </Text>
              </Pressable>
            </View>
          )}

          {/* Reorder button */}
          {isReorderable && (
            <View style={styles.reorderContainer}>
              <Pressable
                style={styles.reorderButton}
                onPress={handleReorder}
                disabled={isReordering}
              >
                <Text style={styles.reorderText}>
                  {isReordering ? "Đang thêm lại..." : "Mua lại đơn hàng"}
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        <View>
          <Text style={styles.shipmentTitle}>Chi tiết lô hàng</Text>
        </View>
        <View style={styles.containerDefault}>
          <View style={styles.shipmentDetails}>
            <View style={{ display: "flex", gap: 1, flexDirection: "row", alignItems: "baseline" }}>
              <Text style={{ fontSize: 15 }}>Trạng thái lô hàng: </Text>
              <Text style={styles.statusText}>{order.order_status || "Chưa được gửi đi"}</Text>
            </View>
            <Text style={styles.deliveryEstimate}>Ngày nhận hàng dự kiến: <Text style={styles.deliveryDate}>{new Date(order.estimatedDeliveryDate).toLocaleDateString()}</Text></Text>
          </View>

          <View>
            {order.order_items.map((item, index) => (
              <View style={styles.productRow} key={index}>
                <Image
                  source={{ uri: item?.productId?.product_images[0]?.url || "" }}
                  style={styles.productImage}
                />
                <View style={styles.productDetails}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {item?.productId?.product_name || "Product Name"}
                  </Text>
                  <Text style={styles.productPrice}>đ{item?.price?.toLocaleString() || 0}</Text>
                  <Text style={styles.productQty}>Số lượng: {item?.quantity || 1}</Text>
                  {item?.product_colors?.length > 0 && (
                    <View style={styles.colorContainer}>
                      <Text style={styles.colorLabel}>Màu:</Text>
                      {item.product_colors.map((color, idx) => (
                        <View
                          key={idx}
                          style={[
                            styles.colorBox,
                            { backgroundColor: color?.code || "#ccc" },
                          ]}
                        />
                      ))}
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View><Text style={styles.paymentInfoMation}>Thông tin thanh toán</Text></View>
        <View style={styles.containerDefault}>
          {/* Payment Method */}
          <View style={styles.paymentRow1}>
            <Text style={styles.labelPayment}>Phương thức thanh toán</Text>
            <Text style={styles.valuePayment}>{order.paymentInfo?.paymentMethod.toUpperCase() || "N/A"}</Text>
          </View>

          <Separator />

          {/* Billing Address */}
          <View style={styles.paymentRow2}>
            <Text style={styles.labelPayment}>Địa chỉ thanh toán</Text>
            <View style={styles.billingAddress}>
              <Text style={styles.addressText}>
                {order.order_shipping?.street || "Số nhà, đường"}
              </Text>
              <Text style={styles.addressText}>
                {order.order_shipping?.ward?.full_name || "Phường/Xã"}
              </Text>
              <Text style={styles.addressText}>
                {order.order_shipping?.district?.full_name || "Quận/Huyện"}
              </Text>
              <Text style={styles.addressText}>
                {order.order_shipping?.province?.name || "Tỉnh/Thành phố"}
              </Text>
              <Text style={styles.addressText}>Số điện thoại: {order.order_shipping?.mobileNo || "Số điện thoại"}</Text>
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.paymentInfoMation}>Tóm tắt đơn hàng</Text>
        </View>
        <View style={styles.containerDefault}>
          {/* Giá gốc trước khi áp dụng giảm giá */}
          <View style={styles.summaryRow}>
            <Text style={styles.labelSummaryOrder}>Giá sản phẩm:</Text>
            <Text style={styles.valueSummaryOrder}>
              đ{order.checkoutInfo?.totalPrice?.toLocaleString("vi-VN") || "0"}
            </Text>
          </View>

          {/* Phí vận chuyển */}
          <View style={styles.summaryRow}>
            <Text style={styles.labelSummaryOrder}>Phí vận chuyển:</Text>
            <Text style={styles.valueSummaryOrder}>
              {order.checkoutInfo?.feeShip > 0
                ? `đ${order.checkoutInfo?.feeShip?.toLocaleString("vi-VN")}`
                : "Miễn phí"}
            </Text>
          </View>

          {/* Mã giảm giá (nếu có) */}
          {/* {order.checkoutInfo?.discountApplied && (
    <View style={styles.summaryRow}>
      <Text style={styles.labelSummaryOrder}>Mã giảm giá áp dụng:</Text>
      <Text style={styles.valueSummaryOrder}>
        {order.checkoutInfo.discountApplied}
      </Text>
    </View>
  )} */}

          {/* Giá sau khi giảm */}
          <View style={styles.summaryRow}>
            <Text style={styles.labelSummaryOrder}>Sau Giảm giá:</Text>
            <Text style={styles.valueSummaryOrderDiscount}>
              đ{order.checkoutInfo?.totalPriceAfterDiscount?.toLocaleString("vi-VN") || "0"}
            </Text>
          </View>

          {/* Tổng tiền */}
          <View style={styles.finalRow}>
            <Text style={styles.finalLabel}>Tổng đơn hàng:</Text>
            <Text style={styles.finalTotal}>
              đ{(order.checkoutInfo?.totalPriceAfterDiscount + (order.checkoutInfo?.feeShip || 0)).toLocaleString("vi-VN")}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderScreen;

const WrapperContentStyle = (paddingBottom = 0, paddingTop = 0) =>
  StyleSheet.create({
    content: {
      paddingBottom: paddingBottom + 16,
      paddingTop,
      backgroundColor: "white",
      flex: 1,
    },
  });

const styles = StyleSheet.create({
  sectionHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },
  sectionTitle: {
    fontSize: 23,
    fontWeight: "bold",
  },
  containerDefault: {
    padding: 16,
    marginVertical: 2,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: "#f7f7f7",
  },
  orderInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  labelsColumn: {
    flex: 1,
    justifyContent: "space-between",
  },
  valuesColumn: {
    flex: 2,
    alignItems: "flex-start",
  },
  label: {
    fontSize: 14,
    color: "gray",
    marginBottom: 8,
  },
  valueCreatedAt: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
  },
  valueTotalPayment: {
    fontSize: 22,
    marginBottom: 8,
  },
  cancelContainer: {
    marginTop: 12,
    alignItems: "flex-end",
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },
  cancelText: {
    color: "#d9534f",
    fontWeight: "600",
  },
  shipmentTitle: {
    fontWeight: "bold",
    fontSize: 20,
    paddingHorizontal: 12,
    marginTop: 12,
    marginBottom: 5,
  },
  statusText: {
    color: "orange",
    fontWeight: "600",
    marginTop: 4,
    fontSize: 23,
  },
  deliveryEstimate: {
    marginTop: 8,
    fontSize: 14,
  },
  deliveryDate: {
    fontSize: 14,
    color: "green",
    fontWeight: "bold",
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginRight: 16,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
    color: "green",
  },
  productQty: {
    fontSize: 14,
    marginTop: 4,
    color: "gray",
  },
  trackButton: {
    padding: 12,
    backgroundColor: "#008E97",
    borderRadius: 4,
    alignItems: "center",
  },
  trackButtonText: {
    color: "white",
    fontWeight: "600",
  },
  noOrdersText: {
    textAlign: "center",
    marginTop: 32,
    fontSize: 18,
    color: "gray",
  },
  colorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  colorLabel: {
    fontSize: 14,
    marginRight: 6,
  },
  colorBox: {
    width: 19,
    height: 19,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  paymentInfoMation: {
    fontWeight: "bold",
    fontSize: 20,
    paddingHorizontal: 12,
    marginTop: 12,
    marginBottom: 5,
  },
  paymentInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  labelPayment: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  valuePayment: {
    fontSize: 16,
  },
  paymentRow1: {
    marginBottom: 16,
  },
  paymentRow2: {
    marginBottom: 16,
    marginTop: 12,
  },
  billingAddress: {
    marginTop: 8,
  },
  addressText: {
    fontSize: 16,
    marginBottom: 4,
    color: "black",
  },
  orderSummaryContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f7f7f7",
    marginTop: 16,
  },
  orderSummaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  labelSummaryOrder: {
    fontSize: 16,
    color: "gray",
  },
  valueSummaryOrder: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  }, valueSummaryOrderDiscount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  finalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 8,
    marginBottom: 30,
  },
  finalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  finalTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#d9534f",
  },
  reorderContainer: {
    marginTop: 16,
    alignItems: "flex-end",
  },
  reorderButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#008E97",
    borderRadius: 4,
  },
  reorderText: {
    color: "white",
    fontWeight: "600",
  },
});
