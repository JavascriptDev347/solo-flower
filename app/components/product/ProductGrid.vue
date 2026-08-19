<template>
    <section class="product-grid-wrapper">
        <h2 v-if="title" class="product-grid-title">{{ title }}</h2>

        <div v-if="pending" class="product-grid">
            <div v-for="n in 8" :key="n" class="product-skeleton-card">
                <div class="skeleton-box" />
                <div class="skeleton-text" />
                <div class="skeleton-text skeleton-text-sm" />
            </div>
        </div>

        <div v-else-if="products.length === 0" class="product-empty">
            Mahsulotlar topilmadi
        </div>

        <div v-else class="product-grid">
            <NuxtLink
                v-for="p in products"
                :key="p.id"
                :to="`/product/${p.slug}`"
                class="product-grid-link"
            >
                <ProductCard
                    :product="p"
                    @add-to-cart="onAddToCart"
                    @toggle-wishlist="onToggleWishlist"
                />
            </NuxtLink>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useProductsStore } from "~/stores/catalog/products";
import { useAuthStore } from "~/stores/identity/auth";
import { useCartStore } from "~/stores/cart";
import type { Product } from "~/types/product";

interface Props {
    title?: string;
}
withDefaults(defineProps<Props>(), {
    title: "Mahsulotlar",
});

const store = useProductsStore();
const authStore = useAuthStore();
const cartStore = useCartStore();
const notify = useNotify();
const route = useRoute();

await store.fetchAll(); // agar allaqachon yuklangan bo'lsa, qayta so'rov yubormaydi

const products = computed(() => store.items);
const pending = computed(() => store.loading);

async function onAddToCart(product: Product) {
    if (!authStore.initialized) {
        await authStore.fetchMe();
    }
    if (!authStore.isAuthenticated) {
        notify.info("Savatga qo'shish uchun avval tizimga kiring");
        await navigateTo(`/auth/login?redirect=${route.fullPath}`);
        return;
    }

    cartStore.add(product);
    notify.success(`"${product.name}" savatga qo'shildi`);
}

function onToggleWishlist(product: Product) {
    notify.info(
        `"${product.name}" — sevimlilar funksiyasi tez orada qo'shiladi`,
    );
}
</script>

<style scoped>
.product-grid-wrapper {
    max-width: 1100px;
    margin: 0 auto;
    padding: 24px 16px;
}

.product-grid-title {
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #1a1a1a;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.product-grid-link {
    display: block;
    text-decoration: none;
    color: inherit;
}

@media (max-width: 900px) {
    .product-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 771px) {
    .product-grid {
        justify-items: center;
        grid-template-columns: repeat(1, 1fr);
    }
}

.product-empty {
    text-align: center;
    color: #888;
    padding: 40px 0;
}

/* Skeleton */
.product-skeleton-card {
    border: 1px solid #e4e4e7;
    border-radius: 24px;
    padding: 14px;
}
.skeleton-box {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 20px;
    background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
}
.skeleton-text {
    margin-top: 14px;
    width: 80%;
    height: 12px;
    border-radius: 4px;
    background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
}
.skeleton-text-sm {
    margin-top: 8px;
    width: 40%;
}
@keyframes shimmer {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}
</style>
