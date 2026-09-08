<template>
    <!-- flower-shop-ui-spec.md 3.1.1 — "isolated subject on a solid
         brand-color panel": qattiq brend rang paneli (mavjud CTA rangi —
         brand-maroon) ustida cutout buket rasmi (fon o'chirilgan/shaffof
         rasm kutiladi), matn to'g'ridan-to'g'ri panel ustida (scrim shart
         emas, chunki orqa fon endi "band" surat emas) -->
    <section
        v-if="!loaded || slides.length"
        class="relative w-full overflow-hidden bg-brand-maroon"
        :aria-busy="!loaded"
        :aria-label="t('hero.bannerAria')"
    >
        <div
            class="max-w-7xl mx-auto px-6 py-14 md:py-20 flex flex-col-reverse md:flex-row items-center gap-10 md:gap-8 min-h-[360px] md:min-h-[440px]"
        >
            <!-- Chap ~55%: matn, to'g'ridan-to'g'ri panel rangi ustida -->
            <div class="w-full md:w-[55%] md:pr-8">
                <Transition name="fade" mode="out-in">
                    <div v-if="!loaded" key="skeleton" class="space-y-4">
                        <USkeleton class="h-4 w-36 rounded-full bg-white/15" />
                        <USkeleton class="h-10 w-full bg-white/15" />
                        <USkeleton class="h-10 w-3/4 bg-white/15" />
                        <USkeleton class="h-12 w-48 rounded-full mt-2 bg-white/15" />
                    </div>

                    <div v-else key="content" class="space-y-4">
                        <p
                            class="text-sm font-semibold uppercase tracking-wide text-white/70"
                        >
                            {{ slide?.eyebrow }}
                        </p>
                        <h1
                            class="font-display text-4xl font-semibold leading-tight text-white"
                        >
                            {{ slide?.title }}
                        </h1>
                        <p class="text-lg text-white/80">{{ slide?.subtitle }}</p>
                        <UButton
                            :label="slide?.cta"
                            trailing-icon="i-lucide-arrow-right"
                            size="lg"
                            class="bg-white text-brand-maroon hover:bg-white/90 rounded-full mt-2"
                            @click="goToCategory"
                        />
                    </div>
                </Transition>
            </div>

            <!-- O'ng ~45%: cutout buket rasmi, panel ustida suzayotgandek soya bilan -->
            <div class="w-full md:w-[45%] flex justify-center md:justify-end">
                <Transition name="fade" mode="out-in">
                    <USkeleton
                        v-if="!loaded"
                        key="skeleton-img"
                        class="w-full max-w-72 aspect-square rounded-3xl bg-white/10"
                    />
                    <img
                        v-else
                        key="content-img"
                        :src="slide?.image"
                        :alt="slide?.eyebrow"
                        class="w-full max-w-72 md:max-w-sm object-contain cursor-pointer"
                        style="filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.25))"
                        @click="goToCategory"
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
                :aria-label="t('hero.slideAria', { n: i + 1 })"
                class="size-2 rounded-full transition-colors"
                :class="loaded && i === activeIndex ? 'bg-white' : 'bg-white/40'"
                @click="activeIndex = i"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
// Ushbu bo'lim sahifa birinchi ochilganda skeleton (yuklanish)
// holatida ko'rinadi. `loaded` true bo'lgach, backenddan kelgan
// haqiqiy eventlar (banner/aksiya bloklari) ko'rsatiladi —
// backendda `is_root DESC, created_at DESC` bo'yicha saralangan
// holda keladi, shuning uchun qo'shimcha saralash shart emas.
import { useEventsStore } from "~/stores/catalog/events";
import { useCategoriesStore } from "~/stores/catalog/categories";
import type { Lang } from "~/composables/catalog/useCategories";

const { t, locale } = useI18n();
const store = useEventsStore();
const categoriesStore = useCategoriesStore();

const loaded = ref(false);
const activeIndex = ref(0);
const slides = computed(() => store.items);
const slide = computed(() => slides.value[activeIndex.value] ?? slides.value[0]);

const categoryName = computed(() => {
    const categoryId = slide.value?.category_id;
    return categoryId ? categoriesStore.byId(categoryId)?.name : undefined;
});

function goToCategory() {
    if (!categoryName.value) return;
    navigateTo({ path: "/catalog", query: { category: categoryName.value } });
}

watch(locale, (newLocale) => {
    store.fetchAll(false, newLocale as Lang).catch(() => {});
    categoriesStore.fetchAll(false, newLocale as Lang).catch(() => {});
});

let intervalId: ReturnType<typeof setInterval> | undefined;

onMounted(async () => {
    try {
        await Promise.all([
            store.fetchAll(false, locale.value as Lang),
            categoriesStore.fetchAll(false, locale.value as Lang),
        ]);
    } catch {
        // xato allaqachon useApi ichida notify qilingan — bannerni buzmaymiz
    } finally {
        loaded.value = true;
    }

    if (slides.value.length > 1) {
        intervalId = setInterval(() => {
            activeIndex.value = (activeIndex.value + 1) % slides.value.length;
        }, 5000);
    }
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
