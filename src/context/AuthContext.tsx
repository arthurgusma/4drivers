"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"

interface User {
  id: string
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<boolean>
  loginWithGoogle: () => Promise<boolean>
  loginWithApple: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authKey, setAuthKey] = useState(0) // Force re-render key
  const router = useRouter()

  useEffect(() => {
    loadStoredUser()
  }, [])

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Error loading stored user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const mockUser: User = {
        id: Date.now().toString(),
        email: email,
        name: email.split("@")[0],
      }

      await AsyncStorage.setItem("user", JSON.stringify(mockUser))
      setUser(mockUser)
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem("user")
      setUser(null)
      setAuthKey(prev => prev + 1)
      router.replace("/(auth)/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const newUser: User = {
        id: Date.now().toString(),
        email: email,
        name: name,
      }

      await AsyncStorage.setItem("user", JSON.stringify(newUser))
      setUser(newUser)
      return true
    } catch (error) {
      console.error("Sign up error:", error)
      return false
    }
  }

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const googleUser: User = {
        id: Date.now().toString(),
        email: "user@gmail.com",
        name: "Google User",
      }

      await AsyncStorage.setItem("user", JSON.stringify(googleUser))
      setUser(googleUser)
      setAuthKey(prev => prev + 1)
      return true
    } catch (error) {
      console.error("Google login error:", error)
      return false
    }
  }

  const loginWithApple = async (): Promise<boolean> => {
    try {
      const appleUser: User = {
        id: Date.now().toString(),
        email: "user@icloud.com",
        name: "Apple User",
      }

      await AsyncStorage.setItem("user", JSON.stringify(appleUser))
      setUser(appleUser)
      setAuthKey(prev => prev + 1)
      return true
    } catch (error) {
      console.error("Apple login error:", error)
      return false
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    signUp,
    loginWithGoogle,
    loginWithApple,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
