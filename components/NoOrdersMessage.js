import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const NoOrdersMessage = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.messageText}>Chào, bạn không có đơn hàng gần đây.</Text>
            <Pressable
                style={styles.homeButton}
                onPress={() => navigation.navigate("Home")}
            >
                <Text style={styles.homeButtonText}>Quay lại Trang chủ</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    messageText: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        color: "#333",
        marginBottom: 15,
    },
    homeButton: {
        backgroundColor: "#FEBD68",
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    homeButtonText: {
        fontSize: 16,
        color: "white",
        fontWeight: "600",
        textAlign: "center",
    },
});

export default NoOrdersMessage;
