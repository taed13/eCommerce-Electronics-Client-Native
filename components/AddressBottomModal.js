import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { BottomModal, SlideAnimation, ModalContent } from 'react-native-modals';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSetDefaultAddress } from '../api/user';

const AddressBottomModal = ({ modalVisible, setModalVisible, addresses, selectedAddress, setSelectedAddress }) => {
    const navigation = useNavigation();
    const { mutate: setDefaultAddress, isLoading, error } = useSetDefaultAddress();

    const handleSetDefaultAddress = (addressId) => {
        setDefaultAddress(addressId, {
            onSuccess: () => {
                console.log("Address set as default successfully!");
            },
            onError: () => {
                console.error("Failed to set default address.");
            },
        });
    };

    return (
        <BottomModal
            onBackdropPress={() => setModalVisible(!modalVisible)}
            swipeDirection={["up", "down"]}
            swipeThreshold={200}
            modalAnimation={
                new SlideAnimation({
                    slideFrom: "bottom",
                })
            }
            onHardwareBackPress={() => setModalVisible(!modalVisible)}
            visible={modalVisible}
            onTouchOutside={() => setModalVisible(!modalVisible)}
        >
            <ModalContent style={styles.modalContent}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>
                        Chọn địa chỉ nhận hàng
                    </Text>

                    <Text style={styles.subHeaderText}>
                        Lựa chọn địa chỉ nhận hàng để xem sản phẩm có sẵn và các lựa chọn giao hàng
                    </Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {addresses &&
                        addresses.map((item, index) => (
                            <Pressable
                                key={index}
                                onPress={() => {
                                    setSelectedAddress(item);
                                    if (!item.default) {
                                        handleSetDefaultAddress(item._id);
                                    }
                                }}
                                style={[
                                    styles.addressItem,
                                    selectedAddress === item && styles.selectedAddressItem,
                                    item.default && styles.defaultAddressItem,
                                ]}
                            >
                                <View style={styles.addressHeader}>
                                    <Text style={styles.addressName}>
                                        {item?.name}
                                    </Text>
                                    <Entypo name="location-pin" size={24} color="red" />
                                </View>

                                <Text numberOfLines={1} style={styles.addressText}>
                                    {item?.street}
                                </Text>
                                <Text numberOfLines={1} style={styles.addressText}>
                                    {item?.ward?.full_name}, {item?.district?.full_name},
                                </Text>
                                <Text numberOfLines={1} style={styles.addressText}>
                                    {item?.province?.name}
                                </Text>
                            </Pressable>
                        ))}

                    <Pressable onPress={() => { setModalVisible(false); navigation.navigate("Address"); }} style={styles.addAddressItem}>
                        <Entypo name="plus" size={24} color="#0066b2" />
                        <Text style={styles.addAddressText}>
                            Thêm địa chỉ nhận hàng mới
                        </Text>
                    </Pressable>
                </ScrollView>

                {isLoading && (
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                )}
            </ModalContent>
        </BottomModal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        width: "100%",
        height: 290,
    },
    header: {
        marginBottom: 8,
    },
    headerText: {
        fontSize: 16,
        fontWeight: "500",
    },
    subHeaderText: {
        marginTop: 5,
        fontSize: 16,
        color: "gray",
    },
    addressItem: {
        width: 140,
        height: 140,
        borderColor: "#D0D0D0",
        borderWidth: 1,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        gap: 3,
        marginRight: 15,
        marginTop: 10,
        backgroundColor: "white",
    },
    selectedAddressItem: {
        backgroundColor: "#d5e9f5",
    },
    defaultAddressItem: {
        backgroundColor: "#D3F9D8",
    },
    addressHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
    },
    addressName: {
        fontSize: 13,
        fontWeight: "bold",
    },
    addressText: {
        width: 130,
        fontSize: 13,
        textAlign: "center",
    },
    addAddressItem: {
        width: 140,
        height: 140,
        borderColor: "#D0D0D0",
        marginTop: 10,
        borderWidth: 1,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    addAddressText: {
        textAlign: "center",
        color: "#0066b2",
        fontWeight: "500",
    },
    loading: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -50 }, { translateY: -50 }],
    },
    footer: {
        flexDirection: "column",
        gap: 7,
        marginBottom: 30,
    },
    footerItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    footerText: {
        color: "#0066b2",
        fontWeight: "400",
    },
});

export default AddressBottomModal;