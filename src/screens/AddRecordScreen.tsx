"use client"

import { useState } from "react"
import { View, ScrollView, StyleSheet, Alert, Text } from "react-native"
import { Card, TextInput, Button, Divider, IconButton } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import { useData } from "../context/DataContext"
import { theme } from "../theme/theme"

export default function AddRecordScreen({ navigation }: any) {
  const { addRecord, state } = useData()
  const [distance, setDistance] = useState("")
  const [earnings, setEarnings] = useState<{ [app: string]: string }>({})
  const [newApp, setNewApp] = useState("")
  const [showAddApp, setShowAddApp] = useState(false)

  const handleAddRecord = () => {
    if (!distance || Number.parseFloat(distance) <= 0) {
      Alert.alert("Erro", "Por favor, insira uma distância válida.")
      return
    }

    const earningsNumbers: { [app: string]: number } = {}
    let hasEarnings = false

    Object.entries(earnings).forEach(([app, value]) => {
      const numValue = Number.parseFloat(value) || 0
      if (numValue > 0) {
        earningsNumbers[app] = numValue
        hasEarnings = true
      }
    })

    if (!hasEarnings) {
      Alert.alert("Erro", "Por favor, insira pelo menos um ganho válido.")
      return
    }

    const record = {
      date: new Date().toISOString().split("T")[0],
      distance: Number.parseFloat(distance),
      earnings: earningsNumbers,
    }

    addRecord(record)

    Alert.alert("Sucesso", "Registro adicionado com sucesso!", [
      { text: "OK", onPress: () => navigation.navigate("Home") },
    ])
  }

  const handleAddApp = () => {
    if (newApp.trim() && !state.settings.apps.includes(newApp.trim())) {
      const updatedSettings = {
        ...state.settings,
        apps: [...state.settings.apps, newApp.trim()],
      }
      // Aqui você pode atualizar as configurações se necessário
      setNewApp("")
      setShowAddApp(false)
    }
  }

  const calculatePreview = () => {
    const dist = Number.parseFloat(distance) || 0
    const totalEarnings = Object.values(earnings).reduce((sum, value) => sum + (Number.parseFloat(value) || 0), 0)
    const fuelCost = (dist / state.settings.vehicleAutonomy) * state.settings.fuelPricePerLiter
    const netProfit = totalEarnings - fuelCost

    return { totalEarnings, fuelCost, netProfit }
  }

  const preview = calculatePreview()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="add-circle" size={24} />
            <Text style={styles.cardTitle}>Novo Registro Diário</Text>
          </View>

          {/* Distância */}
          <TextInput
            label="Distância percorrida (km)"
            value={distance}
            onChangeText={setDistance}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: theme.colors.primary } }}
            left={<TextInput.Icon icon="map-marker-distance" />}
          />

          {/* Ganhos por App */}
          <Text style={styles.sectionTitle}>Ganhos por Aplicativo</Text>

          {state.settings.apps.map((app) => (
            <TextInput
              key={app}
              label={`${app} (R$)`}
              value={earnings[app] || ""}
              onChangeText={(value) => setEarnings((prev) => ({ ...prev, [app]: value }))}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="cash" />}
            />
          ))}

          {/* Adicionar novo app */}
          {showAddApp ? (
            <View style={styles.addAppContainer}>
              <TextInput
                label="Nome do novo aplicativo"
                value={newApp}
                onChangeText={setNewApp}
                mode="outlined"
                style={styles.newAppInput}
              />
              <IconButton icon="check" mode="contained" onPress={handleAddApp} />
              <IconButton
                icon="close"
                onPress={() => {
                  setShowAddApp(false)
                  setNewApp("")
                }}
              />
            </View>
          ) : (
            <Button mode="outlined" onPress={() => setShowAddApp(true)} style={styles.addAppButton} icon="plus">
              Adicionar Novo App
            </Button>
          )}

          <Divider style={styles.divider} />

          {/* Preview dos Cálculos */}
          <Text style={styles.sectionTitle}>Preview dos Cálculos</Text>

          <View style={styles.previewContainer}>
            <View style={styles.previewRow}>
              <Text>Total Ganhos:</Text>
              <Text style={[styles.previewValue, { color: theme.colors.success }]}>
                {formatCurrency(preview.totalEarnings)}
              </Text>
            </View>

            <View style={styles.previewRow}>
              <Text>Gasto Combustível:</Text>
              <Text style={[styles.previewValue, { color: theme.colors.error }]}>
                {formatCurrency(preview.fuelCost)}
              </Text>
            </View>

            <Divider style={styles.previewDivider} />

            <View style={styles.previewRow}>
              <Text style={styles.netProfitLabel}>Lucro Líquido:</Text>
              <Text
                style={[
                  styles.netProfitValue,
                  { color: preview.netProfit >= 0 ? theme.colors.success : theme.colors.error },
                ]}
              >
                {formatCurrency(preview.netProfit)}
              </Text>
            </View>
          </View>

          <Button mode="contained" onPress={handleAddRecord} style={styles.saveButton} icon="content-save">
            Salvar Registro
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  card: {
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 12,
    color: theme.colors.primary,
  },
  addAppContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  newAppInput: {
    flex: 1,
    marginRight: 8,
  },
  addAppButton: {
    marginBottom: 16,
  },
  divider: {
    marginVertical: 20,
  },
  previewContainer: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  previewValue: {
    fontWeight: "bold",
  },
  previewDivider: {
    marginVertical: 8,
  },
  netProfitLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  netProfitValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  saveButton: {
    paddingVertical: 8,
  },
})
