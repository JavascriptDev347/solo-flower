<template>
    <div class="catalog-page">
        <!-- Chap tomonda kategoriya nomi -->
        <aside class="catalog-sidebar">
            <div class="category-badge">
                <span class="category-label">{{ t("catalog.categoryLabel") }}</span>
                <h1 class="category-title">
                    {{ categoryName }}
                </h1>
            </div>
        </aside>

        <!-- Mahsulotlar qismi -->
        <main class="catalog-content">
            <!-- Yuklanmoqda -->
            <div v-if="isLoading" class="product-grid">
                <div
                    v-for="n in 8"
                    :key="n"
                    class="rounded-2xl border border-neutral-200 overflow-hidden"
                >
                    <div class="w-full aspect-square skeleton-box" />
                    <div class="p-3 space-y-2">
                        <div class="skeleton-text" />
                        <div class="skeleton-text skeleton-text-sm" />
                    </div>
                </div>
            </div>

            <!-- Bo'sh holat -->
            <div v-else-if="!products.length" class="empty-state">
                <div class="empty-icon">
                    <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M3 9L4.5 4h15L21 9M3 9v10a1 1 0 001 1h16a1 1 0 001-1V9M3 9h18M9 13a3 3 0 006 0"
                            stroke="#B0B0B8"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </div>
                <p class="empty-title">{{ t("catalog.empty") }}</p>
                <p class="empty-subtitle">
                    {{ t("catalog.emptySubtitle", { category: categoryName }) }}
                </p>
            </div>

            <!-- Mahsulotlar ro'yxati: bir xil ProductCard komponenti (5.1-bo'lim) -->
            <div v-else class="product-grid">
                <ProductCard
                    v-for="product in products"
                    :key="product.id"
                    :product="product"
                    @add-to-cart="onAddToCart"
                />
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { useProductsStore } from "~/stores/catalog/products";
import { useCategoriesStore } from "~/stores/catalog/categories";
import { useAuthStore } from "~/stores/identity/auth";
import { useCartStore } from "~/stores/cart";
import type { Product } from "~/types/product";
import type { Lang } from "~/composables/catalog/useProducts";

// /catalog faqat ?category=nomi bilan ochiladi — kategoriyasiz "barcha
// mahsulotlar" ko'rinishi yo'q, shuning uchun bosh sahifaga qaytaramiz
definePageMeta({
    middleware: [
        (to) => {
            if (!to.query.category) return navigateTo("/");
        },
    ],
});

const { t, locale } = useI18n();
const route = useRoute();
const productsStore = useProductsStore();
const categoriesStore = useCategoriesStore();
const authStore = useAuthStore();
const cartStore = useCartStore();
const notify = useNotify();

const categoryName = computed(() => (route.query.category as string) || "");
const isLoading = ref(true);
const products = computed(() => productsStore.catalogItems);

// ProductGrid.vue bilan bir xil naqsh: avval login tekshiriladi, keyin savatga qo'shiladi
async function onAddToCart(product: Product) {
    if (!authStore.initialized) {
        await authStore.fetchMe();
    }
    if (!authStore.isAuthenticated) {
        notify.info(t("product.loginToAddToCart"));
        await navigateTo(`/auth/login?redirect=${route.fullPath}`);
        return;
    }

    cartStore.add(product);
    notify.success(t("product.addedToCart", { name: product.name }));
}

async function loadProducts() {
    isLoading.value = true;
    try {
        await categoriesStore.fetchAll(false, locale.value as Lang);
        const category = categoryName.value
            ? categoriesStore.byName(categoryName.value)
            : undefined;
        await productsStore.fetchCatalog({
            category_id: category?.id,
            lang: locale.value as Lang,
        });
    } catch {
        // xato allaqachon useApi ichida notify qilingan
    } finally {
        isLoading.value = false;
    }
}

watch([categoryName, locale], loadProducts);
onMounted(loadProducts);

useHead(() => ({
    title: categoryName.value
        ? `${categoryName.value} — ${t("catalog.pageTitleFallback")}`
        : t("catalog.pageTitleFallback"),
}));
</script>

<style scoped>
.catalog-page {
    max-width: 1100px;
    margin: 0 auto;
    padding: 32px 16px;
    gap: 32px;
}

/* Chap panel */
.catalog-sidebar {
    flex: 0 0 220px;
}

.category-badge {
    position: sticky;
    top: 24px;
}

.category-label {
    display: block;
    font-size: 12px;
    color: #9a9aa2;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 6px;
}

.category-title {
    font-size: 22px;
    font-weight: 700;
    color: #1a1a1a;
    line-height: 1.3;
    margin: 0;
}

/* O'ng qism */
.catalog-content {
    margin-top: 25px;
    min-width: 0;
    min-height: 400px;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    text-align: center;
    padding: 60px 20px;
}

.empty-icon {
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
    opacity: 0.8;
}

.empty-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0 0 6px;
}

.empty-subtitle {
    font-size: 14px;
    color: #9a9aa2;
    margin: 0;
}

/* Mahsulotlar to'ri: mobil 2 ustun/16px, planshet 3 ustun, desktop 4 ustun/24px
   (kartaning o'zi endi ProductCard.vue — Tailwind orqali) */
.product-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
}

@media (min-width: 768px) {
    .product-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (min-width: 1024px) {
    .product-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
    }
}

/* Skeleton */
.skeleton-box {
    background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
}
.skeleton-text {
    margin-top: 10px;
    width: 80%;
    height: 12px;
    border-radius: 4px;
    background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
}
.skeleton-text-sm {
    margin-top: 6px;
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

/* Mobil */
@media (max-width: 640px) {
    .catalog-page {
        flex-direction: column;
        gap: 20px;
    }

    .catalog-sidebar {
        flex: none;
    }

    .category-badge {
        position: static;
    }
}
</style>
