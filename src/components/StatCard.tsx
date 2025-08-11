import { View, StyleSheet } from "react-native"
import { Card, Title, Paragraph } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import { theme } from "../theme/theme"

interface StatCardProps {
  title: string
  value: string
  icon: keyof typeof Ionicons.glyphMap
  color?: string
  subtitle?: string
}

export default function StatCard({ title, value, icon, color = theme.colors.primary, subtitle }: StatCardProps) {
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <Ionicons name={icon} size={24} color={color} />
          <Title style={[styles.title, { color }]}>{title}</Title>
        </View>
        <Paragraph style={[styles.value, { color }]}>{value}</Paragraph>
        {subtitle && <Paragraph style={styles.subtitle}>{subtitle}</Paragraph>}
      </Card.Content>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 4,
    elevation: 2,
  },
  content: {
    alignItems: "center",
    paddingVertical: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: "bold",
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.outline,
    marginTop: 4,
    textAlign: "center",
  },
})
