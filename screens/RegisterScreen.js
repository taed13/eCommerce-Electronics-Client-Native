import {
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons, AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRegister } from "../api/user";
const EaLogo = require("../assets/ea_002.png");

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const navigation = useNavigation();
  const { register, isLoading } = useRegister();

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleRegister = async () => {
    let valid = true;

    if (name.trim().length < 2) {
      setNameError("Tên phải có ít nhất 2 ký tự!");
      valid = false;
    } else {
      setNameError("");
    }

    if (!validateEmail(email.trim())) {
      setEmailError("Email không đúng định dạng!");
      valid = false;
    } else {
      setEmailError("");
    }

    if (password.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự!");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Mật khẩu không khớp!");
      valid = false;
    } else {
      setConfirmPasswordError("");
    }

    if (!valid) return;

    const user = { name, email, password };

    try {
      const result = await register(user);
      console.log('result', result);

      if (result?.token) {
        Alert.alert("Đăng ký thành công", "Chúc mừng bạn đã đăng ký thành công tài khoản!", [
          {
            text: "OK",
            onPress: () => navigation.replace("Login"),
          },
        ]);
      } else if (result?.message) {
        Alert.alert("Đăng ký thành công", result.message, [
          {
            text: "OK",
            onPress: () => navigation.replace("Login"),
          },
        ]);
      } else if (result?.error) {
        Alert.alert("Lỗi đăng ký", result.error);
      } else {
        throw new Error("Đăng ký thất bại. Vui lòng thử lại!");
      }
    } catch (err) {
      console.error("Lỗi trong quá trình đăng ký:", err.message);
      Alert.alert("Lỗi", err.message || "Có lỗi xảy ra trong quá trình đăng ký.");
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => Keyboard.dismiss()}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "white", alignItems: "center", marginTop: 50 }}>
        <View style={{ marginTop: 60, marginBottom: 10, alignItems: "center" }}>
          <Image style={{ width: 100, height: 50 }} source={EaLogo} />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView contentContainerStyle={{ alignItems: "center" }} showsVerticalScrollIndicator={false}>
            <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 12, color: "#041E42" }}>Đăng ký tài khoản Electronics của bạn</Text>

            <View style={{ marginTop: 70 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#D0D0D0", paddingVertical: 5, borderRadius: 5, marginTop: 30 }}>
                <Ionicons name="person" size={24} color="gray" style={{ marginLeft: 8 }} />
                <TextInput
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (text.trim().length >= 2) setNameError("");
                  }}
                  style={{ color: "gray", marginVertical: 10, width: 300, fontSize: 16 }}
                  placeholder="Nhập tên của bạn"
                />
              </View>
              {nameError ? <Text style={{ color: "red", marginTop: 5 }}>{nameError}</Text> : null}

              <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#D0D0D0", paddingVertical: 5, borderRadius: 5, marginTop: 30 }}>
                <MaterialIcons style={{ marginLeft: 8 }} name="email" size={24} color="gray" />
                <TextInput
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (validateEmail(text.trim())) setEmailError("");
                  }}
                  style={{ color: "gray", marginVertical: 10, width: 300, fontSize: 16 }}
                  placeholder="Nhập email của bạn"
                />
              </View>
              {emailError ? <Text style={{ color: "red", marginTop: 5 }}>{emailError}</Text> : null}

              <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#D0D0D0", paddingVertical: 5, borderRadius: 5, marginTop: 30 }}>
                <AntDesign name="lock1" size={24} color="gray" style={{ marginLeft: 8 }} />
                <TextInput
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (text.length >= 6) setPasswordError("");
                  }}
                  secureTextEntry={true}
                  style={{ color: "gray", marginVertical: 10, width: 300, fontSize: 16 }}
                  placeholder="Nhập mật khẩu của bạn"
                />
              </View>
              {passwordError ? <Text style={{ color: "red", marginTop: 5 }}>{passwordError}</Text> : null}

              <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#D0D0D0", paddingVertical: 5, borderRadius: 5, marginTop: 30 }}>
                <AntDesign name="lock1" size={24} color="gray" style={{ marginLeft: 8 }} />
                <TextInput
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (text === password) setConfirmPasswordError("");
                  }}
                  secureTextEntry={true}
                  style={{ color: "gray", marginVertical: 10, width: 300, fontSize: 16 }}
                  placeholder="Nhập lại mật khẩu của bạn"
                />
              </View>
              {confirmPasswordError ? <Text style={{ color: "red", marginTop: 5 }}>{confirmPasswordError}</Text> : null}

              <TouchableOpacity
                onPress={handleRegister}
                style={{
                  width: 200,
                  backgroundColor: isLoading ? "#38676e" : "#294a4f",
                  borderRadius: 12,
                  marginLeft: "auto",
                  marginRight: "auto",
                  padding: 15,
                  marginTop: 40,
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={{ textAlign: "center", color: "white", fontSize: 16, fontWeight: "bold" }}>Đăng ký</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 15 }}>
                <Text style={{ textAlign: "center", color: "gray", fontSize: 16, fontWeight: "500" }}>
                  Đã có tài khoản?{" "}
                  <Text style={{ color: "#007FFF", textDecorationLine: "underline" }}>Đăng nhập</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableOpacity>
  );
};

export default RegisterScreen;