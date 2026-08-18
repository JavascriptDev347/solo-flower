<template>
    <section class="category-grid-wrapper">
        <h2 v-if="title" class="category-grid-title">{{ title }}</h2>

        <div v-if="pending" class="category-grid">
            <div v-for="n in 10" :key="n" class="category-item skeleton">
                <div class="category-image skeleton-box" />
                <div class="skeleton-text" />
            </div>
        </div>

        <div v-else-if="categories.length === 0" class="category-empty">
            Kategoriyalar topilmadi
        </div>

        <div v-else class="category-grid">
            <NuxtLink
                v-for="cat in categories"
                :key="cat.id"
                :to="{ path: '/catalog', query: { category: cat.name } }"
                class="category-item"
            >
                <div class="category-image">
                    <img
                        :src="cat.image_url"
                        :alt="cat.name"
                        loading="lazy"
                        @error="onImageError"
                    />
                </div>
                <span class="category-name">{{ cat.name }}</span>
            </NuxtLink>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useCategoriesStore } from "~/stores/catalog/categories";

interface Props {
    title?: string;
}
withDefaults(defineProps<Props>(), {
    title: "Kategoriyalar",
});

const store = useCategoriesStore();

await store.fetchAll(); // agar allaqachon yuklangan bo'lsa, qayta so'rov yubormaydi

const categories = computed(() => store.items);
const pending = computed(() => store.loading);

const PLACEHOLDER_IMG =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#F4F4F5"/>
      <path d="M60 130l20-25 15 18 25-32 20 39H60z" fill="#D4D4D8"/>
      <circle cx="80" cy="80" r="12" fill="#D4D4D8"/>
    </svg>
  `);
function onImageError(e: Event) {
    const img = e.target as HTMLImageElement;
    img.src = PLACEHOLDER_IMG; // zaxira rasm, /public/images/ ichiga qo'ying
}
</script>

<style scoped>
.category-grid-wrapper {
    max-width: 960px;
    margin: 0 auto;
    padding: 24px 16px;
}

.category-grid-title {
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #1a1a1a;
}

.category-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
}

@media (max-width: 768px) {
    .category-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 480px) {
    .category-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }
}

.category-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    cursor: pointer;
}

.category-image {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 20px;
    overflow: hidden;
    background: #f4f4f5;
    transition:
        transform 0.15s ease,
        box-shadow 0.15s ease;
}

.category-item:hover .category-image {
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.category-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.category-name {
    margin-top: 8px;
    font-size: 13px;
    text-align: center;
    color: #333;
    line-height: 1.3;
}

/* Skeleton loading holati */
.skeleton .skeleton-box {
    background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
}

.skeleton .skeleton-text {
    margin-top: 8px;
    width: 60%;
    height: 12px;
    border-radius: 4px;
    background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
}

.category-empty {
    text-align: center;
    color: #888;
    padding: 40px 0;
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
