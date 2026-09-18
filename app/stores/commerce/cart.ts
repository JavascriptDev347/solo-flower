import { defineStore } from "pinia";
import { useCart } from "~/composables/commerce/useCart";
import type { CartItem } from "~/types/cart";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as CartItem[],
    totalItems: 0,
    totalPrice: 0,
    loaded: false,
    loading: false,
  }),

  actions: {
    async fetch(force = false) {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated || (this.loaded && !force)) return this.items;

      const { get } = useCart();
      this.loading = true;
      try {
        const cart = await get();
        this.items = cart?.items ?? [];
        this.totalItems = cart?.total_items ?? 0;
        this.totalPrice = cart?.total_price ?? 0;
        this.loaded = true;
        return this.items;
      } finally {
        this.loading = false;
      }
    },

    async addItem(productId: string, quantity = 1) {
      const { addItem } = useCart();
      await addItem(productId, quantity);
      return this.fetch(true);
    },

    async setQuantity(productId: string, quantity: number) {
      if (quantity <= 0) return this.removeItem(productId);
      const { setQuantity } = useCart();
      await setQuantity(productId, quantity);
      return this.fetch(true);
    },

    async removeItem(productId: string) {
      const { removeItem } = useCart();
      await removeItem(productId);
      return this.fetch(true);
    },

    reset() {
      this.items = [];
      this.totalItems = 0;
      this.totalPrice = 0;
      this.loaded = false;
      this.loading = false;
    },
  },
});
