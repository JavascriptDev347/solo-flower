export interface Product {
  id: string;
  name: string;
  description: string | null;
  tag?: string | null;
  images: string[];
  category_id: string;
  price_amount: number;
  price_currency: string;
  discount_amount?: number;
  final_price_amount?: number | null;
  slug: string;
  is_available: boolean;
  rating: number;
  stock: number;
  sold_count: number;
  created_at: string;
  updated_at: string;
}

// Admin ro'yxati (/products/admin) har doim barcha 3 tilni birga qaytaradi
export interface AdminProduct {
  id: string;
  name_uz: string;
  name_eng: string;
  name_ru: string;
  description_uz: string | null;
  description_eng: string | null;
  description_ru: string | null;
  tag_uz?: string | null;
  tag_eng?: string | null;
  tag_ru?: string | null;
  images: string[];
  category_id: string;
  price_amount: number;
  price_currency: string;
  discount_amount?: number;
  final_price_amount?: number | null;
  slug: string;
  is_available: boolean;
  rating: number;
  stock: number;
  sold_count: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}
