<template>
    <header class="sticky top-0 z-40 bg-white">
        <!-- Desktop: to'liq navbar (logo — nav linklar — Create Account) -->
        <div
            class="hidden md:flex max-w-7xl mx-auto h-20 items-center justify-between px-16"
        >
            <NuxtLink
                to="/"
                class="flex flex-col items-start shrink-0"
                :aria-label="t('navbar.homeAria')"
            >
                <span class="flex items-center gap-2">
                    <span
                        class="size-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center"
                    >
                        <UIcon name="i-lucide-flower-2" class="size-4.5" />
                    </span>
                    <span
                        class="font-heading text-lg font-bold tracking-tight text-neutral-900"
                        >{{ t("navbar.brandName") }}</span
                    >
                </span>
                <span
                    class="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 ml-10"
                    >{{ t("navbar.brandSubtitle") }}</span
                >
            </NuxtLink>

            <nav class="flex items-center gap-8" :aria-label="t('navbar.menuAria')">
                <NuxtLink
                    v-for="item in navItems"
                    :key="item.key"
                    :to="item.to"
                    class="relative text-body font-medium pb-1.5 transition-colors"
                    :class="
                        isActive(item.to)
                            ? 'text-primary-600 after:absolute after:left-0 after:right-0 after:-bottom-1.5 after:h-0.5 after:bg-primary-600 after:rounded-full'
                            : 'text-neutral-600 hover:text-primary-600'
                    "
                >
                    {{ item.label }}
                </NuxtLink>
            </nav>

            <UButton
                :label="t('navbar.createAccount')"
                color="primary"
                variant="solid"
                class="rounded-full px-6 py-2.5 shrink-0"
                @click="navigateTo('/auth/register')"
            />
        </div>

        <!-- Mobil: logo + burger -->
        <div class="md:hidden flex h-16 items-center justify-between px-4">
            <NuxtLink
                to="/"
                class="flex items-center gap-2"
                :aria-label="t('navbar.homeAria')"
            >
                <span
                    class="size-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center"
                >
                    <UIcon name="i-lucide-flower-2" class="size-4.5" />
                </span>
                <span
                    class="font-heading text-lg font-bold tracking-tight text-neutral-900"
                    >{{ t("navbar.brandName") }}</span
                >
            </NuxtLink>

            <UButton
                icon="i-lucide-menu"
                variant="ghost"
                color="neutral"
                square
                class="rounded-full"
                :aria-label="t('navbar.menuAria')"
                @click="isMenuOpen = true"
            />
        </div>

        <!-- Mobil menyu: burger bosilganda ochiladigan slide-over -->
        <USlideover
            v-model:open="isMenuOpen"
            side="right"
            :ui="{ content: 'bg-white' }"
        >
            <template #header>
                <div class="flex justify-between items-center w-full">
                    <span
                        class="font-heading text-lg font-bold tracking-tight text-neutral-900"
                        >{{ t("navbar.brandName") }}</span
                    >
                    <UButton
                        icon="i-lucide-x"
                        variant="ghost"
                        color="neutral"
                        square
                        class="rounded-full"
                        :aria-label="t('navbar.closeMenuAria')"
                        @click="isMenuOpen = false"
                    />
                </div>
            </template>

            <template #body>
                <div class="flex flex-col gap-6">
                    <nav class="flex flex-col gap-1">
                        <NuxtLink
                            v-for="item in navItems"
                            :key="item.key"
                            :to="item.to"
                            class="text-body font-medium px-2 py-2.5 rounded-lg"
                            :class="
                                isActive(item.to)
                                    ? 'text-primary-600 bg-primary-50'
                                    : 'text-neutral-600'
                            "
                            @click="isMenuOpen = false"
                        >
                            {{ item.label }}
                        </NuxtLink>
                    </nav>

                    <UButton
                        :label="t('navbar.createAccount')"
                        color="primary"
                        variant="solid"
                        block
                        class="rounded-full px-6 py-2.5"
                        @click="onMobileCreateAccount"
                    />
                </div>
            </template>
        </USlideover>
    </header>
</template>

<script setup lang="ts">
const { t } = useI18n();
const route = useRoute();
const isMenuOpen = ref(false);

// 2.1-bo'lim: Home, Shop, How It Works, Features, Team, Pricing, Contact.
// Shop — mavjud /catalog sahifasiga yo'naltiriladi, hozircha mos sahifasi
// bo'lmagan bo'limlar (How It Works, Features, Team, Pricing, Contact) uchun
// placeholder link (loyihada shu konventsiya AppHeader'da ham ishlatilgan)
const navItems = computed(() => [
    { key: "home", label: t("navbar.home"), to: "/" },
    { key: "shop", label: t("navbar.shop"), to: "/catalog" },
    { key: "howItWorks", label: t("navbar.howItWorks"), to: "#" },
    { key: "features", label: t("navbar.features"), to: "#" },
    { key: "team", label: t("navbar.team"), to: "#" },
    { key: "pricing", label: t("navbar.pricing"), to: "#" },
    { key: "contact", label: t("navbar.contact"), to: "#" },
]);

function isActive(to: string) {
    if (to === "#") return false;
    if (to === "/") return route.path === "/";
    return route.path.startsWith(to);
}

function onMobileCreateAccount() {
    isMenuOpen.value = false;
    navigateTo("/auth/register");
}
</script>
