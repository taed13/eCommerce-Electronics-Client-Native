import { Text, View, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable, Alert } from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useForgotPassword } from "../api/user";
const EaLogo = require("../assets/ea_002.png");

const ForgotPasswordScreen = () => {
    const navigation = useNavigation();
    const { sendForgotPasswordEmail, isLoading } = useForgotPassword();

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const handleSendEmail = async () => {
        if (!validateEmail(email.trim())) {
            setEmailError("Email không đúng định dạng!");
            return;
        }

        setEmailError("");

        try {
            const result = await sendForgotPasswordEmail({ email });
            console.log('result::', result);

            if (result) {
                Alert.alert("Thành công", "Đường dẫn khôi phục mật khẩu đã được gửi vào email của bạn.", [
                    { text: "OK", onPress: () => navigation.goBack() },
                ]);
            } else {
                throw new Error("Không thể gửi yêu cầu. Vui lòng thử lại!");
            }
        } catch (err) {
            Alert.alert("Lỗi", err.message || "Có lỗi xảy ra trong quá trình gửi yêu cầu.");
        }
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "white",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <View style={{ marginTop: 60, marginBottom: 10, alignItems: "center" }}>
                <Image style={{ width: 100, height: 50 }} source={EaLogo} />
            </View>

            <KeyboardAvoidingView>
                <View style={{ alignItems: "center" }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20, color: "#041E42" }}>
                        Quên mật khẩu
                    </Text>
                    <Text style={{ marginTop: 10, color: "gray", textAlign: "center", fontSize: 16 }}>
                        Nhập địa chỉ email của bạn để nhận đường dẫn khôi phục mật khẩu.
                    </Text>
                </View>

                <View style={{ marginTop: 40 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5,
                            backgroundColor: "#D0D0D0",
                            paddingVertical: 10,
                            borderRadius: 5,
                        }}
                    >
                        <MaterialIcons style={{ marginLeft: 8 }} name="email" size={24} color="gray" />
                        <TextInput
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                if (validateEmail(text.trim())) setEmailError("");
                            }}
                            style={{
                                color: "gray",
                                width: 300,
                                fontSize: 16,
                                marginLeft: 10,
                            }}
                            placeholder="Địa chỉ email của bạn"
                        />
                    </View>
                    {emailError ? <Text style={{ color: "red", marginTop: 5 }}>{emailError}</Text> : null}
                </View>

                <Pressable
                    onPress={handleSendEmail}
                    style={{
                        width: 200,
                        backgroundColor: isLoading ? "#FFD580" : "#FEBE10",
                        borderRadius: 6,
                        padding: 15,
                        marginTop: 40,
                        alignSelf: "center",
                    }}
                    disabled={isLoading}
                >
                    <Text style={{ textAlign: "center", color: "white", fontSize: 16, fontWeight: "bold" }}>
                        {isLoading ? "Đang xử lý..." : "Gửi"}
                    </Text>
                </Pressable>

                <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
                    <Text style={{ textAlign: "center", color: "gray", fontSize: 16, fontWeight: "500" }}>
                        {" "}
                        <Text style={{ color: "#007FFF", textDecorationLine: "underline" }}>Quay lại</Text>
                    </Text>
                </Pressable>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ForgotPasswordScreen;
