import { useEffect, useState } from "react"
import { View, ActivityIndicator } from "react-native"
import { Provider as PaperProvider } from "react-native-paper"
import { Stack, useRouter, useSegments } from "expo-router"
import * as Notifications from "expo-notifications"
import { StatusBar } from "expo-status-bar"

import { AuthProvider, useAuth } from "../src/context/AuthContext"
import { DataProvider } from "../src/context/DataContext"
import { theme } from "../src/theme/theme"

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth()
  const [expoPushToken, setExpoPushToken] = useState<string>("")
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token || ""))
  }, [])

  useEffect(() => {
    if (isLoading) return

    const inAuthGroup = segments[0] === "(auth)"

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to auth screen if not authenticated
      router.replace("/(auth)/login")
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to main app if authenticated
      router.replace("/(tabs)")
    }
  }, [isAuthenticated, segments, isLoading])

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    )
  }

  return (
    <>
      <StatusBar style="dark" backgroundColor={theme.colors.background} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  )
}

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <DataProvider>
          <RootLayoutNav />
        </DataProvider>
      </AuthProvider>
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
