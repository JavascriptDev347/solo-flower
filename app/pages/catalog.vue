<template>
    <div class="catalog-page">
        <!-- Chap tomonda kategoriya nomi -->
        <aside class="catalog-sidebar">
            <div class="category-badge">
                <span class="category-label">Kategoriya</span>
                <h1 class="category-title">
                    {{ categoryName }}
                </h1>
            </div>
        </aside>

        <!-- Mahsulotlar qismi -->
        <main class="catalog-content">
            <!-- Yuklanmoqda -->
            <div v-if="isLoading" class="product-grid">
                <div v-for="n in 8" :key="n" class="product-card skeleton">
                    <div class="product-image skeleton-box" />
                    <div class="skeleton-text" />
                    <div class="skeleton-text skeleton-text-sm" />
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
                <p class="empty-title">Mahsulotlar hozircha yo'q</p>
                <p class="empty-subtitle">
                    "{{ categoryName }}" bo'yicha mahsulotlar tez orada
                    qo'shiladi
                </p>
            </div>

            <!-- Mahsulotlar ro'yxati -->
            <div v-else class="product-grid">
                <div
                    v-for="product in products"
                    :key="product.id"
                    class="product-card"
                >
                    <div class="product-image">
                        <img
                            v-if="product.images[0]"
                            :src="product.images[0]"
                            :alt="product.name"
                            loading="lazy"
                        />
                        <span
                            v-if="!product.is_available"
                            class="unavailable-badge"
                        >
                            Tugagan
                        </span>
                        <span
                            v-else-if="product.discount_amount"
                            class="discount-badge"
                        >
                            Chegirma
                        </span>
                    </div>
                    <p class="product-name">{{ product.name }}</p>
                    <div class="product-price">
                        <span class="price-final">
                            {{
                                formatPrice(
                                    product.final_price_amount ??
                                        product.price_amount,
                                    product.price_currency,
                                )
                            }}
                        </span>
                        <span
                            v-if="product.discount_amount"
                            class="price-original"
                        >
                            {{
                                formatPrice(
                                    product.price_amount,
                                    product.price_currency,
                                )
                            }}
                        </span>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { useProductsStore } from "~/stores/catalog/products";
import { useCategoriesStore } from "~/stores/catalog/categories";

// /catalog faqat ?category=nomi bilan ochiladi — kategoriyasiz "barcha
// mahsulotlar" ko'rinishi yo'q, shuning uchun bosh sahifaga qaytaramiz
definePageMeta({
    middleware: [
        (to) => {
            if (!to.query.category) return navigateTo("/");
        },
    ],
});

const route = useRoute();
const productsStore = useProductsStore();
const categoriesStore = useCategoriesStore();

const categoryName = computed(() => (route.query.category as string) || "");
const isLoading = ref(true);
const products = computed(() => productsStore.catalogItems);

function formatPrice(amount: number | null | undefined, currency: string) {
    return `${(amount ?? 0).toLocaleString("uz-UZ")} ${currency}`;
}

async function loadProducts() {
    isLoading.value = true;
    try {
        await categoriesStore.fetchAll();
        const category = categoryName.value
            ? categoriesStore.byName(categoryName.value)
            : undefined;
        await productsStore.fetchCatalog({ category_id: category?.id });
    } catch {
        // xato allaqachon useApi ichida notify qilingan
    } finally {
        isLoading.value = false;
    }
}

watch(categoryName, loadProducts);
onMounted(loadProducts);

useHead(() => ({
    title: categoryName.value ? `${categoryName.value} — Katalog` : "Katalog",
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

/* Mahsulotlar to'ri */
.product-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.product-card {
    display: flex;
    flex-direction: column;
}

.product-image {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 16px;
    overflow: hidden;
    background: #f4f4f5;
}
.product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.15s ease;
}
.product-card:hover .product-image img {
    transform: scale(1.03);
}

.unavailable-badge,
.discount-badge {
    position: absolute;
    top: 8px;
    left: 8px;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 9px;
    border-radius: 999px;
    color: #fff;
}
.unavailable-badge {
    background: #9a9aa2;
}
.discount-badge {
    background: var(--color-primary, #e0568c);
}

.product-name {
    margin: 10px 0 4px;
    font-size: 14px;
    font-weight: 500;
    color: #1a1a1a;
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.product-price {
    display: flex;
    align-items: baseline;
    gap: 8px;
    flex-wrap: wrap;
}
.price-final {
    font-size: 15px;
    font-weight: 600;
    color: var(--color-primary, #e0568c);
}
.price-original {
    font-size: 12px;
    color: #9a9aa2;
    text-decoration: line-through;
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
@media (max-width: 768px) {
    .product-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 14px;
    }
}

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
