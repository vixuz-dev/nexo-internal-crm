import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import FileUpload from '../components/clients/FileUpload';
import ClientsUploadTable from '../components/clients/ClientsUploadTable';

const ClientsUpload = () => {
  const [excelFile, setExcelFile] = useState(null);
  const [clientsData, setClientsData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (file) => {
    setExcelFile(file);
    if (file) {
      processExcelFile(file);
    } else {
      setClientsData([]);
    }
  };

  const processExcelFile = async (file) => {
    setIsProcessing(true);
    try {
      // Importar xlsx dinámicamente
      const XLSX = await import('xlsx');
      
      // Leer el archivo
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Obtener la primera hoja
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convertir a JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length === 0) {
            alert('El archivo Excel está vacío');
            setClientsData([]);
            setIsProcessing(false);
            return;
          }

          // Asumir que la primera fila son los encabezados
          const headers = jsonData[0].map(h => String(h || '').toLowerCase().trim());
          
          // Mapear los encabezados a nuestros campos (exactamente como en el modal)
          const headerMap = {
            // Información General
            'nombre': 'name',
            'teléfono celular': 'personal_phonenumber',
            'telefono celular': 'personal_phonenumber',
            'celular': 'personal_phonenumber',
            'correo electrónico': 'email',
            'correo electronico': 'email',
            'email': 'email',
            'estado': 'status', // Estado Activo/Inactivo
            'status': 'status',
            // Dirección
            'calle': 'street',
            'numero exterior': 'external_number',
            'número exterior': 'external_number',
            'no. exterior': 'external_number',
            'numero interior': 'internal_number',
            'número interior': 'internal_number',
            'no. interior': 'internal_number',
            'colonia': 'neighborhood',
            'municipio': 'city',
            'ciudad': 'city',
            'estado dirección': 'state', // Estado de la república
            'estado direccion': 'state',
            'estado república': 'state',
            'estado republica': 'state',
            'codigo postal': 'zip_code',
            'código postal': 'zip_code',
            'cp': 'zip_code',
          };

          // Procesar las filas de datos
          const processedClients = jsonData.slice(1).map((row, rowIndex) => {
            const client = {};
            headers.forEach((header, colIndex) => {
              const mappedField = headerMap[header];
              let value = row[colIndex] ? String(row[colIndex]).trim() : '';
              
              if (mappedField) {
                // Normalizar el campo status (Activo/Inactivo)
                if (mappedField === 'status') {
                  const statusLower = value.toLowerCase();
                  if (statusLower === 'activo' || statusLower === '1' || statusLower === 'active') {
                    client[mappedField] = 1;
                  } else if (statusLower === 'inactivo' || statusLower === '0' || statusLower === 'inactive') {
                    client[mappedField] = 0;
                  } else {
                    // Por defecto, activo si no se especifica
                    client[mappedField] = value ? 1 : 1;
                  }
                } else {
                  client[mappedField] = value;
                }
              } else {
                // Mantener el campo original si no está mapeado
                client[header] = value;
              }
            });
            
            // Asegurar que status tenga un valor por defecto (1 = Activo)
            if (client.status === undefined || client.status === '') {
              client.status = 1;
            }
            
            return client;
          }).filter(client => {
            // Filtrar filas vacías
            return Object.values(client).some(val => val && val.toString().trim() !== '');
          });

          setClientsData(processedClients);
        } catch (error) {
          console.error('Error procesando Excel:', error);
          alert('Error al procesar el archivo Excel. Por favor, verifica que el formato sea correcto.');
          setClientsData([]);
        } finally {
          setIsProcessing(false);
        }
      };
      
      reader.onerror = () => {
        alert('Error al leer el archivo');
        setIsProcessing(false);
        setClientsData([]);
      };
      
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el archivo. Asegúrate de que la librería xlsx esté instalada.');
      setIsProcessing(false);
      setClientsData([]);
    }
  };

  const handleAddClients = () => {
    if (clientsData.length === 0) {
      alert('No hay clientes para agregar. Por favor, sube un archivo Excel válido.');
      return;
    }
    // TODO: Implementar llamada a la API para crear clientes masivamente
    console.log('Agregar clientes:', clientsData);
    alert(`Se agregarán ${clientsData.length} clientes. Esta funcionalidad se implementará próximamente.`);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-neutral-200 px-4 py-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Encabezado con título y descripción */}
          <div className="mb-8 mt-4">
            <h2 className="text-2xl md:text-3xl font-poppinsMedium text-neutral-900 mb-2">
              Agregar clientes por excel
            </h2>
            <p className="text-neutral-600 font-poppinsRegular text-base md:text-lg">
              Sube un archivo Excel para agregar clientes de manera masiva al sistema.
            </p>
          </div>

          {/* Área de carga de archivo */}
          <div className="mb-6">
            <FileUpload onFileSelect={handleFileSelect} />
          </div>

          {/* Indicador de procesamiento */}
          {isProcessing && (
            <div className="mb-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
              <p className="text-blue-800 font-poppinsRegular">
                Procesando archivo Excel...
              </p>
            </div>
          )}

          {/* Tabla de clientes procesados */}
          <div className="mb-6">
            <ClientsUploadTable clients={clientsData} />
          </div>

          {/* Botón para agregar clientes */}
          <div className="flex justify-center">
            <button
              onClick={handleAddClients}
              disabled={clientsData.length === 0 || isProcessing}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-poppinsMedium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              Agregar clientes
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientsUpload;

