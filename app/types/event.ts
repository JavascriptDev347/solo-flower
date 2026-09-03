export interface Event {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  category_id: string;
  is_root: boolean;
  created_at: string;
  updated_at: string;
}

// Admin ro'yxati (/events/admin) har doim barcha 3 tilni birga qaytaradi
export interface AdminEvent {
  id: string;
  eyebrow_uz: string;
  eyebrow_eng: string;
  eyebrow_ru: string;
  title_uz: string;
  title_eng: string;
  title_ru: string;
  subtitle_uz: string;
  subtitle_eng: string;
  subtitle_ru: string;
  cta_uz: string;
  cta_eng: string;
  cta_ru: string;
  image: string;
  category_id: string;
  is_root: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}
