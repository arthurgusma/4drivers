"use client"

import { useState } from "react"
import { View, ScrollView, StyleSheet, Dimensions, Text } from "react-native"
import { Card, SegmentedButtons, Chip } from "react-native-paper"
import { VictoryChart, VictoryArea, VictoryBar, VictoryAxis, VictoryTheme } from "victory-native"
import { Ionicons } from "@expo/vector-icons"
import { useData } from "../context/DataContext"
import { theme } from "../theme/theme"
import { format, subWeeks, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"

const screenWidth = Dimensions.get("window").width

export default function DashboardScreen() {
  const { state, getWeeklyStats, getMonthlyStats } = useData()
  const [period, setPeriod] = useState("week")

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getFilteredRecords = () => {
    const now = new Date()
    let startDate: Date

    switch (period) {
      case "week":
        startDate = subWeeks(now, 1)
        break
      case "month":
        startDate = subMonths(now, 1)
        break
      case "quarter":
        startDate = subMonths(now, 3)
        break
      default:
        startDate = subWeeks(now, 1)
    }

    return state.records.filter((record) => new Date(record.date) >= startDate)
  }

  const getChartData = () => {
    const records = getFilteredRecords()

    return records
      .map((record) => ({
        x: format(new Date(record.date), "dd/MM", { locale: ptBR }),
        earnings: Object.values(record.earnings).reduce((sum, value) => sum + value, 0),
        fuelCost: record.fuelCost,
        netProfit: record.netProfit,
        distance: record.distance,
      }))
      .sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime())
  }

  const getAppEarningsData = () => {
    const records = getFilteredRecords()
    const appTotals: { [app: string]: number } = {}

    records.forEach((record) => {
      Object.entries(record.earnings).forEach(([app, value]) => {
        appTotals[app] = (appTotals[app] || 0) + value
      })
    })

    return Object.entries(appTotals).map(([app, total]) => ({
      app,
      total,
      percentage: (total / Object.values(appTotals).reduce((sum, val) => sum + val, 0)) * 100,
    }))
  }

  const chartData = getChartData()
  const appEarningsData = getAppEarningsData()
  const weeklyStats = getWeeklyStats()
  const monthlyStats = getMonthlyStats()

  const currentStats = period === "week" ? weeklyStats : monthlyStats

  return (
    <ScrollView style={styles.container}>
      {/* Seletor de Período */}
      <Card style={styles.card}>
        <Card.Content>
          <SegmentedButtons
            value={period}
            onValueChange={setPeriod}
            buttons={[
              { value: "week", label: "Semana" },
              { value: "month", label: "Mês" },
              { value: "quarter", label: "Trimestre" },
            ]}
          />
        </Card.Content>
      </Card>

      {/* Resumo Estatístico */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="stats-chart" size={24} color={theme.colors.background} />
            <Text style={styles.cardTitle}>Resumo do Período</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total Ganho</Text>
              <Text style={[styles.statValue, { color: theme.colors.success }]}>
                {formatCurrency(currentStats.totalEarnings)}
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Combustível</Text>
              <Text style={[styles.statValue, { color: theme.colors.error }]}>
                {formatCurrency(currentStats.totalFuelCost)}
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Lucro Líquido</Text>
              <Text
                style={[
                  styles.statValue,
                  { color: currentStats.totalNetProfit >= 0 ? theme.colors.success : theme.colors.error },
                ]}
              >
                {formatCurrency(currentStats.totalNetProfit)}
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Média/Dia</Text>
              <Text style={styles.statValue}>
                {formatCurrency(
                  currentStats.recordCount > 0 ? currentStats.totalNetProfit / currentStats.recordCount : 0,
                )}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Métricas Adicionais */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Métricas de Performance</Text>

          <View style={styles.metricsContainer}>
            <View style={styles.metricItem}>
              <Ionicons name="speedometer" size={24} color={theme.colors.tertiary} />
              <Text style={styles.metricLabel}>KM Total</Text>
              <Text style={styles.metricValue}>{currentStats.totalDistance.toFixed(1)} km</Text>
            </View>

            <View style={styles.metricItem}>
              <Ionicons name="cash" size={24} color={theme.colors.success} />
              <Text style={styles.metricLabel}>R$/KM</Text>
              <Text style={styles.metricValue}>
                {currentStats.totalDistance > 0
                  ? formatCurrency(currentStats.totalEarnings / currentStats.totalDistance)
                  : formatCurrency(0)}
              </Text>
            </View>

            <View style={styles.metricItem}>
              <Ionicons name="calendar" size={24} color={theme.colors.warning} />
              <Text style={styles.metricLabel}>Dias Ativos</Text>
              <Text style={styles.metricValue}>{currentStats.recordCount} dias</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Gráfico de Evolução */}
      {chartData.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Evolução dos Ganhos</Text>
            <VictoryChart
              theme={VictoryTheme.material}
              height={250}
              width={screenWidth - 64}
              padding={{ left: 80, top: 20, right: 40, bottom: 60 }}
            >
              <VictoryAxis dependentAxis tickFormat={(x) => `R$${x}`} />
              <VictoryAxis />
              <VictoryArea
                data={chartData}
                x="x"
                y="earnings"
                style={{
                  data: { fill: theme.colors.primary, fillOpacity: 0.3, stroke: theme.colors.primary, strokeWidth: 2 },
                }}
              />
            </VictoryChart>
          </Card.Content>
        </Card>
      )}

      {/* Gráfico de Lucro vs Gastos */}
      {chartData.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Lucro vs Gastos</Text>
            <VictoryChart
              theme={VictoryTheme.material}
              height={250}
              width={screenWidth - 64}
              padding={{ left: 80, top: 20, right: 40, bottom: 60 }}
            >
              <VictoryAxis dependentAxis tickFormat={(x) => `R$${x}`} />
              <VictoryAxis />
              <VictoryBar
                data={chartData}
                x="x"
                y="netProfit"
                style={{
                  data: {
                    fill: ({ datum }) => (datum.netProfit >= 0 ? theme.colors.success : theme.colors.error),
                  },
                }}
              />
            </VictoryChart>
          </Card.Content>
        </Card>
      )}

      {/* Distribuição por App */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Ganhos por Aplicativo</Text>
          <View style={styles.appsContainer}>
            {appEarningsData.map(({ app, total, percentage }) => (
              <View key={app} style={styles.appRow}>
                <Chip style={styles.appChip}>{app}</Chip>
                <View style={styles.appStats}>
                  <Text style={styles.appTotal}>{formatCurrency(total)}</Text>
                  <Text style={styles.appPercentage}>{percentage.toFixed(1)}%</Text>
                </View>
              </View>
            ))}
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
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.textBlack,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  statBox: {
    width: "48%",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.outline,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.success,
  },
  appsContainer: {
    gap: 12,
  },
  appRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  appChip: {
    flex: 1,
  },
  appStats: {
    alignItems: "flex-end",
  },
  appTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.success,
  },
  appPercentage: {
    fontSize: 12,
    color: theme.colors.outline,
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  metricItem: {
    alignItems: "center",
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: theme.colors.outline,
    marginTop: 8,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
})
