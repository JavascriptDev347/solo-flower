<template>
    <section class="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 py-12 md:py-16 lg:py-20">
        <h2 v-if="title" class="text-h2 font-heading text-center text-neutral-900 mb-6 md:mb-8">
            {{ title }}
        </h2>

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

        <!-- Mobil: gorizontal snap-scroll bitta qator, scrollbar yashirilgan.
             Desktop (lg): statik grid, 5 ustun — hech qanday scroll yo'q. -->
        <div
            v-else
            class="flex md:grid md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pr-10 md:pr-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
            <CategoryItem
                v-for="cat in categories"
                :key="cat.id"
                :category="cat"
                class="snap-start md:snap-align-none"
            />
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
</script>
