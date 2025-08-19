import * as Notifications from "expo-notifications"

export const scheduleEndOfDayReminder = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "📊 Hora de registrar!",
      body: "Não se esqueça de registrar seus ganhos de hoje antes de descansar.",
      data: { type: "daily_reminder" },
    },
    trigger: {
      hour: 22,
      minute: 0,
      repeats: true,
    },
  })
}

export const scheduleLowFuelEfficiencyAlert = async (efficiency: number) => {
  if (efficiency < 2) {
    // R$/km muito baixo
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⚠️ Eficiência baixa detectada",
        body: `Sua eficiência está em R$${efficiency.toFixed(2)}/km. Considere revisar sua estratégia.`,
        data: { type: "efficiency_alert" },
      },
      trigger: null,
    })
  }
}

export const scheduleWeeklyReport = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "📈 Relatório semanal disponível",
      body: "Confira seu desempenho da semana na página de Resumo!",
      data: { type: "weekly_report" },
    },
    trigger: {
      weekday: 1, // Segunda-feira
      hour: 9,
      minute: 0,
      repeats: true,
    },
  })
}

export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync()
}
