<template>
    <header class="sticky top-0 z-40 bg-white border-b border-stone-200">
        <!-- Micro-bar: yordam va yetkazib berish hududi (faqat desktop/tablet) -->
        <div class="hidden md:block bg-stone-50 border-b border-stone-100">
            <div
                class="max-w-7xl mx-auto px-6 h-9 flex items-center gap-5 text-xs text-stone-500"
            >
                <button
                    type="button"
                    class="inline-flex items-center gap-1.5 hover:text-brand-accent transition-colors"
                >
                    <UIcon name="i-lucide-map-pin" class="size-3.5" />
                    <span>{{ t("header.deliveryLabel") }}</span>
                    <strong class="text-stone-700 font-semibold">{{
                        t("header.deliveryCity")
                    }}</strong>
                    <UIcon name="i-lucide-chevron-down" class="size-3" />
                </button>

                <div class="flex-1" />

                <NuxtLink
                    to="#"
                    class="hover:text-brand-accent transition-colors"
                >
                    {{ t("header.trackOrder") }}
                </NuxtLink>
                <NuxtLink
                    to="#"
                    class="hover:text-brand-accent transition-colors"
                >
                    {{ t("header.contactUs") }}
                </NuxtLink>
            </div>
        </div>

        <!-- Asosiy qator: logotip, qidiruv, hisob/savat -->
        <div
            class="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-19 flex items-center gap-3 md:gap-8 justify-between"
        >
            <!-- Logotip: mobilda yashirin, joy tejash uchun -->
            <NuxtLink
                to="/"
                class="hidden md:flex items-center gap-2.5 shrink-0"
                :aria-label="t('header.homeAria')"
            >
                <span
                    class="size-9 rounded-full bg-brand-cream text-brand-accent flex items-center justify-center"
                >
                    <UIcon name="i-lucide-flower-2" class="size-5" />
                </span>
                <span class="font-display text-xl font-semibold text-stone-900"
                    >Shukufa</span
                >
            </NuxtLink>

            <!-- Desktop/tablet: to'liq ishlaydigan qidiruv maydoni -->
            <UInput
                v-model="query"
                icon="i-lucide-search"
                size="lg"
                :placeholder="t('header.searchPlaceholder')"
                class="hidden md:flex flex-1 max-w-xl"
                :ui="{ base: 'rounded-full bg-stone-50' }"
            />

            <!-- Mobil: qidiruv sahifasini ochuvchi tugma (brend nomi urg'ulangan) -->
            <button
                type="button"
                class="md:hidden flex-1 h-11 flex items-center gap-2 px-4 rounded-full bg-brand-cream border border-brand-cream-dark text-sm text-stone-500"
                :aria-label="t('header.openSearchAria')"
            >
                <UIcon
                    name="i-lucide-search"
                    class="size-4 shrink-0 text-stone-500"
                />
                <span class="truncate">
                    {{ t("header.searchLabel") }}
                    <strong class="text-brand-accent font-semibold"
                        >Shukufa</strong
                    >
                </span>
            </button>

            <!-- Amallar: desktopda to'liq, mobilda faqat burger -->
            <div class="hidden md:flex items-center gap-4 shrink-0">
                <AppLocaleSwitcher />

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

                <!-- Login qilingan holat: email + dropdown -->
                <UDropdownMenu
                    v-else
                    :items="userMenuItems"
                    :ui="{ content: 'w-52' }"
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

                <UButton
                    variant="ghost"
                    color="neutral"
                    icon="i-lucide-heart"
                    square
                    class="rounded-full"
                    :aria-label="t('header.wishlistAria')"
                />
                <UChip
                    :text="cartCount"
                    color="error"
                    size="sm"
                    :ui="{ base: 'ring-2 ring-white' }"
                >
                    <UButton
                        variant="ghost"
                        color="neutral"
                        icon="i-lucide-shopping-cart"
                        square
                        class="rounded-full"
                        :aria-label="t('header.cartAria')"
                    />
                </UChip>
            </div>

            <UButton
                icon="i-lucide-menu"
                variant="ghost"
                color="neutral"
                square
                class="md:hidden rounded-full shrink-0"
                :aria-label="t('header.menuAria')"
                @click="isMenuOpen = true"
            />
        </div>
        <!-- Mobil menyu: burger bosilganda ochiladigan slide-over -->
        <USlideover
            v-model:open="isMenuOpen"
            side="right"
            :ui="{
                content: 'bg-white',
                header: 'border-stone-100',
                body: 'text-stone-700',
            }"
        >
            <template #header>
                <div class="flex justify-between items-center w-full">
                    <div class="flex items-center gap-2.5">
                        <span
                            class="size-8 rounded-full bg-brand-cream text-brand-accent flex items-center justify-center"
                        >
                            <UIcon name="i-lucide-flower-2" class="size-4" />
                        </span>
                        <span
                            class="font-display text-lg font-semibold text-stone-900"
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
                    <!-- Foydalanuvchi holati: mobil menyu tepasida -->
                    <div
                        v-if="authStore.isAuthenticated"
                        class="flex items-center justify-between bg-stone-50 rounded-xl px-4 py-3"
                    >
                        <div class="flex items-center gap-2.5 min-w-0">
                            <span
                                class="size-9 rounded-full bg-brand-cream text-brand-accent flex items-center justify-center shrink-0"
                            >
                                <UIcon name="i-lucide-user" class="size-4" />
                            </span>
                            <span
                                class="text-sm font-medium text-stone-800 truncate"
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
                        class="space-y-1 text-sm font-medium text-stone-700"
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
                                class="flex items-center gap-2 px-2 py-2.5 text-brand-accent"
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
                        class="w-full flex items-center justify-between text-sm text-stone-600 border border-stone-200 rounded-xl px-4 py-3"
                    >
                        <span class="inline-flex items-center gap-2">
                            <UIcon name="i-lucide-map-pin" class="size-4" />
                            {{ t("header.deliveryLabel") }}
                            <strong class="text-stone-800 font-semibold">{{
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
                    />


                    <div
                        class="border-t border-stone-100 pt-4 space-y-1 text-sm text-stone-500"
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
const { t } = useI18n();
const query = ref("");
const cartCount = 2;
const isMenuOpen = ref(false);

const authStore = useAuthStore();

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
</script>
