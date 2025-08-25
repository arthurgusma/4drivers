import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/src/theme/theme";
import Button from "./Button";

interface SocialButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function SocialButton({ icon, text, onPress, disabled }: SocialButtonProps) {
  return (
    <Button
      mode="outlined"
      onPress={onPress}
      disabled={disabled}
      style={styles.socialButton}
    >
      <View style={styles.socialButtonContent}>
        <Ionicons name={icon} size={18} color={theme.colors.textWhite} />
        <Text style={styles.socialButtonText}>{text}</Text>
      </View>
    </Button>
  );
}

const styles = StyleSheet.create({
  socialButton: {
    width: "100%",
    backgroundColor: theme.colors.background,
    marginVertical: 1,
    borderRadius: 8,
    paddingVertical: 4,
  },
  socialButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  socialButtonText: {
    color: theme.colors.textWhite,
    fontSize: 16,
    fontWeight: "500",
  },
});
