import { Text, View, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLogin } from "../api/user";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "../feature/users/userSlice";
import Loading from "../components/Loading";

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { login, isLoading, error } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [rememberMe, setRememberMe] = useState(false);

  const toggleRememberMe = () => {
    setRememberMe((prev) => !prev);
  };

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleLogin = async () => {
    let valid = true;

    if (!validateEmail(email.trim())) {
      setEmailError("Email không đúng định dạng!");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password.trim()) {
      setPasswordError("Vui lòng nhập mật khẩu của bạn!");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid) return;

    const user = { email, password };
    const result = await login(user);

    if (result?.findUser?.token) {
      await AsyncStorage.setItem("authToken", result.findUser.token);
      dispatch(fetchCurrentUser());
      navigation.replace("Main");
    } else {
      alert(error || "Đăng nhập thất bại. Vui lòng thử lại!");
    }
  };

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
          alignItems: "center",
          marginTop: 50,
        }}
      >
        <View>
          <Image
            style={{ width: 350, height: 100 }}
            source={{
              uri: "https://www.ec.tuwien.ac.at/sites/ec.tuwien.ac.at/files/ec-schrift-300dpi.png",
            }}
          />
        </View>

        <KeyboardAvoidingView>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 12, color: "#041E42" }}>
              Đăng nhập tài khoản của bạn
            </Text>
          </View>

          <View style={{ marginTop: 70 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#D0D0D0",
                paddingVertical: 5,
                borderRadius: 5,
                marginTop: 30,
              }}
            >
              <MaterialIcons style={{ marginLeft: 8 }} name="email" size={24} color="gray" />

              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (text.trim() && validateEmail(text)) {
                    setEmailError("");
                  }
                }}
                style={{ color: "gray", marginVertical: 10, width: 300, fontSize: 16 }}
                placeholder="Nhập email của bạn"
              />
            </View>
            {emailError ? <Text style={{ color: "red", marginTop: 5 }}>{emailError}</Text> : null}
          </View>

          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#D0D0D0",
                paddingVertical: 5,
                borderRadius: 5,
                marginTop: 30,
              }}
            >
              <AntDesign name="lock1" size={24} color="gray" style={{ marginLeft: 8 }} />

              <TextInput
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (text.trim()) {
                    setPasswordError("");
                  }
                }}
                secureTextEntry={true}
                style={{ color: "gray", marginVertical: 10, width: 300, fontSize: 16 }}
                placeholder="Nhập mật khẩu của bạn"
              />
            </View>
            {passwordError ? <Text style={{ color: "red", marginTop: 5 }}>{passwordError}</Text> : null}
          </View>

          <View
            style={{
              marginTop: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity onPress={toggleRememberMe} style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 3,
                  borderWidth: 1,
                  borderColor: rememberMe ? "#FEBE10" : "gray",
                  backgroundColor: rememberMe ? "#FEBE10" : "white",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {rememberMe && <AntDesign name="check" size={16} color="white" />}
              </View>
              <Text style={{ marginLeft: 8 }}>Giữ tôi đăng nhập</Text>
            </TouchableOpacity>


            <Text
              style={{ color: "#007FFF", fontWeight: "500" }}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              Quên mật khẩu?
            </Text>
          </View>

          <View style={{ marginTop: 80 }} />

          <Pressable
            onPress={handleLogin}
            style={{
              width: 200,
              backgroundColor: isLoading ? "#FFD580" : "#FEBE10",
              borderRadius: 6,
              marginLeft: "auto",
              marginRight: "auto",
              padding: 15,
            }}
            disabled={isLoading}
          >
            <Text style={{ textAlign: "center", color: "white", fontSize: 16, fontWeight: "bold" }}>
              {isLoading ? "Đang xử lý..." : "Đăng nhập"}
            </Text>
          </Pressable>

          <Pressable onPress={() => navigation.navigate("Register")} style={{ marginTop: 15 }}>
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16, fontWeight: "500" }} >
              Bạn chưa có tài khoản?{" "}
              <Text style={{ color: "#007FFF", textDecorationLine: "underline" }}>Đăng ký</Text>
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
      {isLoading && <Loading />}
    </>
  );
};

export default LoginScreen;
