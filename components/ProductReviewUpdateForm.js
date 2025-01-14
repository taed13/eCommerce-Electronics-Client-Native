import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../constants/color";

const ProductReviewUpdateForm = ({ initialStarRating, initialComment, onSubmit, onCancel }) => {
    const [starRating, setStarRating] = useState(initialStarRating);
    const [comment, setComment] = useState(initialComment);

    useEffect(() => {
        setStarRating(initialStarRating);
        setComment(initialComment);
    }, [initialStarRating, initialComment]);

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

        console.log("Submitting review data:", reviewData);

        onSubmit(reviewData);

        setStarRating(0);
        setComment("");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chỉnh sửa đánh giá sản phẩm</Text>

            {/* Chọn số sao */}
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
            <TextInput
                style={styles.textInput}
                placeholder="Nhập nhận xét của bạn..."
                multiline
                value={comment}
                onChangeText={(text) => setComment(text)}
            />

            {/* Nút gửi */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Cập nhật đánh giá</Text>
            </TouchableOpacity>
            {/* Nút hủy */}
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProductReviewUpdateForm;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        borderRadius: 8,
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
        justifyContent: "center",
        marginBottom: 16,
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 15,
        borderRadius: 8,
        fontSize: 18,
        textAlignVertical: "top",
        height: 175,
        marginBottom: 8,
    },
    button: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#007bff",
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
    },
    cancelButton: {
        backgroundColor: "#ccc",
    },
});