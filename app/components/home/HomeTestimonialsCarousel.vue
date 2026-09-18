<template>
    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-16 md:py-16">
        <div class="mb-5 flex items-center justify-between gap-4">
            <h2 class="text-h2 font-heading text-neutral-900">{{ t("home.testimonials.title") }}</h2>
            <div class="flex gap-2">
                <button type="button" class="flex size-9 items-center justify-center rounded-full bg-white text-neutral-900 shadow-sm" :aria-label="t('home.carouselPrevious')" @click="swiper?.slidePrev()">
                    <UIcon name="i-lucide-chevron-left" class="size-5" />
                </button>
                <button type="button" class="flex size-9 items-center justify-center rounded-full bg-white text-neutral-900 shadow-sm" :aria-label="t('home.carouselNext')" @click="swiper?.slideNext()">
                    <UIcon name="i-lucide-chevron-right" class="size-5" />
                </button>
            </div>
        </div>
        <Swiper
            :slides-per-view="1"
            :space-between="16"
            :breakpoints="{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }"
            @swiper="swiper = $event"
        >
            <SwiperSlide v-for="(testimonial, index) in testimonials" :key="testimonial.key">
                <article class="h-full rounded-2xl border border-neutral-200 bg-white p-5">
                    <h3 class="text-h3 font-bold text-neutral-900">{{ t(`home.testimonials.items.${testimonial.key}.name`) }}</h3>
                    <p class="mt-3 text-body text-neutral-600">{{ t(`home.testimonials.items.${testimonial.key}.quote`) }}</p>
                    <div v-if="testimonial.product" class="mt-5 border-t border-neutral-200 pt-4">
                        <p class="text-caption text-neutral-600">{{ t("home.testimonials.purchasedProduct") }}</p>
                        <div class="mt-2 flex items-center gap-3">
                            <img v-if="testimonial.product.images[0]" :src="testimonial.product.images[0]" :alt="testimonial.product.name" class="size-12 rounded-xl bg-brand-cream object-cover" />
                            <div class="min-w-0">
                                <p class="truncate text-caption font-semibold text-neutral-900">{{ testimonial.product.name }}</p>
                                <NuxtLink :to="`/product/${testimonial.product.slug}`" class="mt-1 flex items-center gap-1 text-caption font-semibold text-brand-primary">
                                    {{ t("home.testimonials.goToProduct") }}
                                    <UIcon name="i-lucide-chevron-right" class="size-4" />
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </article>
            </SwiperSlide>
        </Swiper>
    </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import type { Product } from "~/types/product";

const props = defineProps<{ products: Product[] }>();
const { t } = useI18n();
const swiper = shallowRef<SwiperInstance>();

const testimonials = computed(() =>
    ["one", "two", "three"].map((key, index) => ({
        key,
        product: props.products[index],
    })),
);
</script>
