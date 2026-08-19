<template>
    <div class="product-card">
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

            <!-- Chapda: mavjudlik / chegirma belgisi -->
            <span
                v-if="!product.is_available"
                class="status-badge status-unavailable"
            >
                Tugagan
            </span>
            <span
                v-else-if="discountPercent"
                class="status-badge status-discount"
            >
                -{{ discountPercent }}%
            </span>

            <!-- O'ngda: sevimlilar tugmasi -->
            <button
                type="button"
                class="wishlist-btn"
                :class="{ active: isWishlisted }"
                :aria-pressed="isWishlisted"
                @click.stop="$emit('toggle-wishlist', product)"
            >
                <UIcon name="i-lucide-heart" class="size-4" />
            </button>
        </div>

        <div class="card-body">
            <h3 class="card-title">{{ product.name }}</h3>

            <div v-show="product.rating" class="card-rating">
                <UIcon name="i-lucide-star" class="size-3.5 star-filled" />
                <span>{{ product.rating.toFixed(1) }}</span>
            </div>

            <div class="card-price-row">
                <span class="price-final">
                    {{
                        formatPrice(
                            product.final_price_amount,
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

            <!-- Savatga qo'shish (rasm ustiga chiqmaydi) -->
            <div class="hover-actions">
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
    return Math.round(
        (1 - props.product.final_price_amount / props.product.price_amount) *
            100,
    );
});

function formatPrice(amount: number, currency: string) {
    return `${amount.toLocaleString("uz-UZ")} ${currency}`;
}
</script>

<style scoped>
.product-card {
    display: flex;
    flex-direction: column;
    height: 530px;
    width: 370px;
    background: #fff;
    border: 1px solid #e4e4e7;
    border-radius: 24px;
    padding: 14px;
    transition:
        border-color 0.2s,
        box-shadow 0.2s,
        transform 0.2s;
}
.product-card:hover {
    border-color: transparent;
    box-shadow: 0 12px 28px -12px rgba(26, 26, 26, 0.18);
    transform: translateY(-2px);
}
@media (max-width: 640px) {
    .product-card {
        width: 330px;
        height: 430px;
    }
}

/* Media: qolgan bo'sh joyni egallaydi, karta balandligi doim bir xil bo'lishi
   uchun aspect-ratio o'rniga flex bilan hisoblanadi */
.card-media {
    position: relative;
    width: 100%;
    flex: 1 1 auto;
    min-height: 0;
    border-radius: 20px;
    overflow: hidden;
    background: #f4f4f5;
}
.card-image {
    width: 100%;
    height: 100%;
    object-fit: cover; /* scale-down o'rniga */
    object-position: center;
    display: block;
    transition: transform 0.35s ease;
}
.product-card:hover .card-image {
    transform: scale(1.04);
}
.card-image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #b0b0b8;
}

/* LTR uchun: status belgisi chap tomonda, sevimlilar tugmasi o'ng tomonda */
.status-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 999px;
    z-index: 1;
}
.status-unavailable {
    background: #9a9aa2;
    color: #fff;
}
.status-discount {
    color: #fff;
    background: var(--color-error, #e5484d);
}

.wishlist-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.9);
    color: #6b6b73;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 1;
    transition:
        color 0.15s,
        transform 0.15s;
}
.wishlist-btn:hover {
    transform: scale(1.08);
}
.wishlist-btn.active {
    color: var(--color-primary, #e0568c);
}
.wishlist-btn.active :deep(svg) {
    fill: currentColor;
}

/* Savatga tugmasi doim ko'rinadi va karta oxirida pastga yopishib turadi */
.hover-actions {
    margin-top: auto;
    padding-top: 10px;
}
.add-to-cart-btn {
    width: 100%;
    justify-content: center;
}

/* Body: media qolgan joyni egallagani uchun body o'ziga kerakli joyni
   oladi, savatga tugmasi esa har doim uning tagida (karta oxirida) qoladi */
.card-body {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    padding: 14px 4px 4px;
}
.card-title {
    font-size: 15px;
    font-weight: 600;
    color: #1a1a1a;
    line-height: 1.35;
    margin: 0 0 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-rating {
    display: flex;
    align-items: center;
    gap: 4px;
    min-height: 18px;
    font-size: 13px;
    color: #1a1a1a;
    margin-bottom: 10px;
}
.star-filled {
    color: #f5a623;
}

.card-price-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
    flex-wrap: wrap;
}
.price-final {
    font-size: 17px;
    font-weight: 700;
    color: var(--color-primary, #e0568c);
}
.price-original {
    font-size: 13px;
    color: #9a9aa2;
    text-decoration: line-through;
}

@media (prefers-reduced-motion: reduce) {
    .product-card,
    .card-image,
    .hover-actions,
    .wishlist-btn {
        transition: none;
    }
}
</style>
