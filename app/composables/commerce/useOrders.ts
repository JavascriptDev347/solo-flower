import type { Order } from "~/types/order";

export interface CheckoutPayload {
  address: string;
  phone: string;
  note?: string;
}

export interface ManualOrderPayload {
  address: string;
  phone: string;
  note?: string;
  items: { product_id: string; quantity: number }[];
  payment_status: "unpaid" | "paid";
}

export function useOrders() {
  const { get, post, patch } = useApi();

  const checkout = (payload: CheckoutPayload) =>
    post<Order>("/checkout", payload);

  const list = () => get<Order[]>("/orders");

  const getById = (id: string) => get<Order>(`/orders/${id}`);

  const listAdmin = () => get<Order[]>("/orders/admin");

  const updatePaymentStatus = (id: string, status: "unpaid" | "paid") =>
    patch<Order>(`/orders/${id}/payment-status`, { status });

  const updateDeliveryStatus = (
    id: string,
    status: "preparing" | "handed_to_courier" | "delivered",
  ) => patch<Order>(`/orders/${id}/delivery-status`, { status });

  const createManual = (payload: ManualOrderPayload) =>
    post<Order>("/admin/orders", payload);

  const cancel = (id: string) =>
    patch<Order>(`/admin/orders/${id}/cancel`);

  return {
    checkout,
    list,
    getById,
    listAdmin,
    updatePaymentStatus,
    updateDeliveryStatus,
    createManual,
    cancel,
  };
}
