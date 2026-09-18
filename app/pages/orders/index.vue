<template>
    <main class="mx-auto max-w-7xl px-4 py-8 pb-24 sm:px-6 lg:px-10">
        <div class="mb-8">
            <h1 class="text-display-sm font-heading text-neutral-900">
                {{ t("orders.title") }}
            </h1>
            <p class="mt-2 text-body text-neutral-600">
                {{ t("orders.count", { count: orders.length }) }}
            </p>
        </div>

        <div v-if="isLoading" class="space-y-4">
            <div
                v-for="n in 4"
                :key="n"
                class="rounded-2xl border border-neutral-200 bg-white p-5"
            >
                <div class="flex items-start justify-between gap-4">
                    <div class="space-y-3">
                        <USkeleton class="h-5 w-36" />
                        <USkeleton class="h-4 w-48" />
                    </div>
                    <USkeleton class="h-6 w-24" />
                </div>
                <div class="mt-6 flex flex-wrap gap-3">
                    <USkeleton class="h-4 w-28" />
                    <USkeleton class="h-4 w-24" />
                    <USkeleton class="h-4 w-32" />
                </div>
            </div>
        </div>

        <div v-else-if="orders.length === 0" class="rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center">
            <UIcon name="i-lucide-package-search" class="mx-auto size-14 text-neutral-400" />
            <h2 class="mt-5 text-h2 font-heading text-neutral-900">{{ t("orders.emptyTitle") }}</h2>
            <p class="mx-auto mt-2 max-w-md text-body text-neutral-600">{{ t("orders.emptySubtitle") }}</p>
            <UButton
                :label="t('orders.backToCatalog')"
                to="/catalog"
                class="mt-6 rounded-full bg-brand-primary px-6 font-bold text-white hover:bg-brand-primary-hover"
            />
        </div>

        <div v-else class="space-y-4">
            <NuxtLink
                v-for="order in orders"
                :key="order.id"
                :to="`/orders/${order.id}`"
                class="block rounded-2xl border border-neutral-200 bg-white p-5 transition-colors hover:border-brand-primary sm:p-6"
            >
                <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p class="text-caption text-neutral-500">{{ t("orders.orderId") }}</p>
                        <h2 class="mt-1 break-all font-semibold text-neutral-900">{{ shortOrderId(order.id) }}</h2>
                        <p class="mt-2 text-caption text-neutral-600">{{ formatDate(order.created_at) }}</p>
                    </div>
                    <p class="text-h3 font-bold text-neutral-900">{{ formatPrice(order.total_amount, order.total_currency) }}</p>
                </div>

                <div class="mt-5 flex flex-wrap items-center gap-2">
                    <span class="text-caption text-neutral-600">
                        {{ t("orders.itemsCount", { count: order.items.reduce((sum, item) => sum + item.quantity, 0) }) }}
                    </span>
                    <span class="rounded-full bg-brand-primary-soft px-3 py-1 text-caption font-semibold text-brand-primary">
                        {{ t(`checkout.paymentStatus.${order.payment_status}`) }}
                    </span>
                    <span class="rounded-full bg-brand-primary-soft px-3 py-1 text-caption font-semibold text-brand-primary">
                        {{ t(`checkout.deliveryStatus.${order.delivery_status}`) }}
                    </span>
                </div>
            </NuxtLink>
        </div>
    </main>
</template>

<script setup lang="ts">
import { useOrders } from "~/composables/commerce/useOrders";
import type { Order } from "~/types/order";

definePageMeta({ middleware: "auth" });

const { t } = useI18n();
const { list } = useOrders();
const orders = ref<Order[]>([]);
const isLoading = ref(true);

function formatPrice(amount: number, currency: string) {
    return `${amount.toLocaleString("uz-UZ")} ${currency}`;
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("uz-UZ", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function shortOrderId(id: string) {
    return id.length > 12 ? `${id.slice(0, 8)}…${id.slice(-4)}` : id;
}

try {
    orders.value = (await list()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
} finally {
    isLoading.value = false;
}

useHead(() => ({ title: t("orders.pageTitle") }));
</script>
