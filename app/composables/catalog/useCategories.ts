import type { Category } from "~/types/category";

export type { Category };

export interface CreateCategoryPayload {
  name: string;
  image?: File;
}

export function useCategories() {
  const { get, put, delete: del, upload } = useApi();
  const list = () => get<Category[]>("/categories");

  const getById = (id: string) => get<Category>(`/categories/${id}`);

  const fetchAll = (search = "") => {
    return get<Category[]>(
      "/categories/admin",
      search ? { search } : undefined,
    );
  };

  const create = (payload: { name: string; image: File }) => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("image", payload.image);
    return upload<{ id: string }>("/categories", formData);
  };

  const update = (id: string, payload: { name: string }) => {
    return put<null>(`/categories/${id}`, payload);
  };

  const remove = (id: string) => {
    return del<string>(`/categories/${id}`);
  };

  return { list, getById, fetchAll, create, update, remove };
}
