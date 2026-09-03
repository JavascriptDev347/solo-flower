<template>
    <nav
        class="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-stone-200 px-2 pt-2 flex items-center justify-around"
        style="padding-bottom: max(0.5rem, env(safe-area-inset-bottom))"
        :aria-label="t('mobileTabBar.navAria')"
    >
        <NuxtLink
            v-for="item in items"
            :key="item.label"
            :to="item.to"
            class="flex flex-col items-center gap-1 flex-1 py-1"
            :class="isActive(item.to) ? 'text-brand-accent' : 'text-stone-500'"
        >
            <span
                class="flex items-center justify-center size-9 rounded-xl transition-colors"
                :class="isActive(item.to) ? 'bg-brand-accent text-white' : ''"
            >
                <UIcon :name="item.icon" class="size-5" />
            </span>
            <span class="text-[11px] font-medium">{{ item.label }}</span>
        </NuxtLink>
    </nav>
</template>

<script setup lang="ts">
const { t } = useI18n();
const authStore = useAuthStore();
const route = useRoute();

function isActive(to: string) {
    if (to === "/") return route.path === "/";
    return route.path.startsWith(to);
}

// Tartib chapdan o'ngga: Bosh sahifa → Savat/Sevimlilar (admin bo'lsa —
// Eventlar/Mahsulotlar admin havolalari) → Profil
const items = computed(() => [
    { label: t("mobileTabBar.home"), icon: "i-lucide-home", to: "/" },
    ...(authStore.isAdmin
        ? [
              {
                  label: t("mobileTabBar.events"),
                  icon: "i-lucide-calendar-days",
                  to: "/admin/events",
              },
              {
                  label: t("mobileTabBar.products"),
                  icon: "i-lucide-box",
                  to: "/admin/products",
              },
          ]
        : [
              {
                  label: t("mobileTabBar.cart"),
                  icon: "i-lucide-shopping-cart",
                  to: "#",
              },
              {
                  label: t("mobileTabBar.wishlist"),
                  icon: "i-lucide-heart",
                  to: "#",
              },
          ]),
    { label: t("mobileTabBar.profile"), icon: "i-lucide-user", to: "#" },
]);
</script>
