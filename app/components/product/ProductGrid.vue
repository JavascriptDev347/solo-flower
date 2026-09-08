<template>
    <section class="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 py-6 md:py-8">
        <h2 v-if="title" class="text-h2 font-heading text-center text-neutral-900 mb-5 md:mb-6">
            {{ title }}
        </h2>

        <div v-if="pending" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            <div
                v-for="n in 8"
                :key="n"
                class="rounded-2xl border border-neutral-200 overflow-hidden"
            >
                <USkeleton class="w-full aspect-square rounded-none" />
                <div class="p-3 space-y-2">
                    <USkeleton class="h-4 w-full" />
                    <USkeleton class="h-4 w-1/3" />
                </div>
            </div>
        </div>

        <div v-else-if="products.length === 0" class="text-center text-neutral-500 py-10">
            {{ t("product.empty") }}
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            <ProductCard
                v-for="p in products"
                :key="p.id"
                :product="p"
                @add-to-cart="onAddToCart"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
import { useProductsStore } from "~/stores/catalog/products";
import { useAuthStore } from "~/stores/identity/auth";
import { useCartStore } from "~/stores/cart";
import type { Product } from "~/types/product";
import type { Lang } from "~/composables/catalog/useProducts";

interface Props {
    title?: string;
}
const props = withDefaults(defineProps<Props>(), {
    title: undefined,
});

const { t, locale } = useI18n();
const title = computed(() => props.title ?? t("product.title"));

const store = useProductsStore();
const authStore = useAuthStore();
const cartStore = useCartStore();
const notify = useNotify();
const route = useRoute();

try {
    await store.fetchAll({ lang: locale.value as Lang }); // agar allaqachon yuklangan bo'lsa, qayta so'rov yubormaydi
} catch {
    // xato allaqachon useApi ichida notify qilingan — sahifani buzmaymiz
}

watch(locale, (newLocale) => {
    store.fetchAll({ lang: newLocale as Lang }).catch(() => {});
});

const products = computed(() => store.items);
const pending = computed(() => store.loading);

async function onAddToCart(product: Product) {
    if (!authStore.initialized) {
        await authStore.fetchMe();
    }
    if (!authStore.isAuthenticated) {
        notify.info(t("product.loginToAddToCart"));
        await navigateTo(`/auth/login?redirect=${route.fullPath}`);
        return;
    }

    cartStore.add(product);
    notify.success(t("product.addedToCart", { name: product.name }));
}
</script>
