import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useCobranzaSummary } from '../store/useCobranzaSummary';
import CobranzaTodayCards from '../components/cobranza/CobranzaTodayCards';
import CobranzaWeeklySummary from '../components/cobranza/CobranzaWeeklySummary';
import DateRangePicker from '../components/sharedComponents/DateRangePicker';
import CobranzaReportTable from '../components/cobranza/CobranzaReportTable';

const CobranzaSummary = () => {
  const { 
    todayTotal, 
    todayProducts, 
    weeklyTotal, 
    reportData, 
    startDate, 
    endDate,
    setTodayData,
    setWeeklyTotal,
    setReportData,
    setDateRange,
    setLoading,
    setError,
    loading,
    error 
  } = useCobranzaSummary();

  // Calcular fechas por defecto (hoy y hace 7 días)
  const getDefaultDates = () => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    return {
      end: today.toISOString().split('T')[0],
      start: sevenDaysAgo.toISOString().split('T')[0],
    };
  };

  // Inicializar fechas si no existen
  useEffect(() => {
    if (!startDate || !endDate) {
      const defaults = getDefaultDates();
      setDateRange(defaults.start, defaults.end);
    }
  }, [startDate, endDate, setDateRange]);

  // Calcular datos del día de hoy (simulado hasta que tengamos el endpoint)
  useEffect(() => {
    // TODO: Llamar al endpoint cuando esté disponible
    // Por ahora, calculamos datos simulados basados en reportData
    const today = new Date().toISOString().split('T')[0];
    const todayData = reportData.filter(item => {
      const itemDate = new Date(item.date).toISOString().split('T')[0];
      return itemDate === today;
    });

    const total = todayData.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const products = todayData.length;

    setTodayData(total, products);
  }, [reportData, setTodayData]);

  // Calcular resumen semanal (simulado hasta que tengamos el endpoint)
  useEffect(() => {
    // TODO: Llamar al endpoint cuando esté disponible
    // Por ahora, calculamos datos simulados basados en reportData
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);

    const weeklyData = reportData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= weekAgo && itemDate <= today;
    });

    const total = weeklyData.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    setWeeklyTotal(total);
  }, [reportData, setWeeklyTotal]);

  // Filtrar datos del reporte por rango de fechas
  const filteredReportData = useMemo(() => {
    if (!startDate || !endDate) return reportData;
    
    return reportData.filter(item => {
      const itemDate = new Date(item.date).toISOString().split('T')[0];
      return itemDate >= startDate && itemDate <= endDate;
    });
  }, [reportData, startDate, endDate]);

  const handleStartDateChange = (date) => {
    setDateRange(date, endDate || getDefaultDates().end);
  };

  const handleEndDateChange = (date) => {
    setDateRange(startDate || getDefaultDates().start, date);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-neutral-200 px-4 py-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Encabezado con título y descripción */}
          <div className="mb-8 mt-4">
            <h2 className="text-2xl md:text-3xl font-poppinsMedium text-neutral-900 mb-2">
              Resumen de Cobranza
            </h2>
            <p className="text-neutral-600 font-poppinsRegular text-base md:text-lg">
              Visualiza la cobranza del día y genera reportes por rango de fechas.
            </p>
          </div>

          {/* Cobranza del día de hoy */}
          <CobranzaTodayCards 
            todayTotal={todayTotal} 
            todayProducts={todayProducts}
            loading={loading}
          />

          {/* Resumen de cobranza semanal */}
          <CobranzaWeeklySummary 
            weeklyTotal={weeklyTotal}
            loading={loading}
          />

          {/* Reporte de cobranza */}
          <div className="rounded-xl bg-white border border-neutral-200 p-4">
            <h3 className="text-lg font-poppinsBold text-neutral-900 mb-4">
              Reporte de Cobranza
            </h3>
            
            {/* Selector de rango de fechas */}
            <div className="mb-6">
              <DateRangePicker
                startDate={startDate || getDefaultDates().start}
                endDate={endDate || getDefaultDates().end}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
              />
            </div>

            {/* Tabla de reporte */}
            {error ? (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                <p className="text-red-800">{error}</p>
              </div>
            ) : (
              <CobranzaReportTable 
                data={filteredReportData}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CobranzaSummary;


