<template>
    <NuxtLink
        :to="`/product/${product.slug}`"
        class="group flex flex-col rounded-2xl border border-neutral-200 bg-white overflow-hidden transition-colors hover:border-brand-primary"
    >
        <!-- Rasm qismi -->
        <div class="relative aspect-square bg-brand-cream">
            <img
                v-if="coverImage"
                :src="coverImage"
                :alt="product.name"
                class="w-full h-full object-cover"
            />
            <div
                v-else
                class="w-full h-full flex items-center justify-center text-neutral-400"
            >
                <UIcon name="i-lucide-image-off" class="size-8" />
            </div>

            <!-- Chap yuqori burchak: mavjud emas yoki chegirma foizi -->
            <span
                v-if="!product.is_available"
                class="absolute top-2 left-2 rounded-full bg-neutral-500 text-white text-caption font-semibold px-2.5 py-1"
            >
                {{ t("product.unavailable") }}
            </span>
            <span
                v-else-if="discountPercent"
                class="absolute top-2 left-2 rounded-full bg-brand-primary-soft text-brand-primary text-caption font-semibold px-2.5 py-1"
            >
                -{{ discountPercent }}%
            </span>

            <!-- O'ng yuqori burchak: sevimlilar (navigatsiyani to'xtatish uchun stop) -->
            <button
                type="button"
                class="absolute top-2 right-2 size-8 rounded-full bg-white shadow-sm flex items-center justify-center transition-colors"
                :class="isWishlisted ? 'text-brand-primary' : 'text-neutral-500 hover:text-brand-primary'"
                :aria-pressed="isWishlisted"
                :aria-label="t('product.wishlistAria')"
                @click.stop="onToggleWishlist"
            >
                <UIcon
                    name="i-lucide-heart"
                    class="size-4"
                    :class="{ 'fill-current': isWishlisted }"
                />
            </button>
        </div>

        <!-- Kontent qismi -->
        <div class="flex flex-col gap-2 p-3">
            <h3 class="text-h3 font-bold text-neutral-900 line-clamp-2 min-h-[2.5em]">
                {{ product.name }}
            </h3>

            <div v-if="product.rating" class="flex items-center gap-1 text-caption font-semibold text-neutral-900">
                <UIcon name="i-lucide-star" class="size-4 text-brand-primary fill-current" />
                <span>{{ Number(product.rating).toFixed(1) }}</span>
            </div>

            <!-- Narxlar va chegirma foizi -->
            <div class="flex items-center flex-wrap gap-2">
                <span class="text-h3 font-bold text-neutral-900">
                    {{
                        formatPrice(
                            product.final_price_amount ?? product.price_amount,
                            product.price_currency,
                        )
                    }}
                </span>
                <span
                    v-if="product.discount_amount"
                    class="text-caption text-neutral-500 line-through"
                >
                    {{ formatPrice(product.price_amount, product.price_currency) }}
                </span>
                <span
                    v-if="discountPercent"
                    class="ml-auto rounded-full bg-brand-primary-soft text-brand-primary text-caption font-semibold px-2 py-0.5"
                >
                    -{{ discountPercent }}%
                </span>
            </div>

            <!-- Savatga qo'shish (navigatsiyani to'xtatish uchun stop) -->
            <UButton
                :label="t('product.addToCart')"
                trailing-icon="i-lucide-shopping-cart"
                size="md"
                block
                :disabled="!product.is_available"
                class="bg-brand-primary hover:bg-brand-primary-hover text-white rounded-full mt-1"
                @click.stop="$emit('add-to-cart', product)"
            />
        </div>
    </NuxtLink>
</template>

<script setup lang="ts">
import type { Product } from "~/types/product";

const { t } = useI18n();

const props = defineProps<{
    product: Product;
}>();

defineEmits<{
    (e: "add-to-cart", product: Product): void;
}>();

const wishlistStore = useWishlistStore();

onMounted(() => {
    wishlistStore.load();
});

const isWishlisted = computed(() => wishlistStore.has(props.product.id));

function onToggleWishlist() {
    wishlistStore.toggle(props.product.id);
}

const coverImage = computed(() => props.product.images?.[0]);

const discountPercent = computed(() => {
    if (!props.product.discount_amount) return 0;
    const finalAmount =
        props.product.final_price_amount ?? props.product.price_amount;
    return Math.round((1 - finalAmount / props.product.price_amount) * 100);
});

function formatPrice(amount: number | null | undefined, currency: string) {
    return `${(amount ?? 0).toLocaleString("uz-UZ")} ${currency}`;
}
</script>
