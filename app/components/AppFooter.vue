<template>
    <footer class="relative bg-brand-maroon text-white">
        <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:px-10 md:py-12">
            <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <UButton :label="t('footer.backToTop')" icon="i-lucide-arrow-up" class="w-fit rounded-full bg-white text-brand-maroon hover:bg-neutral-200" @click="scrollToTop" />
                <div class="hidden flex-col gap-2 text-center text-sm text-neutral-200 md:flex md:text-right">
                    <span>{{ t("footer.phoneLabel") }} <strong class="font-semibold text-white">{{ t("footer.phone") }}</strong></span>
                    <span>{{ t("footer.hoursLabel") }} <strong class="font-semibold text-white">{{ t("footer.hours") }}</strong></span>
                </div>
            </div>

            <div class="mt-10 grid gap-8 md:grid-cols-4">
                <div class="text-center md:text-left">
                    <NuxtLink to="/" class="inline-flex items-center gap-2.5" :aria-label="t('header.homeAria')">
                        <span class="flex size-10 items-center justify-center rounded-full bg-white/10 text-white"><UIcon name="i-lucide-flower-2" class="size-5" /></span>
                        <span class="font-display text-2xl font-semibold text-white">Shukufa</span>
                    </NuxtLink>
                    <p class="mt-3 text-sm text-neutral-200">{{ t("footer.tagline") }}</p>
                    <div class="mt-5 flex flex-col gap-2 text-center text-sm text-neutral-200 md:hidden">
                        <span>{{ t("footer.phoneLabel") }} <strong class="font-semibold text-white">{{ t("footer.phone") }}</strong></span>
                        <span>{{ t("footer.hoursLabel") }} <strong class="font-semibold text-white">{{ t("footer.hours") }}</strong></span>
                    </div>
                </div>

                <section v-for="group in footerGroups" :key="group.key" class="border-b border-white/10 md:border-0">
                    <button type="button" class="flex w-full items-center justify-between py-2 text-left font-semibold text-white md:cursor-default" :aria-expanded="isGroupOpen(group.key)" @click="toggleGroup(group.key)">
                        {{ t(group.title) }}
                        <UIcon name="i-lucide-chevron-down" class="size-4 transition-transform md:hidden" :class="{ 'rotate-180': isGroupOpen(group.key) }" />
                    </button>
                    <ul v-show="isGroupOpen(group.key)" class="space-y-2 pb-4 pt-2 text-sm text-neutral-200 md:block md:pb-0">
                        <li v-for="link in group.links" :key="link.label"><NuxtLink :to="link.to" class="transition-colors hover:text-white">{{ t(link.label) }}</NuxtLink></li>
                    </ul>
                </section>
            </div>

            <div class="mt-8 border-t border-white/10 pt-5">
                <div class="flex flex-col-reverse items-center gap-4 text-center text-xs text-neutral-200 md:flex-row md:justify-between">
                    <p>{{ t("footer.copyright", { year: currentYear }) }}</p>
                    <div class="flex items-center gap-2">
                        <UButton v-for="social in socials" :key="social.key" :icon="social.icon" :aria-label="t(social.label)" variant="ghost" square class="rounded-full bg-white/5 text-neutral-200 hover:bg-white/10 hover:text-white" />
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { useCategoriesStore } from "~/stores/catalog/categories";
import type { Lang } from "~/composables/catalog/useCategories";

const { t, locale } = useI18n();
const categoriesStore = useCategoriesStore();
const currentYear = new Date().getFullYear();
const openGroups = ref<string[]>([]);
// SSR'da har doim false qaytishi kerak (window yo'q), aks holda hidratsiya
// mos kelmasligi (hydration mismatch) va desktopda bo'limlarning bir lahza
// yashirin ko'rinishi (FOUC) yuzaga keladi — shuning uchun matchMedia faqat
// onMounted'da o'qiladi va reaktiv ref orqali yangilanadi
const isDesktop = ref(false);

onMounted(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    isDesktop.value = mediaQuery.matches;
    mediaQuery.addEventListener("change", (event) => {
        isDesktop.value = event.matches;
    });
});

try {
    await categoriesStore.fetchAll(false, locale.value as Lang);
} catch {
    // Kategoriyalar yuklanmasa, footerning statik guruhlari baribir ko'rinadi.
}

watch(locale, (newLocale) => {
    categoriesStore.fetchAll(false, newLocale as Lang).catch(() => {});
});

const categoryLinks = computed(() => categoriesStore.items.slice(0, 7).map((category) => ({
    label: category.name,
    to: { path: "/catalog", query: { category: category.name } },
})));

const footerGroups = computed(() => [
    { key: "categories", title: "footer.categories.title", links: categoryLinks.value },
    {
        key: "about",
        title: "footer.about.title",
        links: [
            { label: "footer.about.links.about", to: "#" },
            { label: "footer.about.links.contact", to: "#" },
            { label: "footer.about.links.terms", to: "#" },
            { label: "footer.about.links.privacy", to: "#" },
        ],
    },
    {
        key: "help",
        title: "footer.help.title",
        links: [
            { label: "footer.help.links.delivery", to: "#" },
            { label: "footer.help.links.payment", to: "#" },
            { label: "footer.help.links.returns", to: "#" },
        ],
    },
]);

const socials = [
    { key: "telegram", icon: "i-simple-icons-telegram", label: "footer.social.telegram" },
    { key: "youtube", icon: "i-lucide-youtube", label: "footer.social.youtube" },
    { key: "instagram", icon: "i-simple-icons-instagram", label: "footer.social.instagram" },
    { key: "x", icon: "i-simple-icons-x", label: "footer.social.x" },
];

function isGroupOpen(key: string) {
    return isDesktop.value || openGroups.value.includes(key);
}

function toggleGroup(key: string) {
    if (openGroups.value.includes(key)) openGroups.value = openGroups.value.filter((item) => item !== key);
    else openGroups.value.push(key);
}

function scrollToTop() {
    if (import.meta.client) window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>
