export interface CartItem {
  product_id: string;
  product_name: string;
  unit_price: number;
  discount_price?: number;
  currency: string;
  quantity: number;
  subtotal: number;
  available: boolean;
}

export interface Cart {
  items: CartItem[];
  total_items: number;
  total_price: number;
}
