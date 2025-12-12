import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useClientsList = create(persist(
  (set) => ({
    clients: [],
    loading: false,
    error: null,
    searchTerm: '',

    setClients: (clients) => set({ clients, loading: false, error: null }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error, loading: false }),
    setSearchTerm: (searchTerm) => set({ searchTerm }),
    // NOTA: addClient marcado para eliminación - solo se usa para agregar clientes nuevos al store
    // Uso actual: Solo en src/components/clients/ClientDetailsModal.jsx (línea 14: import, línea 255: uso)
    // addClient: (newClient) => set((state) => ({
    //   clients: [newClient, ...state.clients],
    // })),
    updateClientInList: (updatedClient) => set((state) => ({
      clients: state.clients.map(client => 
        client.id_client === updatedClient.id_client ? updatedClient : client
      ),
    })),
    clear: () => set({
      clients: [],
      loading: false,
      error: null,
      searchTerm: '',
    }),
  }),
  {
    name: 'clients-list', // clave en localStorage
  }
));

