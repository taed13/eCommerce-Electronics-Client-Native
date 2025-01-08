import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../config/constants';
import Separator from './Separator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileItem = ({ currentUser, navigation, setModalVisible }) => {

    const handleNavigateToSetting = () => {
        setModalVisible(false);  // Close modal
        setTimeout(() => {
            navigation.navigate("Setting");  // Navigate to Settings
        }, 300);
    };

    const clearAuthToken = async () => {
        await AsyncStorage.removeItem("authToken");
        console.log("auth token cleared");
        navigation.replace("Login");  // Redirect to login screen after logging out
    };

    const handleLogout = () => {
        setModalVisible(false);  // Close modal before logout
        setTimeout(() => {
            clearAuthToken();  // Execute logout
        }, 300);
    };

    return (
        <>
            <Pressable style={styles.profileContainer}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarLabel}>
                        {currentUser?.name
                            ?.trim()
                            ?.split(" ")
                            ?.map(word => word[0])
                            ?.join("") || ""}
                    </Text>
                </View>

                <View style={styles.userInfo}>
                    <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
                        {currentUser ? `Xin chào, ${currentUser?.name}` : "Thêm địa chỉ giao hàng"}
                    </Text>
                </View>

                <Pressable onPress={handleNavigateToSetting}>
                    <Text style={styles.viewText}>View</Text>
                </Pressable>
            </Pressable>

            <Separator />

            <Pressable onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Đăng xuất</Text>
            </Pressable>
        </>
    );
};

const styles = StyleSheet.create({
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        backgroundColor: "#F5F8FA",
        borderRadius: 12,
        gap: 8,
        marginBottom: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "gray",
    },
    avatarLabel: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 17,
        fontWeight: "500",
        color: "black",
    },
    viewText: {
        fontSize: 17,
        fontWeight: "600",
        color: "#425768",
        paddingHorizontal: 8,
    },
    logoutButton: {
        backgroundColor: "#425768",
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    logoutText: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
});

export default ProfileItem;
