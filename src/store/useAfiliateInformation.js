import { create } from 'zustand';
import { persist } from 'zustand/middleware';

function toCamelCase(user) {
  return {
    ...user,
    companyId: user.company_id,
  };
}

export const useAfiliateInformation = create(persist(
  (set) => ({
    user: null,
    companyInformation: null,
    clients: null,
    payedInvoices: null,
    pendingInvoices: null,
    canceledInvoices: null,
    invoicesDataTable: null,
    monthlyCollection: null,
    pendingOrders: null,
    invoices: null,
    setUser: (userResponse) => set({ user: toCamelCase(userResponse) }),
    clearUser: () => set({ user: null }),
    setCompanyInformation: (companyInformation) => set({ companyInformation }),
    setClients: (clients) => set({ clients }),
    setPayedInvoices: (payedInvoices) => set({ payedInvoices }),
    setPendingInvoices: (pendingInvoices) => set({ pendingInvoices }),
    setCanceledInvoices: (canceledInvoices) => set({ canceledInvoices }),
    setInvoicesDataTable: (invoicesDataTable) => set({ invoicesDataTable }),
    setMonthlyCollection: (monthlyCollection) => set({ monthlyCollection }),
    setPendingOrders: (pendingOrders) => set({ pendingOrders }),
    setInvoices: (invoices) => set({ invoices }),
  }),
  {
    name: 'user-information', // clave en localStorage
  }
));
