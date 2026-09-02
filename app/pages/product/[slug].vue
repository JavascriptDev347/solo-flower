<template>
    <div class="product-page">
        <NuxtLink :to="backLink" class="back-link">
            <UIcon name="i-lucide-arrow-left" class="size-4" />
            Katalogga qaytish
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
            <p class="not-found-title">Mahsulot topilmadi</p>
            <p class="not-found-subtitle">
                Havola noto'g'ri yoki mahsulot o'chirilgan bo'lishi mumkin
            </p>
            <NuxtLink :to="backLink" class="back-link">
                Katalogga qaytish
            </NuxtLink>
        </div>
        <!-- Mahsulot -->
        <template v-else-if="product">
            <div class="product-layout">
                <!-- Chap: galereya + video -->
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
                            Tugagan
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
                        <a
                            v-if="product.video_url_instagram"
                            :href="product.video_url_instagram"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="instagram-btn"
                            title="Instagramda ko'rish"
                        >
                            <UIcon name="i-lucide-instagram" class="size-5" />
                        </a>
                    </div>

                    <div v-if="product.rating" class="rating-row">
                        <UIcon
                            name="i-lucide-star"
                            class="size-4 star-filled"
                        />
                        <span>{{ product.rating.toFixed(1) }}</span>
                        <span class="sold-count"
                            >· {{ product.sold_count }} marta sotilgan</span
                        >
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
                                    ? "Sotuvda mavjud"
                                    : "Vaqtincha tugagan"
                            }}
                        </span>
                        <span v-if="product.stock" class="stock-text">
                            {{ product.stock }} ta omborda
                        </span>
                    </div>

                    <UButton
                        label="Buyurtma berish"
                        trailing-icon="i-lucide-shopping-cart"
                        size="lg"
                        :disabled="!product.is_available"
                        class="order-btn bg-brand-maroon hover:bg-brand-maroon-soft text-white rounded-full"
                    />

                    <dl v-if="specs.length" class="spec-list">
                        <div
                            v-for="spec in specs"
                            :key="spec.label"
                            class="spec-row"
                        >
                            <dt>{{ spec.label }}</dt>
                            <dd>{{ spec.value }}</dd>
                        </div>
                    </dl>

                    <p v-if="product.care_instructions" class="care-note">
                        <UIcon name="i-lucide-droplets" class="size-4" />
                        {{ product.care_instructions }}
                    </p>

                    <div v-if="product.flower_types.length" class="tag-group">
                        <span class="tag-group-label">Gullar</span>
                        <div class="tag-list">
                            <span
                                v-for="t in product.flower_types"
                                :key="t"
                                class="tag"
                            >
                                {{ t }}
                            </span>
                        </div>
                    </div>

                    <div v-if="product.occasions.length" class="tag-group">
                        <span class="tag-group-label">Munosabat bilan</span>
                        <div class="tag-list">
                            <span
                                v-for="t in product.occasions"
                                :key="t"
                                class="tag"
                            >
                                {{ t }}
                            </span>
                        </div>
                    </div>

                    <div
                        v-if="product.compatible_addons.length"
                        class="tag-group"
                    >
                        <span class="tag-group-label">Mos qo'shimchalar</span>
                        <div class="tag-list">
                            <span
                                v-for="t in product.compatible_addons"
                                :key="t"
                                class="tag tag-addon"
                            >
                                {{ t }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Video -->
            <div v-if="youtubeVideoId" class="video-section">
                <div class="video-section-header">
                    <h2 class="section-heading">Video</h2>
                    <a
                        v-if="product.video_url_youtube"
                        :href="product.video_url_youtube"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="youtube-link"
                    >
                        <UIcon name="i-lucide-youtube" class="size-4" />
                        YouTube'da ochish
                    </a>
                </div>
                <div class="youtube-embed">
                    <div ref="youtubePlayerEl" class="youtube-player-mount" />
                </div>

                <!-- YouTube'ning o'z pleer tugmalari ba'zan (ayniqsa Shorts
                     embed'ida) ko'rinmasligi mumkin — shu sabab o'zimizning
                     tugmalarimizni IFrame API orqali qo'shamiz -->
                <div class="youtube-controls">
                    <button
                        type="button"
                        class="yt-control-btn"
                        :aria-label="isYoutubePlaying ? 'Pauza' : 'Play'"
                        @click="toggleYoutubePlay"
                    >
                        <UIcon
                            :name="
                                isYoutubePlaying
                                    ? 'i-lucide-pause'
                                    : 'i-lucide-play'
                            "
                            class="size-5"
                        />
                    </button>
                    <button
                        type="button"
                        class="yt-control-btn"
                        :aria-label="
                            isYoutubeMuted ? 'Ovozni yoqish' : 'Ovozni ochirish'
                        "
                        @click="toggleYoutubeMute"
                    >
                        <UIcon
                            :name="
                                isYoutubeMuted
                                    ? 'i-lucide-volume-x'
                                    : 'i-lucide-volume-2'
                            "
                            class="size-5"
                        />
                    </button>
                    <button
                        type="button"
                        class="yt-control-btn"
                        aria-label="To'liq ekran"
                        @click="requestYoutubeFullscreen"
                    >
                        <UIcon name="i-lucide-maximize" class="size-5" />
                    </button>
                </div>
            </div>

            <!-- Tavsif -->
            <div v-if="product.description" class="description-section">
                <h2 class="section-heading">Tavsif</h2>
                <p class="description-text">{{ product.description }}</p>
            </div>

            <!-- Sharhlar -->
            <div class="comments-section">
                <h2 class="section-heading">
                    Sharhlar ({{ fakeComments.length }})
                </h2>
                <div class="comments-list">
                    <div
                        v-for="c in fakeComments"
                        :key="c.id"
                        class="comment-card"
                    >
                        <div class="comment-header">
                            <div class="comment-avatar">{{ c.initials }}</div>
                            <div class="comment-meta">
                                <div class="comment-author">{{ c.author }}</div>
                                <div class="comment-date">{{ c.date }}</div>
                            </div>
                            <div class="comment-rating">
                                <UIcon
                                    v-for="i in 5"
                                    :key="i"
                                    name="i-lucide-star"
                                    class="size-3.5"
                                    :class="
                                        i <= c.rating
                                            ? 'star-filled'
                                            : 'star-empty'
                                    "
                                />
                            </div>
                        </div>
                        <p class="comment-text">{{ c.text }}</p>
                    </div>
                </div>
                <p class="comments-note">
                    Sharh qoldirish funksiyasi tez orada qo'shiladi.
                </p>
            </div>
        </template>


    </div>
</template>

<script setup lang="ts">
import { useProducts } from "~/composables/catalog/useProducts";
import { useCategoriesStore } from "~/stores/catalog/categories";
import { PACKAGING_TYPES } from "~/types/product";
import type { Product } from "~/types/product";

const route = useRoute();
const { getBySlug } = useProducts();
const categoriesStore = useCategoriesStore();

const product = ref<Product | null>(null);
const isLoading = ref(true);
const notFound = ref(false);
const activeImageIndex = ref(0);

async function loadProduct() {
    isLoading.value = true;
    notFound.value = false;
    activeImageIndex.value = 0;
    try {
        product.value = await getBySlug(route.params.slug as string);
        categoriesStore.fetchAll();
    } catch {
        notFound.value = true;
        product.value = null;
    } finally {
        isLoading.value = false;
    }
}

onMounted(loadProduct);
watch(() => route.params.slug, loadProduct);

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

const packagingLabel = computed(
    () =>
        PACKAGING_TYPES.find((p) => p.value === product.value?.packaging_type)
            ?.label,
);

const specs = computed(() => {
    if (!product.value) return [];
    const list: { label: string; value: string }[] = [];
    if (product.value.color)
        list.push({ label: "Rangi", value: product.value.color });
    if (product.value.stem_count) {
        list.push({
            label: "Poya soni",
            value: `${product.value.stem_count} ta`,
        });
    }
    if (packagingLabel.value) {
        list.push({ label: "Qadoqlash", value: packagingLabel.value });
    }
    if (product.value.freshness_lifespan) {
        list.push({
            label: "Saqlanish muddati",
            value: `${product.value.freshness_lifespan} kun`,
        });
    }
    return list;
});

// YouTube havolasidan (watch/shorts/youtu.be — qaysi shaklda bo'lishidan
// qat'iy nazar) video ID'sini ajratib oladi
const youtubeVideoId = computed(() => {
    const url = product.value?.video_url_youtube;
    if (!url) return "";
    try {
        const parsed = new URL(url);

        if (parsed.hostname.includes("youtu.be")) {
            return parsed.pathname.slice(1);
        }
        if (parsed.pathname.startsWith("/embed/")) {
            return parsed.pathname.split("/embed/")[1] ?? "";
        }
        if (parsed.pathname.startsWith("/shorts/")) {
            return parsed.pathname.split("/shorts/")[1] ?? "";
        }
        return parsed.searchParams.get("v") ?? "";
    } catch {
        return "";
    }
});

// YouTube Shorts embed'ida native pleer tugmalari ko'rinmasligi mumkin,
// shuning uchun rasmiy IFrame Player API orqali o'z tugmalarimizni
// (play/pauza/ovoz/to'liq ekran) qo'shamiz
const youtubePlayerEl = ref<HTMLDivElement>();
const ytPlayer = ref<any>(null);
const isYoutubePlaying = ref(false);
const isYoutubeMuted = ref(false);

function loadYoutubeApi(): Promise<void> {
    return new Promise((resolve) => {
        const w = window as any;
        if (w.YT?.Player) {
            resolve();
            return;
        }
        const previous = w.onYouTubeIframeAPIReady;
        w.onYouTubeIframeAPIReady = () => {
            previous?.();
            resolve();
        };
        if (!document.getElementById("youtube-iframe-api-script")) {
            const tag = document.createElement("script");
            tag.id = "youtube-iframe-api-script";
            tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag);
        }
    });
}

function destroyYoutubePlayer() {
    ytPlayer.value?.destroy?.();
    ytPlayer.value = null;
    isYoutubePlaying.value = false;
    isYoutubeMuted.value = false;
}

async function initYoutubePlayer() {
    destroyYoutubePlayer();
    if (!youtubeVideoId.value) return;

    await loadYoutubeApi();
    await nextTick();
    if (!youtubePlayerEl.value) return;

    const w = window as any;
    ytPlayer.value = new w.YT.Player(youtubePlayerEl.value, {
        videoId: youtubeVideoId.value,
        playerVars: { rel: 0, playsinline: 1 },
        events: {
            onStateChange: (e: any) => {
                isYoutubePlaying.value = e.data === w.YT.PlayerState.PLAYING;
            },
        },
    });
}

function toggleYoutubePlay() {
    if (!ytPlayer.value) return;
    if (isYoutubePlaying.value) {
        ytPlayer.value.pauseVideo();
    } else {
        ytPlayer.value.playVideo();
    }
}

function toggleYoutubeMute() {
    if (!ytPlayer.value) return;
    if (isYoutubeMuted.value) {
        ytPlayer.value.unMute();
    } else {
        ytPlayer.value.mute();
    }
    isYoutubeMuted.value = !isYoutubeMuted.value;
}

function requestYoutubeFullscreen() {
    const iframe = youtubePlayerEl.value?.querySelector("iframe");
    iframe?.requestFullscreen?.();
}

watch(youtubeVideoId, initYoutubePlayer);
onUnmounted(destroyYoutubePlayer);

function formatPrice(amount: number | null | undefined, currency: string) {
    return `${(amount ?? 0).toLocaleString("uz-UZ")} ${currency}`;
}

// Backendda sharhlar tizimi hali yo'q — hozircha namunaviy fake ma'lumot
const fakeComments = [
    {
        id: 1,
        author: "Dilnoza R.",
        initials: "DR",
        rating: 5,
        date: "10-avgust, 2026",
        text: "Gullar juda yangi va chiroyli yetib keldi, rasmda ko'rsatilganidek ekan. Rahmat!",
    },
    {
        id: 2,
        author: "Javlon T.",
        initials: "JT",
        rating: 4,
        date: "5-avgust, 2026",
        text: "Sifat yaxshi, lekin yetkazib berish biroz kechikdi. Umuman rozi qoldim.",
    },
    {
        id: 3,
        author: "Madina S.",
        initials: "MS",
        rating: 5,
        date: "28-iyul, 2026",
        text: "Onamga sovg'a qildim, juda yoqdi! Qadoqlash ham chiroyli edi.",
    },
];

useHead(() => ({
    title: product.value ? `${product.value.name} — Katalog` : "Mahsulot",
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

.instagram-btn {
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f4f4f5;
    color: #1a1a1a;
    text-decoration: none;
    transition:
        background 0.15s,
        color 0.15s;
}
.instagram-btn:hover {
    background: var(--color-primary-soft, #fdf0f4);
    color: var(--color-primary, #e0568c);
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

.spec-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px 0;
    border-top: 1px solid #e4e4e7;
    margin: 0 0 12px;
}
.spec-row {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
}
.spec-row dt {
    color: #9a9aa2;
}
.spec-row dd {
    margin: 0;
    color: #1a1a1a;
    font-weight: 500;
}

.care-note {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 13px;
    color: #6b6b73;
    background: #f4f4f5;
    border-radius: 12px;
    padding: 12px 14px;
    margin: 0 0 16px;
}

.tag-group {
    margin-bottom: 14px;
}
.tag-group-label {
    display: block;
    font-size: 12px;
    color: #9a9aa2;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 6px;
}
.tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}
.tag {
    font-size: 13px;
    color: #1a1a1a;
    background: #f4f4f5;
    border-radius: 999px;
    padding: 4px 12px;
}
.tag-addon {
    background: var(--color-primary-soft, #fdf0f4);
    color: var(--color-primary, #e0568c);
}

/* Video */
.video-section {
    margin-top: 40px;
    padding-top: 24px;
    border-top: 1px solid #e4e4e7;
}
.video-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
}
.video-section-header .section-heading {
    margin: 0;
}
.youtube-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    color: #6b6b73;
    text-decoration: none;
    flex-shrink: 0;
}
.youtube-link:hover {
    color: #ff0000;
}
.youtube-embed {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    background: #000;
    max-width: 720px;
    aspect-ratio: 16 / 9;
}
.youtube-player-mount {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
}
.youtube-player-mount :deep(iframe) {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
}

.youtube-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
}
.yt-control-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #e4e4e7;
    background: #fff;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition:
        background 0.15s,
        color 0.15s;
}
.yt-control-btn:hover {
    background: var(--color-primary-soft, #fdf0f4);
    color: var(--color-primary, #e0568c);
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
    font-size: 13px;
    font-weight: 600;
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
.comments-note {
    font-size: 13px;
    color: #9a9aa2;
    text-align: center;
    margin: 0;
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
