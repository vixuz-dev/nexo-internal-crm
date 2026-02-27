import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useInvoicesList = create(persist(
  (set) => ({
    invoices: [],
    loading: false,
    error: null,
    searchTerm: '',
    statusFilter: null,

    setInvoices: (invoices) => set({ invoices, loading: false, error: null }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error, loading: false }),
    setSearchTerm: (searchTerm) => set({ searchTerm }),
    setStatusFilter: (statusFilter) => set({ statusFilter }),
    clear: () => set({
      invoices: [],
      loading: false,
      error: null,
      searchTerm: '',
      statusFilter: null,
    }),
  }),
  {
    name: 'invoices-list', // clave en localStorage
  }
));

