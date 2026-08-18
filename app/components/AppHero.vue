<template>
    <section
        class="relative rounded-2xl bg-linear-to-br from-brand-cream to-brand-cream-dark overflow-hidden"
        :aria-busy="!loaded"
        aria-label="Bosh banner"
    >
        <div
            class="max-w-7xl mx-auto px-6 py-10 flex flex-col-reverse md:flex-row items-center gap-8 min-h-85 "
        >
            <!-- Matn qismi -->
            <div class="flex-1 max-w-md w-full">
                <Transition name="fade" mode="out-in">
                    <div v-if="!loaded" key="skeleton" class="space-y-4">
                        <USkeleton class="h-4 w-36 rounded-full" />
                        <USkeleton class="h-10 w-full" />
                        <USkeleton class="h-10 w-3/4" />
                        <USkeleton class="h-12 w-48 rounded-full mt-2" />
                    </div>

                    <div v-else key="content" class="space-y-4">
                        <p
                            class="text-sm font-semibold uppercase tracking-wide text-brand-accent-dark"
                        >
                            {{ slide?.eyebrow }}
                        </p>
                        <h1
                            class="font-display text-4xl font-semibold leading-tight text-stone-900"
                        >
                            {{ slide?.title }}
                        </h1>
                        <p class="text-lg text-stone-600">{{ slide?.subtitle }}</p>
                        <UButton
                            :label="slide?.cta"
                            trailing-icon="i-lucide-arrow-right"
                            size="lg"
                            class="bg-brand-maroon hover:bg-brand-maroon-soft text-white rounded-full mt-2"
                        />
                    </div>
                </Transition>
            </div>

            <!-- Rasm qismi -->
            <div class="flex-1 flex justify-center md:justify-end w-full">
                <Transition name="fade" mode="out-in">
                    <USkeleton
                        v-if="!loaded"
                        key="skeleton-img"
                        class="w-full max-w-105 aspect-4/3 rounded-3xl"
                    />
                    <img
                        v-else
                        key="content-img"
                        :src="slide?.image"
                        :alt="slide?.eyebrow"
                        class="w-full max-w-105 aspect-4/3 object-cover rounded-3xl shadow-lg"
                    />
                </Transition>
            </div>
        </div>

        <!-- Slayder nuqtalari -->
        <div
            class="hidden md:flex absolute bottom-6 inset-x-6 items-center justify-center gap-2"
        >
            <button
                v-for="(item, i) in slides"
                :key="item.image"
                type="button"
                :aria-label="`${i + 1}-slayd`"
                class="size-2 rounded-full transition-colors"
                :class="
                    loaded && i === activeIndex
                        ? 'bg-brand-accent'
                        : 'bg-stone-300'
                "
                @click="activeIndex = i"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
// Ushbu bo'lim sahifa birinchi ochilganda skeleton (yuklanish)
// holatida ko'rinadi. `loaded` true bo'lgach, haqiqiy slayder
// kontenti (rasm, sarlavha, tugma) ko'rsatiladi. Hozircha fake
// data: public/images ichidagi 2 ta rasm. Amalda backend/CMS'dan
// (masalan useAsyncData bilan) olinadi.
const loaded = ref(false);
const activeIndex = ref(0);
const slides = [
    {
        eyebrow: "Yangi kolleksiya",
        title: "Qo'lda terilgan guldastalar",
        subtitle: "Har bir maxsus lahza uchun",
        cta: "Mahsulotlarni ko'rish",
        image: "/images/gul1.webp",
    },
    {
        eyebrow: "Bugungi taklif",
        title: "Sevimlilar uchun gullar",
        subtitle: "Bugun buyurtma bering, bugun yetkazamiz",
        cta: "Mahsulotlarni ko'rish",
        image: "/images/gul2.webp",
    },
];
const slide = computed(() => slides[activeIndex.value] ?? slides[0]);
let intervalId: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
    window.setTimeout(() => {
        loaded.value = true;
    }, 1600);
    intervalId = setInterval(() => {
        activeIndex.value = (activeIndex.value + 1) % slides.length;
    }, 5000);
});
onUnmounted(() => {
    clearInterval(intervalId);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.35s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
