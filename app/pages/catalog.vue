<template>
    <main class="mx-auto max-w-7xl px-4 py-6 pb-24 sm:px-6 md:py-8 lg:px-10">
        <nav class="mb-6 flex items-center gap-2 overflow-x-auto text-caption text-neutral-500" :aria-label="t('catalog.breadcrumbAria')">
            <NuxtLink to="/" class="shrink-0 hover:text-brand-primary">{{ t("catalog.home") }}</NuxtLink>
            <UIcon name="i-lucide-chevron-right" class="size-4 shrink-0" />
            <span class="shrink-0 font-medium text-neutral-900">{{ breadcrumbLabel }}</span>
        </nav>

        <div class="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <h1 class="text-display-sm font-heading text-neutral-900">{{ pageTitle }}</h1>
                <p class="mt-2 text-body text-neutral-600">
                    {{ t("catalog.resultCount", { count: productsStore.catalogPagination?.total_items ?? 0 }) }}
                </p>
            </div>
            <div class="flex gap-2 lg:hidden">
                <UButton icon="i-lucide-arrow-down-up" :label="t('catalog.sort')" variant="outline" color="neutral" class="rounded-full" @click="isSortOpen = true" />
                <UButton icon="i-lucide-sliders-horizontal" :label="t('catalog.filter')" class="rounded-full bg-brand-primary text-white hover:bg-brand-primary-hover" @click="isFilterOpen = true" />
            </div>
        </div>

        <div class="mb-6 hidden gap-2 overflow-x-auto lg:flex">
            <button
                v-for="option in sortOptions"
                :key="option.value"
                type="button"
                class="shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors"
                :class="sort === option.value ? 'bg-brand-primary text-white' : 'text-neutral-700 hover:bg-brand-cream'"
                @click="setSort(option.value)"
            >
                {{ option.label }}
            </button>
        </div>

        <div class="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
            <section>
                <div v-if="isLoading" class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    <div v-for="n in 8" :key="n" class="overflow-hidden rounded-2xl border border-neutral-200">
                        <USkeleton class="aspect-square w-full rounded-none" />
                        <div class="space-y-2 p-3"><USkeleton class="h-4 w-full" /><USkeleton class="h-4 w-1/3" /></div>
                    </div>
                </div>
                <div v-else-if="!displayedProducts.length" class="rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center">
                    <UIcon name="i-lucide-package-open" class="mx-auto size-14 text-neutral-400" />
                    <h2 class="mt-5 text-h2 font-heading text-neutral-900">{{ t("catalog.empty") }}</h2>
                    <p class="mx-auto mt-2 max-w-md text-body text-neutral-600">{{ t("catalog.emptySubtitle", { category: categoryName || t("catalog.allProducts") }) }}</p>
                </div>
                <div v-else class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    <ProductCard v-for="product in displayedProducts" :key="product.id" :product="product" @add-to-cart="onAddToCart" />
                </div>

                <div v-if="totalPages > 1" class="mt-8 flex items-center justify-center gap-2">
                    <UButton icon="i-lucide-chevron-left" color="neutral" variant="ghost" class="size-10 justify-center rounded-full" :disabled="currentPage <= 1" :aria-label="t('gallery.previousPage')" @click="goToPage(currentPage - 1)" />
                    <button
                        v-for="pageNumber in totalPages"
                        :key="pageNumber"
                        type="button"
                        class="flex size-10 items-center justify-center rounded-full text-sm font-semibold transition-colors"
                        :class="pageNumber === currentPage ? 'bg-brand-primary text-white' : 'text-neutral-700 hover:bg-brand-cream'"
                        @click="goToPage(pageNumber)"
                    >{{ pageNumber }}</button>
                    <UButton icon="i-lucide-chevron-right" color="neutral" variant="ghost" class="size-10 justify-center rounded-full" :disabled="currentPage >= totalPages" :aria-label="t('gallery.nextPage')" @click="goToPage(currentPage + 1)" />
                </div>
            </section>

            <aside class="sticky top-24 hidden rounded-2xl border border-neutral-200 bg-white p-5 lg:block">
                <CatalogFilter :category="draftCategory" :price-from="priceFrom" :price-to="priceTo" @apply="applyFilters" />
            </aside>
        </div>

        <USlideover v-model:open="isSortOpen" side="bottom" :ui="{ content: 'bg-white rounded-t-2xl' }">
            <template #header><h2 class="text-h2 font-heading text-neutral-900">{{ t("catalog.sort") }}</h2></template>
            <template #body>
                <div class="space-y-2">
                    <button v-for="option in sortOptions" :key="option.value" type="button" class="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-body" :class="sort === option.value ? 'bg-brand-primary-soft text-brand-primary font-semibold' : 'text-neutral-700'" @click="setSort(option.value); isSortOpen = false">
                        {{ option.label }}<UIcon v-if="sort === option.value" name="i-lucide-check" class="size-5" />
                    </button>
                </div>
            </template>
        </USlideover>

        <USlideover v-model:open="isFilterOpen" side="bottom" :ui="{ content: 'bg-white rounded-t-2xl' }">
            <template #header><h2 class="text-h2 font-heading text-neutral-900">{{ t("catalog.filter") }}</h2></template>
            <template #body><CatalogFilter :category="draftCategory" :price-from="priceFrom" :price-to="priceTo" @apply="applyFilters" /></template>
        </USlideover>
    </main>
</template>

<script setup lang="ts">
import { useProductsStore } from "~/stores/catalog/products";
import { useCategoriesStore } from "~/stores/catalog/categories";
import { useAuthStore } from "~/stores/identity/auth";
import { useCartStore } from "~/stores/commerce/cart";
import type { Product } from "~/types/product";
import type { Lang } from "~/composables/catalog/useProducts";

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const productsStore = useProductsStore();
const categoriesStore = useCategoriesStore();
const authStore = useAuthStore();
const cartStore = useCartStore();
const notify = useNotify();
const isLoading = ref(true);
const isSortOpen = ref(false);
const isFilterOpen = ref(false);
const sort = ref("newest");
const priceFrom = ref<number | undefined>();
const priceTo = ref<number | undefined>();
const draftCategory = ref("");
const pageSize = 20;

const categoryName = computed(() => String(route.query.category ?? ""));
const searchQuery = computed(() => String(route.query.search ?? ""));
const currentPage = computed(() => Math.max(1, Number(route.query.page ?? 1) || 1));
const category = computed(() => categoryName.value ? categoriesStore.byName(categoryName.value) : undefined);
const pageTitle = computed(() => categoryName.value || (searchQuery.value ? t("catalog.searchTitle", { query: searchQuery.value }) : t("catalog.allProducts")));
const breadcrumbLabel = computed(() => categoryName.value || (searchQuery.value ? t("catalog.searchResults") : t("catalog.catalogLabel")));
const totalPages = computed(() => productsStore.catalogPagination?.total_pages ?? 1);
const products = computed(() => productsStore.catalogItems);

const sortOptions = computed(() => [
    { value: "lowest", label: t("catalog.sortLowest") },
    { value: "highest", label: t("catalog.sortHighest") },
    { value: "newest", label: t("catalog.sortNewest") },
    { value: "bestSelling", label: t("catalog.sortBestSelling") },
    { value: "discount", label: t("catalog.sortDiscount") },
]);

const displayedProducts = computed(() => {
    const result = products.value.filter((product) => {
        const price = product.final_price_amount ?? product.price_amount;
        return (priceFrom.value == null || price >= priceFrom.value) && (priceTo.value == null || price <= priceTo.value);
    });
    return result.sort((a, b) => {
        if (sort.value === "lowest") return effectivePrice(a) - effectivePrice(b);
        if (sort.value === "highest") return effectivePrice(b) - effectivePrice(a);
        if (sort.value === "bestSelling") return b.sold_count - a.sold_count;
        if (sort.value === "discount") return discountPercent(b) - discountPercent(a);
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
});

function effectivePrice(product: Product) {
    return product.final_price_amount ?? product.price_amount;
}
function discountPercent(product: Product) {
    return product.price_amount ? (1 - effectivePrice(product) / product.price_amount) * 100 : 0;
}

async function loadProducts() {
    isLoading.value = true;
    try {
        await categoriesStore.fetchAll(false, locale.value as Lang);
        await productsStore.fetchCatalog({
            category_id: category.value?.id,
            search: searchQuery.value || undefined,
            lang: locale.value as Lang,
            page: currentPage.value,
            page_size: pageSize,
        });
    } catch {
        // Xato useApi tomonidan ko'rsatiladi.
    } finally {
        isLoading.value = false;
    }
}

function setSort(value: string) {
    sort.value = value;
}
function goToPage(page: number) {
    if (page < 1 || page > totalPages.value || page === currentPage.value) return;
    router.replace({ query: { ...route.query, page: String(page) } });
}
function applyFilters(value: { category: string; priceFrom?: number; priceTo?: number }) {
    priceFrom.value = value.priceFrom;
    priceTo.value = value.priceTo;
    draftCategory.value = value.category;
    const query = { ...route.query, page: "1" } as Record<string, string>;
    if (draftCategory.value) query.category = draftCategory.value;
    else delete query.category;
    router.replace({ query });
    isFilterOpen.value = false;
}

async function onAddToCart(product: Product) {
    if (!authStore.initialized) await authStore.fetchMe();
    if (!authStore.isAuthenticated) {
        notify.info(t("product.loginToAddToCart"));
        await navigateTo(`/auth/login?redirect=${route.fullPath}`);
        return;
    }
    await cartStore.addItem(product.id);
    notify.success(t("product.addedToCart", { name: product.name }));
}

watch([categoryName, searchQuery, currentPage, locale], loadProducts, { immediate: true });
watch(categoryName, (value) => { draftCategory.value = value; }, { immediate: true });
useHead(() => ({ title: `${pageTitle.value} — ${t("catalog.pageTitleFallback")}` }));
</script>
