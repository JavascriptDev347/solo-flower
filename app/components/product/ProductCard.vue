<template>
    <div class="product-card">
        <!-- Rasm qismi -->
        <div class="card-media">
            <img
                v-if="coverImage"
                :src="coverImage"
                :alt="product.name"
                class="card-image"
            />
            <div v-else class="card-image-placeholder">
                <UIcon name="i-lucide-image-off" class="size-8" />
            </div>

            <!-- Holat belgisi (mavjud emas) -->
            <span
                v-if="!product.is_available"
                class="status-badge status-unavailable"
            >
                Tugagan
            </span>
        </div>

        <!-- Kontent qismi -->
        <div class="card-body">
            <!-- Mahsulot nomi -->
            <h3 class="card-title">
                <NuxtLink
                    :to="`/product/${product.slug}`"
                    class="card-title-link"
                >
                    {{ product.name }}
                </NuxtLink>
            </h3>

            <!-- Reyting va Sevimlilar (bitta qatorda) -->
            <div class="rating-wishlist-row">
                <div v-if="product.rating" class="card-rating">
                    <UIcon name="i-lucide-star" class="size-4 star-filled" />
                    <span>{{ Number(product.rating).toFixed(1) }}</span>
                </div>
                <div v-else></div>

                <button
                    type="button"
                    class="wishlist-btn"
                    :class="{ active: isWishlisted }"
                    :aria-pressed="isWishlisted"
                    @click.stop="$emit('toggle-wishlist', product)"
                >
                    <UIcon name="i-lucide-heart" class="size-5" />
                </button>
            </div>

            <div class="divider"></div>

            <!-- Narxlar va Chegirma foizi -->
            <div class="price-discount-row">
                <div class="price-stack">
                    <span class="price-final">
                        {{
                            formatPrice(
                                product.final_price_amount ??
                                    product.price_amount,
                                product.price_currency,
                            )
                        }}
                    </span>
                    <span v-if="product.discount_amount" class="price-original">
                        {{
                            formatPrice(
                                product.price_amount,
                                product.price_currency,
                            )
                        }}
                    </span>
                </div>

                <span
                    v-if="discountPercent"
                    class="status-badge status-discount"
                >
                    -{{ discountPercent }}%
                </span>
            </div>

            <!-- Pastki Savatga tugmasi -->
            <div class="cart-action">
                <UButton
                    label="Savatga"
                    trailing-icon="i-lucide-shopping-cart"
                    size="md"
                    block
                    :disabled="!product.is_available"
                    class="add-to-cart-btn bg-brand-maroon hover:bg-brand-maroon-soft text-white rounded-full"
                    @click.stop="$emit('add-to-cart', product)"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Product } from "~/types/product";

const props = defineProps<{
    product: Product;
    isWishlisted?: boolean;
}>();

defineEmits<{
    (e: "toggle-wishlist", product: Product): void;
    (e: "add-to-cart", product: Product): void;
}>();

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

<style scoped>
.product-card {
    display: flex;
    flex-direction: column;
    width: 320px;
    background: #ffffff;
    border: 1px solid #fecdd3;
    border-radius: 28px;
    padding: 14px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
    transition:
        transform 0.2s,
        box-shadow 0.2s;
}

.product-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
}

.card-media {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 20px;
    overflow: hidden;
    background: #fdf2f4;
}

.card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.card-image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fda4af;
}

.status-badge {
    font-size: 13px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 999px;
}

.status-unavailable {
    position: absolute;
    top: 10px;
    left: 10px;
    background: #71717a;
    color: #fff;
}

.status-discount {
    background: #ffe4e6;
    color: #e11d48;
}

.card-body {
    display: flex;
    flex-direction: column;
    padding: 12px 6px 4px;
}

.card-title {
    font-size: 16px;
    font-weight: 700;
    color: #1f2937;
    line-height: 1.4;
    margin: 0 0 10px;
    text-align: left;
}

.card-title-link {
    color: inherit;
    text-decoration: none;
}

.rating-wishlist-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.card-rating {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
}

.star-filled {
    color: #e11d48;
}

.wishlist-btn {
    background: transparent;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
        color 0.15s,
        transform 0.15s;
}

.wishlist-btn:hover {
    transform: scale(1.1);
    color: #e11d48;
}

.wishlist-btn.active {
    color: #e11d48;
}

.wishlist-btn.active :deep(svg) {
    fill: currentColor;
}

.divider {
    height: 1px;
    background-color: #f3f4f6;
    margin: 10px 0;
}

.price-discount-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}

.price-stack {
    display: flex;
    flex-direction: column;
    text-align: left;
}

.price-final {
    font-size: 18px;
    font-weight: 800;
    color: #111827;
}

.price-original {
    font-size: 13px;
    color: #9ca3af;
    text-decoration: line-through;
}

.cart-action {
    margin-top: 4px;
}
</style>
