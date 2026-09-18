<script setup lang="ts">
import type {
    DashboardSummary,
    LowStockProduct,
    RevenueHistoryPoint,
} from "~/types/dashboard";

import { useDashboard } from "~/composables/admin/useDashboard";

definePageMeta({
    middleware: "admin",
    layout: "admin",
});

const { getSummary, getRevenueHistory, getLowStock } = useDashboard();

const summary = ref<DashboardSummary>({
    total_products: 0,
    total_units_sold: 0,
    total_revenue: 0,
});
const revenueHistory = ref<RevenueHistoryPoint[]>([]);
const lowStockProducts = ref<LowStockProduct[]>([]);
const revenuePeriod = ref<"day" | "month">("day");
const summaryLoading = ref(true);
const revenueLoading = ref(true);
const lowStockLoading = ref(true);
let revenueRequestId = 0;

const maxRevenue = computed(() =>
    Math.max(...revenueHistory.value.map((point) => point.revenue), 0),
);

function formatPrice(amount: number) {
    return `${amount.toLocaleString("uz-UZ")} UZS`;
}

function formatDate(date: string) {
    const options: Intl.DateTimeFormatOptions =
        revenuePeriod.value === "day"
            ? { day: "2-digit", month: "short" }
            : { month: "short", year: "numeric" };
    return new Date(date).toLocaleDateString("uz-UZ", options);
}

function barHeight(revenue: number) {
    if (!maxRevenue.value || revenue <= 0) return "0%";
    return `${(revenue / maxRevenue.value) * 100}%`;
}

async function loadSummary() {
    summaryLoading.value = true;
    try {
        summary.value = await getSummary();
    } catch {
        // Xato useApi tomonidan ko'rsatiladi, kartalar nol qiymatni saqlaydi.
    } finally {
        summaryLoading.value = false;
    }
}

async function loadRevenueHistory() {
    const requestId = ++revenueRequestId;
    revenueLoading.value = true;
    try {
        const data = await getRevenueHistory(revenuePeriod.value);
        if (requestId === revenueRequestId) revenueHistory.value = data;
    } catch {
        if (requestId === revenueRequestId) revenueHistory.value = [];
    } finally {
        if (requestId === revenueRequestId) revenueLoading.value = false;
    }
}

async function loadLowStock() {
    lowStockLoading.value = true;
    try {
        lowStockProducts.value = (await getLowStock()).slice(0, 5);
    } catch {
        lowStockProducts.value = [];
    } finally {
        lowStockLoading.value = false;
    }
}

function changeRevenuePeriod(period: "day" | "month") {
    if (revenuePeriod.value === period) return;
    revenuePeriod.value = period;
    loadRevenueHistory();
}

onMounted(() => {
    loadSummary();
    loadRevenueHistory();
    loadLowStock();
});
</script>

<template>
    <div class="dashboard-page">
        <div class="page-header">
            <div>
                <h1 class="page-title">Dashboard</h1>
                <p class="page-subtitle">Do'kon statistikasi va hisobotlari</p>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon"><UIcon name="i-lucide-package" /></div>
                <div>
                    <p class="stat-label">Jami mahsulotlar</p>
                    <p class="stat-value">
                        {{
                            summaryLoading
                                ? "..."
                                : summary.total_products.toLocaleString("uz-UZ")
                        }}
                    </p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <UIcon name="i-lucide-shopping-bag" />
                </div>
                <div>
                    <p class="stat-label">Sotilgan birliklar</p>
                    <p class="stat-value">
                        {{
                            summaryLoading
                                ? "..."
                                : summary.total_units_sold.toLocaleString(
                                      "uz-UZ",
                                  )
                        }}
                    </p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><UIcon name="i-lucide-banknote" /></div>
                <div>
                    <p class="stat-label">Jami daromad</p>
                    <p class="stat-value">
                        {{
                            summaryLoading
                                ? "..."
                                : formatPrice(summary.total_revenue)
                        }}
                    </p>
                </div>
            </div>
        </div>

        <section class="dashboard-section">
            <div class="section-header">
                <h2 class="section-title">Daromad tarixi</h2>
                <div class="period-toggle">
                    <button
                        :class="{ active: revenuePeriod === 'day' }"
                        @click="changeRevenuePeriod('day')"
                    >
                        Kunlik
                    </button>
                    <button
                        :class="{ active: revenuePeriod === 'month' }"
                        @click="changeRevenuePeriod('month')"
                    >
                        Oylik
                    </button>
                </div>
            </div>
            <div class="chart-card">
                <div v-if="revenueLoading" class="empty-state">
                    Yuklanmoqda...
                </div>
                <div v-else-if="!revenueHistory.length" class="empty-state">
                    Daromad ma'lumotlari topilmadi
                </div>
                <div v-else class="chart-scroll">
                    <div class="chart">
                        <div
                            v-for="point in revenueHistory"
                            :key="point.period"
                            class="bar-column"
                        >
                            <div class="bar-area">
                                <div
                                    class="revenue-bar"
                                    :style="{
                                        height: barHeight(point.revenue),
                                    }"
                                    :title="formatPrice(point.revenue)"
                                />
                            </div>
                            <span class="bar-label">{{
                                formatDate(point.period)
                            }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="dashboard-section">
            <div class="section-header">
                <h2 class="section-title">Kam zaxirali mahsulotlar</h2>
            </div>
            <div class="table-wrapper">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Mahsulot</th>
                            <th>Zaxira</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="lowStockLoading">
                            <td colspan="2" class="empty-state">
                                Yuklanmoqda...
                            </td>
                        </tr>
                        <tr v-else-if="!lowStockProducts.length">
                            <td colspan="2" class="empty-state">
                                Kam zaxirali mahsulotlar yo'q
                            </td>
                        </tr>
                        <tr
                            v-for="product in lowStockProducts"
                            v-else
                            :key="product.id"
                        >
                            <td class="cell-name">{{ product.name_uz }}</td>
                            <td>
                                <span
                                    class="badge"
                                    :class="
                                        product.stock <= 3
                                            ? 'badge-red'
                                            : 'badge-amber'
                                    "
                                >
                                    {{ product.stock }} ta
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </div>
</template>

<style scoped>
.dashboard-page {
    max-width: 1200px;
}
.page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 24px;
    flex-wrap: wrap;
}
.page-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--color-text);
}
.page-subtitle {
    font-size: 13px;
    color: var(--color-text-muted);
    margin-top: 2px;
}
.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 24px;
}
.stat-card {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
    padding: 20px;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
}
.stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 42px;
    width: 42px;
    height: 42px;
    border-radius: var(--radius-md);
    background: var(--color-primary-soft);
    color: var(--color-primary);
}
.stat-label {
    color: var(--color-text-muted);
    font-size: 13px;
    margin-bottom: 4px;
}
.stat-value {
    color: var(--color-text);
    font-size: 20px;
    font-weight: 700;
    overflow-wrap: anywhere;
}
.dashboard-section {
    margin-bottom: 24px;
}
.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 12px;
}
.section-title {
    color: var(--color-text);
    font-size: 16px;
    font-weight: 600;
}
.period-toggle {
    display: flex;
    gap: 2px;
    padding: 3px;
    background: var(--color-bg-soft);
    border-radius: var(--radius-sm);
}
.period-toggle button {
    border: none;
    border-radius: 6px;
    padding: 6px 12px;
    background: transparent;
    color: var(--color-text-muted);
    font: 13px var(--font-sans);
    cursor: pointer;
}
.period-toggle button.active {
    background: var(--color-bg);
    color: var(--color-primary);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    font-weight: 500;
}
.chart-card,
.table-wrapper {
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    overflow: hidden;
}
.chart-scroll {
    overflow-x: auto;
    padding: 20px 20px 16px;
}
.chart {
    display: flex;
    align-items: flex-end;
    gap: 12px;
    min-width: max-content;
    height: 230px;
}
.bar-column {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
    width: 42px;
    height: 100%;
}
.bar-area {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: 100%;
    height: 190px;
}
.revenue-bar {
    width: 24px;
    min-height: 2px;
    background: var(--color-primary);
    border-radius: 5px 5px 2px 2px;
    transition: height 0.2s ease;
}
.bar-label {
    color: var(--color-text-muted);
    font-size: 11px;
    white-space: nowrap;
}
.data-table {
    width: 100%;
    border-collapse: collapse;
}
.data-table th {
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.03em;
    padding: 12px 16px;
    border-bottom: 1px solid var(--color-border);
}
.data-table td {
    padding: 12px 16px;
    border-bottom: 1px solid var(--color-border);
    font-size: 14px;
    vertical-align: middle;
}
.data-table tr:last-child td {
    border-bottom: none;
}
.cell-name {
    color: var(--color-text);
    font-weight: 500;
}
.badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 500;
}
.badge-red {
    background: #fdecec;
    color: var(--color-error);
}
.badge-amber {
    background: #fff5df;
    color: #a66a00;
}
.empty-state {
    padding: 40px 16px !important;
    text-align: center;
    color: var(--color-text-muted);
    font-size: 14px;
}
@media (max-width: 767px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }
    .stat-card {
        padding: 16px;
    }
    .section-header {
        align-items: flex-start;
        flex-direction: column;
    }
    .chart-scroll {
        padding-inline: 12px;
    }
}
</style>
