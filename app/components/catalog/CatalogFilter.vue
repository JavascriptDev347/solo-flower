<template>
    <div class="flex min-h-0 flex-col">
        <div class="mb-4 flex items-center justify-between">
            <h2 class="text-h2 font-heading text-neutral-900">{{ t("catalog.filter") }}</h2>
        </div>
        <div class="divide-y divide-neutral-200 overflow-y-auto">
            <section class="py-3 first:pt-0">
                <button type="button" class="flex w-full items-center justify-between text-left text-body font-semibold text-neutral-900" @click="categoryOpen = !categoryOpen">
                    {{ t("catalog.categoryLabel") }}
                    <UIcon name="i-lucide-chevron-down" class="size-4 transition-transform" :class="{ 'rotate-180': categoryOpen }" />
                </button>
                <div v-if="categoryOpen" class="mt-3 space-y-2">
                    <label v-for="category in categoriesStore.items" :key="category.id" class="flex cursor-pointer items-center gap-2 text-body text-neutral-700">
                        <input v-model="selectedCategory" type="radio" name="catalog-category" :value="category.name" class="size-4 accent-brand-primary" />
                        <span>{{ category.name }}</span>
                    </label>
                    <button v-if="selectedCategory" type="button" class="text-caption text-brand-primary hover:underline" @click="selectedCategory = ''">{{ t("catalog.clearCategory") }}</button>
                </div>
            </section>
            <section class="py-3">
                <button type="button" class="flex w-full items-center justify-between text-left text-body font-semibold text-neutral-900" @click="priceOpen = !priceOpen">
                    {{ t("catalog.price") }}
                    <UIcon name="i-lucide-chevron-down" class="size-4 transition-transform" :class="{ 'rotate-180': priceOpen }" />
                </button>
                <div v-if="priceOpen" class="mt-3 grid grid-cols-2 gap-2">
                    <UInput v-model.number="from" type="number" :placeholder="t('catalog.from')" :aria-label="t('catalog.from')" />
                    <UInput v-model.number="to" type="number" :placeholder="t('catalog.to')" :aria-label="t('catalog.to')" />
                </div>
            </section>
        </div>
        <UButton :label="t('catalog.applyFilter')" class="sticky bottom-0 mt-5 w-full rounded-full bg-brand-primary text-white shadow-sm hover:bg-brand-primary-hover" @click="apply" />
    </div>
</template>

<script setup lang="ts">
import { useCategoriesStore } from "~/stores/catalog/categories";

const props = defineProps<{
    category: string;
    priceFrom?: number;
    priceTo?: number;
}>();
const emit = defineEmits<{
    apply: [value: { category: string; priceFrom?: number; priceTo?: number }];
}>();
const { t } = useI18n();
const categoriesStore = useCategoriesStore();
const selectedCategory = ref(props.category);
const from = ref(props.priceFrom);
const to = ref(props.priceTo);
const categoryOpen = ref(true);
const priceOpen = ref(true);

watch(() => props.category, (value) => { selectedCategory.value = value; });
watch(() => props.priceFrom, (value) => { from.value = value; });
watch(() => props.priceTo, (value) => { to.value = value; });

function apply() {
    emit("apply", { category: selectedCategory.value, priceFrom: from.value, priceTo: to.value });
}
</script>
