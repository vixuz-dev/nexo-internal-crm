import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useInvoicesList = create(persist(
  (set) => ({
    invoices: [],
    loading: false,
    error: null,
    searchTerm: '',
    statusFilter: null, // null = todos, 1 = pendiente, 2 = pagada, 0 = cancelada
    currentPage: 1,
    itemsPerPage: 5,

    setInvoices: (invoices) => set({ invoices, loading: false, error: null }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error, loading: false }),
    setSearchTerm: (searchTerm) => set({ searchTerm }),
    setStatusFilter: (statusFilter) => set({ statusFilter, currentPage: 1 }),
    setCurrentPage: (page) => set({ currentPage: page }),
    setItemsPerPage: (itemsPerPage) => set({ itemsPerPage, currentPage: 1 }),
    clear: () => set({
      invoices: [],
      loading: false,
      error: null,
      searchTerm: '',
      statusFilter: null,
      currentPage: 1,
      itemsPerPage: 5,
    }),
  }),
  {
    name: 'invoices-list', // clave en localStorage
  }
));

