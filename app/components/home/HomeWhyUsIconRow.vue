<template>
    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-16 md:py-16">
        <div class="grid grid-cols-3 gap-3 md:gap-8">
            <article v-for="item in items" :key="item.key" class="text-center">
                <div class="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-brand-accent-green-soft text-brand-accent-green">
                    <UIcon :name="item.icon" class="size-6" />
                </div>
                <h2 class="text-caption font-bold text-neutral-900 md:text-h3">{{ item.title }}</h2>
                <p class="mt-1 text-caption text-neutral-600">{{ item.description }}</p>
            </article>
        </div>
    </section>
</template>

<script setup lang="ts">
const { t } = useI18n();

const items = computed(() => [
    { key: "freshness", icon: "i-lucide-sparkles", title: t("home.whyUsIcons.freshness.title"), description: t("home.whyUsIcons.freshness.description") },
    { key: "delivery", icon: "i-lucide-clock-3", title: t("home.whyUsIcons.delivery.title"), description: t("home.whyUsIcons.delivery.description") },
    { key: "support", icon: "i-lucide-headset", title: t("home.whyUsIcons.support.title"), description: t("home.whyUsIcons.support.description") },
]);
</script>
