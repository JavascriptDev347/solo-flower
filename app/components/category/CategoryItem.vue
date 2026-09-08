<template>
    <NuxtLink
        :to="{ path: '/catalog', query: { category: category.name } }"
        class="flex flex-col items-center gap-2 w-20 md:w-28 shrink-0"
    >
        <span
            class="size-20 md:size-28 rounded-full overflow-hidden bg-brand-cream shrink-0"
        >
            <img
                :src="category.image_url"
                :alt="category.name"
                loading="lazy"
                class="w-full h-full object-cover"
                @error="onImageError"
            />
        </span>
        <span class="w-full text-caption text-neutral-900 text-center truncate">
            {{ category.name }}
        </span>
    </NuxtLink>
</template>

<script setup lang="ts">
import type { Category } from "~/types/category";

defineProps<{
    category: Category;
}>();

// Rasm yuklanmasa — CategoryGrid.vue'da avval ishlatilgan neytral placeholder
const PLACEHOLDER_IMG =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#F4F4F5"/>
      <path d="M60 130l20-25 15 18 25-32 20 39H60z" fill="#D4D4D8"/>
      <circle cx="80" cy="80" r="12" fill="#D4D4D8"/>
    </svg>
  `);

function onImageError(e: Event) {
    const img = e.target as HTMLImageElement;
    img.src = PLACEHOLDER_IMG;
}
</script>
