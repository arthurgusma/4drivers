import { theme } from "@/src/theme/theme";
import { StyleSheet } from "react-native";
import { Button as PaperButton } from "react-native-paper";

interface ButtonProps {
  children: React.ReactNode;
  mode?: "text" | "outlined" | "contained" | "elevated" | "contained-tonal";
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: any;
  [key: string]: any;
}

export default function Button({ children, style, ...props }: ButtonProps) {
  return (
    <PaperButton 
      style={[styles.button, style]} 
      contentStyle={styles.buttonContent}
      labelStyle={styles.buttonLabel}
      {...props}
    >
      {children}
    </PaperButton>
  );
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
  },
  buttonContent: {
    paddingVertical: 4,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.textWhite,
  },
});