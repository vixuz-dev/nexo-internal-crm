import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useOrdersList = create(persist(
  (set) => ({
    orders: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
    status: 'Todos',
    searchText: '',
    loading: false,
    error: null,

    setOrders: (data) => set((state) => ({
      orders: data.orders || [],
      totalItems: data.totalItems ?? state.totalItems,
      totalPages: data.totalPages ?? state.totalPages,
      ...(data.currentPage != null && { currentPage: data.currentPage }),
      loading: false,
      error: null,
    })),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error, loading: false }),
    setCurrentPage: (page) => set({ currentPage: page }),
    setLimit: (limit) => set({ limit, currentPage: 1 }),
    setStatus: (status) => set({ status, currentPage: 1 }),
    setSearchText: (text) => set({ searchText: text, currentPage: 1 }),
    clear: () => set({
      orders: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      limit: 10,
      status: 'Todos',
      searchText: '',
      loading: false,
      error: null,
    }),
  }),
  {
    name: 'orders-list', // clave en localStorage
  }
));

