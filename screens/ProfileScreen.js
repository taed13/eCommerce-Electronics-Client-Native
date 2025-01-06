import { Image, Text, View, ScrollView, Pressable, StyleSheet, Alert, Platform, SafeAreaView } from "react-native";
import React, { useLayoutEffect, useEffect, useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, AntDesign, MaterialIcons } from "@expo/vector-icons";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../api/axiosInstance";
import { colors } from "../config/constants";
import Loading from "../components/Loading";
import { useGetCurrentUser } from "../api/user";
import ProfileBottomModal from "../components/ProfileBottomModal";
import Separator from "../components/Separator";
import NoOrdersMessage from "../components/NoOrdersMessage";
import HeaderSearchInput from "../components/HeaderSearchInput";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { data, isLoading, error } = useGetCurrentUser();
  const currentUser = data?.data;
  const { userId } = useContext(UserType);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddress, setSelectedAdress] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: colors.primary,
      },
      headerLeft: () => (
        <Image
          style={{ width: 140, height: 120, resizeMode: "contain" }}
          source={{
            uri: "https://www.ec.tuwien.ac.at/sites/ec.tuwien.ac.at/files/ec-schrift-300dpi.png",
          }}
        />
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginRight: 10 }}>
          <Ionicons name="notifications-outline" size={24} color="black" />
          <AntDesign name="search1" size={24} color="black" onPress={() => navigation.navigate("Search")} />
        </View>
      ),
    });
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const id = userId;
      try {
        const response = await axiosInstance.get(`user/${id}`);
        const { user } = response.data;
        setUser(user);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchUserProfile();
  }, []);

  const logout = () => {
    clearAuthToken();
  };
  const clearAuthToken = async () => {
    await AsyncStorage.removeItem("authToken");
    console.log("auth token cleared");
    navigation.replace("Login");
  };
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get(`user/getmyorders`);
        console.log('response', response.data);
        setOrders(response.data?.orders || []);
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [userId]);
  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 16, color: "red" }}>Không thể tải dữ liệu người dùng!</Text>
      </View>
    );
  }
  console.log("orders:::", orders);

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: "white", marginTop: 47 }} stickyHeaderIndices={[0]}>
        <>
          <View>
            <HeaderSearchInput />
          </View>
        </>
        <>
          <Pressable onPress={() => setModalVisible(!modalVisible)} style={{ flexDirection: "row", alignItems: "center", gap: 5, padding: 10 }}>
            <View style={styles.avatar}>
              <Text style={styles.avatarLabel}>
                {currentUser?.name
                  .trim()
                  .split(" ")
                  .reduce((prev, current) => `${prev}${current[0]}`, "")}
              </Text>
            </View>
            <Pressable onPress={() => setModalVisible(!modalVisible)} style={{ flex: 1 }}>
              {currentUser ? (
                <Text style={{ fontSize: 17, fontWeight: "500", color: "black" }} numberOfLines={1} ellipsizeMode="tail">
                  Xin chào, {currentUser?.name || "User"}
                </Text>
              ) : (
                <Text style={{ fontSize: 17, fontWeight: "500", color: "white" }}>Thêm địa chỉ giao hàng</Text>
              )}
            </Pressable>
            <MaterialIcons name="keyboard-arrow-down" size={28} color="black" style={{ flex: 1 }} />
          </Pressable>
        </>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            marginVertical: 12,
            marginHorizontal: 10,
          }}
        >
          <Pressable
            style={{
              paddingVertical: 10,
              paddingHorizontal: 16,
              backgroundColor: "#E0E0E0",
              borderRadius: 25,
              flex: 1,
            }}
          >
            <Text
              style={{ textAlign: "center" }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Đơn hàng của bạn
            </Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate("Setting")}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 16,
              backgroundColor: "#E0E0E0",
              borderRadius: 25,
              flex: 1,
            }}
          >
            <Text
              style={{ textAlign: "center" }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Cài Đặt Tài Khoản
            </Text>
          </Pressable>

          <Pressable
            onPress={() => Alert.alert("Thông báo", "Sẽ cập nhật sau...")}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 16,
              backgroundColor: "#E0E0E0",
              borderRadius: 25,
              flex: 1,
            }}
          >
            <Text style={{ textAlign: "center" }}
              numberOfLines={1}
              ellipsizeMode="tail">
              Mua Lại
            </Text>
          </Pressable>
        </View>

        <Separator />

        <Text style={{ fontSize: 20, marginTop: 12, marginHorizontal: 10, fontWeight: "700" }}>Đơn hàng của bạn</Text>

        <View style={styles.ordersContainer}>
          {loadingOrders ? (
            <Loading />
          ) : orders.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.orderList}>
              {orders.map((order) => (
                <Pressable style={styles.orderCard} key={order._id} onPress={() => navigation.navigate("Order", { orderId: order._id })}>
                  {order?.order_items?.length > 0 && (
                    <View style={styles.orderProduct}>
                      <Image
                        source={{ uri: order.order_items[0]?.productId?.product_images?.[0]?.url }}
                        style={styles.productImage}
                      />
                    </View>
                  )}
                  <Text
                    style={styles.orderInfo}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {order.order_items[0]?.productId?.product_name || "Sản phẩm không có tên"}
                  </Text>

                </Pressable>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.noOrdersContainer}>
              <NoOrdersMessage navigation={navigation} />
            </View>
          )}
        </View>

        <Separator />
      </ScrollView>

      <ProfileBottomModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        currentUser={currentUser}
        navigation={navigation}
      />
    </>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "gray",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  avatarLabel: {
    fontSize: 20,
    color: "white",
  },
  ordersContainer: {
    marginHorizontal: 10,
  },
  orderList: {
    paddingVertical: 10,
  },
  orderCard: {
    width: 120,
    height: 200,
    padding: 15,
    marginHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  orderProduct: {
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d0d0d0",
  },
  productImage: {
    padding: 10,
    width: 120,
    height: 120,
    borderRadius: 10,
    resizeMode: "contain",
  },
  orderInfo: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
  },
  noOrdersContainer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
});

export default ProfileScreen;
