import React from 'react';

const ClientsUploadTable = ({ clients = [] }) => {
  if (clients.length === 0) {
    return (
      <div className="rounded-xl border-2 border-neutral-300 overflow-hidden bg-white">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-4">
            <svg
              className="w-24 h-24 text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <p className="text-neutral-700 font-poppinsRegular text-lg">
            No se han cargado clientes aún
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-200 overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-emerald-50 border-b border-emerald-200">
            <tr>
              <th className="px-4 py-3 text-left text-neutral-700 font-poppinsBold text-center">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-neutral-700 font-poppinsBold text-center">
                Teléfono celular
              </th>
              <th className="px-4 py-3 text-left text-neutral-700 font-poppinsBold text-center">
                Correo electrónico
              </th>
              <th className="px-4 py-3 text-left text-neutral-700 font-poppinsBold text-center">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-neutral-700 font-poppinsBold text-center">
                Calle
              </th>
              <th className="px-4 py-3 text-left text-neutral-700 font-poppinsBold text-center">
                Número exterior
              </th>
              <th className="px-4 py-3 text-left text-neutral-700 font-poppinsBold text-center">
                Número interior
              </th>
              <th className="px-4 py-3 text-left text-neutral-700 font-poppinsBold text-center">
                Colonia
              </th>
              <th className="px-4 py-3 text-left text-neutral-700 font-poppinsBold text-center">
                Municipio
              </th>
              <th className="px-4 py-3 text-left text-neutral-700 font-poppinsBold text-center">
                Estado (República)
              </th>
              <th className="px-4 py-3 text-left text-neutral-700 font-poppinsBold text-center">
                Código Postal
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {clients.map((client, index) => (
              <tr key={index} className="hover:bg-neutral-50 transition">
                <td className="px-4 py-3 text-neutral-900 text-center">{client.name || '-'}</td>
                <td className="px-4 py-3 text-neutral-600 text-center">{client.personal_phonenumber || '-'}</td>
                <td className="px-4 py-3 text-neutral-600 text-center">{client.email || '-'}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-sm ${client.status === 1 || client.status === '1' || client.status === 'Activo' ? 'text-emerald-700 font-poppinsMedium' : 'text-rose-700 font-poppinsMedium'}`}>
                    {client.status === 1 || client.status === '1' || client.status === 'Activo' ? 'Activo' : (client.status === 0 || client.status === '0' || client.status === 'Inactivo' ? 'Inactivo' : '-')}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-600 text-center">{client.street || '-'}</td>
                <td className="px-4 py-3 text-neutral-600 text-center">{client.external_number || '-'}</td>
                <td className="px-4 py-3 text-neutral-600 text-center">{client.internal_number || '-'}</td>
                <td className="px-4 py-3 text-neutral-600 text-center">{client.neighborhood || '-'}</td>
                <td className="px-4 py-3 text-neutral-600 text-center">{client.city || '-'}</td>
                <td className="px-4 py-3 text-neutral-600 text-center">{client.state || '-'}</td>
                <td className="px-4 py-3 text-neutral-600 text-center">{client.zip_code || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsUploadTable;

