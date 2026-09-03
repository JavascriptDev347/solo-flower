<template>
    <UDropdownMenu :items="items" :ui="{ content: 'w-36' }">
        <UButton
            variant="ghost"
            color="neutral"
            icon="i-lucide-globe"
            trailing-icon="i-lucide-chevron-down"
            :label="LOCALE_LABELS[locale as SupportedLocale]"
            class="rounded-full"
            :aria-label="t('header.language')"
        />
    </UDropdownMenu>
</template>

<script setup lang="ts">
type SupportedLocale = "uz" | "eng" | "ru";

const LOCALE_LABELS: Record<SupportedLocale, string> = {
    uz: "UZ",
    eng: "EN",
    ru: "RU",
};

const LOCALE_NAMES: Record<SupportedLocale, string> = {
    uz: "O'zbekcha",
    eng: "English",
    ru: "Русский",
};

const { locale, t } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const items = computed(() => [
    (["uz", "eng", "ru"] as SupportedLocale[]).map((code) => ({
        label: LOCALE_NAMES[code],
        icon: code === locale.value ? "i-lucide-check" : undefined,
        onSelect: () => navigateTo(switchLocalePath(code)),
    })),
]);
</script>
