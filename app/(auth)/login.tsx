import React, { useState } from "react"
import { View, StyleSheet, Alert, Text, KeyboardAvoidingView, Platform } from "react-native"
import { Card, TextInput } from "react-native-paper"
import Button from "../../src/components/ui/Button"
import SocialButton from "../../src/components/ui/SocialButton"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useAuth } from "../../src/context/AuthContext"
import { theme } from "../../src/theme/theme"

export default function LoginScreen() {
  const { login, loginWithGoogle, loginWithApple } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.")
      return
    }

    if (!email.includes("@")) {
      Alert.alert("Erro", "Por favor, insira um email válido.")
      return
    }

    setIsLoading(true)
    try {
      const success = await login(email, password)
      if (!success) {
        Alert.alert("Erro", "Email ou senha incorretos.")
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao fazer login. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = () => {
    router.push("/(auth)/signup")
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const success = await loginWithGoogle()
      if (!success) {
        Alert.alert("Erro", "Erro ao fazer login com Google.")
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao fazer login com Google.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAppleSignIn = async () => {
    setIsLoading(true)
    try {
      const success = await loginWithApple()
      if (!success) {
        Alert.alert("Erro", "Erro ao fazer login com Apple.")
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao fazer login com Apple.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <Ionicons name="car" size={64} color={theme.colors.primary} />
              <Text style={styles.title}>Driver Finance</Text>
            </View>

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="email" />}
            />

            <TextInput
              label="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon 
                  icon={showPassword ? "eye-off" : "eye"} 
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            <Button
              mode="outlined"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
              {isLoading ? "Entrando..." : "Entrar"}
              </Text>
            </Button>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialLoginGroup}>
              <SocialButton
                icon="logo-google"
                text="Continuar com Google"
                onPress={handleGoogleSignIn}
                disabled={isLoading}
              />

              <SocialButton
                icon="logo-apple"
                text="Continuar com Apple"
                onPress={handleAppleSignIn}
                disabled={isLoading}
              />
            </View>
              

            <View style={styles.signUpLink}>
              <Text style={styles.signUpText}>Não tem uma conta? </Text>
              <Button
                mode="outlined"
                onPress={handleSignUp}
              >
                <Text style={styles.signUpText}> Criar conta </Text>
              </Button>
            </View>

            <Button
              mode="outlined"
              onPress={() => Alert.alert("Info", "Funcionalidade de recuperação de senha em desenvolvimento.")}
            >
              <Text style={styles.signUpText}> Esqueceu a senha? </Text>
            </Button>
          </Card.Content>
        </Card>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  card: {
    elevation: 8,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.textWhite,
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme.colors.textWhite,
    borderRadius: 16,
  },
  socialLoginGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.outline,
  },
  dividerText: {
    marginHorizontal: 16,
    color: theme.colors.outline,
  },
  signUpLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
  },

  signUpText: {
    color: theme.colors.primary,
    fontSize: 18,
    marginRight: 4,
  },
  buttonText: {
    color: theme.colors.textWhite,
    fontSize: 18,
  },
})
