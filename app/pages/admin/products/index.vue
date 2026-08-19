<script setup lang="ts">
import { useProductsStore } from "~/stores/catalog/products";
import { useCategoriesStore } from "~/stores/catalog/categories";
import type { Product } from "~/types/product";

definePageMeta({
    middleware: "admin",
    layout: "admin",
});

const store = useProductsStore();
const categoriesStore = useCategoriesStore();
const notify = useNotify();

const isLoading = computed(() => store.adminLoading);
const search = ref("");
const categoryFilter = ref("");
const showDeleted = ref(false);

const isModalOpen = ref(false);
const selectedProduct = ref<Product | null>(null);

const deleteTarget = ref<Product | null>(null);
const isDeleting = ref(false);

let searchTimeout: ReturnType<typeof setTimeout>;

async function loadProducts() {
    try {
        await store.fetchAllAdmin({
            search: search.value || undefined,
            category_id: categoryFilter.value || undefined,
        });
    } catch {
        // xato allaqachon useApi ichida notify qilingan
    }
}

watch(search, () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(loadProducts, 400);
});

watch(categoryFilter, loadProducts);

const filteredProducts = computed(() =>
    showDeleted.value
        ? store.adminItems
        : store.adminItems.filter((p) => !p.deleted_at),
);

function categoryName(categoryId: string) {
    return categoriesStore.byId(categoryId)?.name ?? "—";
}

function formatPrice(amount: number, currency: string) {
    return `${amount.toLocaleString("uz-UZ")} ${currency}`;
}

function openCreate() {
    selectedProduct.value = null;
    isModalOpen.value = true;
}

function openEdit(product: Product) {
    selectedProduct.value = product;
    isModalOpen.value = true;
}

async function onDelete() {
    if (!deleteTarget.value) return;
    isDeleting.value = true;
    try {
        await store.remove(deleteTarget.value.id);
        notify.success("Mahsulot o'chirildi");
        deleteTarget.value = null;
    } catch {
        // notify allaqachon chiqdi
    } finally {
        isDeleting.value = false;
    }
}

onMounted(() => {
    loadProducts();
    categoriesStore.fetchAll();
});
</script>

<template>
    <div class="products-page">
        <div class="page-header">
            <div>
                <h1 class="page-title">Mahsulotlar</h1>
                <p class="page-subtitle">
                    Jami: {{ filteredProducts.length }} ta
                </p>
            </div>
            <button class="btn-primary" @click="openCreate">
                <UIcon name="i-lucide-plus" class="size-4" />
                Yangi mahsulot
            </button>
        </div>

        <div class="toolbar">
            <div class="search-input">
                <UIcon name="i-lucide-search" class="size-4" />
                <input v-model="search" type="text" placeholder="Qidirish..." />
            </div>
            <select v-model="categoryFilter" class="category-filter">
                <option value="">Barcha kategoriyalar</option>
                <option
                    v-for="cat in categoriesStore.items"
                    :key="cat.id"
                    :value="cat.id"
                >
                    {{ cat.name }}
                </option>
            </select>
            <label class="checkbox-label">
                <input v-model="showDeleted" type="checkbox" />
                O'chirilganlarni ko'rsatish
            </label>
        </div>

        <!-- Desktop jadval -->
        <div class="table-wrapper">
            <table class="data-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Nomi</th>
                        <th>Kategoriya</th>
                        <th>Narx</th>
                        <th>Ombor</th>
                        <th>Holati</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="isLoading">
                        <td colspan="7" class="empty-state">Yuklanmoqda...</td>
                    </tr>
                    <tr v-else-if="!filteredProducts.length">
                        <td colspan="7" class="empty-state">
                            Mahsulotlar topilmadi
                        </td>
                    </tr>
                    <tr v-for="row in filteredProducts" v-else :key="row.id">
                        <td>
                            <img
                                :src="row.images[0]"
                                class="thumb"
                                :class="{ 'thumb-empty': !row.images.length }"
                                alt=""
                            />
                        </td>
                        <td class="cell-name">
                            {{ row.name }}
                            <div class="cell-muted">{{ row.slug }}</div>
                        </td>
                        <td class="cell-muted">
                            {{ categoryName(row.category_id) }}
                        </td>
                        <td>
                            <div class="price-final">
                                {{
                                    formatPrice(
                                        row.final_price_amount,
                                        row.price_currency,
                                    )
                                }}
                            </div>
                            <div
                                v-if="row.discount_amount"
                                class="price-original"
                            >
                                {{
                                    formatPrice(
                                        row.price_amount,
                                        row.price_currency,
                                    )
                                }}
                            </div>
                        </td>
                        <td>
                            <div>{{ row.stock }} ta</div>
                            <span
                                class="badge"
                                :class="
                                    row.is_available
                                        ? 'badge-green'
                                        : 'badge-gray'
                                "
                            >
                                {{ row.is_available ? "Sotuvda" : "Tugagan" }}
                            </span>
                        </td>
                        <td>
                            <span
                                class="badge"
                                :class="
                                    row.deleted_at ? 'badge-red' : 'badge-green'
                                "
                            >
                                {{ row.deleted_at ? "O'chirilgan" : "Faol" }}
                            </span>
                        </td>
                        <td>
                            <div class="row-actions">
                                <button
                                    class="icon-btn"
                                    title="Tahrirlash"
                                    @click="openEdit(row)"
                                >
                                    <UIcon
                                        name="i-lucide-pencil"
                                        class="size-4"
                                    />
                                </button>
                                <button
                                    v-if="!row.deleted_at"
                                    class="icon-btn icon-btn-danger"
                                    title="O'chirish"
                                    @click="deleteTarget = row"
                                >
                                    <UIcon
                                        name="i-lucide-trash-2"
                                        class="size-4"
                                    />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Mobil kartalar -->
        <div class="mobile-list">
            <div v-if="isLoading" class="empty-state">Yuklanmoqda...</div>
            <div v-else-if="!filteredProducts.length" class="empty-state">
                Mahsulotlar topilmadi
            </div>
            <div
                v-for="row in filteredProducts"
                v-else
                :key="row.id"
                class="mobile-card"
            >
                <img
                    :src="row.images[0]"
                    class="thumb"
                    :class="{ 'thumb-empty': !row.images.length }"
                    alt=""
                />
                <div class="mobile-card-info">
                    <p class="cell-name">{{ row.name }}</p>
                    <div class="price-final">
                        {{
                            formatPrice(
                                row.final_price_amount,
                                row.price_currency,
                            )
                        }}
                    </div>
                    <div class="mobile-card-meta">
                        <span
                            class="badge"
                            :class="
                                row.deleted_at ? 'badge-red' : 'badge-green'
                            "
                        >
                            {{ row.deleted_at ? "O'chirilgan" : "Faol" }}
                        </span>
                        <span
                            class="badge"
                            :class="
                                row.is_available ? 'badge-green' : 'badge-gray'
                            "
                        >
                            {{ row.is_available ? "Sotuvda" : "Tugagan" }}
                        </span>
                    </div>
                </div>
                <div class="row-actions">
                    <button
                        class="icon-btn"
                        title="Tahrirlash"
                        @click="openEdit(row)"
                    >
                        <UIcon name="i-lucide-pencil" class="size-4" />
                    </button>
                    <button
                        v-if="!row.deleted_at"
                        class="icon-btn icon-btn-danger"
                        title="O'chirish"
                        @click="deleteTarget = row"
                    >
                        <UIcon name="i-lucide-trash-2" class="size-4" />
                    </button>
                </div>
            </div>
        </div>

        <ProductFormModal
            v-model="isModalOpen"
            :product="selectedProduct"
            @saved="loadProducts"
        />

        <!-- O'chirishni tasdiqlash modali -->
        <Teleport to="body">
            <div
                v-if="deleteTarget"
                class="modal-overlay"
                @click.self="deleteTarget = null"
            >
                <div class="modal-card modal-sm">
                    <h3 class="modal-title">Mahsulotni o'chirish</h3>
                    <p class="modal-text">
                        <strong>{{ deleteTarget.name }}</strong> mahsulotini
                        o'chirmoqchimisiz?
                    </p>
                    <div class="modal-footer">
                        <button class="btn-ghost" @click="deleteTarget = null">
                            Bekor qilish
                        </button>
                        <button
                            class="btn-danger"
                            :disabled="isDeleting"
                            @click="onDelete"
                        >
                            {{ isDeleting ? "O'chirilmoqda..." : "O'chirish" }}
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<style scoped>
.products-page {
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

.btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--color-primary);
    color: #fff;
    border: none;
    border-radius: var(--radius-sm);
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
    font-family: var(--font-sans);
    cursor: pointer;
    transition: background 0.15s;
}
.btn-primary:hover {
    background: var(--color-primary-hover);
}
.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-ghost {
    background: transparent;
    border: 1px solid var(--color-border);
    color: var(--color-text);
    border-radius: var(--radius-sm);
    padding: 9px 16px;
    font-size: 14px;
    font-family: var(--font-sans);
    cursor: pointer;
}
.btn-ghost:hover {
    background: var(--color-bg-soft);
}

.btn-danger {
    background: var(--color-error);
    color: #fff;
    border: none;
    border-radius: var(--radius-sm);
    padding: 9px 16px;
    font-size: 14px;
    font-family: var(--font-sans);
    cursor: pointer;
}
.btn-danger:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.toolbar {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
    flex-wrap: wrap;
}

.search-input {
    flex: 1;
    min-width: 200px;
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--color-bg-soft);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: 9px 14px;
}
.search-input input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 14px;
    width: 100%;
    color: var(--color-text);
    font-family: var(--font-sans);
}

.category-filter {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: 9px 14px;
    font-size: 14px;
    font-family: var(--font-sans);
    color: var(--color-text);
    background: var(--color-bg);
    min-width: 160px;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--color-text-soft);
    white-space: nowrap;
    cursor: pointer;
}

.table-wrapper {
    display: none;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    overflow-x: auto;
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
    white-space: nowrap;
}
.data-table td {
    padding: 10px 16px;
    border-bottom: 1px solid var(--color-border);
    font-size: 14px;
    vertical-align: middle;
}
.data-table tr:last-child td {
    border-bottom: none;
}

.thumb {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-sm);
    object-fit: cover;
    display: block;
    background: var(--color-bg-soft);
}
.thumb-empty {
    visibility: hidden;
}

.cell-name {
    font-weight: 500;
    color: var(--color-text);
}
.cell-muted {
    color: var(--color-text-muted);
    font-size: 13px;
}

.price-final {
    font-weight: 500;
    color: var(--color-text);
    white-space: nowrap;
}
.price-original {
    font-size: 12px;
    color: var(--color-text-muted);
    text-decoration: line-through;
    white-space: nowrap;
}

.badge {
    display: inline-block;
    font-size: 12px;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 999px;
}
.badge-green {
    background: #e7f7ed;
    color: var(--color-success);
}
.badge-red {
    background: #fdecec;
    color: var(--color-error);
}
.badge-gray {
    background: var(--color-bg-soft);
    color: var(--color-text-muted);
}

.row-actions {
    display: flex;
    gap: 6px;
    justify-content: flex-end;
}

.icon-btn {
    width: 30px;
    height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    color: var(--color-text-soft);
}
.icon-btn:hover {
    background: var(--color-bg-soft);
}
.icon-btn-danger:hover {
    background: #fdecec;
    color: var(--color-error);
}

.empty-state {
    text-align: center;
    padding: 40px 16px;
    color: var(--color-text-muted);
    font-size: 14px;
}

/* Mobil kartalar */
.mobile-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.mobile-card {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 12px;
}
.mobile-card-info {
    flex: 1;
    min-width: 0;
}
.mobile-card-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
    flex-wrap: wrap;
}

@media (min-width: 768px) {
    .table-wrapper {
        display: block;
    }
    .mobile-list {
        display: none;
    }
}

/* Modal (o'chirish tasdiqlash uchun umumiy) */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    z-index: 100;
}
.modal-card {
    background: var(--color-bg);
    border-radius: var(--radius-lg);
    padding: 24px;
    width: 100%;
}
.modal-sm {
    max-width: 380px;
}
.modal-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: 8px;
}
.modal-text {
    font-size: 14px;
    color: var(--color-text-soft);
    margin-bottom: 20px;
}
.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}
</style>
