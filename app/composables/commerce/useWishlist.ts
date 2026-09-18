import type { Wishlist } from "~/types/wishlist";

export function useWishlist() {
  const { get, post, delete: del } = useApi();

  const fetchWishlist = () => get<Wishlist>("/wishlist");
  const add = (productId: string) =>
    post<string>(`/wishlist/items/${productId}`);
  const remove = (productId: string) =>
    del<string>(`/wishlist/items/${productId}`);

  return { get: fetchWishlist, add, remove };
}
