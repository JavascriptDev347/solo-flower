<template>
    <section class="bg-white py-24 px-6 text-center">
        <AppHero />
        <div class="max-w-xl mx-auto flex flex-col items-center gap-5">
            <h1 class="text-4xl font-extrabold text-gray-900 m-0 leading-tight">
                {{ t("home.title") }}
            </h1>
            <p class="text-base text-gray-500 m-0 leading-relaxed">
                {{ t("home.subtitle") }}
            </p>
        </div>
    </section>
    <CategoryGrid />
    <ProductGrid />
</template>

<script setup lang="ts">
const { t } = useI18n();
</script>
