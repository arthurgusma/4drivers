import React, { useState } from "react"
import { View, StyleSheet, Alert, Text, KeyboardAvoidingView, Platform } from "react-native"
import { Card, TextInput } from "react-native-paper"
import Button from "../../src/components/ui/Button"
import SocialButton from "../../src/components/ui/SocialButton"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useAuth } from "../../src/context/AuthContext"
import { theme } from "../../src/theme/theme"

export default function SignUpScreen() {
  const { signUp, loginWithGoogle, loginWithApple } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.")
      return
    }

    if (!email.includes("@")) {
      Alert.alert("Erro", "Por favor, insira um email válido.")
      return
    }

    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.")
      return
    }

    setIsLoading(true)
    try {
      const success = await signUp(email, password, name)
      if (success) {
        Alert.alert("Sucesso", "Conta criada com sucesso!")
      } else {
        Alert.alert("Erro", "Erro ao criar conta. Tente novamente.")
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao criar conta. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
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
              label="Nome completo"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="account" />}
            />

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

            <TextInput
              label="Confirmar senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon 
                  icon={showConfirmPassword ? "eye-off" : "eye"} 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />

            <Button
              mode="outlined"
              onPress={handleSignUp}
              loading={isLoading}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Criando conta..." : "Criar Conta"}
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
              <Text style={styles.signUpText}>Já tem uma conta? </Text>
              <Button
                mode="outlined"
                onPress={() => router.push("/(auth)/login")}
              >
                <Text style={styles.signUpText}> Fazer login </Text>
              </Button>
            </View>
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
