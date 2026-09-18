<template>
    <main class="mx-auto max-w-7xl px-4 py-8 pb-24 sm:px-6 lg:px-10">
        <div class="mb-8">
            <h1 class="text-display-sm font-heading text-neutral-900">
                {{ t("cart.title") }}
            </h1>
            <p class="mt-2 text-body text-neutral-600">
                {{ t("cart.itemCount", { count: cartStore.totalItems }) }}
            </p>
        </div>

        <div v-if="cartStore.loading && !cartStore.loaded" class="text-center py-16">
            <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-brand-primary" />
        </div>

        <div v-else-if="cartStore.items.length === 0" class="rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center">
            <UIcon name="i-lucide-shopping-basket" class="mx-auto size-14 text-neutral-400" />
            <h2 class="mt-5 text-h2 font-heading text-neutral-900">{{ t("cart.emptyTitle") }}</h2>
            <p class="mx-auto mt-2 max-w-md text-body text-neutral-600">{{ t("cart.emptySubtitle") }}</p>
            <UButton
                :label="t('cart.backToCatalog')"
                to="/"
                class="mt-6 rounded-full bg-brand-primary px-6 font-bold text-white hover:bg-brand-primary-hover"
            />
        </div>

        <div v-else class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section class="space-y-4" :aria-label="t('cart.itemsLabel')">
                <article
                    v-for="item in cartStore.items"
                    :key="item.product_id"
                    class="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5"
                >
                    <div v-if="!item.available" class="flex items-center justify-between gap-4">
                        <div class="flex items-center gap-3 text-error">
                            <UIcon name="i-lucide-circle-alert" class="size-6 shrink-0" />
                            <p class="text-body font-semibold">{{ t("cart.unavailable") }}</p>
                        </div>
                        <UButton
                            icon="i-lucide-trash-2"
                            color="error"
                            variant="ghost"
                            :aria-label="t('cart.removeAria')"
                            :loading="removingId === item.product_id"
                            @click="removeItem(item.product_id)"
                        />
                    </div>

                    <div v-else class="flex gap-4">
                        <div class="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-cream sm:size-32">
                            <img
                                v-if="productImage(item.product_id)"
                                :src="productImage(item.product_id)"
                                :alt="item.product_name"
                                class="size-full object-cover"
                            />
                            <UIcon v-else name="i-lucide-flower-2" class="size-8 text-brand-primary" />
                        </div>

                        <div class="min-w-0 flex-1">
                            <div class="flex items-start justify-between gap-2">
                                <h2 class="text-h3 font-bold text-neutral-900">{{ item.product_name }}</h2>
                                <UButton
                                    icon="i-lucide-trash-2"
                                    color="error"
                                    variant="ghost"
                                    class="shrink-0"
                                    :aria-label="t('cart.removeAria')"
                                    :loading="removingId === item.product_id"
                                    @click="removeItem(item.product_id)"
                                />
                            </div>

                            <div class="mt-3 flex flex-wrap items-center gap-2">
                                <span class="text-h3 font-bold text-neutral-900">
                                    {{ formatPrice(item.discount_price ?? item.unit_price, item.currency) }}
                                </span>
                                <span v-if="item.discount_price != null" class="text-caption text-neutral-500 line-through">
                                    {{ formatPrice(item.unit_price, item.currency) }}
                                </span>
                                <span v-if="discountPercent(item)" class="rounded-full bg-brand-primary-soft px-2 py-0.5 text-caption font-semibold text-brand-primary">
                                    -{{ discountPercent(item) }}%
                                </span>
                            </div>

                            <div class="mt-4 flex items-center justify-between gap-3">
                                <span class="text-caption text-neutral-600">{{ formatPrice(item.subtotal, item.currency) }}</span>
                                <div class="flex items-center overflow-hidden rounded-full bg-neutral-50">
                                    <UButton
                                        :icon="item.quantity === 1 ? 'i-lucide-trash-2' : 'i-lucide-minus'"
                                        color="neutral"
                                        variant="ghost"
                                        class="size-9 justify-center text-error"
                                        :aria-label="item.quantity === 1 ? t('cart.removeAria') : t('cart.decreaseAria')"
                                        :loading="updatingId === item.product_id"
                                        @click="item.quantity === 1 ? removeItem(item.product_id) : updateQuantity(item.product_id, item.quantity - 1)"
                                    />
                                    <span class="flex size-9 items-center justify-center rounded-full bg-white text-sm font-bold text-neutral-900">{{ item.quantity }}</span>
                                    <UButton
                                        icon="i-lucide-plus"
                                        color="neutral"
                                        variant="ghost"
                                        class="size-9 justify-center"
                                        :aria-label="t('cart.increaseAria')"
                                        :loading="updatingId === item.product_id"
                                        @click="updateQuantity(item.product_id, item.quantity + 1)"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </section>

            <aside class="h-fit rounded-2xl border border-neutral-200 bg-white p-5 lg:sticky lg:top-6">
                <h2 class="text-h3 font-bold text-neutral-900">{{ t("cart.summaryTitle") }}</h2>
                <div class="mt-5 space-y-3 text-body">
                    <div class="flex justify-between gap-4 text-neutral-600">
                        <span>{{ t("cart.subtotal") }}</span>
                        <span>{{ formatPrice(subtotal, summaryCurrency) }}</span>
                    </div>
                    <div class="flex justify-between gap-4 text-neutral-600">
                        <span>{{ t("cart.discount") }}</span>
                        <span>-{{ formatPrice(discountTotal, summaryCurrency) }}</span>
                    </div>
                    <div class="border-t border-neutral-200 pt-4">
                        <div class="flex justify-between gap-4 text-h3 font-bold text-neutral-900">
                            <span>{{ t("cart.grandTotal") }}</span>
                            <span>{{ formatPrice(cartStore.totalPrice, summaryCurrency) }}</span>
                        </div>
                    </div>
                </div>
                <UButton
                    :label="t('cart.continue')"
                    to="/checkout"
                    block
                    size="lg"
                    class="mt-6 rounded-full bg-brand-primary font-bold text-white hover:bg-brand-primary-hover"
                />
            </aside>
        </div>
    </main>
</template>

<script setup lang="ts">
import { useCartStore } from "~/stores/commerce/cart";
import { useProductsStore } from "~/stores/catalog/products";
import type { CartItem } from "~/types/cart";

definePageMeta({ middleware: "auth" });

const { t } = useI18n();
const cartStore = useCartStore();
const productsStore = useProductsStore();
const updatingId = ref<string | null>(null);
const removingId = ref<string | null>(null);

await cartStore.fetch();

const productImage = (productId: string) =>
    [...productsStore.items, ...productsStore.catalogItems].find((product) => product.id === productId)?.images[0];

const discountTotal = computed(() =>
    cartStore.items.reduce(
        (sum, item) =>
            sum + (item.discount_price != null ? (item.unit_price - item.discount_price) * item.quantity : 0),
        0,
    ),
);
const subtotal = computed(() => cartStore.totalPrice + discountTotal.value);
const summaryCurrency = computed(() => cartStore.items.find((item) => item.available)?.currency ?? "UZS");

function discountPercent(item: CartItem) {
    if (item.discount_price == null || item.unit_price <= 0) return 0;
    return Math.round((1 - item.discount_price / item.unit_price) * 100);
}

function formatPrice(amount: number, currency: string) {
    return `${amount.toLocaleString("uz-UZ")} ${currency}`;
}

async function updateQuantity(productId: string, quantity: number) {
    updatingId.value = productId;
    try {
        await cartStore.setQuantity(productId, quantity);
    } finally {
        updatingId.value = null;
    }
}

async function removeItem(productId: string) {
    removingId.value = productId;
    try {
        await cartStore.removeItem(productId);
    } finally {
        removingId.value = null;
    }
}

useHead(() => ({ title: t("cart.pageTitle") }));
</script>
