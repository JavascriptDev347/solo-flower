<template>
    <main class="mx-auto max-w-7xl px-4 py-8 pb-24 sm:px-6 lg:px-10">
        <div v-if="order" class="mx-auto max-w-3xl">
            <div class="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
                <div class="text-center">
                    <div class="mx-auto flex size-16 items-center justify-center rounded-full bg-brand-primary-soft text-brand-primary">
                        <UIcon name="i-lucide-circle-check" class="size-9" />
                    </div>
                    <h1 class="mt-5 text-display-sm font-heading text-neutral-900">{{ t("checkout.successTitle") }}</h1>
                    <p class="mt-2 text-body text-neutral-600">{{ t("checkout.successMessage") }}</p>
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

                <div class="mt-8 grid gap-3 sm:grid-cols-2">
                    <UButton
                        :label="t('checkout.continueShopping')"
                        to="/catalog"
                        block
                        size="lg"
                        class="rounded-full bg-brand-primary font-bold text-white hover:bg-brand-primary-hover"
                    />
                    <UButton
                        :label="t('checkout.viewOrder')"
                        :to="`/orders/${order.id}`"
                        block
                        size="lg"
                        variant="outline"
                        color="neutral"
                        class="rounded-full"
                    />
                </div>
            </div>
        </div>

        <template v-else>
            <div class="mb-8">
                <h1 class="text-display-sm font-heading text-neutral-900">{{ t("checkout.title") }}</h1>
                <p class="mt-2 text-body text-neutral-600">{{ t("checkout.subtitle") }}</p>
            </div>

            <div v-if="cartStore.loading && !cartStore.loaded" class="py-16 text-center">
                <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-brand-primary" />
            </div>

            <div v-else class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                <form id="checkout-form" class="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6" @submit.prevent="submit">
                    <div class="space-y-5">
                        <div>
                            <label for="checkout-address" class="mb-2 block text-body font-semibold text-neutral-900">{{ t("checkout.address") }}</label>
                            <UTextarea
                                id="checkout-address"
                                v-model="address"
                                :placeholder="t('checkout.addressPlaceholder')"
                                :rows="4"
                                :color="addressError ? 'error' : 'neutral'"
                                class="w-full"
                            />
                            <p v-if="addressError" class="mt-1 text-caption text-error">{{ addressError }}</p>
                        </div>

                        <div>
                            <label for="checkout-phone" class="mb-2 block text-body font-semibold text-neutral-900">{{ t("checkout.phone") }}</label>
                            <UInput
                                id="checkout-phone"
                                v-model="phone"
                                type="tel"
                                :placeholder="t('checkout.phonePlaceholder')"
                                :color="phoneError ? 'error' : 'neutral'"
                                class="w-full"
                            />
                            <p v-if="phoneError" class="mt-1 text-caption text-error">{{ phoneError }}</p>
                        </div>

                        <div>
                            <label for="checkout-note" class="mb-2 block text-body font-semibold text-neutral-900">{{ t("checkout.note") }}</label>
                            <UTextarea
                                id="checkout-note"
                                v-model="note"
                                :placeholder="t('checkout.notePlaceholder')"
                                :rows="3"
                                class="w-full"
                            />
                        </div>
                    </div>
                </form>

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
                        type="submit"
                        form="checkout-form"
                        :label="t('checkout.submit')"
                        :loading="submitting"
                        block
                        size="lg"
                        class="mt-6 rounded-full bg-brand-primary font-bold text-white hover:bg-brand-primary-hover"
                    />
                </aside>
            </div>
        </template>
    </main>
</template>

<script setup lang="ts">
import { useCartStore } from "~/stores/commerce/cart";
import { useOrders } from "~/composables/commerce/useOrders";
import type { Order } from "~/types/order";

definePageMeta({ middleware: "auth" });

const { t } = useI18n();
const cartStore = useCartStore();
const { checkout } = useOrders();
const address = ref("");
const phone = ref("+998");
const note = ref("");
const addressError = ref("");
const phoneError = ref("");
const submitting = ref(false);
const order = ref<Order | null>(null);

await cartStore.fetch();
if (cartStore.items.length === 0) {
    await navigateTo("/cart");
}

const discountTotal = computed(() =>
    cartStore.items.reduce(
        (sum, item) =>
            sum + (item.discount_price != null ? (item.unit_price - item.discount_price) * item.quantity : 0),
        0,
    ),
);
const subtotal = computed(() => cartStore.totalPrice + discountTotal.value);
const summaryCurrency = computed(() => cartStore.items.find((item) => item.available)?.currency ?? "UZS");

function formatPrice(amount: number, currency: string) {
    return `${amount.toLocaleString("uz-UZ")} ${currency}`;
}

function validate() {
    addressError.value = address.value.trim() ? "" : t("checkout.addressRequired");
    phoneError.value = /^\+998\d{9}$/.test(phone.value.trim()) ? "" : t("checkout.phoneInvalid");
    return !addressError.value && !phoneError.value;
}

async function submit() {
    if (submitting.value || !validate()) return;

    submitting.value = true;
    try {
        order.value = await checkout({
            address: address.value.trim(),
            phone: phone.value.trim(),
            note: note.value.trim() || undefined,
        });
        cartStore.reset();
    } finally {
        submitting.value = false;
    }
}

useHead(() => ({ title: t("checkout.pageTitle") }));
</script>
