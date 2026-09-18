<template>
    <main class="mx-auto max-w-7xl px-4 py-8 pb-24 sm:px-6 lg:px-10">
        <div class="mb-8">
            <h1 class="text-display-sm font-heading text-neutral-900">
                {{ t("wishlist.title") }}
            </h1>
            <p class="mt-2 text-body text-neutral-600">
                {{ t("wishlist.itemCount", { count: products.length }) }}
            </p>
        </div>

        <div v-if="isLoading" class="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            <div
                v-for="n in 8"
                :key="n"
                class="overflow-hidden rounded-2xl border border-neutral-200"
            >
                <USkeleton class="aspect-square w-full rounded-none" />
                <div class="space-y-2 p-3">
                    <USkeleton class="h-4 w-full" />
                    <USkeleton class="h-4 w-1/3" />
                </div>
            </div>
        </div>

        <div v-else-if="products.length === 0" class="rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center">
            <UIcon name="i-lucide-heart" class="mx-auto size-14 text-neutral-400" />
            <h2 class="mt-5 text-h2 font-heading text-neutral-900">{{ t("wishlist.emptyTitle") }}</h2>
            <p class="mx-auto mt-2 max-w-md text-body text-neutral-600">{{ t("wishlist.emptySubtitle") }}</p>
            <UButton
                :label="t('wishlist.backToCatalog')"
                to="/catalog"
                class="mt-6 rounded-full bg-brand-primary px-6 font-bold text-white hover:bg-brand-primary-hover"
            />
        </div>

        <div v-else class="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            <ProductCard
                v-for="product in products"
                :key="product.id"
                :product="product"
                @add-to-cart="onAddToCart"
            />
        </div>
    </main>
</template>

<script setup lang="ts">
import { useWishlistStore } from "~/stores/commerce/wishlist";
import { useCartStore } from "~/stores/commerce/cart";
import { useProducts } from "~/composables/catalog/useProducts";
import type { Product } from "~/types/product";

definePageMeta({ middleware: "auth" });

const { t } = useI18n();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const notify = useNotify();
const products = ref<Product[]>([]);
const isLoading = ref(true);

async function loadProducts() {
    isLoading.value = true;
    // useProducts() await'dan OLDIN chaqirilishi shart — aks holda SSR paytida
    // Nuxt konteksti yo'qolib, "composable called outside of setup" xatosi chiqadi
    // (nested async funksiya ichidagi await'lar script setup'ning maxsus
    // kontekst-saqlash kompilyatsiyasiga kirmaydi, faqat top-level await'lar kiradi)
    const { getById } = useProducts();
    try {
        await wishlistStore.fetch();
        const resolved = await Promise.allSettled(
            wishlistStore.items.map((item) => getById(item.product_id, undefined, { silent: true })),
        );
        products.value = resolved
            .filter((result): result is PromiseFulfilledResult<Product> => result.status === "fulfilled")
            .map((result) => result.value);
    } finally {
        isLoading.value = false;
    }
}

await loadProducts();

watch(
    () => wishlistStore.items.map((item) => item.product_id),
    (ids) => {
        products.value = products.value.filter((product) => ids.includes(product.id));
    },
    { deep: true },
);

async function onAddToCart(product: Product) {
    await cartStore.addItem(product.id);
    notify.success(t("product.addedToCart", { name: product.name }));
}

useHead(() => ({ title: t("wishlist.pageTitle") }));
</script>
