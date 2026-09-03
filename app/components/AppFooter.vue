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
                        Tel:
                        <strong class="text-[#f6efe8] font-semibold"
                            >+998 91 234 56 78</strong
                        >
                    </span>
                    <span class="inline-flex items-center gap-2">
                        Uzbekistan Time (UTC+5)
                        <strong class="text-[#f6efe8] font-semibold"
                            >08:00–21:00</strong
                        >
                    </span>
                </div>
                <div class="border-t border-white/10">
                    <div
                        class="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3 text-xs"
                    >
                        <div class="flex items-center gap-2">
                            <UButton
                                icon="i-simple-icons-telegram"
                                aria-label="Telegram"
                                variant="ghost"
                                square
                                class="rounded-full bg-white/5 hover:bg-brand-accent text-[#cdb9b0] hover:text-white"
                            />
                            <UButton
                                icon="i-lucide-youtube"
                                aria-label="YouTube"
                                variant="ghost"
                                square
                                class="rounded-full bg-white/5 hover:bg-brand-accent text-[#cdb9b0] hover:text-white"
                            />
                            <UButton
                                icon="i-simple-icons-instagram"
                                aria-label="Instagram"
                                variant="ghost"
                                square
                                class="rounded-full bg-white/5 hover:bg-brand-accent text-[#cdb9b0] hover:text-white"
                            />
                            <UButton
                                icon="i-simple-icons-x"
                                aria-label="X"
                                variant="ghost"
                                square
                                class="rounded-full bg-white/5 hover:bg-brand-accent text-[#cdb9b0] hover:text-white"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts"></script>
