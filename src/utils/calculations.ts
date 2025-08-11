export const calculateFuelCost = (distance: number, autonomy: number, fuelPrice: number): number => {
  return (distance / autonomy) * fuelPrice
}

export const calculateNetProfit = (earnings: { [app: string]: number }, fuelCost: number): number => {
  const totalEarnings = Object.values(earnings).reduce((sum, value) => sum + value, 0)
  return totalEarnings - fuelCost
}

export const calculateEfficiency = (earnings: number, distance: number): number => {
  return distance > 0 ? earnings / distance : 0
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export const formatDistance = (distance: number): string => {
  return `${distance.toFixed(1)} km`
}

export const calculateAveragePerDay = (total: number, days: number): number => {
  return days > 0 ? total / days : 0
}
