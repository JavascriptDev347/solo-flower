<template>
    <div class="flex items-center gap-2 whitespace-nowrap" :aria-label="`${t('home.offers.countdownLabel')} ${time}`">
        <span class="text-caption text-neutral-600">{{ t("home.offers.countdownLabel") }}</span>
        <span class="font-heading text-h3 font-bold tabular-nums text-brand-primary">{{ time }}</span>
    </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const remaining = ref(0);
let timer: ReturnType<typeof setInterval> | undefined;

function updateRemaining() {
    const now = new Date();
    const end = new Date(now);
    end.setHours(24, 0, 0, 0);
    remaining.value = Math.max(0, end.getTime() - now.getTime());
}

const time = computed(() => {
    const totalSeconds = Math.floor(remaining.value / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
});

onMounted(() => {
    updateRemaining();
    timer = setInterval(updateRemaining, 1000);
});

onUnmounted(() => clearInterval(timer));
</script>
