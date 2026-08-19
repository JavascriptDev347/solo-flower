import { defineStore } from "pinia";
import {
  useProducts,
  type CreateProductPayload,
  type UpdateProductPayload,
  type ProductListParams,
} from "~/composables/catalog/useProducts";
import type { Product } from "~/types/product";

export const useProductsStore = defineStore("products", {
  state: () => ({
    // Public katalog uchun (faqat faol mahsulotlar, filtrsiz so'rov keshlanadi)
    items: [] as Product[],
    loaded: false,
    loading: false,
    // Admin ro'yxati uchun (o'chirilganlar bilan, har doim yangilanadi)
    adminItems: [] as Product[],
    adminLoading: false,
  }),

  actions: {
    async fetchAll(params?: ProductListParams, force = false) {
      const hasFilter = !!(params?.search || params?.category_id);
      // Filtrsiz so'rov allaqachon yuklangan bo'lsa va force qilinmasa — qayta so'rov yubormaydi
      if (!hasFilter && this.loaded && !force) return this.items;

      const { list } = useProducts();
      this.loading = true;
      try {
        this.items = await list(params);
        if (!hasFilter) this.loaded = true;
        return this.items;
      } finally {
        this.loading = false;
      }
    },

    async fetchAllAdmin(params?: ProductListParams) {
      const { fetchAllAdmin } = useProducts();
      this.adminLoading = true;
      try {
        this.adminItems = await fetchAllAdmin(params);
        return this.adminItems;
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
