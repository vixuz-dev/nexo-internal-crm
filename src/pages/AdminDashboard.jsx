import React, { useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAfiliateInformation } from "../store/useAfiliateInformation";
import WelcomeMessage from "../components/sharedComponents/WelcomeMessage";
import { getInfoHome } from '../api/summaryApi';
import { useHomePageInformacion } from '../store/useHomePageInformacion';
import HomeSummaryCards from "../components/home/HomeSummaryCards";
import HomeInvoicesOverview from "../components/home/HomeInvoicesOverview";
import HomeLastInvoicesTable from "../components/home/HomeLastInvoicesTable";

const AdminDashboard = () => {
  const { companyInformation } = useAfiliateInformation();

  const { setHomeData, setLoading: setHomeLoading, setError: setHomeError } = useHomePageInformacion();

  // Cargar información del Home al ingresar al panel
  useEffect(() => {
    const fetchHome = async () => {
      setHomeLoading(true);
      try {
        const data = await getInfoHome();
        const body = data?.body || {};
        setHomeData({
          clients: body.clients || null,
          weeklyCollection: body.weeklyCollection || null,
          invoices: body.invoices || null,
          totalInvoices: body.totalInvoices || null,
          monthlySales: body.monthlySales || null,
          lastInvoices: Array.isArray(body.lastInvoices) ? body.lastInvoices : [],
        });
        setHomeLoading(false);
      } catch (err) {
        setHomeError(err?.message || 'Error al cargar información de inicio');
        setHomeLoading(false);
      }
    };
    fetchHome();
  }, [setHomeData, setHomeLoading, setHomeError]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-neutral-200 px-4 py-8">
        <div className="w-full max-w-5xl mx-auto">
          <WelcomeMessage companyInformation={companyInformation} />

          {/* Resumen Home */}
          <div className="mt-6 space-y-4">
            <HomeSummaryCards />
            <HomeInvoicesOverview />
            <HomeLastInvoicesTable />
          </div>

          
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

