import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useHomePageInformacion = create(persist(
  (set) => ({
    loading: false,
    error: null,
    clients: null,
    weeklyCollection: null,
    invoices: null,
    totalInvoices: null,
    monthlySales: null,
    lastInvoices: [],

    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setHomeData: ({ clients, weeklyCollection, invoices, totalInvoices, monthlySales, lastInvoices }) =>
      set({ clients, weeklyCollection, invoices, totalInvoices, monthlySales, lastInvoices }),
    clear: () => set({
      loading: false,
      error: null,
      clients: null,
      weeklyCollection: null,
      invoices: null,
      totalInvoices: null,
      monthlySales: null,
      lastInvoices: [],
    }),
  }),
  {
    name: 'home-page-information',
  }
));


