import { defineStore } from "pinia";
import {
  useProducts,
  type CreateProductPayload,
  type UpdateProductPayload,
  type ProductListParams,
  type AdminProductListParams,
  type Lang,
} from "~/composables/catalog/useProducts";
import type { Product, AdminProduct } from "~/types/product";
import type { Pagination } from "~/types/api";

export const useProductsStore = defineStore("products", {
  state: () => ({
    // Public katalog uchun (faqat faol mahsulotlar, filtrsiz so'rov keshlanadi)
    items: [] as Product[],
    itemsLang: null as Lang | null,
    pagination: null as Pagination | null,
    loaded: false,
    loading: false,
    // Admin ro'yxati uchun (o'chirilganlar bilan, har doim yangilanadi)
    adminItems: [] as AdminProduct[],
    adminPagination: null as Pagination | null,
    adminLoading: false,
    // Katalog sahifasi uchun (filtrlangan, homepage keshiga tegmaydi)
    catalogItems: [] as Product[],
    catalogPagination: null as Pagination | null,
    catalogLoading: false,
  }),

  actions: {
    async fetchAll(params?: ProductListParams, force = false) {
      const hasFilter = !!(params?.search || params?.category_id);
      const langChanged =
        params?.lang != null &&
        this.itemsLang != null &&
        this.itemsLang !== params.lang;
      // Filtrsiz so'rov allaqachon yuklangan bo'lsa, til o'zgarmagan bo'lsa
      // va force qilinmasa — qayta so'rov yubormaydi
      if (!hasFilter && this.loaded && !force && !langChanged) return this.items;

      const { list } = useProducts();
      this.loading = true;
      try {
        const result = await list(params);
        this.items = result?.items ?? [];
        this.pagination = result?.pagination ?? null;
        this.itemsLang = params?.lang ?? this.itemsLang;
        if (!hasFilter) this.loaded = true;
        return this.items;
      } finally {
        this.loading = false;
      }
    },

    async fetchCatalog(params?: ProductListParams) {
      const { list } = useProducts();
      this.catalogLoading = true;
      try {
        const result = await list(params);
        this.catalogItems = result?.items ?? [];
        this.catalogPagination = result?.pagination ?? null;
        return this.catalogItems;
      } finally {
        this.catalogLoading = false;
      }
    },

    async fetchAllAdmin(params?: AdminProductListParams) {
      const { fetchAllAdmin } = useProducts();
      this.adminLoading = true;
      try {
        const result = await fetchAllAdmin(params);
        this.adminItems = result?.items ?? [];
        this.adminPagination = result?.pagination ?? null;
        return result;
      } finally {
        this.adminLoading = false;
      }
    },

    async create(payload: CreateProductPayload) {
      const { create } = useProducts();
      const result = await create(payload);
      this.loaded = false;
      return result;
    },

    async update(id: string, payload: UpdateProductPayload) {
      const { update } = useProducts();
      const result = await update(id, payload);
      // API hech narsa qaytarmaydi (null), shuning uchun keshni bekor qilamiz
      this.loaded = false;
      return result;
    },

    async remove(id: string) {
      const { remove } = useProducts();
      await remove(id);
      this.items = this.items.filter((p) => p.id !== id);
      this.adminItems = this.adminItems.filter((p) => p.id !== id);
      this.loaded = false;
    },
  },
});
