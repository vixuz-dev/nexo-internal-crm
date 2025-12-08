import React from 'react';

// Skeleton base con animación
const SkeletonBase = ({ className = "", children, ...props }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-[length:200%_100%] ${className}`}
    {...props}
  >
    {children}
  </div>
);

// Skeleton para tarjetas de estadísticas
export const StatCardSkeleton = () => (
  <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm border border-neutral-200">
    <div className="p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-neutral-200 animate-pulse" />
      <div className="flex-1 min-w-0">
        <div className="h-4 w-24 bg-neutral-200 rounded mb-2 animate-pulse" />
        <div className="h-8 w-16 bg-neutral-200 rounded animate-pulse" />
      </div>
    </div>
  </div>
);

// Skeleton para tarjetas de bienvenida
export const WelcomeCardSkeleton = () => (
  <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white shadow-lg">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-6 w-48 bg-white/20 rounded mb-2 animate-pulse" />
        <div className="h-4 w-64 bg-white/20 rounded animate-pulse" />
      </div>
      <div className="w-16 h-16 bg-white/20 rounded-full animate-pulse" />
    </div>
  </div>
);

// Skeleton para tarjetas de resumen
export const SummaryCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow p-6 border border-neutral-200">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-neutral-200 animate-pulse" />
      <div>
        <div className="h-5 w-32 bg-neutral-200 rounded mb-1 animate-pulse" />
        <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-4 w-full bg-neutral-200 rounded animate-pulse" />
      <div className="h-4 w-3/4 bg-neutral-200 rounded animate-pulse" />
    </div>
  </div>
);

// Skeleton para gráficos
export const ChartSkeleton = ({ height = "320px" }) => (
  <div className="bg-white rounded-2xl shadow p-6 border border-neutral-200">
    <div className="h-5 w-48 bg-neutral-200 rounded mb-4 animate-pulse" />
    <div 
      className="w-full bg-neutral-200 rounded animate-pulse" 
      style={{ height }}
    />
  </div>
);

// Skeleton para tablas
export const TableSkeleton = ({ rows = 5, columns = 6 }) => (
  <div className="bg-white rounded-2xl shadow p-6 border border-neutral-200">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-neutral-200 animate-pulse" />
      <div>
        <div className="h-5 w-48 bg-neutral-200 rounded mb-1 animate-pulse" />
        <div className="h-4 w-64 bg-neutral-200 rounded animate-pulse" />
      </div>
    </div>
    
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-neutral-200">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="py-3 px-4">
                <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="py-4 px-4">
                  <div className="h-4 w-16 bg-neutral-200 rounded animate-pulse" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Skeleton para la barra de filtros
export const FilterBarSkeleton = () => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200 mb-6">
    <div className="flex flex-wrap gap-4 items-center">
      <div className="h-10 w-64 bg-neutral-200 rounded-lg animate-pulse" />
      <div className="h-10 w-48 bg-neutral-200 rounded-lg animate-pulse" />
      <div className="h-10 w-40 bg-neutral-200 rounded-lg animate-pulse" />
      <div className="h-10 w-40 bg-neutral-200 rounded-lg animate-pulse" />
    </div>
  </div>
);

// Skeleton para paginación
export const PaginationSkeleton = () => (
  <div className="flex justify-center items-center gap-2 mt-8">
    <div className="h-10 w-10 bg-neutral-200 rounded-lg animate-pulse" />
    <div className="h-10 w-10 bg-neutral-200 rounded-lg animate-pulse" />
    <div className="h-10 w-10 bg-neutral-200 rounded-lg animate-pulse" />
    <div className="h-10 w-10 bg-neutral-200 rounded-lg animate-pulse" />
    <div className="h-10 w-10 bg-neutral-200 rounded-lg animate-pulse" />
  </div>
);

// Skeleton para el layout general
export const DashboardLayoutSkeleton = () => (
  <div className="min-h-screen bg-neutral-100 px-3 py-8">
    <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto">
      <div className="h-8 w-48 bg-neutral-200 rounded mb-2 animate-pulse" />
      <div className="h-4 w-64 bg-neutral-200 rounded mb-8 animate-pulse" />
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      
      <TableSkeleton rows={10} columns={6} />
    </div>
  </div>
);

// Home: grid de resumen (3 tarjetas)
export const HomeSummaryGridSkeleton = () => (
  <div className="rounded-xl bg-white border border-neutral-200 p-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-5"><SummaryCardSkeleton /></div>
      <div className="lg:col-span-4"><SummaryCardSkeleton /></div>
      <div className="lg:col-span-3"><SummaryCardSkeleton /></div>
    </div>
  </div>
);

// Home: pila de estado de facturas (3 tarjetas)
export const HomeInvoicesStatusSkeleton = () => (
  <div className="space-y-4">
    <SummaryCardSkeleton />
    <SummaryCardSkeleton />
    <SummaryCardSkeleton />
  </div>
);

// Home: contenedor de pie chart
export const HomePieSkeleton = () => (
  <div className="h-full w-full rounded-xl border-2 border-neutral-300 bg-white flex flex-col">
    <div className="px-4 py-3 border-b border-neutral-200">
      <div className="h-5 w-56 bg-neutral-200 rounded animate-pulse" />
    </div>
    <div className="flex-1 p-2">
      <div className="w-full h-full bg-neutral-200 rounded animate-pulse" />
    </div>
  </div>
);

export default {
  StatCardSkeleton,
  WelcomeCardSkeleton,
  SummaryCardSkeleton,
  ChartSkeleton,
  TableSkeleton,
  FilterBarSkeleton,
  PaginationSkeleton,
  DashboardLayoutSkeleton,
  HomeSummaryGridSkeleton,
  HomeInvoicesStatusSkeleton,
  HomePieSkeleton,
};
