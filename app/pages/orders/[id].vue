<template>
    <main class="mx-auto max-w-7xl px-4 py-8 pb-24 sm:px-6 lg:px-10">
        <div v-if="isLoading" class="py-16 text-center">
            <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-brand-primary" />
        </div>

        <div v-else-if="order" class="mx-auto max-w-3xl">
            <NuxtLink to="/orders" class="inline-flex items-center gap-2 text-body font-semibold text-brand-primary hover:text-brand-primary-hover">
                <UIcon name="i-lucide-arrow-left" class="size-4" />
                {{ t("orders.backToOrders") }}
            </NuxtLink>

            <div class="mt-5 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
                <div class="text-center">
                    <div class="mx-auto flex size-16 items-center justify-center rounded-full bg-brand-primary-soft text-brand-primary">
                        <UIcon name="i-lucide-package-check" class="size-9" />
                    </div>
                    <h1 class="mt-5 text-display-sm font-heading text-neutral-900">{{ t("orders.detailTitle") }}</h1>
                </div>

                <div class="mt-8 grid gap-6 sm:grid-cols-2">
                    <div>
                        <p class="text-caption text-neutral-500">{{ t("checkout.orderId") }}</p>
                        <p class="mt-1 break-all font-semibold text-neutral-900">{{ order.id }}</p>
                    </div>
                    <div>
                        <p class="text-caption text-neutral-500">{{ t("checkout.total") }}</p>
                        <p class="mt-1 font-bold text-neutral-900">{{ formatPrice(order.total_amount, order.total_currency) }}</p>
                    </div>
                    <div>
                        <p class="text-caption text-neutral-500">{{ t("checkout.address") }}</p>
                        <p class="mt-1 text-body text-neutral-900">{{ order.address }}</p>
                    </div>
                    <div>
                        <p class="text-caption text-neutral-500">{{ t("checkout.phone") }}</p>
                        <p class="mt-1 text-body text-neutral-900">{{ order.phone }}</p>
                    </div>
                    <div v-if="order.note" class="sm:col-span-2">
                        <p class="text-caption text-neutral-500">{{ t("checkout.note") }}</p>
                        <p class="mt-1 text-body text-neutral-900">{{ order.note }}</p>
                    </div>
                </div>

                <div class="mt-6 flex flex-wrap gap-2">
                    <span class="rounded-full bg-brand-primary-soft px-3 py-1 text-caption font-semibold text-brand-primary">
                        {{ t(`checkout.paymentStatus.${order.payment_status}`) }}
                    </span>
                    <span class="rounded-full bg-brand-primary-soft px-3 py-1 text-caption font-semibold text-brand-primary">
                        {{ t(`checkout.deliveryStatus.${order.delivery_status}`) }}
                    </span>
                </div>

                <div class="mt-8 border-t border-neutral-200 pt-6">
                    <h2 class="text-h3 font-bold text-neutral-900">{{ t("checkout.itemsTitle") }}</h2>
                    <div class="mt-4 space-y-3">
                        <div v-for="item in order.items" :key="item.product_id" class="flex items-center justify-between gap-4 text-body">
                            <div class="min-w-0">
                                <p class="truncate font-semibold text-neutral-900">{{ item.product_name }}</p>
                                <p class="text-caption text-neutral-600">{{ item.quantity }} × {{ formatPrice(item.unit_price, item.currency) }}</p>
                            </div>
                            <span class="shrink-0 font-semibold text-neutral-900">{{ formatPrice(item.unit_price * item.quantity, item.currency) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { useOrders } from "~/composables/commerce/useOrders";
import type { Order } from "~/types/order";

definePageMeta({ middleware: "auth" });

const { t } = useI18n();
const route = useRoute();
const { getById } = useOrders();
const order = ref<Order | null>(null);
const isLoading = ref(true);

function formatPrice(amount: number, currency: string) {
    return `${amount.toLocaleString("uz-UZ")} ${currency}`;
}

try {
    order.value = await getById(route.params.id as string);
} catch {
    await navigateTo("/orders");
} finally {
    isLoading.value = false;
}

useHead(() => ({ title: t("orders.detailPageTitle") }));
</script>
