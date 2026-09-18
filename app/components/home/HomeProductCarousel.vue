<template>
    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-16 md:py-16">
        <div v-if="showHeader" class="mb-5 flex items-center justify-between gap-4">
            <h2 class="text-h2 font-heading text-neutral-900">{{ title }}</h2>
            <NuxtLink :to="seeMoreTo" class="flex shrink-0 items-center gap-1 text-caption font-semibold text-brand-primary">
                {{ t("home.seeMore") }}
                <UIcon name="i-lucide-chevron-right" class="size-4" />
            </NuxtLink>
        </div>

        <div class="relative">
            <Swiper
                :slides-per-view="2"
                :space-between="12"
                :breakpoints="{ 768: { slidesPerView: 3, spaceBetween: 16 }, 1024: { slidesPerView: 4, spaceBetween: 20 } }"
                @swiper="onSwiper"
                @slide-change="syncNavigation"
            >
                <SwiperSlide v-for="product in products" :key="product.id">
                    <ProductCard :product="product" />
                </SwiperSlide>
            </Swiper>
            <button
                v-if="canGoPrevious"
                type="button"
                class="absolute -left-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-900 shadow-sm"
                :aria-label="t('home.carouselPrevious')"
                @click="goPrevious"
            >
                <UIcon name="i-lucide-chevron-left" class="size-5" />
            </button>
            <button
                v-if="canGoNext"
                type="button"
                class="absolute -right-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-900 shadow-sm"
                :aria-label="t('home.carouselNext')"
                @click="goNext"
            >
                <UIcon name="i-lucide-chevron-right" class="size-5" />
            </button>
        </div>
    </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import type { Product } from "~/types/product";

withDefaults(defineProps<{
    title: string;
    seeMoreTo: string;
    products: Product[];
    showHeader?: boolean;
}>(), {
    showHeader: true,
});

const { t } = useI18n();
const swiper = shallowRef<SwiperInstance>();
const canGoPrevious = ref(false);
const canGoNext = ref(false);

function onSwiper(instance: SwiperInstance) {
    swiper.value = instance;
    syncNavigation(instance);
}

function syncNavigation(instance = swiper.value) {
    if (!instance) return;
    canGoPrevious.value = !instance.isBeginning;
    canGoNext.value = !instance.isEnd;
}

function goPrevious() {
    swiper.value?.slidePrev();
}

function goNext() {
    swiper.value?.slideNext();
}
</script>
