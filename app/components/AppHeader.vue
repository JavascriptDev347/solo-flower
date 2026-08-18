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
                    <span>Yetkazib berish:</span>
                    <strong class="text-stone-700 font-semibold"
                        >Toshkent shahri</strong
                    >
                    <UIcon name="i-lucide-chevron-down" class="size-3" />
                </button>

                <div class="flex-1" />

                <NuxtLink
                    to="#"
                    class="hover:text-brand-accent transition-colors"
                >
                    Buyurtmani kuzatish
                </NuxtLink>
                <NuxtLink
                    to="#"
                    class="hover:text-brand-accent transition-colors"
                >
                    Biz bilan bog'lanish
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
                aria-label="Shukufa — bosh sahifa"
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
                placeholder="Shukufada gul qidiring..."
                class="hidden md:flex flex-1 max-w-xl"
                :ui="{ base: 'rounded-full bg-stone-50' }"
            />

            <!-- Mobil: qidiruv sahifasini ochuvchi tugma (brend nomi urg'ulangan) -->
            <button
                type="button"
                class="md:hidden flex-1 h-11 flex items-center gap-2 px-4 rounded-full bg-brand-cream border border-brand-cream-dark text-sm text-stone-500"
                aria-label="Qidiruvni ochish"
            >
                <UIcon
                    name="i-lucide-search"
                    class="size-4 shrink-0 text-stone-500"
                />
                <span class="truncate">
                    Qidirish:
                    <strong class="text-brand-accent font-semibold"
                        >Shukufa</strong
                    >
                </span>
            </button>

            <!-- Amallar: desktopda to'liq, mobilda faqat burger -->
            <div class="hidden md:flex items-center gap-4 shrink-0">
                <!-- Login qilinmagan holat -->
                <UButton
                    v-if="!authStore.isAuthenticated"
                    variant="ghost"
                    color="neutral"
                    icon="i-lucide-user"
                    label="Kirish"
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
                    aria-label="Sevimlilar"
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
                        aria-label="Savat"
                    />
                </UChip>
            </div>

            <UButton
                icon="i-lucide-menu"
                variant="ghost"
                color="neutral"
                square
                class="md:hidden rounded-full shrink-0"
                aria-label="Menyu"
                @click="isMenuOpen = true"
            />
        </div>

        <!-- Navigatsiya qatori: faqat desktop/tablet, mobilda menyu ichida -->
        <nav
            class="hidden md:block border-t border-stone-100"
            aria-label="Asosiy navigatsiya"
        >
            <div
                class="max-w-7xl mx-auto px-6 h-13 flex items-center gap-6 md:gap-8 overflow-x-auto"
            >
                <UButton
                    icon="i-lucide-menu"
                    label="Barcha kategoriyalar"
                    class="bg-brand-maroon hover:bg-brand-maroon-soft text-white rounded-lg shrink-0"
                />

                <ul
                    class="flex items-center gap-6 text-sm font-medium text-stone-700 whitespace-nowrap"
                >
                    <li>
                        <NuxtLink
                            to="#"
                            class="px-3 py-1.5 rounded-full bg-brand-cream text-brand-accent-dark font-semibold"
                        >
                            Bugun yetkazib berish
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink
                            to="#"
                            class="px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 font-semibold"
                        >
                            Sevgi kuni
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink
                            to="#"
                            class="hover:text-brand-accent transition-colors"
                            >Ta'ziya guldastalari</NuxtLink
                        >
                    </li>
                    <li>
                        <NuxtLink
                            to="#"
                            class="hover:text-brand-accent transition-colors"
                            >Tabrik guldastalari</NuxtLink
                        >
                    </li>
                    <li>
                        <NuxtLink
                            to="#"
                            class="hover:text-brand-accent transition-colors"
                            >Oq gullar</NuxtLink
                        >
                    </li>
                </ul>
            </div>
        </nav>

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
                        aria-label="Menyuni yopish"
                        @click="isMenuOpen = false"
                    />
                </div>
            </template>

            <template #body>
                <div class="space-y-6">
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
                            aria-label="Chiqish"
                            @click="onLogout"
                        />
                    </div>

                    <UButton
                        v-else
                        icon="i-lucide-user"
                        label="Kirish"
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
                            Yetkazib berish:
                            <strong class="text-stone-800 font-semibold"
                                >Toshkent shahri</strong
                            >
                        </span>
                        <UIcon name="i-lucide-chevron-down" class="size-4" />
                    </button>

                    <UButton
                        icon="i-lucide-menu"
                        label="Barcha kategoriyalar"
                        block
                        class="bg-brand-maroon hover:bg-brand-maroon-soft text-white rounded-xl"
                    />

                    <ul class="space-y-1 text-sm font-medium text-stone-700">
                        <li>
                            <NuxtLink to="#" class="block px-2 py-2.5"
                                >Bugun yetkazib berish</NuxtLink
                            >
                        </li>
                        <li>
                            <NuxtLink to="#" class="block px-2 py-2.5"
                                >Sevgi kuni</NuxtLink
                            >
                        </li>
                        <li>
                            <NuxtLink to="#" class="block px-2 py-2.5"
                                >Ta'ziya guldastalari</NuxtLink
                            >
                        </li>
                        <li>
                            <NuxtLink to="#" class="block px-2 py-2.5"
                                >Tabrik guldastalari</NuxtLink
                            >
                        </li>
                        <li>
                            <NuxtLink to="#" class="block px-2 py-2.5"
                                >Oq gullar</NuxtLink
                            >
                        </li>
                    </ul>

                    <div
                        class="border-t border-stone-100 pt-4 space-y-1 text-sm text-stone-500"
                    >
                        <NuxtLink to="#" class="block px-2 py-2"
                            >Buyurtmani kuzatish</NuxtLink
                        >
                        <NuxtLink to="#" class="block px-2 py-2"
                            >Biz bilan bog'lanish</NuxtLink
                        >
                    </div>
                </div>
            </template>
        </USlideover>
    </header>
</template>

<script setup lang="ts">
const query = ref("");
const cartCount = 2;
const isMenuOpen = ref(false);

const authStore = useAuthStore();

const userMenuItems = computed(() => [
    [
        {
            label: "Profil",
            icon: "i-lucide-user-round",
            to: "/profile",
        },
        {
            label: "Buyurtmalarim",
            icon: "i-lucide-package",
            to: "/orders",
        },
        ...(authStore.isAdmin
            ? [
                  {
                      label: "Admin panel",
                      icon: "i-lucide-shield",
                      to: "/admin",
                  },
              ]
            : []),
    ],
    [
        {
            label: "Chiqish",
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
