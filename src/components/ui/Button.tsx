import { theme } from "@/src/theme/theme";
import { StyleSheet } from "react-native";
import { Button as PaperButton } from "react-native-paper";

export default function Button({ children, ...props }: any) {
  return <PaperButton style={styles.button} {...props} >{children}</PaperButton>;
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.background,
  },
});