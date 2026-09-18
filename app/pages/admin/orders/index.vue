<script setup lang="ts">
import type { Order } from "~/types/order";
import { useOrders } from "~/composables/commerce/useOrders";

definePageMeta({ middleware: "admin", layout: "admin" });

const { listAdmin, updatePaymentStatus, updateDeliveryStatus, cancel } = useOrders();
const notify = useNotify();
const orders = ref<Order[]>([]);
const isLoading = ref(true);
const activeFilter = ref<"all" | Order["delivery_status"]>("all");
const isFormOpen = ref(false);
const detailsTarget = ref<Order | null>(null);
const cancelTarget = ref<Order | null>(null);
const isCancelling = ref(false);
const busyAction = ref("");

const filters = [
    { value: "all" as const, label: "Barchasi" },
    { value: "preparing" as const, label: "Tayyorlanmoqda" },
    { value: "handed_to_courier" as const, label: "Kuryerda" },
    { value: "delivered" as const, label: "Yetkazildi" },
    { value: "cancelled" as const, label: "Bekor qilindi" },
];

const filteredOrders = computed(() =>
    activeFilter.value === "all"
        ? orders.value
        : orders.value.filter((order) => order.delivery_status === activeFilter.value),
);

function formatPrice(amount: number, currency = "UZS") {
    return `${amount.toLocaleString("uz-UZ")} ${currency}`;
}

function shortId(id: string) {
    return id.slice(0, 8);
}

function paymentLabel(status: Order["payment_status"]) {
    return status === "paid" ? "To'langan" : "To'lanmagan";
}

function deliveryLabel(status: Order["delivery_status"]) {
    return {
        preparing: "Tayyorlanmoqda",
        handed_to_courier: "Kuryerda",
        delivered: "Yetkazildi",
        cancelled: "Bekor qilindi",
    }[status];
}

function statusClass(status: Order["delivery_status"] | Order["payment_status"]) {
    return {
        preparing: "badge-amber",
        handed_to_courier: "badge-blue",
        delivered: "badge-green",
        cancelled: "badge-red",
        unpaid: "badge-amber",
        paid: "badge-green",
    }[status];
}

function replaceOrder(updated: Order) {
    const index = orders.value.findIndex((order) => order.id === updated.id);
    if (index !== -1) orders.value[index] = updated;
    if (detailsTarget.value?.id === updated.id) detailsTarget.value = updated;
}

async function togglePayment(order: Order) {
    const key = `payment-${order.id}`;
    if (busyAction.value) return;
    busyAction.value = key;
    try {
        replaceOrder(await updatePaymentStatus(order.id, order.payment_status === "paid" ? "unpaid" : "paid"));
        notify.success("To'lov holati yangilandi");
    } catch {
        // Xato useApi tomonidan ko'rsatiladi.
    } finally {
        busyAction.value = "";
    }
}

async function advanceDelivery(order: Order) {
    if (busyAction.value) return;
    const nextStatus = order.delivery_status === "preparing" ? "handed_to_courier" : "delivered";
    busyAction.value = `delivery-${order.id}`;
    try {
        replaceOrder(await updateDeliveryStatus(order.id, nextStatus));
        notify.success("Yetkazib berish holati yangilandi");
    } catch {
        // Xato useApi tomonidan ko'rsatiladi.
    } finally {
        busyAction.value = "";
    }
}

async function confirmCancel() {
    if (!cancelTarget.value) return;
    isCancelling.value = true;
    try {
        replaceOrder(await cancel(cancelTarget.value.id));
        notify.success("Buyurtma bekor qilindi");
        cancelTarget.value = null;
    } catch {
        // Xato useApi tomonidan ko'rsatiladi.
    } finally {
        isCancelling.value = false;
    }
}

function onCreated(order: Order) {
    orders.value.unshift(order);
}

async function loadOrders() {
    isLoading.value = true;
    try {
        orders.value = await listAdmin();
    } catch {
        orders.value = [];
    } finally {
        isLoading.value = false;
    }
}

onMounted(loadOrders);
</script>

<template>
    <div class="orders-page">
        <div class="page-header">
            <div>
                <h1 class="page-title">Buyurtmalar</h1>
                <p class="page-subtitle">Jami: {{ orders.length }} ta</p>
            </div>
            <button class="btn-primary" @click="isFormOpen = true">
                <UIcon name="i-lucide-plus" class="size-4" /> Yangi buyurtma
            </button>
        </div>

        <div class="filter-tabs">
            <button v-for="filter in filters" :key="filter.value" :class="{ active: activeFilter === filter.value }" @click="activeFilter = filter.value">
                {{ filter.label }}
            </button>
        </div>

        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr><th>ID</th><th>Mijoz</th><th>Mahsulotlar</th><th>Summa</th><th>To'lov</th><th>Yetkazib berish</th><th></th></tr></thead>
                <tbody>
                    <tr v-if="isLoading"><td colspan="7" class="empty-state">Yuklanmoqda...</td></tr>
                    <tr v-else-if="!filteredOrders.length"><td colspan="7" class="empty-state">Buyurtmalar topilmadi</td></tr>
                    <tr v-for="order in filteredOrders" v-else :key="order.id">
                        <td class="cell-id" :title="order.id">#{{ shortId(order.id) }}</td>
                        <td><div class="contact-cell"><span>{{ order.address }}</span><small>{{ order.phone }}</small></div></td>
                        <td>{{ order.items.reduce((sum, item) => sum + item.quantity, 0) }} ta</td>
                        <td class="cell-total">{{ formatPrice(order.total_amount, order.total_currency) }}</td>
                        <td><button class="badge badge-button" :class="statusClass(order.payment_status)" :disabled="busyAction !== ''" @click="togglePayment(order)">{{ paymentLabel(order.payment_status) }}</button></td>
                        <td><div class="status-actions"><span class="badge" :class="statusClass(order.delivery_status)">{{ deliveryLabel(order.delivery_status) }}</span><button v-if="order.delivery_status === 'preparing'" class="text-action" :disabled="busyAction !== ''" @click="advanceDelivery(order)">Kuryerga topshirish</button><button v-else-if="order.delivery_status === 'handed_to_courier'" class="text-action" :disabled="busyAction !== ''" @click="advanceDelivery(order)">Yetkazildi deb belgilash</button><button v-if="order.delivery_status === 'preparing'" class="text-action danger-action" :disabled="busyAction !== ''" @click="cancelTarget = order">Bekor qilish</button></div></td>
                        <td><button class="icon-btn" title="Batafsil" @click="detailsTarget = order"><UIcon name="i-lucide-eye" class="size-4" /></button></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="mobile-list">
            <div v-if="isLoading" class="empty-state">Yuklanmoqda...</div>
            <div v-else-if="!filteredOrders.length" class="empty-state">Buyurtmalar topilmadi</div>
            <div v-for="order in filteredOrders" v-else :key="order.id" class="mobile-card">
                <div class="mobile-card-top"><span class="cell-id">#{{ shortId(order.id) }}</span><button class="icon-btn" title="Batafsil" @click="detailsTarget = order"><UIcon name="i-lucide-eye" class="size-4" /></button></div>
                <div class="contact-cell"><span>{{ order.address }}</span><small>{{ order.phone }}</small></div>
                <div class="mobile-summary"><span>{{ order.items.reduce((sum, item) => sum + item.quantity, 0) }} ta mahsulot</span><strong>{{ formatPrice(order.total_amount, order.total_currency) }}</strong></div>
                <div class="mobile-statuses"><button class="badge badge-button" :class="statusClass(order.payment_status)" :disabled="busyAction !== ''" @click="togglePayment(order)">{{ paymentLabel(order.payment_status) }}</button><span class="badge" :class="statusClass(order.delivery_status)">{{ deliveryLabel(order.delivery_status) }}</span></div>
                <div class="mobile-actions"><button v-if="order.delivery_status === 'preparing'" class="text-action" :disabled="busyAction !== ''" @click="advanceDelivery(order)">Kuryerga topshirish</button><button v-else-if="order.delivery_status === 'handed_to_courier'" class="text-action" :disabled="busyAction !== ''" @click="advanceDelivery(order)">Yetkazildi deb belgilash</button><button v-if="order.delivery_status === 'preparing'" class="text-action danger-action" :disabled="busyAction !== ''" @click="cancelTarget = order">Bekor qilish</button></div>
            </div>
        </div>

        <AdminOrderFormModal v-model="isFormOpen" @saved="onCreated" />

        <Teleport to="body">
            <div v-if="detailsTarget" class="modal-overlay" @click.self="detailsTarget = null">
                <div class="modal-card detail-card">
                    <div class="modal-heading"><h3 class="modal-title">Buyurtma #{{ shortId(detailsTarget.id) }}</h3><button class="close-btn" @click="detailsTarget = null">×</button></div>
                    <div class="detail-grid"><div><small>Manzil</small><p>{{ detailsTarget.address }}</p></div><div><small>Telefon</small><p>{{ detailsTarget.phone }}</p></div><div v-if="detailsTarget.note"><small>Izoh</small><p>{{ detailsTarget.note }}</p></div><div><small>Holatlar</small><p><span class="badge" :class="statusClass(detailsTarget.payment_status)">{{ paymentLabel(detailsTarget.payment_status) }}</span> <span class="badge" :class="statusClass(detailsTarget.delivery_status)">{{ deliveryLabel(detailsTarget.delivery_status) }}</span></p></div></div>
                    <h4 class="items-title">Mahsulotlar</h4>
                    <div class="detail-items"><div v-for="item in detailsTarget.items" :key="item.product_id" class="detail-item"><div><strong>{{ item.product_name }}</strong><small>{{ item.quantity }} × {{ formatPrice(item.unit_price, item.currency) }}</small></div><span>{{ formatPrice(item.unit_price * item.quantity, item.currency) }}</span></div></div>
                    <div class="detail-total"><span>Jami</span><strong>{{ formatPrice(detailsTarget.total_amount, detailsTarget.total_currency) }}</strong></div>
                </div>
            </div>
            <div v-if="cancelTarget" class="modal-overlay" @click.self="cancelTarget = null">
                <div class="modal-card modal-sm"><h3 class="modal-title">Buyurtmani bekor qilish</h3><p class="modal-text">Ushbu buyurtmani bekor qilmoqchimisiz?</p><div class="modal-footer"><button class="btn-ghost" @click="cancelTarget = null">Yo'q</button><button class="btn-danger" :disabled="isCancelling" @click="confirmCancel">{{ isCancelling ? "Bekor qilinmoqda..." : "Ha, bekor qilish" }}</button></div></div>
            </div>
        </Teleport>
    </div>
</template>

<style scoped>
.orders-page { max-width: 1400px; }
.page-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
.page-title { font-size: 20px; font-weight: 600; color: var(--color-text); }
.page-subtitle { font-size: 13px; color: var(--color-text-muted); margin-top: 2px; }
.btn-primary, .btn-ghost, .btn-danger { border-radius: var(--radius-sm); padding: 9px 16px; font-size: 14px; font-family: var(--font-sans); cursor: pointer; }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--color-primary); color: #fff; border: none; font-weight: 500; }
.btn-primary:hover { background: var(--color-primary-hover); }
.btn-ghost { background: transparent; border: 1px solid var(--color-border); color: var(--color-text); }
.btn-ghost:hover { background: var(--color-bg-soft); }
.btn-danger { background: var(--color-error); color: #fff; border: none; }
.btn-danger:disabled, .btn-ghost:disabled { opacity: .6; cursor: not-allowed; }
.filter-tabs { display: flex; gap: 6px; overflow-x: auto; margin-bottom: 14px; padding-bottom: 2px; }
.filter-tabs button { border: 1px solid var(--color-border); background: transparent; color: var(--color-text-soft); border-radius: 999px; padding: 7px 13px; font: 13px var(--font-sans); cursor: pointer; white-space: nowrap; }
.filter-tabs button.active { background: var(--color-primary); border-color: var(--color-primary); color: #fff; }
.table-wrapper { display: none; background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { text-align: left; font-size: 12px; font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: .03em; padding: 12px 14px; border-bottom: 1px solid var(--color-border); }
.data-table td { padding: 11px 14px; border-bottom: 1px solid var(--color-border); font-size: 13px; vertical-align: middle; }
.data-table tr:last-child td { border-bottom: none; }
.cell-id { color: var(--color-text-soft); font-family: monospace; white-space: nowrap; }
.contact-cell { min-width: 140px; max-width: 230px; display: flex; flex-direction: column; gap: 3px; }
.contact-cell span { color: var(--color-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.contact-cell small, .detail-grid small, .detail-item small { color: var(--color-text-muted); font-size: 12px; }
.cell-total { font-weight: 600; white-space: nowrap; color: var(--color-text); }
.badge { display: inline-flex; align-items: center; border-radius: 999px; padding: 4px 9px; font-size: 11px; font-weight: 600; white-space: nowrap; }
.badge-button { border: none; cursor: pointer; font-family: var(--font-sans); }
.badge-button:disabled { opacity: .6; cursor: wait; }
.badge-green { background: #e8f7ee; color: #21834a; }.badge-amber { background: #fff5df; color: #a66a00; }.badge-blue { background: #e8f1ff; color: #3468b5; }.badge-red { background: #fdecec; color: var(--color-error); }
.status-actions { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; min-width: 155px; }
.text-action { border: none; background: transparent; color: var(--color-primary); padding: 2px 0; font: 12px var(--font-sans); cursor: pointer; }
.text-action:disabled { opacity: .5; cursor: wait; }.danger-action { color: var(--color-error); }
.icon-btn { width: 30px; height: 30px; display: inline-flex; align-items: center; justify-content: center; background: transparent; border: none; border-radius: var(--radius-sm); cursor: pointer; color: var(--color-text-soft); }.icon-btn:hover { background: var(--color-bg-soft); color: var(--color-primary); }
.empty-state { text-align: center; padding: 40px 16px !important; color: var(--color-text-muted); font-size: 14px !important; }
.mobile-list { display: flex; flex-direction: column; gap: 10px; }
.mobile-card { background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 13px; }.mobile-card-top, .mobile-summary, .mobile-statuses, .mobile-actions { display: flex; align-items: center; justify-content: space-between; gap: 8px; }.mobile-card-top { margin-bottom: 10px; }.mobile-summary { margin-top: 12px; font-size: 13px; color: var(--color-text-muted); }.mobile-summary strong { color: var(--color-text); }.mobile-statuses { justify-content: flex-start; margin-top: 10px; }.mobile-actions { justify-content: flex-start; margin-top: 8px; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.4); display: flex; align-items: center; justify-content: center; padding: 16px; z-index: 100; }.modal-card { background: var(--color-bg); border-radius: var(--radius-lg); padding: 24px; width: 100%; max-width: 620px; max-height: 92vh; overflow-y: auto; }.modal-sm { max-width: 380px; }.modal-title { font-size: 16px; font-weight: 600; color: var(--color-text); margin: 0; }.modal-heading { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }.close-btn { border: none; background: transparent; font-size: 24px; color: var(--color-text-muted); cursor: pointer; }.modal-text { font-size: 14px; color: var(--color-text-soft); margin: 10px 0 20px; }.modal-footer { display: flex; justify-content: flex-end; gap: 8px; }.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }.detail-grid p { margin-top: 4px; color: var(--color-text); font-size: 14px; }.items-title { margin: 22px 0 10px; color: var(--color-text); font-size: 14px; }.detail-items { border: 1px solid var(--color-border); border-radius: var(--radius-sm); }.detail-item { display: flex; justify-content: space-between; gap: 12px; padding: 10px; border-bottom: 1px solid var(--color-border); font-size: 13px; }.detail-item:last-child { border-bottom: none; }.detail-item div { display: flex; flex-direction: column; gap: 3px; min-width: 0; }.detail-item strong { color: var(--color-text); }.detail-item > span { white-space: nowrap; color: var(--color-text); }.detail-total { display: flex; justify-content: space-between; padding-top: 14px; color: var(--color-text); }
@media (min-width: 900px) { .table-wrapper { display: block; } .mobile-list { display: none; } }
@media (max-width: 520px) { .detail-grid { grid-template-columns: 1fr; gap: 10px; } }
</style>
