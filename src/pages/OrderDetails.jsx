import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiFileText, FiUser, FiCalendar, FiDollarSign, FiPhone, FiMapPin, FiInfo, FiTruck } from "react-icons/fi";
import DashboardLayout from "../layouts/DashboardLayout";
import { useOrdersList } from "../store/useOrdersList";
import { ROUTES } from "../utils/routes";

const OrderDetails = () => {
  const { id_order } = useParams();
  const navigate = useNavigate();
  const { orders } = useOrdersList();

  // Obtener pedido del store usando el ID de la URL
  const order = useMemo(() => {
    const orderId = Number(id_order);
    const foundOrder = orders.find((o) => o.orderId === orderId);
    return foundOrder || null;
  }, [id_order, orders]);

  // Si no se encuentra el pedido, mostrar mensaje o redirigir
  if (!order) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-neutral-200 px-4 py-8">
          <div className="w-full max-w-7xl mx-auto">
            <div className="mb-8 mt-4">
              <h2 className="text-2xl md:text-3xl font-poppinsMedium text-neutral-900 mb-2">
                Pedido no encontrado
              </h2>
              <p className="text-neutral-600 font-poppinsRegular text-base md:text-lg mb-4">
                No se pudo encontrar la información del pedido con ID:{" "}
                {id_order}
              </p>
              <button
                onClick={() => navigate(ROUTES.ORDERS_LIST)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-poppinsMedium"
              >
                Volver al listado
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const formatCurrency = (amount) => {
    const num = Number(amount || 0);
    return num.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const parseAttributes = (attributesString) => {
    if (!attributesString) return {};
    try {
      return JSON.parse(attributesString);
    } catch {
      return {};
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'pendiente') {
      return <span className="px-2 py-1 rounded text-xs font-poppinsMedium bg-amber-100 text-amber-800">Pendiente</span>;
    } else if (statusLower === 'seminuevo') {
      return <span className="px-2 py-1 rounded text-xs font-poppinsMedium bg-blue-100 text-blue-800">Seminuevo</span>;
    } else if (statusLower === 'completado') {
      return <span className="px-2 py-1 rounded text-xs font-poppinsMedium bg-emerald-100 text-emerald-800">Completado</span>;
    }
    return <span className="px-2 py-1 rounded text-xs font-poppinsMedium bg-neutral-100 text-neutral-800">{status || '-'}</span>;
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-neutral-200 px-4 py-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Encabezado con título, folio, cliente y botón de regresar */}
          <div className="mb-6 mt-4 rounded-xl bg-primary-50 border border-primary-200 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-poppinsBold font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <FiFileText className="h-6 w-6 text-primary-600" />
                  Detalle del pedido
                </h2>
                {/* Información resumida del pedido */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-neutral-700">
                    <FiFileText className="h-5 w-5 text-primary-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-neutral-600 font-poppinsMedium">Folio</p>
                      <p className="text-sm font-poppinsBold text-neutral-900">{order.folio || "Sin folio"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-700">
                    <FiUser className="h-5 w-5 text-primary-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-neutral-600 font-poppinsMedium">Cliente</p>
                      <p className="text-sm font-poppinsBold text-neutral-900">{order.name || "Sin nombre"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-700">
                    <FiCalendar className="h-5 w-5 text-primary-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-neutral-600 font-poppinsMedium">Fecha</p>
                      <p className="text-sm font-poppinsBold text-neutral-900">{formatDateTime(order.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-700">
                    <FiDollarSign className="h-5 w-5 text-primary-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-neutral-600 font-poppinsMedium">Total</p>
                      <p className="text-sm font-poppinsBold text-neutral-900">{formatCurrency(order.total)}</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Botón de regresar */}
              <button
                onClick={() => navigate(ROUTES.ORDERS_LIST)}
                className="flex items-center gap-2 px-4 py-2 border border-highlight-500 rounded-lg text-neutral-700 hover:bg-highlight-100 transition font-poppinsMedium whitespace-nowrap"
                title="Volver al listado de pedidos"
              >
                <FiArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Regresar</span>
              </button>
            </div>
          </div>

          {/* Información de envío */}
          {order.shippingInfo && (
            <div className="mb-6 rounded-xl bg-highlight-50 border border-highlight-200 p-6">
              <h3 className="text-lg md:text-xl font-poppinsBold font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <FiTruck className="h-5 w-5 text-highlight-600" />
                Información de envío
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <FiUser className="h-5 w-5 text-highlight-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600 font-poppinsMedium mb-1">Nombre del receptor</p>
                    <p className="text-neutral-900 font-poppinsRegular">{order.shippingInfo.nameReceived || "-"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiPhone className="h-5 w-5 text-highlight-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600 font-poppinsMedium mb-1">Teléfono</p>
                    <p className="text-neutral-900 font-poppinsRegular">{order.shippingInfo.phoneReceived || "-"}</p>
                  </div>
                </div>
                <div className="md:col-span-2 flex items-start gap-3">
                  <FiMapPin className="h-5 w-5 text-highlight-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600 font-poppinsMedium mb-1">Dirección</p>
                    <p className="text-neutral-900 font-poppinsRegular">
                      {[
                        order.shippingInfo.deliveryStreet,
                        order.shippingInfo.deliveryExternalNum,
                        order.shippingInfo.deliveryInternalNum && `Int. ${order.shippingInfo.deliveryInternalNum}`,
                        order.shippingInfo.deliveryNeighborhood,
                        order.shippingInfo.deliveryCity,
                        order.shippingInfo.deliveryState,
                        order.shippingInfo.deliveryZipCode
                      ].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
                {order.shippingInfo.deliveryReferences && (
                  <div className="md:col-span-2 flex items-start gap-3">
                    <FiInfo className="h-5 w-5 text-highlight-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-neutral-600 font-poppinsMedium mb-1">Referencias</p>
                      <p className="text-neutral-900 font-poppinsRegular">{order.shippingInfo.deliveryReferences}</p>
                    </div>
                  </div>
                )}
                {order.deliveryDate && (
                  <div className="flex items-start gap-3">
                    <FiCalendar className="h-5 w-5 text-highlight-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-neutral-600 font-poppinsMedium mb-1">Fecha de entrega</p>
                      <p className="text-neutral-900 font-poppinsRegular">{formatDate(order.deliveryDate)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tabla de productos */}
          <div className="rounded-xl bg-white border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h3 className="text-lg md:text-xl font-poppinsBold text-neutral-900">
                Productos del pedido
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-neutral-700 font-poppinsBold">Imagen</th>
                    <th className="px-4 py-3 text-left text-neutral-700 font-poppinsBold">Producto</th>
                    <th className="px-4 py-3 text-left text-neutral-700 font-poppinsBold">Cantidad</th>
                    <th className="px-4 py-3 text-left text-neutral-700 font-poppinsBold">Precio</th>
                    <th className="px-4 py-3 text-left text-neutral-700 font-poppinsBold">Total</th>
                    <th className="px-4 py-3 text-left text-neutral-700 font-poppinsBold">Estado</th>
                    <th className="px-4 py-3 text-left text-neutral-700 font-poppinsBold">Afiliado</th>
                    <th className="px-4 py-3 text-left text-neutral-700 font-poppinsBold">Atributos</th>
                    <th className="px-4 py-3 text-left text-neutral-700 font-poppinsBold">Fecha entrega</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {order.products && order.products.length > 0 ? (
                    order.products.map((product) => {
                      const attributes = parseAttributes(product.attributes);
                      return (
                        <tr key={product.order_detail_id} className="hover:bg-neutral-50 transition">
                          <td className="px-4 py-3">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.product_name}
                                className="w-16 h-16 object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center">
                                <span className="text-neutral-400 text-xs">Sin imagen</span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-neutral-900 font-poppinsMedium">
                            {product.product_name || "-"}
                          </td>
                          <td className="px-4 py-3 text-neutral-600">
                            {product.product_quantity || 0}
                          </td>
                          <td className="px-4 py-3 text-neutral-900">
                            {formatCurrency(product.price)}
                          </td>
                          <td className="px-4 py-3 text-neutral-900 font-poppinsMedium">
                            {formatCurrency(product.total)}
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(product.status)}
                          </td>
                          <td className="px-4 py-3 text-neutral-600 text-sm">
                            {product.affiliate || "-"}
                          </td>
                          <td className="px-4 py-3 text-neutral-600 text-sm">
                            {Object.keys(attributes).length > 0 ? (
                              <div className="flex flex-col gap-1">
                                {Object.entries(attributes).map(([key, value]) => (
                                  <span key={key}>
                                    <span className="font-poppinsMedium">{key}:</span> {value}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-4 py-3 text-neutral-600">
                            {product.delivery_date ? formatDate(product.delivery_date) : "-"}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-neutral-600">
                        No hay productos en este pedido
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrderDetails;

