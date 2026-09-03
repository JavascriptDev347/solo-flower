<template>
    <section class="category-slider-wrapper">
        <h2 v-if="title" class="category-title">{{ title }}</h2>

        <!-- Skeleton Yuklanish Holati -->
        <div v-if="pending" class="skeleton-track">
            <div v-for="n in 5" :key="n" class="category-card skeleton-card">
                <div class="skeleton-text" />
                <div class="skeleton-circle" />
            </div>
        </div>

        <!-- Bo'sh Holat -->
        <div v-else-if="categories.length === 0" class="category-empty">
            {{ t("category.empty") }}
        </div>

        <!-- Swiper Slider + Animatsiya (faqat mijoz tomonda — swiper SSR'da
             haqiqiy DOM'ga muhtoj, shuning uchun ClientOnly bilan o'raladi) -->
        <div v-else class="slider-container">
            <ClientOnly>
                <swiper
                    :modules="[SwiperAutoplay, SwiperFreeMode]"
                    :slides-per-view="1.8"
                    :space-between="14"
                    :free-mode="{ enabled: true, sticky: true }"
                    :grab-cursor="true"
                    :loop="categories.length > 5"
                    :autoplay="{
                        delay: 2600,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }"
                    :breakpoints="{
                        480: { slidesPerView: 2.4, spaceBetween: 14 },
                        640: { slidesPerView: 3.2, spaceBetween: 16 },
                        900: { slidesPerView: 4.2, spaceBetween: 18 },
                        1200: { slidesPerView: 5.5, spaceBetween: 20 },
                    }"
                    class="category-swiper"
                >
                    <swiper-slide
                        v-for="(cat, index) in categories"
                        :key="cat.id"
                        class="category-slide"
                    >
                        <NuxtLink
                            :to="{
                                path: '/catalog',
                                query: { category: cat.name },
                            }"
                            class="category-card animate-card"
                            :style="{ animationDelay: `${(index % 6) * 100}ms` }"
                        >
                            <p class="category-name">{{ cat.name }}</p>
                            <div class="image-wrapper">
                                <img
                                    :src="cat.image_url"
                                    :alt="cat.name"
                                    loading="lazy"
                                    @error="onImageError"
                                />
                            </div>
                        </NuxtLink>
                    </swiper-slide>
                </swiper>

                <template #fallback>
                    <div class="skeleton-track">
                        <div
                            v-for="n in 5"
                            :key="n"
                            class="category-card skeleton-card"
                        >
                            <div class="skeleton-text" />
                            <div class="skeleton-circle" />
                        </div>
                    </div>
                </template>
            </ClientOnly>
        </div>
    </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import {
    Autoplay as SwiperAutoplay,
    FreeMode as SwiperFreeMode,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

import { useCategoriesStore } from "~/stores/catalog/categories";
import type { Lang } from "~/composables/catalog/useCategories";

const { t, locale } = useI18n();

interface Props {
    title?: string;
}
const props = withDefaults(defineProps<Props>(), {
    title: undefined,
});
const title = computed(() => props.title ?? t("category.title"));

const store = useCategoriesStore();

try {
    await store.fetchAll(false, locale.value as Lang);
} catch {
    // xato allaqachon useApi ichida notify qilingan — sahifani buzmaymiz
}

watch(locale, (newLocale) => {
    store.fetchAll(false, newLocale as Lang).catch(() => {});
});

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
    img.src = PLACEHOLDER_IMG;
}
</script>

<style scoped>
.category-slider-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 16px;
}

@media (max-width: 480px) {
    .category-slider-wrapper {
        padding: 16px 12px;
    }
}

.category-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 20px;
    color: #1a1a1a;
}

.category-swiper {
    overflow: hidden;
    padding-bottom: 8px;
}

.category-slide {
    height: auto;
}

/* Karta konteyneri */
.category-card {
    position: relative;
    display: flex;
    align-items: flex-start;
    width: 100%;
    height: 150px;
    padding: 20px;
    border-radius: 24px;
    background-color: #eef0f5; /* Rasmdagi och kulrang-binafsharang fon */
    text-decoration: none;
    overflow: hidden; /* Rasm pastdan va o'ngdan kartaning doira burchagiga mos kesiladi */
    box-sizing: border-box;
    transition:
        transform 0.25s ease,
        box-shadow 0.25s ease;
}

.category-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.07);
}

@media (max-width: 480px) {
    .category-card {
        height: 120px;
        padding: 14px;
        border-radius: 20px;
    }
}

/* Sarlavha */
.category-name {
    position: relative;
    z-index: 2;
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #2b2e35;
    line-height: 1.2;
    max-width: 48%; /* Matn gul bilan to'qnashmasligi uchun */
}

@media (max-width: 480px) {
    .category-name {
        font-size: 13px;
        max-width: 52%;
    }
}

/* Katta rasm konteyneri */
.image-wrapper {
    position: absolute;
    right: -10px;
    bottom: -15px;
    width: 200px; /* Kattalashtirilgan kenglik */
    height: 190px; /* Kartaning bo'yidan (150px) balandroq */
    z-index: 1;
    pointer-events: none;
}

@media (max-width: 480px) {
    .image-wrapper {
        width: 150px;
        height: 145px;
    }
}

.image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: contain; /* Guldasta cho'zilmay, asl nisbatda to'liq ko'rinadi */
    object-position: right bottom;
    display: block;
}
/* Kirish animatsiyasi (fade-up effekti) */
.animate-card {
    opacity: 0;
    animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeUp {
    0% {
        opacity: 0;
        transform: translateY(20px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Skeleton Loading */
.skeleton-track {
    display: flex;
    gap: 14px;
    overflow-x: hidden;
}

.skeleton-card {
    flex: 0 0 calc((100% - 4 * 14px) / 1.8);
    height: 150px;
    position: relative;
    background: #eaeaea;
}

@media (min-width: 480px) {
    .skeleton-card {
        flex-basis: calc((100% - 4 * 14px) / 2.4);
    }
}
@media (min-width: 640px) {
    .skeleton-card {
        flex-basis: calc((100% - 4 * 16px) / 3.2);
    }
}
@media (min-width: 900px) {
    .skeleton-card {
        flex-basis: calc((100% - 4 * 18px) / 4.2);
    }
}
@media (min-width: 1200px) {
    .skeleton-card {
        flex-basis: calc((100% - 4 * 20px) / 5.5);
    }
}
@media (max-width: 480px) {
    .skeleton-card {
        height: 120px;
    }
}

.skeleton-text {
    width: 50%;
    height: 16px;
    border-radius: 6px;
    background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
}

.skeleton-circle {
    position: absolute;
    right: -10px;
    bottom: -10px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}

.category-empty {
    text-align: center;
    color: #888;
    padding: 40px 0;
}
</style>
