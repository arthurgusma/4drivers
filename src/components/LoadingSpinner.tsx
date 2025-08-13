import { View, StyleSheet, Text } from "react-native"
import { ActivityIndicator } from "react-native-paper"
import { theme } from "../theme/theme"

interface LoadingSpinnerProps {
  message?: string
}

export default function LoadingSpinner({ message = "Carregando..." }: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  message: {
    marginTop: 16,
    textAlign: "center",
    color: theme.colors.outline,
  },
})
