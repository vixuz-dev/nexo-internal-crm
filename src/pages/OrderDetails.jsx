import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import DashboardLayout from "../layouts/DashboardLayout";
import { useOrdersList } from "../store/useOrdersList";
import { ROUTES } from "../utils/routes";

const Field = ({ label, children }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-black/55 mb-1">
      {label}
    </p>
    <p className="text-sm md:text-base text-black font-medium leading-snug">
      {children}
    </p>
  </div>
);

const SectionCard = ({ title, children }) => (
  <div className="rounded-xl bg-white border border-neutral-200 p-6 shadow-sm">
    <h3 className="text-base md:text-lg font-semibold text-black border-b border-neutral-200 border-l-4 border-l-primary-500 pl-3 pb-3 mb-5 -ml-px">
      {title}
    </h3>
    {children}
  </div>
);

const OrderDetails = () => {
  const { id_order } = useParams();
  const navigate = useNavigate();
  const { orders } = useOrdersList();

  const order = useMemo(() => {
    const orderId = Number(id_order);
    const foundOrder = orders.find((o) => (o.order_id ?? o.orderId) === orderId);
    return foundOrder || null;
  }, [id_order, orders]);

  if (!order) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-neutral-200 px-4 py-8">
          <div className="w-full max-w-7xl mx-auto">
            <div className="mb-8 mt-4 rounded-xl bg-white border border-neutral-200 p-6 shadow-sm">
              <h2 className="text-2xl md:text-3xl font-semibold text-black mb-2">
                Pedido no encontrado
              </h2>
              <p className="text-black text-base md:text-lg mb-4">
                No se pudo encontrar la información del pedido con ID:{" "}
                {id_order}
              </p>
              <button
                onClick={() => navigate(ROUTES.ORDERS_LIST)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
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
    const dateOnlyMatch = String(dateString).match(/^(\d{4})-(\d{2})-(\d{2})/);
    const date = dateOnlyMatch
      ? new Date(Number(dateOnlyMatch[1]), Number(dateOnlyMatch[2]) - 1, Number(dateOnlyMatch[3]))
      : new Date(dateString);
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

  const getAttributesDisplayList = (attributes) => {
    if (!attributes) return [];
    const raw = Array.isArray(attributes)
      ? attributes
      : typeof attributes === "object" && attributes !== null
        ? Object.entries(attributes).map(([key, value]) => ({ name: key, value }))
        : [];
    return raw
      .map((a) => ({
        name: String(a?.name ?? a?.key ?? ""),
        value: String(a?.value ?? ""),
      }))
      .filter((a) => a.name !== "" || a.value !== "");
  };

  /** Badge sin relleno de color: borde y texto con acento primary / neutro */
  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || "";
    const base =
      "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-white border";
    if (statusLower === "pendiente de pago") {
      return (
        <span className={`${base} border-primary-300 text-primary-800`}>
          Pendiente de pago
        </span>
      );
    }
    if (statusLower === "pendiente") {
      return (
        <span className={`${base} border-primary-400 text-primary-700`}>
          Pendiente
        </span>
      );
    }
    if (statusLower === "en tránsito" || statusLower === "en transito") {
      return (
        <span className={`${base} border-primary-500 text-primary-800`}>
          En tránsito
        </span>
      );
    }
    if (statusLower === "entregado") {
      return (
        <span className={`${base} border-primary-600 text-primary-900`}>
          Entregado
        </span>
      );
    }
    return (
      <span className={`${base} border-neutral-300 text-black`}>
        {status || "—"}
      </span>
    );
  };

  const shipping = order.shipping_info ?? order.shippingInfo;
  const addressLine =
    (shipping?.address ??
      [
        order.shippingInfo?.deliveryStreet,
        order.shippingInfo?.deliveryExternalNum,
        order.shippingInfo?.deliveryInternalNum &&
          `Int. ${order.shippingInfo.deliveryInternalNum}`,
        order.shippingInfo?.deliveryNeighborhood,
        order.shippingInfo?.deliveryCity,
        order.shippingInfo?.deliveryState,
        order.shippingInfo?.deliveryZipCode,
      ]
        .filter(Boolean)
        .join(", ")) || "";

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-neutral-200 px-4 py-8">
        <div className="w-full max-w-7xl mx-auto space-y-6">
          <div className="rounded-xl bg-white border border-neutral-200 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl md:text-3xl font-semibold text-black mb-1 border-l-4 border-primary-500 pl-3">
                  Detalle del pedido
                </h2>
                <p className="text-sm text-primary-700 font-medium mb-5 pl-3">
                  Folio {order.folio || "Sin folio"} · ID {order.order_id ?? order.orderId ?? id_order}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pl-0 sm:pl-3">
                  <Field label="Cliente">
                    {(order.client_name ?? order.name) || "Sin nombre"}
                  </Field>
                  <Field label="Fecha del pedido">
                    {formatDateTime(order.created_at ?? order.date)}
                  </Field>
                  <Field label="Total">
                    <span className="text-primary-700">{formatCurrency(order.total)}</span>
                  </Field>
                </div>
              </div>
              <button
                onClick={() => navigate(ROUTES.ORDERS_LIST)}
                className="flex items-center gap-2 px-4 py-2 border border-primary-300 rounded-lg text-primary-800 bg-white hover:bg-primary-50 transition font-medium whitespace-nowrap shrink-0 shadow-sm"
                title="Volver al listado de pedidos"
              >
                <FiArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Regresar</span>
              </button>
            </div>
          </div>

          {shipping && (
            <SectionCard title="Información de envío">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Nombre del receptor">
                  {(shipping?.name_received ?? order.shippingInfo?.nameReceived) || "—"}
                </Field>
                <Field label="Teléfono">
                  {(
                    (shipping?.phone_received ?? order.shippingInfo?.phoneReceived) ??
                    ""
                  ) || "—"}
                </Field>
                <div className="md:col-span-2">
                  <Field label="Dirección">{addressLine || "—"}</Field>
                </div>
                {(shipping?.delivery_references ?? order.shippingInfo?.deliveryReferences) && (
                  <div className="md:col-span-2">
                    <Field label="Referencias">
                      {shipping?.delivery_references ?? order.shippingInfo?.deliveryReferences}
                    </Field>
                  </div>
                )}
                {(order.completed_date ?? order.deliveryDate) && (
                  <Field label="Fecha de entrega">
                    {formatDate(order.completed_date ?? order.deliveryDate)}
                  </Field>
                )}
              </div>
            </SectionCard>
          )}

          <div className="rounded-xl bg-white border border-neutral-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h3 className="text-base md:text-lg font-semibold text-black border-l-4 border-primary-500 pl-3">
                Productos del pedido
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-black font-bold">
                      Imagen
                    </th>
                    <th className="px-4 py-3 text-left text-black font-bold">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-left text-black font-bold">
                      Cantidad
                    </th>
                    <th className="px-4 py-3 text-left text-black font-bold">
                      Precio
                    </th>
                    <th className="px-4 py-3 text-left text-black font-bold">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-black font-bold">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-black font-bold">
                      Afiliado
                    </th>
                    <th className="px-4 py-3 text-left text-black font-bold">
                      Atributos
                    </th>
                    <th className="px-4 py-3 text-left text-black font-bold">
                      Fecha entrega
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {order.products && order.products.length > 0 ? (
                    order.products.map((product) => {
                      const attributesList = getAttributesDisplayList(product.attributes);
                      return (
                        <tr
                          key={product.order_detail_id}
                          className="hover:bg-neutral-50 transition"
                        >
                          <td className="px-4 py-3">
                            {product.variant_image_url ?? product.image ? (
                              <img
                                src={product.variant_image_url ?? product.image}
                                alt={product.product_name}
                                className="w-16 h-16 object-cover rounded-lg border border-neutral-200"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="w-16 h-16 bg-neutral-100 rounded-lg border border-neutral-200 flex items-center justify-center">
                                <span className="text-black text-xs">Sin imagen</span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-black font-medium">
                            {product.product_name || "—"}
                          </td>
                          <td className="px-4 py-3 text-black">
                            {product.product_quantity || 0}
                          </td>
                          <td className="px-4 py-3 text-black">
                            {formatCurrency(product.price)}
                          </td>
                          <td className="px-4 py-3 text-black font-medium">
                            {formatCurrency(product.total)}
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(product.status)}
                          </td>
                          <td className="px-4 py-3 text-black text-sm">
                            {product.affiliate || "—"}
                          </td>
                          <td className="px-4 py-3 text-black text-sm">
                            {attributesList.length > 0 ? (
                              <div className="flex flex-col gap-1">
                                {attributesList.map((item, idx) => (
                                  <span key={item.name || idx}>
                                    <span className="font-medium text-primary-800">
                                      {item.name}:
                                    </span>{" "}
                                    {item.value}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-4 py-3 text-black">
                            {product.delivery_date
                              ? formatDate(product.delivery_date)
                              : "—"}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-4 py-8 text-center text-black"
                      >
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
