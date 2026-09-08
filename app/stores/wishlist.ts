import { defineStore } from "pinia";

const STORAGE_KEY = "wishlist";

function readFromStorage(): string[] {
  if (!import.meta.client) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeToStorage(ids: string[]) {
  if (!import.meta.client) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // localStorage mavjud bo'lmasa/to'lib qolsa — jim o'tkazib yuboramiz
  }
}

// cart.ts bilan bir xil naqsh: client-only, localStorage'da saqlanadi,
// backend API bilan bog'lanmagan (hali wishlist endpointi yo'q)
export const useWishlistStore = defineStore("wishlist", {
  state: () => ({
    ids: [] as string[],
    loaded: false,
  }),

  getters: {
    has: (state) => (productId: string) => state.ids.includes(productId),
    totalCount: (state) => state.ids.length,
  },

  actions: {
    load() {
      if (this.loaded) return;
      this.ids = readFromStorage();
      this.loaded = true;
    },

    toggle(productId: string) {
      this.load();
      this.ids = this.ids.includes(productId)
        ? this.ids.filter((id) => id !== productId)
        : [...this.ids, productId];
      writeToStorage(this.ids);
    },
  },
});
