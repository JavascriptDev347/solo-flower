import type { Event, AdminEvent } from "~/types/event";

export type { Event, AdminEvent };

export type Lang = "uz" | "eng" | "ru";

export interface CreateEventPayload {
  eyebrow_uz?: string;
  eyebrow_eng?: string;
  eyebrow_ru?: string;
  title_uz: string;
  title_eng: string;
  title_ru: string;
  subtitle_uz?: string;
  subtitle_eng?: string;
  subtitle_ru?: string;
  cta_uz?: string;
  cta_eng?: string;
  cta_ru?: string;
  category_id: string;
  is_root?: boolean;
  image: File;
}

export interface UpdateEventPayload {
  eyebrow_uz?: string;
  eyebrow_eng?: string;
  eyebrow_ru?: string;
  title_uz?: string;
  title_eng?: string;
  title_ru?: string;
  subtitle_uz?: string;
  subtitle_eng?: string;
  subtitle_ru?: string;
  cta_uz?: string;
  cta_eng?: string;
  cta_ru?: string;
  category_id?: string;
  is_root?: boolean;
}

export function useEvents() {
  const { get, put, delete: del, upload } = useApi();

  const list = (lang?: Lang) => get<Event[]>("/events", lang ? { lang } : undefined);

  const getById = (id: string, lang?: Lang) =>
    get<Event>(`/events/${id}`, lang ? { lang } : undefined);

  const fetchAllAdmin = () => get<AdminEvent[]>("/events/admin");

  const create = (payload: CreateEventPayload) => {
    const formData = new FormData();
    if (payload.eyebrow_uz) formData.append("eyebrow_uz", payload.eyebrow_uz);
    if (payload.eyebrow_eng) formData.append("eyebrow_eng", payload.eyebrow_eng);
    if (payload.eyebrow_ru) formData.append("eyebrow_ru", payload.eyebrow_ru);
    formData.append("title_uz", payload.title_uz);
    formData.append("title_eng", payload.title_eng);
    formData.append("title_ru", payload.title_ru);
    if (payload.subtitle_uz) formData.append("subtitle_uz", payload.subtitle_uz);
    if (payload.subtitle_eng) formData.append("subtitle_eng", payload.subtitle_eng);
    if (payload.subtitle_ru) formData.append("subtitle_ru", payload.subtitle_ru);
    if (payload.cta_uz) formData.append("cta_uz", payload.cta_uz);
    if (payload.cta_eng) formData.append("cta_eng", payload.cta_eng);
    if (payload.cta_ru) formData.append("cta_ru", payload.cta_ru);
    formData.append("category_id", payload.category_id);
    formData.append("is_root", payload.is_root ? "true" : "false");
    formData.append("image", payload.image);
    return upload<Event>("/events", formData);
  };

  const update = (id: string, payload: UpdateEventPayload) => {
    return put<null>(`/events/${id}`, payload);
  };

  const remove = (id: string) => {
    return del<string>(`/events/${id}`);
  };

  return { list, getById, fetchAllAdmin, create, update, remove };
}
