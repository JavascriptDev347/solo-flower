<template>
    <footer class="relative bg-brand-maroon text-[#cdb9b0]">
        <div class="border-b border-white/10">
            <div
                class="max-w-7xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-4"
            >
                <div class="flex items-center gap-2.5">
                    <span
                        class="size-9 rounded-full bg-white/10 text-[#f6efe8] flex items-center justify-center"
                    >
                        <UIcon name="i-lucide-flower-2" class="size-5" />
                    </span>
                    <span
                        class="font-display text-xl font-semibold text-[#f6efe8]"
                        >Shukufa</span
                    >
                </div>

                <div class="flex flex-wrap items-center gap-6 text-sm">
                    <span class="inline-flex items-center gap-2">
                        <UIcon name="i-lucide-phone" class="size-4" />
                        Telefon:
                        <strong class="text-[#f6efe8] font-semibold"
                            >+998 91 234 56 78</strong
                        >
                    </span>
                    <span class="inline-flex items-center gap-2">
                        <UIcon name="i-lucide-clock" class="size-4" />
                        Ish vaqti:
                        <strong class="text-[#f6efe8] font-semibold"
                            >08:00–21:00</strong
                        >
                    </span>
                </div>
            </div>
        </div>

        <div
            class="max-w-7xl mx-auto px-6 py-9 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
            <div v-for="col in columns" :key="col.title">
                <h3 class="font-display text-base text-[#f6efe8] mb-4">
                    {{ col.title }}
                </h3>
                <ul class="space-y-3 text-sm">
                    <li v-for="link in col.links" :key="link">
                        <NuxtLink
                            to="#"
                            class="hover:text-[#f6efe8] transition-colors"
                            >{{ link }}</NuxtLink
                        >
                    </li>
                </ul>
            </div>
        </div>

        <div class="border-t border-white/10">
            <div
                class="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3 text-xs"
            >
                <p>Barcha huquqlar himoyalangan — Shukufa © 2026</p>

                <div class="flex items-center gap-2">
                    <UButton
                        v-for="s in socials"
                        :key="s.icon"
                        :icon="s.icon"
                        :aria-label="s.label"
                        variant="ghost"
                        square
                        class="rounded-full bg-white/5 hover:bg-brand-accent text-[#cdb9b0] hover:text-white"
                    />
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
const columns = [
    {
        title: "Biz haqimizda",
        links: [
            "Shukufa haqida",
            "Savol-javob",
            "Bog'lanish",
            "Mijozlar fikri",
            "Hamkorlik",
        ],
    },
    {
        title: "Tezkor havolalar",
        links: [
            "Eng ko'p sotilganlar",
            "Tabrik gullari",
            "Ta'ziya gullari",
            "Chegirmalar",
            "Blog",
        ],
    },
    {
        title: "Kategoriyalar",
        links: [
            "Buketlar",
            "Guldon gullar",
            "Quyoshgullar",
            "Atirgullar",
            "Orxideyalar",
        ],
    },
    {
        title: "Yordam",
        links: [
            "Yetkazib berish",
            "To'lov usullari",
            "Qaytarish",
            "Maxfiylik siyosati",
            "Foydalanish shartlari",
        ],
    },
];

const socials = [
    { icon: "i-lucide-send", label: "Telegram" },
    { icon: "i-lucide-youtube", label: "YouTube" },
    { icon: "i-lucide-instagram", label: "Instagram" },
    { icon: "i-simple-icons-x", label: "X" },
];
</script>
