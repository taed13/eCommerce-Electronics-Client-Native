import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { fontFamily } from "../constants/fontFamily";
import { fontSize, iconSize, spacing } from "../constants/dimensions";
// import { colors } from '../constants/color';

import Feather from "react-native-vector-icons/Feather";
import { useTheme } from "@react-navigation/native";

const CustomInput = ({ label, icon, placeholder, type, ...rest }) => {
  const [secureTextEntery, setSecureTextEntery] = useState(true);
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.inputLabel,
          {
            color: colors.textPrimary,
          },
        ]}
      >
        {label}
      </Text>

      <View style={styles.inputFieldContainer}>
        {icon}
        <TextInput
          style={[styles.textInput, { color: colors.textPrimary }]}
          placeholder={placeholder}
          placeholderTextColor={colors.iconSecondary}
          secureTextEntry={type === "password" && secureTextEntery}
          {...rest}
        />
        {type === "password" && (
          <TouchableOpacity onPress={() => setSecureTextEntery(!secureTextEntery)}>
            <Feather
              name={secureTextEntery ? "eye" : "eye-off"}
              size={iconSize.md}
              color={colors.iconSecondary}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  inputLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.md,
    marginVertical: spacing.sm,
  },
  inputFieldContainer: {
    borderWidth: 1,
    borderColor: "#F1ECEC",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.sm,
  },
  textInput: {
    flex: 1,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
  },
});
