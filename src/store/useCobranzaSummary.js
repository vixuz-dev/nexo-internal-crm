import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCobranzaSummary = create(persist(
  (set) => ({
    todayTotal: 0,
    todayProducts: 0,
    weeklyTotal: 0,
    reportData: [],
    startDate: null,
    endDate: null,
    loading: false,
    error: null,

    setTodayData: (total, products) => set({ todayTotal: total, todayProducts: products }),
    setWeeklyTotal: (total) => set({ weeklyTotal: total }),
    setReportData: (data) => set({ reportData: data }),
    setDateRange: (startDate, endDate) => set({ startDate, endDate }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error, loading: false }),
    clear: () => set({
      todayTotal: 0,
      todayProducts: 0,
      weeklyTotal: 0,
      reportData: [],
      startDate: null,
      endDate: null,
      loading: false,
      error: null,
    }),
  }),
  {
    name: 'cobranza-summary', // clave en localStorage
  }
));


