export interface Category {
  id: string;
  name: string;
  image_url: string;
  image_public_id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface CategoryFormState {
  name: string;
  image: File | null;
}
