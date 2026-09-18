<template>
    <section class="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 py-12 md:py-16 lg:py-20">
        <div class="mb-6 flex items-center justify-between gap-4 md:mb-8">
            <h2 v-if="title" class="text-h2 font-heading text-neutral-900">
                {{ title }}
            </h2>
            <button
                v-if="!pending && categories.length"
                type="button"
                class="shrink-0 rounded-full px-4 py-2 text-caption font-semibold text-brand-primary transition-colors hover:bg-brand-cream"
                @click="showAll = !showAll"
            >
                {{ t(showAll ? "category.collapse" : "category.all") }}
            </button>
        </div>

        <!-- Skeleton -->
        <div
            v-if="pending"
            class="flex md:grid md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 overflow-x-auto md:overflow-visible pr-10 md:pr-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
            <div
                v-for="n in 10"
                :key="n"
                class="flex flex-col items-center gap-2 w-20 md:w-28 shrink-0"
            >
                <USkeleton class="size-20 md:size-28 rounded-full" />
                <USkeleton class="h-3 w-14" />
            </div>
        </div>

        <!-- Bo'sh holat -->
        <div v-else-if="categories.length === 0" class="text-center text-neutral-500 py-10">
            {{ t("category.empty") }}
        </div>

        <div v-else-if="showAll" class="flex flex-wrap justify-center gap-4 md:gap-6">
            <CategoryItem v-for="cat in categories" :key="cat.id" :category="cat" />
        </div>

        <div v-else class="marquee-viewport">
            <div class="marquee-track">
                <div v-for="copy in 2" :key="copy" class="marquee-group">
                    <CategoryItem
                        v-for="cat in categories"
                        :key="`${copy}-${cat.id}`"
                        :category="cat"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useCategoriesStore } from "~/stores/catalog/categories";
import type { Lang } from "~/composables/catalog/useCategories";

interface Props {
    title?: string;
}
const props = withDefaults(defineProps<Props>(), {
    title: undefined,
});

const { t, locale } = useI18n();
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
const showAll = ref(false);
</script>

<style scoped>
.marquee-viewport {
    overflow: hidden;
}

.marquee-track {
    display: flex;
    width: max-content;
    animation: category-marquee 30s linear infinite;
}

.marquee-group {
    display: flex;
    flex-shrink: 0;
    align-items: flex-start;
    gap: 1rem;
    padding-right: 1rem;
}

.marquee-viewport:hover .marquee-track,
.marquee-viewport:active .marquee-track {
    animation-play-state: paused;
}

@media (min-width: 768px) {
    .marquee-group {
        gap: 1.5rem;
        padding-right: 1.5rem;
    }
}

@keyframes category-marquee {
    to {
        transform: translateX(-50%);
    }
}
</style>
