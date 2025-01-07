/* eslint-disable react/prop-types */
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { usePurchaseSuccess } from "../api/checkout";
import { colors } from "../constants/color";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Loading from "../components/Loading";
import { useGetUserAddresses } from "../api/user";
import { useUserAsyncStore } from "../hook/useUserAsyncStore";

const formatCurrency = (amount) => {
  return `${amount.toLocaleString('vi-VN')} VND`;
};

const OrderSuccessScreen = ({ route }) => {
  const { sessionID } = route.params;
  const insets = useSafeAreaInsets();
  const navigate = useNavigation();

  const { userAsyncStore, loading } = useUserAsyncStore();
  const { mutate, isPending, data } = usePurchaseSuccess();

  const { data: addresses, isLoading, isError, refetch } = useGetUserAddresses(userAsyncStore?._id);
  const defaultAddress = addresses?.data?.addresses?.find(
    (address) => address.default === true
  );

  const handlePress = () => {
    navigate.navigate("Home");
  };

  useEffect(() => {
    if (sessionID) {
      mutate(sessionID);
    }
  }, [sessionID]);

  return (
    <>
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}>
          <View style={OrderSuccessScreenStyle.container}>
            <View>
              <Text style={OrderSuccessScreenStyle.title}>Cảm ơn bạn đã mua hàng !</Text>
              <Text>
                Bạn cũng nhận được email chi tiết về đơn hàng này và chúng tôi sẽ thông báo cho bạn khi đơn hàng đã được
                giao.
              </Text>
              {/* <Text>OrderSummary {sessionID ?? "----"} </Text> */}
            </View>
            <View style={OrderSuccessScreenStyle.divider} />
            <View style={{ gap: 4 }}>
              <Text style={OrderSuccessScreenStyle.title}>Địa chỉ nhận hàng</Text>
              <Text>{userAsyncStore?.name ?? "Name"}</Text>
              <Text>{userAsyncStore?.email ?? "Email@gmail.com"}</Text>
              <Text>{defaultAddress?.mobileNo ?? "00000000000"}</Text>
              {defaultAddress && (
                <Text>{`${defaultAddress?.street}, ${defaultAddress?.ward.full_name}, ${defaultAddress?.district.full_name}, ${defaultAddress?.province.name}`}</Text>
              )}
            </View>
            <View style={OrderSuccessScreenStyle.divider} />
            <View style={{ gap: 4 }}>
              <Text style={OrderSuccessScreenStyle.title}>Thông tin thanh toán</Text>
              <Text>Phương thức thanh toán CARD</Text>
              <Text>Trạng thái thanh toán CARD</Text>
              <Text>{`Tổng thanh toán: ${formatCurrency(data?.session?.amount_subtotal ?? 0)}`}</Text>
            </View>
          </View>

          <View style={{ marginTop: 16 }}>
            <View style={OrderSuccessScreenStyle.container}>
              <View style={OrderSuccessScreenStyle.headerRow}>
                <TouchableOpacity onPress={() => navigate.navigate("Order", { orderId: data?.order?.id })}>
                  <Text style={OrderSuccessScreenStyle.titleDetailLink}>Chi tiết đơn hàng</Text>
                </TouchableOpacity>
              </View>
              <View style={OrderSuccessScreenStyle.information}>
                <View style={[OrderSuccessScreenStyle.productionCodeWrapper, { marginBottom: 4 }]}>
                  <Text style={OrderSuccessScreenStyle.label}>Mã đơn hàng:</Text>
                  <Text style={[OrderSuccessScreenStyle.value, { flex: 1 }]}>{data?.order?.order_code ?? "code"}</Text>
                </View>
                <View style={OrderSuccessScreenStyle.productionCodeWrapper}>
                  <Text style={OrderSuccessScreenStyle.label}>Ngày đặt hàng:</Text>
                  <Text style={OrderSuccessScreenStyle.value}>{new Date(
                    data?.session.created * 1000
                  ).toLocaleDateString()}</Text>
                </View>
              </View>
              <View>
                <View>
                  {data?.products &&
                    data.products.map((item, index) => {
                      return (
                        <View style={OrderSuccessScreenStyle.productionCodeWrapper} key={index}>
                          <Image source={{ uri: item.image }} style={OrderSuccessScreenStyle.image} />
                          <View style={{ flex: 1 }}>
                            <View style={{ flex: 1, flexDirection: "row" }}>
                              <Text style={[OrderSuccessScreenStyle.name, { flex: 1 }]}>{item?.name ?? "Name"}</Text>
                            </View>
                            <View style={OrderSuccessScreenStyle.productionCodeWrapper}>
                              <Text style={OrderSuccessScreenStyle.label}>Số lượng:</Text>
                              <Text style={OrderSuccessScreenStyle.value}>{item?.quantity ?? 0}</Text>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                </View>
                <View style={OrderSuccessScreenStyle.stepWrapper}>
                  <View style={OrderSuccessScreenStyle.stepContent}>
                    <View style={[OrderSuccessScreenStyle.stepItem]}>
                      <Text style={[OrderSuccessScreenStyle.stepText]}>1</Text>
                    </View>
                    <Text style={OrderSuccessScreenStyle.stepLabel} numberOfLines={1} ellipsizeMode="tail">
                      Đã đặt
                    </Text>
                  </View>
                  <View style={OrderSuccessScreenStyle.stepDividerWrapper}>
                    <View style={OrderSuccessScreenStyle.stepDivider} />
                  </View>
                  <View style={OrderSuccessScreenStyle.stepContent}>
                    <View style={[OrderSuccessScreenStyle.stepItem]}>
                      <Text style={[OrderSuccessScreenStyle.stepText]}>2</Text>
                    </View>
                    <Text style={OrderSuccessScreenStyle.stepLabel} numberOfLines={1} ellipsizeMode="tail">
                      Đã vận chuyển
                    </Text>
                  </View>
                  <View style={OrderSuccessScreenStyle.stepDividerWrapper}>
                    <View style={OrderSuccessScreenStyle.stepDivider} />
                  </View>
                  <View style={OrderSuccessScreenStyle.stepContent}>
                    <View style={[OrderSuccessScreenStyle.stepItem, OrderSuccessScreenStyle.stepDisabled]}>
                      <Text style={[OrderSuccessScreenStyle.stepText]}>3</Text>
                    </View>
                    <Text style={OrderSuccessScreenStyle.stepLabel} numberOfLines={1} ellipsizeMode="tail">
                      Đã giao hàng
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={ButtonStyle(insets).wrapper}>
          <TouchableOpacity style={OrderSuccessScreenStyle.btn} onPress={handlePress}>
            <Text style={OrderSuccessScreenStyle.btnText}>Trang chủ</Text>
          </TouchableOpacity>
        </View>
      </View>
      {isPending && <Loading />}
    </>
  );
};

export default OrderSuccessScreen;

const OrderSuccessScreenStyle = StyleSheet.create({
  information: {
  },
  image: {
    width: 100,
    height: 100,
  },
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    borderColor: colors.darkGray,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 500,
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
    marginBottom: 8,
  },
  headerRow: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  titleDetailLink: {
    fontSize: 16,
    fontWeight: 500,
    color: "#0B58CA",
    textDecorationLine: "underline",
  },
  productionCodeWrapper: {
    flexDirection: "row",
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 300,
  },
  value: {
    fontSize: 14,
    fontWeight: 500,
  },
  stepWrapper: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  stepDividerWrapper: {
    height: 38,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  stepLabel: {
    fontSize: 13,
    textAlign: "center",
    flexWrap: "nowrap",
    overflow: "hidden",
  },
  stepDivider: {
    height: 1,
    flex: 1,
    backgroundColor: colors.red,
  },
  stepContent: {
    alignItems: "center",
    flex: 2,
  },
  stepItem: {
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: colors.red,
    justifyContent: "center",
    alignItems: "center",
  },
  stepText: {
    fontSize: 18,
    color: "white",
    fontWeight: 500,
  },
  stepDisabled: {
    backgroundColor: colors.darkGray,
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: colors.darkGray,
  },
  btn: {
    backgroundColor: colors.red,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: 500,
  },
});

const ButtonStyle = (insets) =>
  StyleSheet.create({
    wrapper: {
      paddingBottom: insets.bottom + 16,
      paddingTop: 16,
      paddingHorizontal: 16,
    },
  });
