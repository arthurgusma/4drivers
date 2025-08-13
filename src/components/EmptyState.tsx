import { View, StyleSheet, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { theme } from "../theme/theme"
import Button from "./ui/Button"

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  description: string
  actionText?: string
  onAction?: () => void
}

export default function EmptyState({ icon, title, description, actionText, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color={theme.colors.outline} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionText && onAction && (
        <Button mode="contained" onPress={onAction}>
          {actionText}
        </Button>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    color: theme.colors.outline,
    marginBottom: 24,
  },
})
