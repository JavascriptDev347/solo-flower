import type { Category, AdminCategory } from "~/types/category";

export type { Category, AdminCategory };

export type Lang = "uz" | "eng" | "ru";

export interface UpdateCategoryPayload {
  name_uz?: string;
  name_eng?: string;
  name_ru?: string;
}

export function useCategories() {
  const { get, put, delete: del, upload } = useApi();

  const list = (search = "", lang?: Lang) => {
    const query: Record<string, any> = {};
    if (search) query.search = search;
    if (lang) query.lang = lang;
    return get<Category[]>("/categories", query);
  };

  const getById = (id: string, lang?: Lang) =>
    get<Category>(`/categories/${id}`, lang ? { lang } : undefined);

  const fetchAll = (search = "") => {
    return get<AdminCategory[]>(
      "/categories/admin",
      search ? { search } : undefined,
    );
  };

  const create = (payload: { name_uz: string; name_eng: string; name_ru: string; image: File }) => {
    const formData = new FormData();
    formData.append("name_uz", payload.name_uz);
    formData.append("name_eng", payload.name_eng);
    formData.append("name_ru", payload.name_ru);
    formData.append("image", payload.image);
    return upload<{ id: string }>("/categories", formData);
  };

  const update = (id: string, payload: UpdateCategoryPayload) => {
    return put<null>(`/categories/${id}`, payload);
  };

  const remove = (id: string) => {
    return del<string>(`/categories/${id}`);
  };

  return { list, getById, fetchAll, create, update, remove };
}
