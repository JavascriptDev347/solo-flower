import type { Event } from "~/types/event";

export type { Event };

export interface CreateEventPayload {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  cta?: string;
  category_id: string;
  is_root?: boolean;
  image: File;
}

export interface UpdateEventPayload {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  cta?: string;
  category_id?: string;
  is_root?: boolean;
}

export function useEvents() {
  const { get, put, delete: del, upload } = useApi();

  const list = () => get<Event[]>("/events");

  const getById = (id: string) => get<Event>(`/events/${id}`);

  const fetchAllAdmin = () => get<Event[]>("/events/admin");

  const create = (payload: CreateEventPayload) => {
    const formData = new FormData();
    if (payload.eyebrow) formData.append("eyebrow", payload.eyebrow);
    formData.append("title", payload.title);
    if (payload.subtitle) formData.append("subtitle", payload.subtitle);
    if (payload.cta) formData.append("cta", payload.cta);
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
