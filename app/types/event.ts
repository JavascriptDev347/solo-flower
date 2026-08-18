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
  deleted_at?: string | null;
}

export interface EventFormState {
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  category_id: string;
  is_root: boolean;
  image: File | null;
}
