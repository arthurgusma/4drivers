import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { theme } from "../../src/theme/theme"

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap

          if (route.name === "index") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "add") {
            iconName = focused ? "add-circle" : "add-circle-outline"
          } else if (route.name === "dashboard") {
            iconName = focused ? "analytics" : "analytics-outline"
          } else if (route.name === "settings") {
            iconName = focused ? "settings" : "settings-outline"
          } else {
            iconName = "home-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: theme.colors.background,
        tabBarInactiveTintColor: theme.colors.tertiary,
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Novo Registro",
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Resumo",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Configurações",
        }}
      />
    </Tabs>
  )
}
