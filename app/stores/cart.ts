import { defineStore } from "pinia";
import type { Product } from "~/types/product";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  finalPriceAmount: number;
  priceCurrency: string;
  quantity: number;
}

const STORAGE_KEY = "cart";

function readFromStorage(): CartItem[] {
  if (!import.meta.client) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeToStorage(items: CartItem[]) {
  if (!import.meta.client) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage mavjud bo'lmasa/to'lib qolsa — jim o'tkazib yuboramiz
  }
}

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as CartItem[],
    loaded: false,
  }),

  getters: {
    totalCount: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: (state) =>
      state.items.reduce(
        (sum, item) => sum + item.finalPriceAmount * item.quantity,
        0,
      ),
  },

  actions: {
    // localStorage'dan faqat bir marta o'qiydi (SSR'da hech narsa qilmaydi)
    load() {
      if (this.loaded) return;
      this.items = readFromStorage();
      this.loaded = true;
    },

    add(product: Product, quantity = 1) {
      this.load();
      const existing = this.items.find((i) => i.productId === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.items.push({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.images[0] ?? "",
          finalPriceAmount: product.final_price_amount,
          priceCurrency: product.price_currency,
          quantity,
        });
      }
      writeToStorage(this.items);
    },

    remove(productId: string) {
      this.items = this.items.filter((i) => i.productId !== productId);
      writeToStorage(this.items);
    },

    setQuantity(productId: string, quantity: number) {
      if (quantity <= 0) {
        this.remove(productId);
        return;
      }
      const item = this.items.find((i) => i.productId === productId);
      if (!item) return;
      item.quantity = quantity;
      writeToStorage(this.items);
    },

    clear() {
      this.items = [];
      writeToStorage(this.items);
    },
  },
});
