import { defineStore } from "pinia";
import { useWishlist } from "~/composables/commerce/useWishlist";
import type { WishlistItem } from "~/types/wishlist";

export const useWishlistStore = defineStore("wishlist", {
  state: () => ({
    items: [] as WishlistItem[],
    loaded: false,
    loading: false,
  }),

  getters: {
    has: (state) => (productId: string) =>
      state.items.some((item) => item.product_id === productId),
  },

  actions: {
    async fetch(force = false) {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated || (this.loaded && !force)) {
        return this.items;
      }

      const { get } = useWishlist();
      this.loading = true;
      try {
        const wishlist = await get();
        this.items = wishlist?.items ?? [];
        this.loaded = true;
        return this.items;
      } finally {
        this.loading = false;
      }
    },

    async toggle(productId: string) {
      const { add, remove } = useWishlist();
      if (this.has(productId)) {
        await remove(productId);
      } else {
        await add(productId);
      }
      return this.fetch(true);
    },

    reset() {
      this.items = [];
      this.loaded = false;
      this.loading = false;
    },
  },
});
