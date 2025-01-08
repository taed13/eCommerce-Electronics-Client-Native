/* eslint-disable react/prop-types */
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

// icons
import Ionicons from "react-native-vector-icons/Ionicons";
import Octicons from "react-native-vector-icons/Octicons";
import { iconSize } from "../constants/dimensions";
import { useNavigation, useTheme } from "@react-navigation/native";

const Header = ({ isHasSetting = false, title = "", canBack = true }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const handleOpenSetting = () => {
    navigation.navigate("Setting");
  };

  return (
    <View style={[styles.container, { paddingVertical: !canBack ? 30 : 20, marginTop: 40, }]}>
      {
        canBack &&
        < TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={"arrow-back"} color={colors.iconPrimary} size={iconSize.md} />
        </TouchableOpacity>
      }

      {
        title && (
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {title}
          </Text>
        )
      }

      {
        isHasSetting && (
          <TouchableOpacity onPress={handleOpenSetting}>
            <Octicons name={"gear"} color={colors.iconPrimary} size={iconSize.md} />
          </TouchableOpacity>
        )
      }
    </View >
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    paddingVertical: 20,
    marginTop: 20,
  },
  title: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 23,
    fontWeight: "bold",
  },
});
