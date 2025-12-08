import React from 'react';
import HomeInvoicesStatus from './HomeInvoicesStatus';
import HomeInvoicesPie from './HomeInvoicesPie';

export default function HomeInvoicesOverview() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
      <div className="lg:col-span-5 h-full rounded-xl bg-white border border-neutral-200 p-4">
        <HomeInvoicesStatus />
      </div>
      <div className="lg:col-span-7 h-full rounded-xl bg-white border border-neutral-200 p-4">
        <HomeInvoicesPie />
      </div>
    </div>
  );
}


