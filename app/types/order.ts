export interface OrderItem {
  product_id: string;
  product_name: string;
  unit_price: number;
  currency: string;
  quantity: number;
}

export interface Order {
  id: string;
  user_id?: string;
  address: string;
  phone: string;
  note?: string;
  items: OrderItem[];
  payment_status: "unpaid" | "paid";
  delivery_status:
    | "preparing"
    | "handed_to_courier"
    | "delivered"
    | "cancelled";
  total_amount: number;
  total_currency: string;
  created_at: string;
}
