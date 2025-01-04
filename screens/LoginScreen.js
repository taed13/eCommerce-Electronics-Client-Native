import { Text, View, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable } from "react-native";
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
  //taed.business.13@gmail.com
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [rememberMe, setRememberMe] = useState(false);

  const toggleRememberMe = () => {
    setRememberMe((prev) => !prev);
  };

  // Hàm kiểm tra định dạng email
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
            style={{ width: 150, height: 100 }}
            source={{
              uri: "https://assets.stickpng.com/thumbs/6160562276000b00045a7d97.png",
            }}
          />
        </View>

        <KeyboardAvoidingView>
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "bold",
                marginTop: 12,
                color: "#041E42",
              }}
            >
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
                onChangeText={(text) => setEmail(text)}
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: email ? 16 : 16,
                }}
                placeholder="Nhập email của bạn"
              />
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
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
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: password ? 16 : 16,
                }}
                placeholder="Nhập mật khẩu của bạn"
              />
            </View>
          </View>

          <View
            style={{
              marginTop: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text>Giữ tôi đăng nhập</Text>

            <Text style={{ color: "#007FFF", fontWeight: "500" }}>Quên mật khẩu</Text>
          </View>

          <View style={{ marginTop: 80 }} />

          <Pressable
            onPress={handleLogin}
            style={{
              width: 200,
              backgroundColor: "#FEBE10",
              borderRadius: 6,
              marginLeft: "auto",
              marginRight: "auto",
              padding: 15,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Đăng nhập
            </Text>
          </Pressable>

          <Pressable onPress={() => navigation.navigate("Register")} style={{ marginTop: 15 }}>
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              Bạn chưa có tài khoản? Đăng ký ngay
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
      {isLoading && <Loading />}
    </>
  );
};

export default LoginScreen;
