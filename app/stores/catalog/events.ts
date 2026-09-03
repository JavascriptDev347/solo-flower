import { defineStore } from "pinia";
import {
  useEvents,
  type CreateEventPayload,
  type UpdateEventPayload,
  type Lang,
} from "~/composables/catalog/useEvents";
import type { Event, AdminEvent } from "~/types/event";

export const useEventsStore = defineStore("events", {
  state: () => ({
    // Bosh sahifa banneri uchun (faqat faol eventlar, keshlanadi)
    items: [] as Event[],
    itemsLang: null as Lang | null,
    loaded: false,
    loading: false,
    // Admin ro'yxati uchun (o'chirilganlar bilan, har doim yangilanadi)
    adminItems: [] as AdminEvent[],
    adminLoading: false,
  }),

  actions: {
    async fetchAll(force = false, lang?: Lang) {
      const langChanged =
        lang != null && this.itemsLang != null && this.itemsLang !== lang;
      // allaqachon yuklangan bo'lsa, til o'zgarmagan bo'lsa va force
      // qilinmasa — qayta so'rov yubormaydi
      if (this.loaded && !force && !langChanged) return this.items;

      const { list } = useEvents();
      this.loading = true;
      try {
        this.items = (await list(lang)) ?? [];
        this.itemsLang = lang ?? this.itemsLang;
        this.loaded = true;
        return this.items;
      } finally {
        this.loading = false;
      }
    },

    async fetchAllAdmin() {
      const { fetchAllAdmin } = useEvents();
      this.adminLoading = true;
      try {
        this.adminItems = (await fetchAllAdmin()) ?? [];
        return this.adminItems;
      } finally {
        this.adminLoading = false;
      }
    },

    async create(payload: CreateEventPayload) {
      const { create } = useEvents();
      const result = await create(payload);
      this.loaded = false;
      return result;
    },

    async update(id: string, payload: UpdateEventPayload) {
      const { update } = useEvents();
      const result = await update(id, payload);
      // API hech narsa qaytarmaydi (null), shuning uchun keshni bekor qilamiz
      this.loaded = false;
      return result;
    },

    async remove(id: string) {
      const { remove } = useEvents();
      await remove(id);
      this.items = this.items.filter((e) => e.id !== id);
      this.adminItems = this.adminItems.filter((e) => e.id !== id);
      this.loaded = false;
    },
  },
});
