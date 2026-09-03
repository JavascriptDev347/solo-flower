import { defineStore } from "pinia";
import { useCategories, type Lang } from "~/composables/catalog/useCategories";
import type { Category, AdminCategory } from "~/types/category";

export const useCategoriesStore = defineStore("categories", {
  state: () => ({
    // Public katalog uchun (faqat faol kategoriyalar, keshlanadi)
    items: [] as Category[],
    itemsLang: null as Lang | null,
    loaded: false,
    loading: false,
    // Admin ro'yxati uchun (qidiruv/o'chirilganlar bilan, har doim yangilanadi)
    adminItems: [] as AdminCategory[],
    adminLoading: false,
  }),

  getters: {
    byId: (state) => (id: string) => state.items.find((c) => c.id === id),

    byName: (state) => (name: string) =>
      state.items.find((c) => c.name === name),
  },

  actions: {
    async fetchAll(force = false, lang?: Lang) {
      const langChanged =
        lang != null && this.itemsLang != null && this.itemsLang !== lang;
      // allaqachon yuklangan bo'lsa, til o'zgarmagan bo'lsa va force
      // qilinmasa — qayta so'rov yubormaydi
      if (this.loaded && !force && !langChanged) return this.items;

      const { list } = useCategories();
      this.loading = true;
      try {
        this.items = (await list("", lang)) ?? [];
        this.itemsLang = lang ?? this.itemsLang;
        this.loaded = true;
        return this.items;
      } finally {
        this.loading = false;
      }
    },

    async fetchAllAdmin(search = "") {
      const { fetchAll: fetchAllAdminApi } = useCategories();
      this.adminLoading = true;
      try {
        this.adminItems = (await fetchAllAdminApi(search)) ?? [];
        return this.adminItems;
      } finally {
        this.adminLoading = false;
      }
    },

    async create(payload: {
      name_uz: string;
      name_eng: string;
      name_ru: string;
      image: File;
    }) {
      const { create } = useCategories();
      const result = await create(payload);
      // API faqat { id } qaytaradi — to'liq kategoriya emas, shuning uchun
      // ro'yxatlarga optimistik push qilmaymiz, keshlarni bekor qilamiz
      this.loaded = false;
      return result;
    },

    async update(
      id: string,
      payload: { name_uz?: string; name_eng?: string; name_ru?: string },
    ) {
      const { update } = useCategories();
      const result = await update(id, payload);
      // API hech narsa qaytarmaydi (null), shuning uchun keshlarni bekor qilamiz
      this.loaded = false;
      return result;
    },

    async remove(id: string) {
      const { remove } = useCategories();
      await remove(id);
      this.items = this.items.filter((c) => c.id !== id);
      this.adminItems = this.adminItems.filter((c) => c.id !== id);
      this.loaded = false;
    },
  },
});
