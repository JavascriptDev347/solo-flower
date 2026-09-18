<template>
    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-16 md:py-16">
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            <article v-for="item in items" :key="item.key" class="space-y-3">
                <div class="flex aspect-[4/3] items-center justify-center rounded-2xl bg-brand-cream text-brand-maroon">
                    <UIcon :name="item.icon" class="size-14" />
                </div>
                <h2 class="text-h3 font-bold text-neutral-900">{{ item.title }}</h2>
                <p class="text-body text-neutral-600">{{ item.description }}</p>
            </article>
        </div>
    </section>
</template>

<script setup lang="ts">
const { t } = useI18n();

const items = computed(() => [
    { key: "freshness", icon: "i-lucide-flower-2", title: t("home.whyUsPhoto.freshness.title"), description: t("home.whyUsPhoto.freshness.description") },
    { key: "delivery", icon: "i-lucide-truck", title: t("home.whyUsPhoto.delivery.title"), description: t("home.whyUsPhoto.delivery.description") },
    { key: "quality", icon: "i-lucide-award", title: t("home.whyUsPhoto.quality.title"), description: t("home.whyUsPhoto.quality.description") },
    { key: "care", icon: "i-lucide-heart-handshake", title: t("home.whyUsPhoto.care.title"), description: t("home.whyUsPhoto.care.description") },
]);
</script>
