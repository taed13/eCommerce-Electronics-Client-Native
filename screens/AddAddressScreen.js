import { Text, View, ScrollView, Pressable, StyleSheet, SafeAreaView, Platform } from "react-native";
import React, { useEffect, useContext, useState, useCallback } from "react";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../api/axiosInstance";
import HeaderSearchInput from "../components/HeaderSearchInput";
import { useDeleteAddress, useSetDefaultAddress } from "../api/user";

const AddAddressScreen = () => {
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const { userId } = useContext(UserType);
  const { mutate: deleteAddress, isLoading: isDeleting } = useDeleteAddress();
  const { mutate: setDefaultAddress, isLoading: isSettingDefault } = useSetDefaultAddress();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    const token = await AsyncStorage.getItem("authToken");
    try {
      const response = await axiosInstance.get(`user/addresses/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const { addresses } = response.data;
      setAddresses(addresses);
    } catch (error) {
      console.log("error", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [])
  );

  const handleDeleteAddress = (addressId) => {
    deleteAddress(addressId, {
      onSuccess: () => {
        setAddresses(addresses.filter(address => address._id !== addressId));
        console.log("Address deleted successfully!");
      },
      onError: () => {
        console.error("Failed to delete address.");
      },
    });
  };

  const handleSetDefaultAddress = (addressId) => {
    setDefaultAddress(addressId, {
      onSuccess: () => {
        console.log("Address set as default successfully!");
        fetchAddresses();
      },
      onError: () => {
        console.error("Failed to set default address.");
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, marginTop: Platform.OS === "android" ? 40 : 0 }}>
      <View>
        <HeaderSearchInput />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>

        <View style={styles.container}>
          <Text style={styles.title}>Địa chỉ của tôi</Text>

          <Pressable onPress={() => navigation.navigate("Add")} style={styles.addAddressButton}>
            <Text style={{ fontSize: 17 }}>Thêm địa chỉ mới</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
          </Pressable>

          <Pressable>
            {addresses &&
              addresses.map((item, index) => (
                <Pressable key={index} style={styles.addressItem}>
                  <View style={styles.addressHeader}>
                    <Text style={styles.addressName}>{item?.name}</Text>
                    <Entypo name="location-pin" size={24} color="red" />
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "baseline", gap: 5 }}>
                    <Text style={styles.customerNameText}>{item?.firstname} {item?.lastname}</Text>
                    <Text style={{ fontSize: 22, color: '#999', fontWeight: 300 }}>|</Text>
                    <Text style={styles.addressText}>{item?.mobileNo}</Text>
                  </View>

                  <Text style={styles.addressText}>{item?.street}</Text>

                  <Text style={styles.addressText}>{item?.ward.full_name}, {item?.district.full_name}, {item?.province.name}</Text>

                  <View style={styles.actionsContainer}>
                    <Pressable onPress={() => navigation.navigate("EditAddress", { addressId: item._id })} style={styles.actionButton}>
                      <Text>Sửa</Text>
                    </Pressable>

                    {
                      !item.default &&
                      <Pressable style={styles.actionButton} onPress={() => handleDeleteAddress(item._id)}>
                        <Text>Xóa</Text>
                      </Pressable>
                    }

                    {
                      item.default ? (
                        <Pressable style={styles.defaultButton}>
                          <Text style={{ color: '#448dc2', }}>Địa chỉ mặc định</Text>
                        </Pressable>
                      ) : (
                        <Pressable style={styles.actionButton} onPress={() => handleSetDefaultAddress(item._id)}>
                          <Text>Đặt làm mặc định</Text>
                        </Pressable>
                      )
                    }
                  </View>
                </Pressable>
              ))}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#fff",
  },
  container: {
    padding: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  addAddressButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    borderColor: "#bbb",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    paddingVertical: 13,
    paddingHorizontal: 5,
  },
  addressItem: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#bbb",
    padding: 10,
    flexDirection: "column",
    gap: 5,
    marginVertical: 10,
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  addressName: {
    fontSize: 15,
    fontWeight: "bold",
  },
  customerNameText: {
    fontSize: 18,
    color: "#181818",
    fontWeight: 700,
  },
  addressText: {
    fontSize: 15,
    color: "#777",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 7,
  },
  defaultButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 0.9,
    borderColor: "#448dc2",
  },
  actionButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
    borderWidth: 0.9,
    borderColor: "#bbb",
  },
});

export default AddAddressScreen;