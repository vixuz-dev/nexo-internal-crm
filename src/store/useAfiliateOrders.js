import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAfiliateOrders = create(persist(
  (set) => ({
    ordersSummary: null,
    setOrdersSummary: (ordersSummary) => set({ ordersSummary }),
    ordersPaginated: {
      orders: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      limit: 6,
    },
    setOrdersPaginated: (ordersPaginated) => set({ ordersPaginated }),
    pendingOrdersCount: 0,
    setPendingOrdersCount: (count) => set({ pendingOrdersCount: count }),
  }),
  {
    name: 'afiliate-orders', // clave en localStorage
  }
)); 