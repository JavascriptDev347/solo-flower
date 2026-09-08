<template>
    <section class="relative">
        <div
            class="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-center md:text-left"
        >
            <!-- Chap ustun: matn -->
            <div class="flex flex-col items-center md:items-start">
                <span
                    class="size-14 rounded-full bg-mint-100 flex items-center justify-center"
                    :aria-label="t('heroSection.badgeAria')"
                >
                    <UIcon name="i-lucide-flower-2" class="size-6 text-primary-600" />
                </span>

                <p class="text-eyebrow uppercase text-primary-600 mt-4">
                    {{ t("heroSection.eyebrow") }}
                </p>

                <h1
                    class="font-heading text-display-sm md:text-display text-neutral-900 mt-3"
                >
                    {{ t("heroSection.headline") }}
                    <span class="text-primary-600">{{
                        t("heroSection.headlineHighlight")
                    }}</span>
                </h1>

                <p class="text-body text-neutral-600 max-w-[520px] mt-4">
                    {{ t("heroSection.paragraph") }}
                </p>

                <!-- Do'kon nishonlari: Google Play + App Store (hozircha placeholder havola) -->
                <div class="flex items-center gap-3 mt-8">
                    <UButton
                        to="#"
                        color="neutral"
                        variant="solid"
                        class="rounded-lg h-12 w-40 px-4 gap-2 justify-start"
                    >
                        <UIcon
                            name="i-simple-icons-googleplay"
                            class="size-6 shrink-0"
                        />
                        <span class="flex flex-col items-start leading-tight">
                            <span class="text-[10px]">{{
                                t("heroSection.storeBadgeGoogleEyebrow")
                            }}</span>
                            <span class="text-sm font-semibold">{{
                                t("heroSection.storeBadgeGoogleLabel")
                            }}</span>
                        </span>
                    </UButton>

                    <UButton
                        to="#"
                        color="neutral"
                        variant="solid"
                        class="rounded-lg h-12 w-40 px-4 gap-2 justify-start"
                    >
                        <UIcon name="i-simple-icons-apple" class="size-6 shrink-0" />
                        <span class="flex flex-col items-start leading-tight">
                            <span class="text-[10px]">{{
                                t("heroSection.storeBadgeAppleEyebrow")
                            }}</span>
                            <span class="text-sm font-semibold">{{
                                t("heroSection.storeBadgeAppleLabel")
                            }}</span>
                        </span>
                    </UButton>
                </div>
            </div>

            <!-- O'ng ustun: vizual (desktopda ikkita bir-birining ustiga tushgan,
                 burilgan rasm; mobilda bitta markazlashgan rasm) -->
            <div class="relative flex justify-center md:justify-end">
                <div
                    class="absolute inset-0 -z-10 opacity-40 bg-[radial-gradient(circle_at_30%_30%,var(--color-primary-100),transparent_60%)]"
                    aria-hidden="true"
                />

                <img
                    src="/images/gul1.webp"
                    :alt="t('heroSection.imageAlt')"
                    class="md:hidden w-full max-w-sm aspect-square object-cover rounded-3xl shadow-lg"
                />

                <div class="hidden md:block relative w-full max-w-md aspect-square">
                    <img
                        src="/images/gul2.webp"
                        alt=""
                        aria-hidden="true"
                        class="absolute right-0 top-8 w-3/4 aspect-3/4 object-cover rounded-3xl shadow-lg rotate-6"
                    />
                    <img
                        src="/images/gul1.webp"
                        :alt="t('heroSection.imageAlt')"
                        class="absolute left-0 bottom-0 w-3/4 aspect-3/4 object-cover rounded-3xl shadow-lg -rotate-8"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
</script>
