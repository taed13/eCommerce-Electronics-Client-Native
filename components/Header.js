/* eslint-disable react/prop-types */
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

// icons
import Ionicons from "react-native-vector-icons/Ionicons";
import Octicons from "react-native-vector-icons/Octicons";
import { iconSize } from "../constants/dimensions";
import { useNavigation, useTheme } from "@react-navigation/native";

const Header = ({ isHasSetting = false, title = "" }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const hanleOpenSetting = () => {
    navigation.navigate("Setting");
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name={"arrow-back"} color={colors.iconPrimary} size={iconSize.md} />
      </TouchableOpacity>
      {title && <Text>{title}</Text>}

      {isHasSetting && (
        <TouchableOpacity onPress={hanleOpenSetting}>
          <Octicons name={"gear"} color={colors.iconPrimary} size={iconSize.md} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
});
