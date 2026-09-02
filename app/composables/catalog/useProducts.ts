import type { Product, PackagingType } from "~/types/product";
import type { PaginatedList } from "~/types/api";

export type { Product };

export interface ProductListParams {
  search?: string;
  category_id?: string;
}

export interface AdminProductListParams extends ProductListParams {
  page?: number;
  page_size?: number;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  category_id: string;
  amount: number;
  currency: string;
  discount_amount?: number;
  slug?: string;
  video_url_youtube?: string;
  video_url_instagram?: string;
  is_available?: boolean;
  rating?: number;
  stock?: number;
  flower_types?: string[];
  color?: string;
  stem_count?: number;
  packaging_type: PackagingType;
  freshness_lifespan?: number;
  care_instructions?: string;
  occasions?: string[];
  compatible_addons?: string[];
  images?: File[];
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  video_url_youtube?: string;
  video_url_instagram?: string;
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
  flower_types?: string[];
  color?: string;
  stem_count?: number;
  packaging_type?: PackagingType;
  freshness_lifespan?: number;
  care_instructions?: string;
  clear_care_instructions?: boolean;
  occasions?: string[];
  compatible_addons?: string[];
}

export function useProducts() {
  const { get, put, delete: del, upload } = useApi();

  const list = (params?: ProductListParams) =>
    get<PaginatedList<Product>>("/products", params as Record<string, any>);

  const listByCategory = (categoryId: string, search = "") =>
    get<PaginatedList<Product>>(
      `/categories/${categoryId}/products`,
      search ? { search } : undefined,
    );

  const getById = (id: string) => get<Product>(`/products/${id}`);

  const getBySlug = (slug: string) => get<Product>(`/products/slug/${slug}`);

  const fetchAllAdmin = (params?: AdminProductListParams) =>
    get<PaginatedList<Product>>(
      "/products/admin",
      params as Record<string, any>,
    );

  const create = (payload: CreateProductPayload) => {
    const formData = new FormData();
    formData.append("name", payload.name);
    if (payload.description) formData.append("description", payload.description);
    formData.append("category_id", payload.category_id);
    formData.append("amount", String(payload.amount));
    formData.append("currency", payload.currency);
    if (payload.discount_amount != null) {
      formData.append("discount_amount", String(payload.discount_amount));
    }
    if (payload.slug) formData.append("slug", payload.slug);
    if (payload.video_url_youtube) {
      formData.append("video_url_youtube", payload.video_url_youtube);
    }
    if (payload.video_url_instagram) {
      formData.append("video_url_instagram", payload.video_url_instagram);
    }
    formData.append("is_available", payload.is_available === false ? "false" : "true");
    if (payload.rating != null) formData.append("rating", String(payload.rating));
    if (payload.stock != null) formData.append("stock", String(payload.stock));
    if (payload.flower_types?.length) {
      formData.append("flower_types", payload.flower_types.join(","));
    }
    if (payload.color) formData.append("color", payload.color);
    if (payload.stem_count != null) {
      formData.append("stem_count", String(payload.stem_count));
    }
    formData.append("packaging_type", payload.packaging_type);
    if (payload.freshness_lifespan != null) {
      formData.append("freshness_lifespan", String(payload.freshness_lifespan));
    }
    if (payload.care_instructions) {
      formData.append("care_instructions", payload.care_instructions);
    }
    if (payload.occasions?.length) {
      formData.append("occasions", payload.occasions.join(","));
    }
    if (payload.compatible_addons?.length) {
      formData.append("compatible_addons", payload.compatible_addons.join(","));
    }
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
