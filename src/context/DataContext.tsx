"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

export interface DailyRecord {
  id: string
  date: string
  distance: number
  earnings: { [app: string]: number }
  fuelCost: number
  netProfit: number
}

export interface Settings {
  fuelPricePerLiter: number
  vehicleAutonomy: number // km per liter
  apps: string[]
}

interface DataState {
  records: DailyRecord[]
  settings: Settings
}

type DataAction =
  | { type: "SET_RECORDS"; payload: DailyRecord[] }
  | { type: "ADD_RECORD"; payload: DailyRecord }
  | { type: "UPDATE_SETTINGS"; payload: Settings }
  | { type: "DELETE_RECORD"; payload: string }
  | { type: "CLEAR_ALL_DATA" }

const initialState: DataState = {
  records: [],
  settings: {
    fuelPricePerLiter: 5.5,
    vehicleAutonomy: 12,
    apps: ["Uber", "99", "InDrive"],
  },
}

const DataContext = createContext<{
  state: DataState
  dispatch: React.Dispatch<DataAction>
  addRecord: (record: Omit<DailyRecord, "id" | "fuelCost" | "netProfit">) => void
  updateSettings: (settings: Settings) => void
  getTodayRecord: () => DailyRecord | undefined
  getWeeklyStats: () => any
  getMonthlyStats: () => any
  clearAllData: () => Promise<void>
}>({
  state: initialState,
  dispatch: () => {},
  addRecord: () => {},
  updateSettings: () => {},
  getTodayRecord: () => undefined,
  getWeeklyStats: () => ({}),
  getMonthlyStats: () => ({}),
  clearAllData: async () => {},
})

function dataReducer(state: DataState, action: DataAction): DataState {
  switch (action.type) {
    case "SET_RECORDS":
      return { ...state, records: action.payload }
    case "ADD_RECORD":
      return { ...state, records: [...state.records, action.payload] }
    case "UPDATE_SETTINGS":
      return { ...state, settings: action.payload }
    case "DELETE_RECORD":
      return {
        ...state,
        records: state.records.filter((record) => record.id !== action.payload),
      }
    case "CLEAR_ALL_DATA":
      return {
        ...state,
        records: [],
        settings: initialState.settings,
      }
    default:
      return state
  }
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(dataReducer, initialState)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    saveData()
  }, [state])

  const loadData = async () => {
    try {
      const recordsData = await AsyncStorage.getItem("records")
      const settingsData = await AsyncStorage.getItem("settings")

      if (recordsData) {
        dispatch({ type: "SET_RECORDS", payload: JSON.parse(recordsData) })
      }

      if (settingsData) {
        dispatch({ type: "UPDATE_SETTINGS", payload: JSON.parse(settingsData) })
      }
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const saveData = async () => {
    try {
      await AsyncStorage.setItem("records", JSON.stringify(state.records))
      await AsyncStorage.setItem("settings", JSON.stringify(state.settings))
    } catch (error) {
      console.error("Error saving data:", error)
    }
  }

  const addRecord = (record: Omit<DailyRecord, "id" | "fuelCost" | "netProfit">) => {
    const fuelCost = (record.distance / state.settings.vehicleAutonomy) * state.settings.fuelPricePerLiter
    const totalEarnings = Object.values(record.earnings).reduce((sum, value) => sum + value, 0)
    const netProfit = totalEarnings - fuelCost

    const newRecord: DailyRecord = {
      ...record,
      id: Date.now().toString(),
      fuelCost,
      netProfit,
    }

    dispatch({ type: "ADD_RECORD", payload: newRecord })
  }

  const updateSettings = (settings: Settings) => {
    dispatch({ type: "UPDATE_SETTINGS", payload: settings })
  }

  const getTodayRecord = () => {
    const today = new Date().toISOString().split("T")[0]
    return state.records.find((record) => record.date === today)
  }

  const getWeeklyStats = () => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const weeklyRecords = state.records.filter((record) => new Date(record.date) >= oneWeekAgo)

    return {
      totalEarnings: weeklyRecords.reduce(
        (sum, record) => sum + Object.values(record.earnings).reduce((s, v) => s + v, 0),
        0,
      ),
      totalFuelCost: weeklyRecords.reduce((sum, record) => sum + record.fuelCost, 0),
      totalNetProfit: weeklyRecords.reduce((sum, record) => sum + record.netProfit, 0),
      totalDistance: weeklyRecords.reduce((sum, record) => sum + record.distance, 0),
      recordCount: weeklyRecords.length,
    }
  }

  const getMonthlyStats = () => {
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

    const monthlyRecords = state.records.filter((record) => new Date(record.date) >= oneMonthAgo)

    return {
      totalEarnings: monthlyRecords.reduce(
        (sum, record) => sum + Object.values(record.earnings).reduce((s, v) => s + v, 0),
        0,
      ),
      totalFuelCost: monthlyRecords.reduce((sum, record) => sum + record.fuelCost, 0),
      totalNetProfit: monthlyRecords.reduce((sum, record) => sum + record.netProfit, 0),
      totalDistance: monthlyRecords.reduce((sum, record) => sum + record.distance, 0),
      recordCount: monthlyRecords.length,
    }
  }

  const clearAllData = async () => {
    try {
      await AsyncStorage.multiRemove(["records", "settings"])
      
      dispatch({ type: "CLEAR_ALL_DATA" })
    } catch (error) {
      console.error("Error clearing data:", error)
      throw error
    }
  }

  return (
    <DataContext.Provider
      value={{
        state,
        dispatch,
        addRecord,
        updateSettings,
        getTodayRecord,
        getWeeklyStats,
        getMonthlyStats,
        clearAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
