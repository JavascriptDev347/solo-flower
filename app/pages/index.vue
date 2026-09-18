<template>
    <AppHero />
    <CategoryGrid />
    <HomeWhyUsPhotoGrid />
    <HomeProductCarousel v-if="bestSellers.length" :title="t('home.bestSellers.title')" see-more-to="/catalog" :products="bestSellers" />
    <section v-if="offers.length" class="mx-4 rounded-2xl bg-brand-primary-soft sm:mx-6 md:mx-16">
        <div class="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 pt-6 sm:px-6 md:px-8">
            <h2 class="text-h2 font-heading font-bold text-brand-primary">{{ t("home.offers.title") }}</h2>
            <HomeCountdownTimer />
            <NuxtLink to="/catalog" class="flex shrink-0 items-center gap-1 text-caption font-semibold text-brand-primary">
                {{ t("home.seeMore") }}
                <UIcon name="i-lucide-chevron-right" class="size-4" />
            </NuxtLink>
        </div>
        <HomeProductCarousel title="" see-more-to="/catalog" :products="offers" :show-header="false" />
    </section>
    <HomeWhyUsIconRow />
    <HomeTestimonialsCarousel :products="testimonialProducts" />
</template>

<script setup lang="ts">
import type { Lang } from "~/composables/catalog/useProducts";
import { useProductsStore } from "~/stores/catalog/products";

const { t, locale } = useI18n();
const productsStore = useProductsStore();

try {
    await productsStore.fetchAll({ lang: locale.value as Lang, page_size: 20 });
} catch {
    // xato allaqachon useApi ichida notify qilingan — ma'lumot bo'lmasa marketing bo'limlar shunchaki yashiriladi
}

const products = computed(() => productsStore.items);
const bestSellers = computed(() =>
    [...products.value].sort((a, b) => b.sold_count - a.sold_count).slice(0, 10),
);
const offers = computed(() => [...products.value].reverse().slice(0, 10));
const testimonialProducts = computed(() => products.value.slice(0, 3));
</script>
