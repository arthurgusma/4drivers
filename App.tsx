"use client"

import { useEffect, useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { Provider as PaperProvider } from "react-native-paper"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import * as Notifications from "expo-notifications"

import HomeScreen from "./src/screens/HomeScreen"
import AddRecordScreen from "./src/screens/AddRecordScreen"
import DashboardScreen from "./src/screens/DashboardScreen"
import SettingsScreen from "./src/screens/SettingsScreen"
import { DataProvider } from "./src/context/DataContext"
import { theme } from "./src/theme/theme"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

// Configuração das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Adicionar") {
            iconName = focused ? "add-circle" : "add-circle-outline"
          } else if (route.name === "Dashboard") {
            iconName = focused ? "analytics" : "analytics-outline"
          } else if (route.name === "Configurações") {
            iconName = focused ? "settings" : "settings-outline"
          } else {
            iconName = "home-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintcolor: theme.colors.background,
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
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Início" }} />
      <Tab.Screen name="Adicionar" component={AddRecordScreen} options={{ title: "Novo Registro" }} />
      <Tab.Screen name="Resumo" component={DashboardScreen} />
      <Tab.Screen name="Configurações" component={SettingsScreen} />
    </Tab.Navigator>
  )
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState<string>("")

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token || ""))
  }, [])

  return (
    <PaperProvider theme={theme}>
      <DataProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <TabNavigator />
        </NavigationContainer>
      </DataProvider>
    </PaperProvider>
  )
}

async function registerForPushNotificationsAsync() {
  let token
  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!")
    return
  }

  token = (await Notifications.getExpoPushTokenAsync()).data
  return token
}
