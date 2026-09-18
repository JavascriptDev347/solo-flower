import type { Product, AdminProduct } from "~/types/product";
import type { PaginatedList } from "~/types/api";

export type { Product, AdminProduct };

export type Lang = "uz" | "eng" | "ru";

export interface ProductListParams {
  search?: string;
  category_id?: string;
  lang?: Lang;
  page?: number;
  page_size?: number;
}

export interface AdminProductListParams {
  search?: string;
  category_id?: string;
  page?: number;
  page_size?: number;
}

export interface CreateProductPayload {
  name_uz: string;
  name_eng: string;
  name_ru: string;
  description_uz?: string;
  description_eng?: string;
  description_ru?: string;
  category_id: string;
  amount: number;
  currency: string;
  discount_amount?: number;
  slug?: string;
  is_available?: boolean;
  rating?: number;
  stock?: number;
  tag_uz?: string;
  tag_eng?: string;
  tag_ru?: string;
  images?: File[];
}

export interface UpdateProductPayload {
  name_uz?: string;
  name_eng?: string;
  name_ru?: string;
  description_uz?: string;
  description_eng?: string;
  description_ru?: string;
  category_id?: string;
  amount?: number;
  currency?: string;
  discount_amount?: number;
  clear_discount?: boolean;
  slug?: string;
  is_available?: boolean;
  rating?: number;
  stock?: number;
  sold_count?: number;
  tag_uz?: string;
  tag_eng?: string;
  tag_ru?: string;
  clear_tag_uz?: boolean;
  clear_tag_eng?: boolean;
  clear_tag_ru?: boolean;
}

export function useProducts() {
  const { get, put, delete: del, upload } = useApi();

  const list = (params?: ProductListParams) =>
    get<PaginatedList<Product>>("/products", params as Record<string, any>);

  const listByCategory = (
    categoryId: string,
    params?: Omit<ProductListParams, "category_id">,
  ) =>
    get<PaginatedList<Product>>(
      `/categories/${categoryId}/products`,
      params as Record<string, any>,
    );

  const getById = (id: string, lang?: Lang, opts?: { silent?: boolean }) =>
    get<Product>(`/products/${id}`, lang ? { lang } : undefined, opts);

  const getBySlug = (slug: string, lang?: Lang) =>
    get<Product>(`/products/slug/${slug}`, lang ? { lang } : undefined);

  const fetchAllAdmin = (params?: AdminProductListParams) =>
    get<PaginatedList<AdminProduct>>(
      "/products/admin",
      params as Record<string, any>,
    );

  const create = (payload: CreateProductPayload) => {
    const formData = new FormData();
    formData.append("name_uz", payload.name_uz);
    formData.append("name_eng", payload.name_eng);
    formData.append("name_ru", payload.name_ru);
    if (payload.description_uz) formData.append("description_uz", payload.description_uz);
    if (payload.description_eng) formData.append("description_eng", payload.description_eng);
    if (payload.description_ru) formData.append("description_ru", payload.description_ru);
    formData.append("category_id", payload.category_id);
    formData.append("amount", String(payload.amount));
    formData.append("currency", payload.currency);
    if (payload.discount_amount != null) {
      formData.append("discount_amount", String(payload.discount_amount));
    }
    if (payload.slug) formData.append("slug", payload.slug);
    formData.append("is_available", payload.is_available === false ? "false" : "true");
    if (payload.rating != null) formData.append("rating", String(payload.rating));
    if (payload.stock != null) formData.append("stock", String(payload.stock));
    if (payload.tag_uz) formData.append("tag_uz", payload.tag_uz);
    if (payload.tag_eng) formData.append("tag_eng", payload.tag_eng);
    if (payload.tag_ru) formData.append("tag_ru", payload.tag_ru);
    for (const file of payload.images ?? []) {
      formData.append("images", file);
    }
    return upload<Product>("/products", formData);
  };

  const update = (id: string, payload: UpdateProductPayload) => {
    return put<null>(`/products/${id}`, payload);
  };

  const remove = (id: string) => {
    return del<string>(`/products/${id}`);
  };

  return {
    list,
    listByCategory,
    getById,
    getBySlug,
    fetchAllAdmin,
    create,
    update,
    remove,
  };
}
