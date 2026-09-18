<template>
    <div class="product-page">
        <NuxtLink :to="backLink" class="back-link">
            <UIcon name="i-lucide-arrow-left" class="size-4" />
            {{ t("product.backToCatalog") }}
        </NuxtLink>

        <!-- Yuklanmoqda -->
        <div v-if="isLoading" class="product-layout">
            <div class="gallery">
                <div class="gallery-main skeleton-box" />
            </div>
            <div class="info-panel">
                <div class="skeleton-text" style="width: 40%" />
                <div class="skeleton-text" style="width: 80%; height: 28px" />
                <div class="skeleton-text" style="width: 30%" />
            </div>
        </div>

        <!-- Topilmadi -->
        <div v-else-if="notFound" class="not-found">
            <UIcon name="i-lucide-search-x" class="size-10 not-found-icon" />
            <p class="not-found-title">{{ t("product.notFoundTitle") }}</p>
            <p class="not-found-subtitle">
                {{ t("product.notFoundSubtitle") }}
            </p>
            <NuxtLink :to="backLink" class="back-link">
                {{ t("product.backToCatalog") }}
            </NuxtLink>
        </div>
        <!-- Mahsulot -->
        <template v-else-if="product">
            <div class="product-layout">
                <!-- Chap: galereya -->
                <div class="gallery">
                    <div class="gallery-main">
                        <img
                            v-if="activeImage"
                            :src="activeImage"
                            :alt="product.name"
                        />
                        <div v-else class="gallery-placeholder">
                            <UIcon name="i-lucide-image-off" class="size-8" />
                        </div>
                        <span
                            v-if="!product.is_available"
                            class="unavailable-badge"
                        >
                            {{ t("product.unavailable") }}
                        </span>
                    </div>

                    <div
                        v-if="product.images.length > 1"
                        class="gallery-thumbs"
                    >
                        <button
                            v-for="(img, i) in product.images"
                            :key="img"
                            type="button"
                            class="gallery-thumb"
                            :class="{ active: i === activeImageIndex }"
                            @click="activeImageIndex = i"
                        >
                            <img :src="img" alt="" />
                        </button>
                    </div>
                </div>

                <!-- O'ng: ma'lumotlar -->
                <div class="info-panel">
                    <NuxtLink
                        v-if="categoryName"
                        :to="{
                            path: '/catalog',
                            query: { category: categoryName },
                        }"
                        class="category-chip"
                    >
                        {{ categoryName }}
                    </NuxtLink>

                    <div class="title-row">
                        <h1 class="product-title">{{ product.name }}</h1>
                        <span v-if="product.tag" class="tag-chip">{{
                            product.tag
                        }}</span>
                    </div>

                    <div v-if="product.rating" class="rating-row">
                        <UIcon
                            name="i-lucide-star"
                            class="size-4 star-filled"
                        />
                        <span>{{ product.rating.toFixed(1) }}</span>
                        <span class="sold-count">{{
                            t("product.soldCount", { count: product.sold_count })
                        }}</span>
                    </div>

                    <div class="price-row">
                        <span class="price-final">
                            {{
                                formatPrice(
                                    product.final_price_amount ??
                                        product.price_amount,
                                    product.price_currency,
                                )
                            }}
                        </span>
                        <template v-if="product.discount_amount">
                            <span class="price-original">
                                {{
                                    formatPrice(
                                        product.price_amount,
                                        product.price_currency,
                                    )
                                }}
                            </span>
                            <span class="discount-percent">
                                -{{ discountPercent }}%
                            </span>
                        </template>
                    </div>

                    <div class="availability-row">
                        <span
                            class="badge"
                            :class="
                                product.is_available
                                    ? 'badge-green'
                                    : 'badge-gray'
                            "
                        >
                            {{
                                product.is_available
                                    ? t("product.available")
                                    : t("product.unavailableLong")
                            }}
                        </span>
                        <span v-if="product.stock" class="stock-text">
                            {{ t("product.inStock", { count: product.stock }) }}
                        </span>
                    </div>

                    <UButton
                        :label="t('product.order')"
                        trailing-icon="i-lucide-shopping-cart"
                        size="lg"
                        :disabled="!product.is_available"
                        class="order-btn bg-brand-maroon hover:bg-brand-maroon-soft text-white rounded-full"
                        @click="onAddToCart"
                    />

                </div>
            </div>

            <!-- Tavsif -->
            <div v-if="product.description" class="description-section">
                <h2 class="section-heading">{{ t("product.description") }}</h2>
                <p class="description-text">{{ product.description }}</p>
            </div>

            <!-- Sharhlar -->
            <div class="comments-section">
                <h2 class="section-heading">
                    {{ t("product.reviews", { count: reviewTotal }) }}
                </h2>
                <div v-if="reviews.length" class="comments-list">
                    <div
                        v-for="review in reviews"
                        :key="review.id"
                        class="comment-card"
                    >
                        <div class="comment-header">
                            <div class="comment-avatar">
                                <UIcon name="i-lucide-user" class="size-4" />
                            </div>
                            <div class="comment-meta">
                                <div class="comment-author">
                                    {{ t("product.verifiedBuyer") }}
                                </div>
                                <div class="comment-date">
                                    {{ formatDate(review.created_at) }}
                                </div>
                            </div>
                            <div class="comment-rating">
                                <UIcon
                                    v-for="i in 5"
                                    :key="i"
                                    name="i-lucide-star"
                                    class="size-3.5"
                                    :class="
                                        i <= review.rating
                                            ? 'star-filled'
                                            : 'star-empty'
                                    "
                                />
                            </div>
                        </div>
                        <p v-if="review.comment" class="comment-text">
                            {{ review.comment }}
                        </p>
                    </div>
                </div>
                <p v-else class="comments-empty">
                    {{ t("product.noReviews") }}
                </p>
                <button
                    v-if="hasMoreReviews"
                    type="button"
                    class="load-more-btn"
                    :disabled="isLoadingMoreReviews"
                    @click="loadMoreReviews"
                >
                    {{
                        isLoadingMoreReviews
                            ? t("product.loadingReviews")
                            : t("product.loadMoreReviews")
                    }}
                </button>

                <div v-if="canReview" class="review-form">
                    <h3 class="review-form-title">
                        {{ t("product.leaveReview") }}
                    </h3>
                    <div class="review-field">
                        <span class="review-label">
                            {{ t("product.ratingLabel") }}
                        </span>
                        <div class="review-rating-picker">
                            <button
                                v-for="i in 5"
                                :key="i"
                                type="button"
                                class="rating-star-btn"
                                :aria-label="String(i)"
                                @click="
                                    reviewRating = i;
                                    ratingError = false;
                                "
                            >
                                <UIcon
                                    name="i-lucide-star"
                                    class="size-5"
                                    :class="
                                        i <= reviewRating
                                            ? 'star-filled'
                                            : 'star-empty'
                                    "
                                />
                            </button>
                        </div>
                        <p v-if="ratingError" class="review-validation">
                            {{ t("product.ratingRequired") }}
                        </p>
                    </div>
                    <label class="review-field">
                        <span class="review-label">{{
                            t("product.commentLabel")
                        }}</span>
                        <textarea
                            v-model="reviewComment"
                            class="review-textarea"
                            :placeholder="t('product.commentPlaceholder')"
                            rows="3"
                        />
                    </label>
                    <button
                        type="button"
                        class="review-submit-btn"
                        :disabled="isSubmittingReview"
                        @click="submitReview"
                    >
                        {{
                            isSubmittingReview
                                ? t("product.submittingReview")
                                : t("product.submitReview")
                        }}
                    </button>
                </div>
            </div>
        </template>


    </div>
</template>

<script setup lang="ts">
import { useProducts } from "~/composables/catalog/useProducts";
import type { Lang } from "~/composables/catalog/useProducts";
import { useCategoriesStore } from "~/stores/catalog/categories";
import { useAuthStore } from "~/stores/identity/auth";
import { useCartStore } from "~/stores/commerce/cart";
import { useOrders } from "~/composables/commerce/useOrders";
import { useReviews } from "~/composables/commerce/useReviews";
import { ApiError } from "~/types/api";
import type { Product } from "~/types/product";
import type { Review } from "~/types/review";

const { t, locale } = useI18n();
const route = useRoute();
const { getBySlug } = useProducts();
const categoriesStore = useCategoriesStore();
const authStore = useAuthStore();
const cartStore = useCartStore();
const { list: listOrders } = useOrders();
const { list: listReviews, create: createReview } = useReviews();
const notify = useNotify();

const product = ref<Product | null>(null);
const isLoading = ref(true);
const notFound = ref(false);
const activeImageIndex = ref(0);
const selectedQuantity = ref(1);
const reviews = ref<Review[]>([]);
const reviewPagination = ref({ page: 1, total_pages: 1, total_items: 0 });
const isLoadingMoreReviews = ref(false);
const canReview = ref(false);
const reviewRating = ref(0);
const reviewComment = ref("");
const isSubmittingReview = ref(false);
const ratingError = ref(false);

const reviewTotal = computed(() => reviewPagination.value.total_items);
const hasMoreReviews = computed(
    () => reviewPagination.value.page < reviewPagination.value.total_pages,
);

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("uz-UZ", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

// Faqat "allaqachon sharh qoldirgan" holatini aniqlaydi va formani yashiradi —
// haqqoniy shart (yetkazilgan buyurtma bor-yo'qligi) loadReviewEligibility'da
// tekshiriladi, shuning uchun bu yerda hech qachon canReview'ni true qilmaymiz
function updateReviewEligibility() {
    if (reviews.value.some((review) => review.user_id === authStore.user?.user_id)) {
        canReview.value = false;
    }
}

async function loadReviews(productId: string) {
    reviews.value = [];
    reviewPagination.value = { page: 1, total_pages: 1, total_items: 0 };
    const result = await listReviews(productId);
    reviews.value = [...result.items].sort(
        (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    reviewPagination.value = result.pagination;
    updateReviewEligibility();
}

async function loadMoreReviews() {
    if (!product.value || isLoadingMoreReviews.value || !hasMoreReviews.value) {
        return;
    }
    isLoadingMoreReviews.value = true;
    try {
        const result = await listReviews(product.value.id, {
            page: reviewPagination.value.page + 1,
        });
        reviews.value.push(...result.items);
        reviewPagination.value = result.pagination;
        updateReviewEligibility();
    } finally {
        isLoadingMoreReviews.value = false;
    }
}

async function loadReviewEligibility(productId: string) {
    canReview.value = false;
    if (!authStore.initialized) await authStore.fetchMe();
    if (!authStore.isAuthenticated) return;

    const orders = await listOrders();
    canReview.value =
        orders.some(
            (order) =>
                order.delivery_status === "delivered" &&
                order.items.some((item) => item.product_id === productId),
        ) &&
        !reviews.value.some(
            (review) => review.user_id === authStore.user?.user_id,
        );
}

async function submitReview() {
    if (!product.value || reviewRating.value === 0) {
        ratingError.value = true;
        return;
    }
    ratingError.value = false;
    isSubmittingReview.value = true;
    try {
        const review = await createReview({
            product_id: product.value.id,
            rating: reviewRating.value,
            comment: reviewComment.value.trim() || undefined,
        });
        reviews.value.unshift(review);
        reviewPagination.value.total_items += 1;
        canReview.value = false;
        reviewRating.value = 0;
        reviewComment.value = "";
        notify.success(t("product.reviewSubmitted"));
    } catch (error) {
        if (error instanceof ApiError && error.status === 409) {
            canReview.value = false;
        }
    } finally {
        isSubmittingReview.value = false;
    }
}

async function loadProduct() {
    isLoading.value = true;
    notFound.value = false;
    activeImageIndex.value = 0;
    try {
        product.value = await getBySlug(
            route.params.slug as string,
            locale.value as Lang,
        );
        categoriesStore.fetchAll(false, locale.value as Lang);
        try {
            await loadReviews(product.value.id);
            await loadReviewEligibility(product.value.id);
        } catch {
            reviews.value = [];
            reviewPagination.value = { page: 1, total_pages: 1, total_items: 0 };
            canReview.value = false;
        }
    } catch {
        notFound.value = true;
        product.value = null;
    } finally {
        isLoading.value = false;
    }
}

onMounted(loadProduct);
watch([() => route.params.slug, locale], loadProduct);

const activeImage = computed(
    () => product.value?.images[activeImageIndex.value],
);

const categoryName = computed(() =>
    product.value
        ? categoriesStore.byId(product.value.category_id)?.name
        : undefined,
);

// /catalog endi faqat ?category=nomi bilan ochiladi, shuning uchun
// kategoriya noma'lum bo'lsa (masalan hali yuklanmagan yoki mahsulot
// topilmagan) bosh sahifaga qaytaramiz
const backLink = computed(() =>
    categoryName.value
        ? { path: "/catalog", query: { category: categoryName.value } }
        : "/",
);

const discountPercent = computed(() => {
    if (!product.value?.discount_amount) return 0;
    const finalAmount =
        product.value.final_price_amount ?? product.value.price_amount;
    return Math.round((1 - finalAmount / product.value.price_amount) * 100);
});

function formatPrice(amount: number | null | undefined, currency: string) {
    return `${(amount ?? 0).toLocaleString("uz-UZ")} ${currency}`;
}

async function onAddToCart() {
    if (!product.value) return;
    if (!authStore.initialized) await authStore.fetchMe();
    if (!authStore.isAuthenticated) {
        notify.info(t("product.loginToAddToCart"));
        await navigateTo(`/auth/login?redirect=${route.fullPath}`);
        return;
    }

    await cartStore.addItem(product.value.id, selectedQuantity.value ?? 1);
    notify.success(t("product.addedToCart", { name: product.value.name }));
}

useHead(() => ({
    title: product.value
        ? `${product.value.name} — ${t("product.pageTitleSuffix")}`
        : t("product.pageTitleFallback"),
}));
</script>

<style scoped>
.product-page {
    max-width: 1100px;
    margin: 0 auto;
    padding: 32px 16px 60px;
}

.back-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 500;
    color: #6b6b73;
    text-decoration: none;
    margin-bottom: 20px;
}
.back-link:hover {
    color: var(--color-primary, #e0568c);
}

.product-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
}
@media (min-width: 800px) {
    .product-layout {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        align-items: start;
    }
}

/* Galereya */
.gallery {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.gallery-main {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 20px;
    overflow: hidden;
    background: #f4f4f5;
}
.gallery-main img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}
.gallery-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #b0b0b8;
}

.unavailable-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 999px;
    background: #9a9aa2;
    color: #fff;
}

.gallery-thumbs {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}
.gallery-thumb {
    width: 64px;
    height: 64px;
    border-radius: 12px;
    overflow: hidden;
    padding: 0;
    border: 2px solid transparent;
    cursor: pointer;
    background: none;
    flex-shrink: 0;
}
.gallery-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}
.gallery-thumb.active {
    border-color: var(--color-primary, #e0568c);
}

/* Info panel */
.info-panel {
    display: flex;
    flex-direction: column;
}

.title-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
}

.tag-chip {
    flex-shrink: 0;
    font-size: 12px;
    font-weight: 600;
    color: #fff;
    background: var(--color-primary, #e0568c);
    text-transform: capitalize;
    padding: 4px 12px;
    border-radius: 999px;
}

.category-chip {
    align-self: flex-start;
    font-size: 12px;
    font-weight: 600;
    color: var(--color-primary, #e0568c);
    background: var(--color-primary-soft, #fdf0f4);
    padding: 4px 12px;
    border-radius: 999px;
    text-decoration: none;
    margin-bottom: 10px;
}

.product-title {
    font-size: 26px;
    font-weight: 700;
    color: #1a1a1a;
    line-height: 1.25;
    margin: 0 0 10px;
}

.rating-row {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: #1a1a1a;
    margin-bottom: 16px;
}
.star-filled {
    color: #f5a623;
}
.star-empty {
    color: #e4e4e7;
}
.sold-count {
    color: #9a9aa2;
}

.price-row {
    display: flex;
    align-items: baseline;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 12px;
}
.price-final {
    font-size: 26px;
    font-weight: 700;
    color: var(--color-primary, #e0568c);
}
.price-original {
    font-size: 15px;
    color: #9a9aa2;
    text-decoration: line-through;
}
.discount-percent {
    font-size: 12px;
    font-weight: 600;
    color: #fff;
    background: var(--color-error, #e5484d);
    padding: 2px 8px;
    border-radius: 999px;
}

.availability-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}
.badge {
    display: inline-block;
    font-size: 12px;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 999px;
}
.badge-green {
    background: #e7f7ed;
    color: var(--color-success, #2fa85a);
}
.badge-gray {
    background: #f4f4f5;
    color: #9a9aa2;
}
.stock-text {
    font-size: 13px;
    color: #9a9aa2;
}

.order-btn {
    width: 100%;
    justify-content: center;
    margin-bottom: 24px;
}

/* Tavsif */
.description-section {
    margin-top: 40px;
    padding-top: 24px;
    border-top: 1px solid #e4e4e7;
}
.section-heading {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 17px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 12px;
}
.description-text {
    font-size: 14px;
    line-height: 1.7;
    color: #4b4b52;
    white-space: pre-line;
    margin: 0;
}

/* Sharhlar */
.comments-section {
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid #e4e4e7;
}
.comments-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 16px;
}
.comment-card {
    background: #fafafa;
    border: 1px solid #e4e4e7;
    border-radius: 16px;
    padding: 16px;
}
.comment-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}
.comment-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--color-primary-soft, #fdf0f4);
    color: var(--color-primary, #e0568c);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.comment-meta {
    flex: 1;
    min-width: 0;
}
.comment-author {
    font-size: 14px;
    font-weight: 600;
    color: #1a1a1a;
}
.comment-date {
    font-size: 12px;
    color: #9a9aa2;
}
.comment-rating {
    display: flex;
    gap: 2px;
}
.comment-text {
    font-size: 14px;
    line-height: 1.6;
    color: #4b4b52;
    margin: 0;
}
.comments-empty {
    font-size: 13px;
    color: #9a9aa2;
    text-align: center;
    margin: 0;
}
.load-more-btn {
    display: block;
    margin: 0 auto 24px;
    padding: 8px 16px;
    border: 1px solid #e4e4e7;
    border-radius: 999px;
    background: #fff;
    color: var(--color-primary, #e0568c);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
}
.load-more-btn:hover:not(:disabled) {
    background: var(--color-primary-soft, #fdf0f4);
}
.load-more-btn:disabled {
    cursor: default;
    opacity: 0.6;
}
.review-form {
    margin-top: 24px;
    padding: 18px;
    border: 1px solid #e4e4e7;
    border-radius: 16px;
    background: #fff;
}
.review-form-title {
    margin: 0 0 16px;
    color: #1a1a1a;
    font-size: 16px;
    font-weight: 600;
}
.review-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 14px;
}
.review-label {
    color: #4b4b52;
    font-size: 13px;
    font-weight: 600;
}
.review-rating-picker {
    display: flex;
    gap: 4px;
}
.rating-star-btn {
    padding: 2px;
    border: 0;
    background: transparent;
    cursor: pointer;
}
.rating-star-btn:hover .star-empty {
    color: #f5a623;
}
.review-textarea {
    width: 100%;
    resize: vertical;
    padding: 10px 12px;
    border: 1px solid #e4e4e7;
    border-radius: 10px;
    color: #1a1a1a;
    font: inherit;
    font-size: 14px;
    outline: none;
}
.review-textarea:focus {
    border-color: var(--color-primary, #e0568c);
}
.review-validation {
    margin: 0;
    color: var(--color-error, #e5484d);
    font-size: 12px;
}
.review-submit-btn {
    padding: 9px 18px;
    border: 0;
    border-radius: 999px;
    background: var(--color-primary, #e0568c);
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
}
.review-submit-btn:hover:not(:disabled) {
    opacity: 0.9;
}
.review-submit-btn:disabled {
    cursor: default;
    opacity: 0.6;
}

/* Topilmadi */
.not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    text-align: center;
    gap: 4px;
}
.not-found-icon {
    color: #b0b0b8;
    margin-bottom: 12px;
}
.not-found-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0;
}
.not-found-subtitle {
    font-size: 14px;
    color: #9a9aa2;
    margin: 0 0 16px;
}

/* Skeleton */
.skeleton-box {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 20px;
    background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
}
.skeleton-text {
    height: 16px;
    border-radius: 6px;
    margin-bottom: 14px;
    background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
}
@keyframes shimmer {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}
</style>
