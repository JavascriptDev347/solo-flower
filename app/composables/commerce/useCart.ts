import type { Cart } from "~/types/cart";

export function useCart() {
  const { get, post, put, delete: del } = useApi();

  const fetchCart = () => get<Cart>("/cart");
  const addItem = (productId: string, quantity: number) =>
    post<string>("/cart/items", { product_id: productId, quantity });
  const setQuantity = (productId: string, quantity: number) =>
    put<string>(`/cart/items/${productId}`, { quantity });
  const removeItem = (productId: string) =>
    del<string>(`/cart/items/${productId}`);

  return { get: fetchCart, addItem, setQuantity, removeItem };
}
