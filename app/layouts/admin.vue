<script setup lang="ts">
const isSidebarOpen = ref(false);

const navItems = [
    { label: "Dashboard", to: "/admin" },
    { label: "Kategoriyalar", to: "/admin/categories" },
    { label: "Eventlar", to: "/admin/events" },
    { label: "Galereya", to: "/admin/gallery" },
    { label: "Mahsulotlar", to: "/admin/products" },
    { label: "Buyurtmalar", to: "/admin/orders" },
];

const authStore = useAuthStore();
const route = useRoute();

watch(
    () => route.path,
    () => {
        isSidebarOpen.value = false;
    },
);
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
        <!-- Desktop sidebar -->
        <aside
            class="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
        >
            <div
                class="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800"
            >
                <span class="font-semibold text-lg">Admin Panel</span>
            </div>
            <nav class="flex-1 px-3 py-4 space-y-1">
                <NuxtLink
                    v-for="item in navItems"
                    :key="item.to"
                    :to="item.to"
                    class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    active-class="bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
                >
                    {{ item.label }}
                </NuxtLink>
            </nav>
            <div class="p-3 border-t border-gray-200 dark:border-gray-800">
                <button
                    class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                    @click="authStore.logout()"
                >
                    Chiqish
                </button>
            </div>
        </aside>

        <!-- Mobil drawer -->
        <Teleport to="body">
            <Transition
                enter-active-class="transition-opacity duration-200"
                enter-from-class="opacity-0"
                leave-active-class="transition-opacity duration-200"
                leave-to-class="opacity-0"
            >
                <div
                    v-if="isSidebarOpen"
                    class="fixed inset-0 z-50 bg-black/40 lg:hidden"
                    @click.self="isSidebarOpen = false"
                >
                    <Transition
                        enter-active-class="transition-transform duration-200"
                        enter-from-class="-translate-x-full"
                        leave-active-class="transition-transform duration-200"
                        leave-to-class="-translate-x-full"
                        appear
                    >
                        <aside
                            class="w-64 h-full bg-white dark:bg-gray-900 flex flex-col"
                        >
                            <div
                                class="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800"
                            >
                                <span class="font-semibold text-lg"
                                    >Admin Panel</span
                                >
                                <button
                                    class="text-gray-400 hover:text-gray-600 text-xl leading-none"
                                    @click="isSidebarOpen = false"
                                >
                                    ✕
                                </button>
                            </div>
                            <nav class="flex-1 px-3 py-4 space-y-1">
                                <NuxtLink
                                    v-for="item in navItems"
                                    :key="item.to"
                                    :to="item.to"
                                    class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    active-class="bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
                                    @click="isSidebarOpen = false"
                                >
                                    {{ item.label }}
                                </NuxtLink>
                            </nav>
                            <div
                                class="p-3 border-t border-gray-200 dark:border-gray-800"
                            >
                                <button
                                    class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                                    @click="authStore.logout()"
                                >
                                    Chiqish
                                </button>
                            </div>
                        </aside>
                    </Transition>
                </div>
            </Transition>
        </Teleport>

        <!-- Content area -->
        <div class="lg:pl-64">
            <header
                class="h-16 flex items-center gap-3 px-4 lg:px-8 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10"
            >
                <button class="lg:hidden text-xl" @click="isSidebarOpen = true">
                    ☰
                </button>
                <slot name="header" />
            </header>

            <main class="p-4 lg:p-8">
                <slot />
            </main>
        </div>
    </div>
</template>
