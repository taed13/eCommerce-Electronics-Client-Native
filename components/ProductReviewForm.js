import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../constants/color";

const ProductReviewForm = ({ onSubmit }) => {
    const [starRating, setStarRating] = useState(0);
    const [comment, setComment] = useState("");

    const handleSubmit = () => {
        if (starRating === 0) {
            Alert.alert("Lỗi", "Vui lòng chọn số sao đánh giá!");
            return;
        }

        if (!comment.trim()) {
            Alert.alert("Lỗi", "Vui lòng nhập nội dung nhận xét!");
            return;
        }

        const reviewData = {
            star: starRating,
            comment,
            postedAt: new Date().toISOString(),
        };

        // Gọi callback `onSubmit` để gửi dữ liệu đánh giá
        onSubmit(reviewData);

        // Reset form sau khi gửi thành công
        setStarRating(0);
        setComment("");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Viết đánh giá sản phẩm</Text>

            {/* Chọn số sao */}
            {/* <Text style={styles.label}>:</Text> */}
            <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setStarRating(star)}>
                        <AntDesign
                            name={star <= starRating ? "star" : "staro"}
                            size={32}
                            color={star <= starRating ? colors.yellow : "#ddd"}
                            style={{ marginRight: 8 }}
                        />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Nhập nhận xét */}
            {/* <Text style={styles.label}>Nhận xét:</Text> */}
            <TextInput
                style={styles.textInput}
                placeholder="Nhập nhận xét của bạn..."
                multiline
                value={comment}
                onChangeText={(text) => setComment(text)}
            />

            {/* Nút gửi */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Gửi đánh giá</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProductReviewForm;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#333",
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: "#555",
    },
    starContainer: {
        flexDirection: "row",
        marginBottom: 16,
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        textAlignVertical: "top",
        height: 100,
        marginBottom: 16,
    },
    button: {
        backgroundColor: colors.btn,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});
