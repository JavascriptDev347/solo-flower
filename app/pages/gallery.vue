<template>
    <main class="mx-auto max-w-7xl px-4 py-8 pb-24 sm:px-6 lg:px-10">
        <div class="mb-8">
            <h1 class="text-display-sm font-heading text-neutral-900">
                {{ t("gallery.title") }}
            </h1>
            <p class="mt-2 text-body text-neutral-600">
                {{ t("gallery.subtitle") }}
            </p>
        </div>

        <div
            v-if="galleryStore.loading && !galleryStore.pagination"
            class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
            <div
                v-for="n in 6"
                :key="n"
                class="overflow-hidden rounded-2xl border border-neutral-200"
            >
                <USkeleton class="aspect-square w-full rounded-none" />
                <div class="space-y-2 p-4">
                    <USkeleton class="h-4 w-full" />
                    <USkeleton class="h-4 w-2/3" />
                </div>
            </div>
        </div>

        <div
            v-else-if="!galleryStore.items.length"
            class="rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center"
        >
            <UIcon name="i-lucide-images" class="mx-auto size-14 text-neutral-400" />
            <h2 class="mt-5 text-h2 font-heading text-neutral-900">
                {{ t("gallery.emptyTitle") }}
            </h2>
            <p class="mx-auto mt-2 max-w-md text-body text-neutral-600">
                {{ t("gallery.emptySubtitle") }}
            </p>
        </div>

        <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <article
                v-for="post in galleryStore.items"
                :key="post.id"
                class="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
            >
                <div
                    v-if="post.image_urls.length"
                    class="grid aspect-square gap-1 bg-brand-cream"
                    :class="post.image_urls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'"
                >
                    <img
                        v-for="(image, index) in post.image_urls"
                        :key="image"
                        :src="image"
                        alt=""
                        class="size-full min-h-0 object-cover"
                        :class="{ 'col-span-2': post.image_urls.length === 3 && index === 0 }"
                    />
                </div>
                <div class="p-4">
                    <p v-if="post.description" class="text-body text-neutral-700">
                        {{ post.description }}
                    </p>
                </div>
            </article>
        </div>

        <div
            v-if="galleryStore.pagination && galleryStore.pagination.total_pages > 1"
            class="mt-8 flex items-center justify-center gap-2"
        >
            <UButton
                icon="i-lucide-chevron-left"
                color="neutral"
                variant="ghost"
                class="size-10 justify-center rounded-full"
                :disabled="currentPage <= 1"
                :aria-label="t('gallery.previousPage')"
                @click="goToPage(currentPage - 1)"
            />
            <button
                v-for="pageNumber in galleryStore.pagination.total_pages"
                :key="pageNumber"
                class="flex size-10 items-center justify-center rounded-full text-sm font-semibold transition-colors"
                :class="
                    pageNumber === currentPage
                        ? 'bg-brand-primary text-white'
                        : 'text-neutral-700 hover:bg-brand-cream'
                "
                @click="goToPage(pageNumber)"
            >
                {{ pageNumber }}
            </button>
            <UButton
                icon="i-lucide-chevron-right"
                color="neutral"
                variant="ghost"
                class="size-10 justify-center rounded-full"
                :disabled="currentPage >= galleryStore.pagination.total_pages"
                :aria-label="t('gallery.nextPage')"
                @click="goToPage(currentPage + 1)"
            />
        </div>
    </main>
</template>

<script setup lang="ts">
import { useGalleryStore } from "~/stores/content/gallery";

const { t } = useI18n();
const galleryStore = useGalleryStore();
const currentPage = ref(1);
const pageSize = 20;

async function loadGallery() {
    await galleryStore.fetchAll({ page: currentPage.value, page_size: pageSize });
}

function goToPage(page: number) {
    const totalPages = galleryStore.pagination?.total_pages ?? 1;
    if (page < 1 || page > totalPages || page === currentPage.value) return;
    currentPage.value = page;
    loadGallery();
}

await loadGallery();
useHead(() => ({ title: t("gallery.pageTitle") }));
</script>
