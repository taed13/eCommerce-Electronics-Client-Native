import React from "react";
import { Text, View, StyleSheet, Linking, TouchableOpacity, ScrollView } from "react-native";
import ContactRow from "../components/ContactRow";
import Cell from "../components/Cell";
import Header from "../components/Header";
import Loading from "../components/Loading";
import { Ionicons } from '@expo/vector-icons';
import { colors } from "../config/constants";
import { useGetCurrentUser } from "../api/user";

const SettingScreen = ({ navigation }) => {
  const { data, isLoading } = useGetCurrentUser();

  if (isLoading) {
    return <Loading />;
  }

  const currentUser = data?.data;

  const handleOpenGithub = async () => {
    const githubUrl = "https://github.com/taed13/eCommerce-Electronics-Client-Native";
    await Linking.openURL(githubUrl);
  };

  return (
    <ScrollView>
      <Header title="Cài đặt" />

      <ContactRow
        name={currentUser?.name || "John Doe"}
        subtitle={currentUser?.email || "johndoe@gmail.com"}
        image={currentUser?.avatarImage}
        onPress={() => navigation.navigate("ProfileUser")}
      />

      <View style={styles.settingsContainer}>
        <Cell
          title="Tài khoản"
          subtitle="Quyền riêng tư, Đăng xuất, Xóa tài khoản."
          icon="key-outline"
          iconColor="black"
          onPress={() => navigation.navigate("Account")}
        />

        <Cell
          title="Trợ giúp"
          subtitle="Liên hệ, Thông tin ứng dụng."
          icon="help-circle-outline"
          iconColor="black"
          onPress={() => navigation.navigate("Help")}
        />

        <Cell
          title="Mời bạn bè"
          icon="people-outline"
          iconColor="black"
          onPress={() => {
            alert('Sẽ cập nhật sau...');
          }}
          showForwardIcon={false}
        />
      </View>

      <TouchableOpacity style={styles.githubLink} onPress={handleOpenGithub}>
        <Text style={styles.githubText}>
          <Ionicons name="logo-github" size={12} color={colors.teal} />{" "}
          App's Github
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  settingsContainer: {
    marginTop: 20,
  },
  githubLink: {
    marginTop: 20,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  githubText: {
    fontSize: 12,
    fontWeight: "400",
  },
});

export default SettingScreen;
