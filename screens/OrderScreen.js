import { View, ScrollView, StyleSheet } from "react-native";
import React from "react";
// import LottieView from "lottie-react-native";
// import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "../components/Header";
import { useGetMyOrder } from "../api/order";
import { OrderItem } from "../components/OrderItem";
import Loading from "../components/Loading";

const OrderScreen = () => {
  // const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const { data, isLoading, error } = useGetMyOrder();
  console.log({ data, isLoading, error });

  return (
    <>
      <View style={[WrapperContentStyle(insets.bottom, insets.top).content]}>
        <Header />
        <ScrollView>
          <View style={[MainContentStyle.orderList]}>
            {data &&
              data.map((item, index) => {
                return <OrderItem key={index} item={item} />;
              })}
          </View>
        </ScrollView>
        {/* <LottieView
                source={require("../assets/thumbs.json")}
                // ref={animation}
                style={{
                    height: 260,
                    width: 300,
                    alignSelf: "center",
                    marginTop: 40,
                    justifyContent: "center",
                }}
                autoPlay
                loop={false}
                speed={0.7}
            /> */}

        {/* <LottieView
                source={require("../assets/sparkle.json")}
                style={{
                    height: 300,
                    position: "absolute",
                    top: 100,
                    width: 300,
                    alignSelf: "center",
                }}
                autoPlay
                loop={false}
                speed={0.7}
            /> */}
      </View>
      {isLoading && <Loading />}
    </>
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
      paddingHorizontal: 8,
    },
  });

const MainContentStyle = StyleSheet.create({
  orderList: {
    gap: 8,
  },
});
