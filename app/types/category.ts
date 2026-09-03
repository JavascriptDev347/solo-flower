export interface Category {
  id: string;
  name: string;
  image_url: string;
  image_public_id: string;
  created_at: string;
  updated_at: string;
}

// Admin ro'yxati (/categories/admin) har doim barcha 3 tilni birga qaytaradi
export interface AdminCategory {
  id: string;
  name_uz: string;
  name_eng: string;
  name_ru: string;
  image_url: string;
  image_public_id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}
