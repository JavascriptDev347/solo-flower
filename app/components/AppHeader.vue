<template>
    <header class="bg-white border-b border-neutral-200">
        <!-- Desktop (lg+) — 1-qator: logo, qidiruv, til/sevimlilar/savat/hisob. Faqat shu qator sticky. -->
        <div class="hidden lg:block sticky top-0 z-40 bg-white border-b border-neutral-200">
            <div class="max-w-7xl mx-auto px-10 h-20 flex items-center gap-6">
                <NuxtLink
                    to="/"
                    class="flex items-center gap-2.5 shrink-0"
                    :aria-label="t('header.homeAria')"
                >
                    <span
                        class="size-9 rounded-full bg-brand-primary-soft text-brand-primary flex items-center justify-center"
                    >
                        <UIcon name="i-lucide-flower-2" class="size-5" />
                    </span>
                    <span class="font-display text-xl font-semibold text-brand-primary"
                        >Shukufa</span
                    >
                </NuxtLink>

                <form class="flex-1 max-w-xl mx-auto" @submit.prevent="onSearchSubmit">
                    <UInput
                        v-model="query"
                        leading-icon="i-lucide-search"
                        size="lg"
                        :placeholder="t('header.searchPlaceholder')"
                        class="w-full"
                        :ui="{ base: 'rounded-full bg-neutral-50' }"
                    />
                </form>

                <a
                    href="tel:+998901234567"
                    class="flex shrink-0 items-center gap-2 text-neutral-700 transition-colors hover:text-brand-primary"
                    :aria-label="t('header.phoneAria')"
                >
                    <UIcon name="i-lucide-phone" class="size-5" />
                    <span class="text-body font-medium">+998 90 123 45 67</span>
                </a>

                <div class="flex items-center gap-4 shrink-0">
                    <AppLocaleSwitcher />

                    <NuxtLink to="/wishlist">
                        <UButton
                            variant="ghost"
                            color="neutral"
                            icon="i-lucide-heart"
                            square
                            class="rounded-full"
                            :aria-label="t('header.wishlistAria')"
                        />
                    </NuxtLink>

                    <UChip
                        :text="cartCount"
                        :show="cartCount > 0"
                        size="sm"
                        :ui="{ base: 'ring-2 ring-white bg-brand-primary text-white font-bold' }"
                    >
                        <NuxtLink to="/cart">
                            <UButton
                                variant="ghost"
                                color="neutral"
                                icon="i-lucide-shopping-cart"
                                square
                                class="rounded-full"
                                :aria-label="t('header.cartAria')"
                            />
                        </NuxtLink>
                    </UChip>

                    <!-- Login qilinmagan holat -->
                    <UButton
                        v-if="!authStore.isAuthenticated"
                        variant="ghost"
                        color="neutral"
                        icon="i-lucide-user"
                        :label="t('header.login')"
                        class="rounded-full"
                        @click="navigateTo('/auth/login')"
                    />

                    <!-- Login qilingan holat: foydalanuvchi nomi + pastga qaragan chevron -->
                    <UDropdownMenu
                        v-else
                        :items="userMenuItems"
                        :ui="{ content: 'w-52 rounded-xl' }"
                    >
                        <UButton
                            variant="ghost"
                            color="neutral"
                            icon="i-lucide-user"
                            trailing-icon="i-lucide-chevron-down"
                            class="rounded-full max-w-52"
                        >
                            <span class="truncate">{{
                                authStore.user?.email
                            }}</span>
                        </UButton>
                    </UDropdownMenu>
                </div>
            </div>
        </div>

        <!-- Desktop (lg+) — 2-qator: asosiy nav havolalar. Sticky emas, oddiy scroll bilan ketadi. -->
        <nav
            class="hidden lg:block border-b border-neutral-200"
            :aria-label="t('header.navAria')"
        >
            <div class="max-w-7xl mx-auto px-10 h-12 flex items-center gap-8">
                <NuxtLink
                    v-for="item in navItems"
                    :key="item.key"
                    :to="item.to"
                    class="text-body font-medium text-neutral-600 hover:text-brand-primary transition-colors"
                >
                    {{ item.label }}
                </NuxtLink>
            </div>
        </nav>

        <!-- Mobil/tablet (< lg) — bitta qator: logo, qidiruv, burger. Sticky. -->
        <div class="lg:hidden sticky top-0 z-40 bg-white">
            <div class="h-16 px-4 sm:px-6 flex items-center gap-3">
                <NuxtLink
                    to="/"
                    class="flex items-center gap-2 shrink-0"
                    :aria-label="t('header.homeAria')"
                >
                    <span
                        class="size-8 rounded-full bg-brand-primary-soft text-brand-primary flex items-center justify-center"
                    >
                        <UIcon name="i-lucide-flower-2" class="size-4" />
                    </span>
                    <span
                        class="font-display text-base font-semibold text-brand-primary"
                        >Shukufa</span
                    >
                </NuxtLink>

                <form class="flex-1 min-w-0" @submit.prevent="onSearchSubmit">
                    <UInput
                        v-model="query"
                        leading-icon="i-lucide-search"
                        size="lg"
                        :placeholder="t('header.searchPlaceholder')"
                        class="w-full"
                        :ui="{ base: 'rounded-full bg-neutral-50' }"
                    />
                </form>

                <UButton
                    icon="i-lucide-menu"
                    variant="ghost"
                    color="neutral"
                    square
                    class="rounded-full shrink-0"
                    :aria-label="t('header.menuAria')"
                    @click="isMenuOpen = true"
                />
            </div>

            <!-- Breadcrumb: faqat sahifa o'zi `definePageMeta({ breadcrumb: [...] })`
                 orqali bergan bo'lsa ko'rinadi (hozircha hech bir sahifa bermaydi —
                 sahifa darajasidagi ulash keyingi ishga qoldirilgan). LTR: Home → ... → o'ngga qarab. -->
            <div
                v-if="breadcrumbItems.length"
                class="px-4 sm:px-6 pb-3 flex items-center gap-1.5 text-caption text-neutral-500 overflow-x-auto"
            >
                <NuxtLink to="/" class="shrink-0 hover:text-brand-primary">
                    {{ t("header.breadcrumbHome") }}
                </NuxtLink>
                <template v-for="(crumb, index) in breadcrumbItems" :key="index">
                    <UIcon name="i-lucide-chevron-right" class="size-3.5 shrink-0" />
                    <NuxtLink
                        v-if="crumb.to && index < breadcrumbItems.length - 1"
                        :to="crumb.to"
                        class="shrink-0 hover:text-brand-primary"
                    >
                        {{ crumb.label }}
                    </NuxtLink>
                    <span v-else class="shrink-0 text-neutral-900 font-medium">{{
                        crumb.label
                    }}</span>
                </template>
            </div>
        </div>

        <!-- Mobil menyu: burger bosilganda ochiladigan slide-over (til almashtirgich shu yerda) -->
        <USlideover
            v-model:open="isMenuOpen"
            side="right"
            :ui="{
                content: 'bg-white',
                header: 'border-neutral-200',
                body: 'text-neutral-600',
            }"
        >
            <template #header>
                <div class="flex justify-between items-center w-full">
                    <div class="flex items-center gap-2.5">
                        <span
                            class="size-8 rounded-full bg-brand-primary-soft text-brand-primary flex items-center justify-center"
                        >
                            <UIcon name="i-lucide-flower-2" class="size-4" />
                        </span>
                        <span
                            class="font-display text-lg font-semibold text-brand-primary"
                            >Shukufa</span
                        >
                    </div>
                    <UButton
                        icon="i-lucide-x"
                        variant="ghost"
                        color="neutral"
                        square
                        class="rounded-full"
                        :aria-label="t('header.closeMenuAria')"
                        @click="isMenuOpen = false"
                    />
                </div>
            </template>

            <template #body>
                <div class="space-y-6">
                    <AppLocaleSwitcher />

                    <!-- Asosiy nav havolalar (desktopdagi 2-qator bilan bir xil ro'yxat) -->
                    <nav class="space-y-1" :aria-label="t('header.navAria')">
                        <NuxtLink
                            v-for="item in navItems"
                            :key="item.key"
                            :to="item.to"
                            class="block px-2 py-2.5 text-sm font-medium text-neutral-700"
                            @click="isMenuOpen = false"
                        >
                            {{ item.label }}
                        </NuxtLink>
                    </nav>

                    <!-- Foydalanuvchi holati: mobil menyu tepasida -->
                    <div
                        v-if="authStore.isAuthenticated"
                        class="flex items-center justify-between bg-neutral-50 rounded-xl px-4 py-3"
                    >
                        <div class="flex items-center gap-2.5 min-w-0">
                            <span
                                class="size-9 rounded-full bg-brand-primary-soft text-brand-primary flex items-center justify-center shrink-0"
                            >
                                <UIcon name="i-lucide-user" class="size-4" />
                            </span>
                            <span
                                class="text-sm font-medium text-neutral-800 truncate"
                            >
                                {{ authStore.user?.email }}
                            </span>
                        </div>
                        <UButton
                            icon="i-lucide-log-out"
                            variant="ghost"
                            color="error"
                            square
                            size="sm"
                            :aria-label="t('header.logoutAria')"
                            @click="onLogout"
                        />
                    </div>

                    <!-- Hisob havolalari: profil, buyurtmalar, (admin bo'lsa) admin panel -->
                    <ul
                        v-if="authStore.isAuthenticated"
                        class="space-y-1 text-sm font-medium text-neutral-700"
                    >
                        <li>
                            <NuxtLink
                                to="/profile"
                                class="flex items-center gap-2 px-2 py-2.5"
                                @click="isMenuOpen = false"
                            >
                                <UIcon
                                    name="i-lucide-user-round"
                                    class="size-4"
                                />
                                {{ t("header.profile") }}
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink
                                to="/orders"
                                class="flex items-center gap-2 px-2 py-2.5"
                                @click="isMenuOpen = false"
                            >
                                <UIcon name="i-lucide-package" class="size-4" />
                                {{ t("header.myOrders") }}
                            </NuxtLink>
                        </li>
                        <li v-if="authStore.isAdmin">
                            <NuxtLink
                                to="/admin"
                                class="flex items-center gap-2 px-2 py-2.5 text-brand-primary"
                                @click="isMenuOpen = false"
                            >
                                <UIcon name="i-lucide-shield" class="size-4" />
                                {{ t("header.adminPanel") }}
                            </NuxtLink>
                        </li>
                    </ul>

                    <UButton
                        v-else
                        icon="i-lucide-user"
                        :label="t('header.login')"
                        block
                        variant="outline"
                        color="neutral"
                        class="rounded-xl"
                        @click="onMobileLoginClick"
                    />

                    <button
                        type="button"
                        class="w-full flex items-center justify-between text-sm text-neutral-600 border border-neutral-200 rounded-xl px-4 py-3"
                    >
                        <span class="inline-flex items-center gap-2">
                            <UIcon name="i-lucide-map-pin" class="size-4" />
                            {{ t("header.deliveryLabel") }}
                            <strong class="text-neutral-800 font-semibold">{{
                                t("header.deliveryCity")
                            }}</strong>
                        </span>
                        <UIcon name="i-lucide-chevron-down" class="size-4" />
                    </button>

                    <UButton
                        icon="i-lucide-menu"
                        :label="t('header.allCategories')"
                        block
                        class="bg-brand-maroon hover:bg-brand-maroon-soft text-white rounded-xl"
                        @click="onAllCategoriesClick"
                    />

                    <div
                        class="border-t border-neutral-200 pt-4 space-y-1 text-sm text-neutral-500"
                    >
                        <NuxtLink to="#" class="block px-2 py-2">{{
                            t("header.trackOrder")
                        }}</NuxtLink>
                        <NuxtLink to="#" class="block px-2 py-2">{{
                            t("header.contactUs")
                        }}</NuxtLink>
                    </div>
                </div>
            </template>
        </USlideover>
    </header>
</template>

<script setup lang="ts">
import { useCartStore } from "~/stores/commerce/cart";
import { useCategoriesStore } from "~/stores/catalog/categories";
import type { Lang } from "~/composables/catalog/useCategories";

interface BreadcrumbItem {
    label: string;
    to?: string;
}

const { t, locale } = useI18n();
const route = useRoute();
const query = ref("");
const isMenuOpen = ref(false);

const authStore = useAuthStore();
const cartStore = useCartStore();
const categoriesStore = useCategoriesStore();

try {
    await categoriesStore.fetchAll(false, locale.value as Lang);
} catch {
    // Xato useApi orqali ko'rsatiladi; header qolgan navigatsiyani saqlab qoladi.
}

onMounted(async () => {
    if (!authStore.initialized) await authStore.fetchMe();
    if (authStore.isAuthenticated) await cartStore.fetch();
});

watch(
    () => authStore.isAuthenticated,
    (authenticated) => {
        if (authenticated) {
            cartStore.fetch();
        } else {
            cartStore.reset();
        }
    },
);

const cartCount = computed(() => cartStore.totalItems);

// Sahifa `definePageMeta({ breadcrumb: [{ label, to }] })` orqali beradi;
// bermasa qator umuman ko'rsatilmaydi (hozircha hech qanday sahifa bermaydi).
const breadcrumbItems = computed(
    () => (route.meta.breadcrumb as BreadcrumbItem[] | undefined) ?? [],
);

watch(locale, (newLocale) => {
    categoriesStore.fetchAll(false, newLocale as Lang).catch(() => {});
});

const navItems = computed(() =>
    categoriesStore.items.slice(0, 7).map((category) => ({
        key: category.id,
        label: category.name,
        to: { path: "/catalog", query: { category: category.name } },
    })),
);

const userMenuItems = computed(() => [
    [
        {
            label: t("header.profile"),
            icon: "i-lucide-user-round",
            to: "/profile",
        },
        {
            label: t("header.myOrders"),
            icon: "i-lucide-package",
            to: "/orders",
        },
        ...(authStore.isAdmin
            ? [
                  {
                      label: t("header.adminPanel"),
                      icon: "i-lucide-shield",
                      to: "/admin",
                  },
              ]
            : []),
    ],
    [
        {
            label: t("header.logout"),
            icon: "i-lucide-log-out",
            color: "error" as const,
            onSelect: onLogout,
        },
    ],
]);

function onLogout() {
    authStore.logout();
}

function onMobileLoginClick() {
    isMenuOpen.value = false;
    navigateTo("/auth/login");
}

function onAllCategoriesClick() {
    isMenuOpen.value = false;
    navigateTo("/catalog");
}

function onSearchSubmit() {
    const search = query.value.trim();
    isMenuOpen.value = false;
    navigateTo({ path: "/catalog", query: search ? { search } : {} });
}
</script>
