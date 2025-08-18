"use client"

import React from "react"
import { View, ScrollView, StyleSheet, RefreshControl } from "react-native"
import { Card, Chip, Divider } from "react-native-paper"
import { Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useData } from "../context/DataContext"
import { theme } from "../theme/theme"
import Button from "../components/ui/Button"

export default function HomeScreen({ navigation }: any) {
  const { getTodayRecord, getWeeklyStats, state } = useData()
  const [refreshing, setRefreshing] = React.useState(false)

  const todayRecord = getTodayRecord()
  const weeklyStats = getWeeklyStats()

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1000)
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Resumo do Dia */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="today" size={24} />
            <Text style={styles.cardTitle}>Resumo de Hoje</Text>
          </View>

          {todayRecord ? (
            <View>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Ganhos</Text>
                  <Text style={[styles.statValue, { color: theme.colors.success }]}>
                    {formatCurrency(Object.values(todayRecord.earnings).reduce((sum, value) => sum + value, 0))}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Combustível</Text>
                  <Text style={[styles.statValue, { color: theme.colors.error }]}>
                    {formatCurrency(todayRecord.fuelCost)}
                  </Text>
                </View>
              </View>

              <Divider style={styles.divider} />

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Lucro Líquido</Text>
                  <Text
                    style={[
                      styles.statValue,
                      {
                        color: todayRecord.netProfit >= 0 ? theme.colors.success : theme.colors.error,
                        fontSize: 20,
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    {formatCurrency(todayRecord.netProfit)}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Distância</Text>
                  <Text style={styles.statValue}>{todayRecord.distance.toFixed(1)} km</Text>
                </View>
              </View>

              <View style={styles.appsContainer}>
                <Text style={styles.appsTitle}>Ganhos por App:</Text>
                <View style={styles.chipsContainer}>
                  {Object.entries(todayRecord.earnings).map(([app, value]) => (
                    <Chip key={app} style={styles.chip}>
                      {app}: {formatCurrency(value)}
                    </Chip>
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <Ionicons name="calendar-outline" size={48} color={theme.colors.outline} />
              <Text style={styles.noDataText}>Nenhum registro para hoje</Text>
              <Button mode="contained" onPress={() => navigation.navigate("Adicionar")}>
                Adicionar Primeiro Registro
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Resumo Semanal */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="calendar" size={24} />
            <Text style={styles.cardTitle}>Resumo da Semana</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Ganho</Text>
              <Text style={[styles.statValue, { color: theme.colors.success }]}>
                {formatCurrency(weeklyStats.totalEarnings)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Combustível</Text>
              <Text style={[styles.statValue, { color: theme.colors.error }]}>
                {formatCurrency(weeklyStats.totalFuelCost)}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Lucro Líquido</Text>
              <Text
                style={[
                  styles.statValue,
                  {
                    color: weeklyStats.totalNetProfit >= 0 ? theme.colors.success : theme.colors.error,
                    fontWeight: "bold",
                  },
                ]}
              >
                {formatCurrency(weeklyStats.totalNetProfit)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Dias Trabalhados</Text>
              <Text style={styles.statValue}>{weeklyStats.recordCount} dias</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total KM</Text>
              <Text style={styles.statValue}>{weeklyStats.totalDistance.toFixed(1)} km</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Média/KM</Text>
              <Text style={styles.statValue}>
                {weeklyStats.totalDistance > 0
                  ? formatCurrency(weeklyStats.totalEarnings / weeklyStats.totalDistance)
                  : formatCurrency(0)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Ações Rápidas */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="flash" size={24} />
            <Text style={styles.cardTitle}>Ações Rápidas</Text>
          </View>
          <View style={styles.actionsContainer}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate("Adicionar")}
              icon="plus"
            >
              Novo Registro
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate("Dashboard")}
              icon="chart-line"
            >
              Ver Relatórios
            </Button>
          </View>
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
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.outline,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    marginVertical: 12,
  },
  appsContainer: {
    marginTop: 16,
  },
  appsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 4,
  },
  noDataContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  noDataText: {
    marginTop: 16,
    marginBottom: 24,
    textAlign: "center",
    color: theme.colors.outline,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
  },
})
