<script setup lang="ts">
import type { Product } from "~/types/product";
import { useProducts } from "~/composables/catalog/useProducts";
import { useOrders } from "~/composables/commerce/useOrders";

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ "update:modelValue": [value: boolean]; saved: [order: import("~/types/order").Order] }>();

const notify = useNotify();
const { list } = useProducts();
const { createManual } = useOrders();
const address = ref("");
const phone = ref("+998");
const note = ref("");
const paymentStatus = ref<"unpaid" | "paid">("unpaid");
const products = ref<Product[]>([]);
const selectedProductId = ref("");
const search = ref("");
const items = ref<{ product_id: string; quantity: number }[]>([]);
const error = ref("");
const isLoadingProducts = ref(false);
const isSubmitting = ref(false);

const filteredProducts = computed(() => {
    const query = search.value.trim().toLocaleLowerCase();
    return products.value.filter((product) =>
        !query || product.name.toLocaleLowerCase().includes(query),
    );
});

const selectedProduct = computed(() =>
    products.value.find((product) => product.id === selectedProductId.value),
);

const lineItems = computed(() =>
    items.value.map((item) => ({
        ...item,
        product: products.value.find((product) => product.id === item.product_id),
    })),
);

const total = computed(() =>
    lineItems.value.reduce(
        (sum, item) => sum + (item.product?.final_price_amount ?? item.product?.price_amount ?? 0) * item.quantity,
        0,
    ),
);

function formatPrice(amount: number, currency = "UZS") {
    return `${amount.toLocaleString("uz-UZ")} ${currency}`;
}

async function loadProducts() {
    isLoadingProducts.value = true;
    try {
        const result = await list({ page: 1, page_size: 1000 });
        products.value = result.items.filter((product) => product.is_available);
    } catch {
        products.value = [];
    } finally {
        isLoadingProducts.value = false;
    }
}

function reset() {
    address.value = "";
    phone.value = "+998";
    note.value = "";
    paymentStatus.value = "unpaid";
    selectedProductId.value = "";
    search.value = "";
    items.value = [];
    error.value = "";
}

function close() {
    if (!isSubmitting.value) emit("update:modelValue", false);
}

function addProduct() {
    if (!selectedProductId.value) return;
    const existing = items.value.find((item) => item.product_id === selectedProductId.value);
    if (existing) existing.quantity += 1;
    else items.value.push({ product_id: selectedProductId.value, quantity: 1 });
    selectedProductId.value = "";
    search.value = "";
}

function removeItem(productId: string) {
    items.value = items.value.filter((item) => item.product_id !== productId);
}

function setQuantity(productId: string, event: Event) {
    const quantity = Number((event.target as HTMLInputElement).value);
    const item = items.value.find((lineItem) => lineItem.product_id === productId);
    if (item) item.quantity = Number.isFinite(quantity) ? quantity : 1;
}

function validate() {
    if (!address.value.trim()) {
        error.value = "Manzilni kiriting";
        return false;
    }
    if (!/^\+998\d{9}$/.test(phone.value.trim())) {
        error.value = "Telefon +998 va 9 ta raqamdan iborat bo'lishi kerak";
        return false;
    }
    if (!items.value.length) {
        error.value = "Kamida bitta mahsulot tanlang";
        return false;
    }
    if (items.value.some((item) => !Number.isInteger(item.quantity) || item.quantity < 1)) {
        error.value = "Mahsulot miqdori 1 dan kam bo'lmasligi kerak";
        return false;
    }
    error.value = "";
    return true;
}

async function onSubmit() {
    if (isSubmitting.value || !validate()) return;
    isSubmitting.value = true;
    try {
        const order = await createManual({
            address: address.value.trim(),
            phone: phone.value.trim(),
            note: note.value.trim() || undefined,
            payment_status: paymentStatus.value,
            items: items.value.map(({ product_id, quantity }) => ({ product_id, quantity })),
        });
        notify.success("Buyurtma yaratildi");
        emit("saved", order);
        reset();
        emit("update:modelValue", false);
    } catch (requestError) {
        error.value = requestError instanceof Error ? requestError.message : "Xatolik yuz berdi";
    } finally {
        isSubmitting.value = false;
    }
}

watch(
    () => props.modelValue,
    (open) => {
        if (open) {
            reset();
            if (!products.value.length) loadProducts();
        }
    },
);
</script>

<template>
    <Teleport to="body">
        <div v-if="modelValue" class="modal-overlay" @click.self="close">
            <div class="modal-card">
                <h3 class="modal-title">Yangi buyurtma</h3>
                <div class="form-grid">
                    <div class="form-group form-wide">
                        <label>Manzil *</label>
                        <textarea v-model="address" rows="2" placeholder="Yetkazib berish manzili" />
                    </div>
                    <div class="form-group">
                        <label>Telefon *</label>
                        <input v-model="phone" type="tel" placeholder="+998901234567" />
                    </div>
                    <div class="form-group">
                        <label>To'lov holati</label>
                        <select v-model="paymentStatus">
                            <option value="unpaid">To'lanmagan</option>
                            <option value="paid">To'langan</option>
                        </select>
                    </div>
                    <div class="form-group form-wide">
                        <label>Izoh</label>
                        <textarea v-model="note" rows="2" placeholder="Ixtiyoriy izoh" />
                    </div>
                </div>

                <div class="form-group">
                    <label>Mahsulotlar *</label>
                    <div class="product-picker">
                        <input v-model="search" type="search" placeholder="Mahsulot qidirish..." />
                        <select v-model="selectedProductId" :disabled="isLoadingProducts">
                            <option value="">{{ isLoadingProducts ? "Yuklanmoqda..." : "Mahsulot tanlang" }}</option>
                            <option v-for="product in filteredProducts" :key="product.id" :value="product.id">
                                {{ product.name }} — {{ formatPrice(product.final_price_amount ?? product.price_amount, product.price_currency) }}
                            </option>
                        </select>
                        <button type="button" class="btn-ghost" :disabled="!selectedProduct" @click="addProduct">Qo'shish</button>
                    </div>
                </div>

                <div v-if="lineItems.length" class="line-items">
                    <div v-for="item in lineItems" :key="item.product_id" class="line-item">
                        <div class="line-info">
                            <strong>{{ item.product?.name ?? "Mahsulot" }}</strong>
                            <span>{{ formatPrice(item.product?.final_price_amount ?? item.product?.price_amount ?? 0, item.product?.price_currency) }}</span>
                        </div>
                        <input :value="item.quantity" type="number" min="1" aria-label="Miqdor" @input="setQuantity(item.product_id, $event)" />
                        <span class="line-total">{{ formatPrice((item.product?.final_price_amount ?? item.product?.price_amount ?? 0) * item.quantity, item.product?.price_currency) }}</span>
                        <button type="button" class="remove-btn" title="O'chirish" @click="removeItem(item.product_id)">×</button>
                    </div>
                    <div class="order-total"><span>Jami</span><strong>{{ formatPrice(total) }}</strong></div>
                </div>
                <p v-else class="hint-text">Buyurtmaga kamida bitta mahsulot qo'shing</p>
                <p v-if="error" class="error-text">{{ error }}</p>
                <div class="modal-footer">
                    <button class="btn-ghost" @click="close">Bekor qilish</button>
                    <button class="btn-primary" :disabled="isSubmitting" @click="onSubmit">
                        {{ isSubmitting ? "Saqlanmoqda..." : "Yaratish" }}
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.4); display: flex; align-items: center; justify-content: center; padding: 16px; z-index: 100; }
.modal-card { background: var(--color-bg); border-radius: var(--radius-lg); padding: 24px; width: 100%; max-width: 680px; max-height: 92vh; overflow-y: auto; }
.modal-title { font-size: 16px; font-weight: 600; color: var(--color-text); margin-bottom: 20px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 14px; }
.form-wide { grid-column: 1 / -1; }
.form-group { margin-bottom: 14px; }
.form-group label { display: block; font-size: 13px; font-weight: 500; color: var(--color-text-soft); margin-bottom: 6px; }
.form-group input, .form-group select, .form-group textarea, .product-picker input, .product-picker select, .line-item input { width: 100%; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 9px 11px; font: 14px var(--font-sans); color: var(--color-text); background: var(--color-bg); outline: none; }
.form-group textarea { resize: vertical; }
.form-group input:focus, .form-group select:focus, .form-group textarea:focus, .product-picker input:focus, .product-picker select:focus { border-color: var(--color-primary); }
.product-picker { display: grid; grid-template-columns: 1fr 1.2fr auto; gap: 8px; }
.btn-primary, .btn-ghost { border-radius: var(--radius-sm); padding: 9px 16px; font-size: 14px; font-family: var(--font-sans); cursor: pointer; }
.btn-primary { background: var(--color-primary); color: #fff; border: none; font-weight: 500; }
.btn-primary:hover { background: var(--color-primary-hover); }
.btn-primary:disabled, .btn-ghost:disabled { opacity: .6; cursor: not-allowed; }
.btn-ghost { background: transparent; border: 1px solid var(--color-border); color: var(--color-text); }
.btn-ghost:hover { background: var(--color-bg-soft); }
.line-items { border: 1px solid var(--color-border); border-radius: var(--radius-sm); overflow: hidden; margin-bottom: 14px; }
.line-item { display: grid; grid-template-columns: minmax(0, 1fr) 68px auto 28px; align-items: center; gap: 8px; padding: 9px 10px; border-bottom: 1px solid var(--color-border); }
.line-info { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.line-info strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--color-text); font-size: 13px; }
.line-info span, .hint-text { color: var(--color-text-muted); font-size: 12px; }
.line-item input { padding: 6px; }
.line-total { color: var(--color-text); font-size: 13px; white-space: nowrap; }
.remove-btn { border: none; background: transparent; color: var(--color-error); font-size: 21px; cursor: pointer; }
.order-total { display: flex; justify-content: space-between; padding: 12px 10px; color: var(--color-text); font-size: 14px; }
.hint-text { margin: 8px 0 14px; }
.error-text { font-size: 13px; color: var(--color-error); background: #fdecec; border-radius: var(--radius-sm); padding: 10px 12px; margin-bottom: 16px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 8px; margin-top: 4px; }
@media (max-width: 600px) { .form-grid, .product-picker { grid-template-columns: 1fr; } .form-wide { grid-column: auto; } .line-item { grid-template-columns: minmax(0, 1fr) 58px 28px; } .line-total { grid-column: 1 / 3; } }
</style>
