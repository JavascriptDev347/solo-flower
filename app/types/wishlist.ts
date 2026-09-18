export interface WishlistItem {
  product_id: string;
  added_at: string;
}

export interface Wishlist {
  user_id: string;
  items: WishlistItem[];
}
