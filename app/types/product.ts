export type PackagingType = "bucket" | "box" | "vase";

export const PACKAGING_TYPES: { value: PackagingType; label: string }[] = [
  { value: "bucket", label: "Chelak" },
  { value: "box", label: "Quti" },
  { value: "vase", label: "Vaza" },
];

export interface Product {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  video_url_youtube: string | null;
  video_url_instagram: string | null;
  category_id: string;
  price_amount: number;
  price_currency: string;
  discount_amount?: number;
  final_price_amount: number;
  slug: string;
  is_available: boolean;
  rating: number;
  stock: number;
  sold_count: number;
  flower_types: string[];
  color: string | null;
  stem_count: number | null;
  packaging_type: PackagingType;
  freshness_lifespan: number;
  care_instructions: string | null;
  occasions: string[];
  allow_custom_card: null;
  compatible_addons: string[];
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}
