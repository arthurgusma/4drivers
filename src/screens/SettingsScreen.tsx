"use client"

import { useState } from "react"
import { View, ScrollView, StyleSheet, Alert, Text } from "react-native"
import { Card, TextInput, Button, List, Switch, Divider, Chip, IconButton } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import * as Notifications from "expo-notifications"
import { useData } from "../context/DataContext"
import { theme } from "../theme/theme"

export default function SettingsScreen() {
  const { state, updateSettings } = useData()
  const [fuelPrice, setFuelPrice] = useState(state.settings.fuelPricePerLiter.toString())
  const [autonomy, setAutonomy] = useState(state.settings.vehicleAutonomy.toString())
  const [newApp, setNewApp] = useState("")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [showAddApp, setShowAddApp] = useState(false)

  const handleSaveSettings = () => {
    const newFuelPrice = Number.parseFloat(fuelPrice)
    const newAutonomy = Number.parseFloat(autonomy)

    if (isNaN(newFuelPrice) || newFuelPrice <= 0) {
      Alert.alert("Erro", "Por favor, insira um preço de combustível válido.")
      return
    }

    if (isNaN(newAutonomy) || newAutonomy <= 0) {
      Alert.alert("Erro", "Por favor, insira uma autonomia válida.")
      return
    }

    const updatedSettings = {
      ...state.settings,
      fuelPricePerLiter: newFuelPrice,
      vehicleAutonomy: newAutonomy,
    }

    updateSettings(updatedSettings)
    Alert.alert("Sucesso", "Configurações salvas com sucesso!")
  }

  const handleAddApp = () => {
    if (newApp.trim() && !state.settings.apps.includes(newApp.trim())) {
      const updatedSettings = {
        ...state.settings,
        apps: [...state.settings.apps, newApp.trim()],
      }
      updateSettings(updatedSettings)
      setNewApp("")
      setShowAddApp(false)
      Alert.alert("Sucesso", "Aplicativo adicionado com sucesso!")
    } else {
      Alert.alert("Erro", "Nome inválido ou aplicativo já existe.")
    }
  }

  const handleRemoveApp = (appToRemove: string) => {
    Alert.alert("Confirmar", `Deseja remover o aplicativo "${appToRemove}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => {
          const updatedSettings = {
            ...state.settings,
            apps: state.settings.apps.filter((app) => app !== appToRemove),
          }
          updateSettings(updatedSettings)
        },
      },
    ])
  }

  const scheduleNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Lembrete de Registro",
        body: "Não se esqueça de registrar seus ganhos de hoje!",
      },
      trigger: {
        hour: 22,
        minute: 0,
        repeats: true,
      },
    })
  }

  const handleNotificationToggle = async (value: boolean) => {
    setNotificationsEnabled(value)

    if (value) {
      const { status } = await Notifications.requestPermissionsAsync()
      if (status === "granted") {
        await scheduleNotification()
        Alert.alert("Sucesso", "Notificações ativadas! Você receberá lembretes diários às 22h.")
      } else {
        Alert.alert("Erro", "Permissão para notificações negada.")
        setNotificationsEnabled(false)
      }
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync()
      Alert.alert("Info", "Notificações desativadas.")
    }
  }

  const clearAllData = () => {
    Alert.alert("ATENÇÃO", "Esta ação irá apagar TODOS os seus dados. Esta ação não pode ser desfeita!", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "APAGAR TUDO",
        style: "destructive",
        onPress: () => {
          // Aqui você implementaria a lógica para limpar todos os dados
          Alert.alert("Info", "Funcionalidade em desenvolvimento.")
        },
      },
    ])
  }

  return (
    <ScrollView style={styles.container}>
      {/* Configurações do Veículo */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>
            <Ionicons name="car" size={24} color={theme.colors.primary} /> Configurações do Veículo
          </Text>

          <TextInput
            label="Preço do combustível (R$/L)"
            value={fuelPrice}
            onChangeText={setFuelPrice}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="gas-station" />}
          />

          <TextInput
            label="Autonomia do veículo (km/L)"
            value={autonomy}
            onChangeText={setAutonomy}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="speedometer" />}
          />

          <Button mode="contained" onPress={handleSaveSettings} style={styles.saveButton} icon="content-save">
            Salvar Configurações
          </Button>
        </Card.Content>
      </Card>

      {/* Gerenciar Aplicativos */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>
            <Ionicons name="apps" size={24} color={theme.colors.primary} /> Aplicativos de Transporte
          </Text>

          <Text style={styles.subtitle}>Aplicativos configurados:</Text>

          <View style={styles.appsContainer}>
            {state.settings.apps.map((app) => (
              <View key={app} style={styles.appChipContainer}>
                <Chip style={styles.appChip}>{app}</Chip>
                <IconButton icon="close" size={16} onPress={() => handleRemoveApp(app)} />
              </View>
            ))}
          </View>

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
            <Button mode="outlined" onPress={() => setShowAddApp(true)} style={styles.addButton} icon="plus">
              Adicionar Aplicativo
            </Button>
          )}
        </Card.Content>
      </Card>

      {/* Notificações */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>
            <Ionicons name="notifications" size={24} color={theme.colors.primary} /> Notificações
          </Text>

          <List.Item
            title="Lembretes diários"
            description="Receber lembrete para registrar ganhos (22h)"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => <Switch value={notificationsEnabled} onValueChange={handleNotificationToggle} />}
          />
        </Card.Content>
      </Card>

      {/* Informações do App */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>
            <Ionicons name="information-circle" size={24} color={theme.colors.primary} /> Sobre o App
          </Text>

          <List.Item title="Versão" description="1.0.0" left={(props) => <List.Icon {...props} icon="information" />} />

          <List.Item
            title="Total de registros"
            description={`${state.records.length} registros salvos`}
            left={(props) => <List.Icon {...props} icon="database" />}
          />

          <Divider style={styles.divider} />

          <Button
            mode="outlined"
            onPress={clearAllData}
            style={[styles.dangerButton, { borderColor: theme.colors.error }]}
            textColor={theme.colors.error}
            icon="delete"
          >
            Apagar Todos os Dados
          </Button>
        </Card.Content>
      </Card>

      {/* Dicas */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>
            <Ionicons name="bulb" size={24} color={theme.colors.warning} /> Dicas de Uso
          </Text>

          <List.Item
            title="Registre diariamente"
            description="Mantenha seus registros em dia para análises precisas"
            left={(props) => <List.Icon {...props} icon="calendar-check" />}
          />

          <List.Item
            title="Monitore a autonomia"
            description="Atualize o preço do combustível regularmente"
            left={(props) => <List.Icon {...props} icon="gas-station" />}
          />

          <List.Item
            title="Use os relatórios"
            description="Analise seus dados no Dashboard para otimizar ganhos"
            left={(props) => <List.Icon {...props} icon="chart-line" />}
          />
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
    marginBottom: 16,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
    color: theme.colors.secondary,
  },
  input: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 8,
  },
  appsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  appChipContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  appChip: {
    marginRight: 4,
  },
  addAppContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  newAppInput: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    marginTop: 8,
  },
  divider: {
    marginVertical: 16,
  },
  dangerButton: {
    marginTop: 8,
  },
})
