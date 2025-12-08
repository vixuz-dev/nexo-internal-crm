import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAffiliatesList = create(persist(
  (set) => ({
    affiliates: [],
    loading: false,
    error: null,
    searchTerm: '',

    setAffiliates: (affiliates) => set({ affiliates, loading: false, error: null }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error, loading: false }),
    setSearchTerm: (searchTerm) => set({ searchTerm }),
    clear: () => set({
      affiliates: [],
      loading: false,
      error: null,
      searchTerm: '',
    }),
  }),
  {
    name: 'affiliates-list', // clave en localStorage
  }
));

