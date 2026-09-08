<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 pt-4 md:pt-8 pb-44 md:pb-16">
        <!-- 4.1.1 — mobil top bar: orqaga / sarlavha / qo'shimcha amallar -->
        <div
            class="md:hidden grid grid-cols-[auto_1fr_auto] items-center gap-2 mb-4"
        >
            <button
                type="button"
                class="size-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-600"
                :aria-label="t('productDetails.backAria')"
                @click="navigateTo(backLink)"
            >
                <UIcon name="i-lucide-chevron-left" class="size-5" />
            </button>
            <h1
                class="text-center text-h3 font-heading font-semibold text-neutral-900 truncate"
            >
                {{ t("productDetails.title") }}
            </h1>
            <button
                type="button"
                class="size-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-600"
                :aria-label="t('productDetails.moreOptionsAria')"
            >
                <UIcon name="i-lucide-ellipsis" class="size-5" />
            </button>
        </div>

        <!-- 4.2 — desktopda breadcrumb/header qatori -->
        <div class="hidden md:flex items-center gap-3 mb-8">
            <button
                type="button"
                class="size-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-600 shrink-0"
                :aria-label="t('productDetails.backAria')"
                @click="navigateTo(backLink)"
            >
                <UIcon name="i-lucide-chevron-left" class="size-5" />
            </button>
            <h1 class="text-h2 font-heading font-semibold text-neutral-900">
                {{ t("productDetails.title") }}
            </h1>
        </div>

        <!-- Yuklanmoqda -->
        <div
            v-if="isLoading"
            class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16"
        >
            <USkeleton class="w-full aspect-square rounded-3xl" />
            <div class="space-y-4">
                <USkeleton class="h-8 w-3/4" />
                <USkeleton class="h-4 w-1/3" />
                <USkeleton class="h-24 w-full" />
                <USkeleton class="h-12 w-48 rounded-full" />
            </div>
        </div>

        <!-- Topilmadi -->
        <div
            v-else-if="notFound"
            class="flex flex-col items-center justify-center text-center gap-2 min-h-[50vh]"
        >
            <UIcon name="i-lucide-search-x" class="size-10 text-neutral-400" />
            <p class="text-h3 font-semibold text-neutral-900">
                {{ t("product.notFoundTitle") }}
            </p>
            <p class="text-body text-neutral-600 mb-2">
                {{ t("product.notFoundSubtitle") }}
            </p>
            <NuxtLink :to="backLink" class="text-primary-600 font-medium">
                {{ t("product.backToCatalog") }}
            </NuxtLink>
        </div>

        <!-- Mahsulot -->
        <template v-else-if="product">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
                <!-- Chap: galereya -->
                <div class="flex flex-col gap-3">
                    <div
                        class="relative w-full aspect-square rounded-2xl md:rounded-3xl overflow-hidden bg-neutral-50"
                    >
                        <img
                            v-if="activeImage"
                            :src="activeImage"
                            :alt="product.name"
                            class="w-full h-full object-cover"
                        />
                        <div
                            v-else
                            class="w-full h-full flex items-center justify-center text-neutral-400"
                        >
                            <UIcon name="i-lucide-image-off" class="size-8" />
                        </div>
                    </div>

                    <div
                        v-if="product.images.length > 1"
                        class="flex items-center gap-2"
                    >
                        <button
                            type="button"
                            class="md:hidden size-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 shrink-0"
                            :aria-label="t('productDetails.galleryPrevAria')"
                            @click="prevImage"
                        >
                            <UIcon name="i-lucide-chevron-left" class="size-4" />
                        </button>

                        <div
                            class="flex items-center gap-2 overflow-x-auto md:flex-wrap md:overflow-visible"
                        >
                            <button
                                v-for="(img, i) in product.images"
                                :key="img"
                                type="button"
                                class="size-14 rounded-lg overflow-hidden shrink-0 border-2"
                                :class="
                                    i === activeImageIndex
                                        ? 'border-primary-600'
                                        : 'border-transparent'
                                "
                                @click="activeImageIndex = i"
                            >
                                <img
                                    :src="img"
                                    alt=""
                                    class="w-full h-full object-cover"
                                />
                            </button>
                        </div>

                        <button
                            type="button"
                            class="md:hidden size-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 shrink-0"
                            :aria-label="t('productDetails.galleryNextAria')"
                            @click="nextImage"
                        >
                            <UIcon name="i-lucide-chevron-right" class="size-4" />
                        </button>
                    </div>
                </div>

                <!-- O'ng: ma'lumotlar -->
                <div class="flex flex-col gap-6 md:gap-8">
                    <h2
                        class="font-heading text-display-sm font-bold text-neutral-900"
                    >
                        {{ product.name }}
                    </h2>

                    <!-- Tavsif -->
                    <div v-if="product.description">
                        <p class="text-caption text-neutral-600 mb-1">
                            {{ t("productDetails.title") }}
                        </p>
                        <p
                            class="text-body text-neutral-600"
                            :class="{ 'line-clamp-3': !descriptionExpanded }"
                        >
                            {{ product.description }}
                            <button
                                v-if="canExpandDescription"
                                type="button"
                                class="text-primary-600 font-medium"
                                @click="descriptionExpanded = !descriptionExpanded"
                            >
                                {{
                                    descriptionExpanded
                                        ? t("productDetails.showLess")
                                        : t("productDetails.readMore")
                                }}
                            </button>
                        </p>
                    </div>

                    <!-- O'lchamlar (Bandlar soni) — hozircha faqat vizual holat,
                         backendda mos maydon yo'qligi sababli narx/savatga ta'sir qilmaydi -->
                    <div>
                        <p class="text-caption text-neutral-600 mb-3">
                            {{ t("productDetails.sizesLabel") }}
                        </p>
                        <div class="flex items-center gap-3">
                            <button
                                v-for="size in sizeOptions"
                                :key="size"
                                type="button"
                                class="relative size-12 rounded-full flex items-center justify-center text-sm font-semibold transition-colors"
                                :class="
                                    selectedSize === size
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-neutral-50 text-neutral-600 border border-neutral-200'
                                "
                                :aria-pressed="selectedSize === size"
                                :aria-label="
                                    t('productDetails.sizeAria', { size }) +
                                    (selectedSize === size
                                        ? ', ' + t('productDetails.sizeSelectedAria')
                                        : '')
                                "
                                @click="selectedSize = size"
                            >
                                {{ size }}
                                <span
                                    v-if="selectedSize === size"
                                    class="absolute -top-1 -right-1 size-4 rounded-full bg-white text-primary-600 flex items-center justify-center shadow-sm"
                                >
                                    <UIcon name="i-lucide-check" class="size-3" />
                                </span>
                            </button>
                        </div>
                    </div>

                    <!-- Sotuvchi (florist) — hozircha placeholder, backendda
                         sotuvchi/florist ma'lumoti mavjud emas -->
                    <div
                        class="flex items-center justify-between rounded-2xl border border-neutral-200 p-4"
                    >
                        <div class="flex items-center gap-3 min-w-0">
                            <span
                                class="size-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0"
                            >
                                <UIcon name="i-lucide-flower-2" class="size-5" />
                            </span>
                            <div class="min-w-0">
                                <p
                                    class="text-h3 font-semibold text-neutral-900 truncate"
                                >
                                    Shukufa
                                </p>
                                <p class="text-caption text-neutral-600">
                                    {{ t("productDetails.sellerRole") }}
                                </p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 shrink-0">
                            <button
                                type="button"
                                class="size-10 rounded-full border border-neutral-200 text-primary-600 flex items-center justify-center"
                                :aria-label="t('productDetails.messageAria')"
                            >
                                <UIcon
                                    name="i-lucide-message-circle"
                                    class="size-4.5"
                                />
                            </button>
                            <button
                                type="button"
                                class="size-10 rounded-full border border-neutral-200 text-primary-600 flex items-center justify-center"
                                :aria-label="t('productDetails.callAria')"
                            >
                                <UIcon name="i-lucide-phone" class="size-4.5" />
                            </button>
                        </div>
                    </div>

                    <!-- Miqdor -->
                    <div class="flex items-center justify-between">
                        <span class="text-caption text-neutral-600">{{
                            t("productDetails.quantityLabel")
                        }}</span>
                        <div
                            class="flex items-center gap-4 border border-neutral-200 rounded-full px-2 py-1.5"
                        >
                            <button
                                type="button"
                                class="size-8 rounded-full flex items-center justify-center text-neutral-600 disabled:opacity-40"
                                :disabled="quantity <= 1"
                                :aria-label="t('productDetails.decreaseAria')"
                                @click="quantity--"
                            >
                                <UIcon name="i-lucide-minus" class="size-4" />
                            </button>
                            <span
                                class="text-body font-semibold text-neutral-900 w-6 text-center"
                                >{{ quantity }}</span
                            >
                            <button
                                type="button"
                                class="size-8 rounded-full flex items-center justify-center text-neutral-600"
                                :aria-label="t('productDetails.increaseAria')"
                                @click="quantity++"
                            >
                                <UIcon name="i-lucide-plus" class="size-4" />
                            </button>
                        </div>
                    </div>

                    <!-- Narx + Savatga qo'shish: mobilda pastga qotirilgan panel,
                         desktopda ustunning oxirida oddiy karta (4.2-bo'lim) -->
                    <div
                        class="fixed inset-x-0 bottom-20 z-30 mx-4 rounded-3xl bg-white shadow-lg p-4 flex items-center justify-between gap-4 md:static md:mx-0 md:shadow-none md:rounded-2xl md:bg-neutral-50 md:p-6"
                    >
                        <div>
                            <p class="text-caption text-neutral-600">
                                {{ t("productDetails.totalPriceLabel") }}
                            </p>
                            <p
                                class="text-h2 font-heading font-bold text-neutral-900"
                            >
                                {{ formatPrice(totalPrice, product.price_currency) }}
                            </p>
                        </div>
                        <UButton
                            :label="t('product.addToCart')"
                            icon="i-lucide-shopping-bag"
                            size="xl"
                            :disabled="!product.is_available"
                            color="primary"
                            class="rounded-full px-8 py-3.5"
                            @click="onAddToCart"
                        />
                    </div>
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
import { useCartStore } from "~/stores/cart";
import type { Product } from "~/types/product";

const { t, locale } = useI18n();
const route = useRoute();
const { getById } = useProducts();
const categoriesStore = useCategoriesStore();
const authStore = useAuthStore();
const cartStore = useCartStore();
const notify = useNotify();

const product = ref<Product | null>(null);
const isLoading = ref(true);
const notFound = ref(false);
const activeImageIndex = ref(0);
const descriptionExpanded = ref(false);
const quantity = ref(1);

// 4.1.6 — "Sizes (Stems)": backendda hali mos maydon yo'q, shuning uchun
// faqat lokal/vizual holat sifatida saqlanadi
const sizeOptions = ["10", "15", "25", "40", "40+"];
const selectedSize = ref(sizeOptions[0]);

async function loadProduct() {
    isLoading.value = true;
    notFound.value = false;
    activeImageIndex.value = 0;
    quantity.value = 1;
    try {
        product.value = await getById(
            route.params.id as string,
            locale.value as Lang,
        );
        categoriesStore.fetchAll(false, locale.value as Lang);
    } catch {
        notFound.value = true;
        product.value = null;
    } finally {
        isLoading.value = false;
    }
}

onMounted(loadProduct);
watch([() => route.params.id, locale], loadProduct);

const activeImage = computed(() => product.value?.images[activeImageIndex.value]);

const canExpandDescription = computed(
    () => (product.value?.description?.length ?? 0) > 180,
);

const categoryName = computed(() =>
    product.value ? categoriesStore.byId(product.value.category_id)?.name : undefined,
);

const backLink = computed(() =>
    categoryName.value
        ? { path: "/catalog", query: { category: categoryName.value } }
        : "/",
);

const unitPrice = computed(
    () => product.value?.final_price_amount ?? product.value?.price_amount ?? 0,
);
const totalPrice = computed(() => unitPrice.value * quantity.value);

function formatPrice(amount: number, currency: string) {
    return `${amount.toLocaleString("uz-UZ")} ${currency}`;
}

function prevImage() {
    if (!product.value) return;
    const count = product.value.images.length;
    activeImageIndex.value = (activeImageIndex.value - 1 + count) % count;
}

function nextImage() {
    if (!product.value) return;
    const count = product.value.images.length;
    activeImageIndex.value = (activeImageIndex.value + 1) % count;
}

async function onAddToCart() {
    if (!product.value) return;
    if (!authStore.initialized) {
        await authStore.fetchMe();
    }
    if (!authStore.isAuthenticated) {
        notify.info(t("product.loginToAddToCart"));
        await navigateTo(`/auth/login?redirect=${route.fullPath}`);
        return;
    }
    cartStore.add(product.value, quantity.value);
    notify.success(t("product.addedToCart", { name: product.value.name }));
}

useHead(() => ({
    title: product.value
        ? `${product.value.name} — ${t("product.pageTitleSuffix")}`
        : t("product.pageTitleFallback"),
}));
</script>
