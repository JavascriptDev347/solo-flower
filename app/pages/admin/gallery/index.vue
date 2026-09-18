<script setup lang="ts">
import { useGalleryStore } from "~/stores/content/gallery";
import type { GalleryPost } from "~/types/gallery";

definePageMeta({ middleware: "admin", layout: "admin" });

const store = useGalleryStore();
const notify = useNotify();
const page = ref(1);
const pageSize = 20;
const isModalOpen = ref(false);
const deleteTarget = ref<GalleryPost | null>(null);
const isDeleting = ref(false);
const pagination = computed(() => store.pagination);

async function loadGallery() {
    try {
        await store.fetchAll({ page: page.value, page_size: pageSize });
    } catch {
        // xato allaqachon useApi ichida notify qilingan
    }
}

function goToPage(target: number) {
    const totalPages = pagination.value?.total_pages ?? 1;
    if (target < 1 || target > totalPages) return;
    page.value = target;
    loadGallery();
}

async function onDelete() {
    if (!deleteTarget.value) return;
    isDeleting.value = true;
    try {
        await store.remove(deleteTarget.value.id);
        notify.success("Galereya posti o'chirildi");
        deleteTarget.value = null;
    } catch {
        // notify allaqachon chiqdi
    } finally {
        isDeleting.value = false;
    }
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("uz-UZ", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

onMounted(loadGallery);
</script>

<template>
    <div class="gallery-page">
        <div class="page-header">
            <div>
                <h1 class="page-title">Galereya</h1>
                <p class="page-subtitle">Jami: {{ pagination?.total_items ?? store.items.length }} ta</p>
            </div>
            <button class="btn-primary" @click="isModalOpen = true">
                <UIcon name="i-lucide-plus" class="size-4" /> Yangi post
            </button>
        </div>

        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr><th></th><th>Tavsif</th><th>Yaratilgan sana</th><th></th></tr></thead>
                <tbody>
                    <tr v-if="store.loading"><td colspan="4" class="empty-state">Yuklanmoqda...</td></tr>
                    <tr v-else-if="!store.items.length"><td colspan="4" class="empty-state">Galereya postlari topilmadi</td></tr>
                    <tr v-for="row in store.items" v-else :key="row.id">
                        <td>
                            <div v-if="row.image_urls.length" class="thumb"><img :src="row.image_urls[0]" alt="" /></div>
                            <div v-else class="thumb thumb-empty"><UIcon name="i-lucide-image-off" class="size-5" /></div>
                        </td>
                        <td class="cell-description">{{ row.description || "—" }}</td>
                        <td class="cell-muted">{{ formatDate(row.created_at) }}</td>
                        <td><div class="row-actions"><button class="icon-btn icon-btn-danger" title="O'chirish" @click="deleteTarget = row"><UIcon name="i-lucide-trash-2" class="size-4" /></button></div></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="mobile-list">
            <div v-if="store.loading" class="empty-state">Yuklanmoqda...</div>
            <div v-else-if="!store.items.length" class="empty-state">Galereya postlari topilmadi</div>
            <div v-for="row in store.items" v-else :key="row.id" class="mobile-card">
                <div v-if="row.image_urls.length" class="thumb"><img :src="row.image_urls[0]" alt="" /></div>
                <div v-else class="thumb thumb-empty"><UIcon name="i-lucide-image-off" class="size-5" /></div>
                <div class="mobile-card-info"><p class="cell-description">{{ row.description || "—" }}</p><span class="cell-muted">{{ formatDate(row.created_at) }}</span></div>
                <div class="row-actions"><button class="icon-btn icon-btn-danger" title="O'chirish" @click="deleteTarget = row"><UIcon name="i-lucide-trash-2" class="size-4" /></button></div>
            </div>
        </div>

        <div v-if="pagination && pagination.total_pages > 1" class="pagination">
            <button class="btn-ghost" :disabled="page <= 1" @click="goToPage(page - 1)">Oldingi</button>
            <span class="pagination-info">{{ page }} / {{ pagination.total_pages }}</span>
            <button class="btn-ghost" :disabled="page >= pagination.total_pages" @click="goToPage(page + 1)">Keyingi</button>
        </div>

        <GalleryFormModal v-model="isModalOpen" @saved="loadGallery" />

        <Teleport to="body">
            <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
                <div class="modal-card modal-sm">
                    <h3 class="modal-title">Galereya postini o'chirish</h3>
                    <p class="modal-text">Ushbu galereya postini o'chirmoqchimisiz?</p>
                    <div class="modal-footer">
                        <button class="btn-ghost" @click="deleteTarget = null">Bekor qilish</button>
                        <button class="btn-danger" :disabled="isDeleting" @click="onDelete">{{ isDeleting ? "O'chirilmoqda..." : "O'chirish" }}</button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<style scoped>
.gallery-page { max-width: 1100px; }
.page-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
.page-title { font-size: 20px; font-weight: 600; color: var(--color-text); }
.page-subtitle { font-size: 13px; color: var(--color-text-muted); margin-top: 2px; }
.btn-primary, .btn-ghost, .btn-danger { border-radius: var(--radius-sm); padding: 9px 16px; font-size: 14px; font-family: var(--font-sans); cursor: pointer; }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--color-primary); color: #fff; border: none; font-weight: 500; }
.btn-primary:hover { background: var(--color-primary-hover); }
.btn-ghost { background: transparent; border: 1px solid var(--color-border); color: var(--color-text); }
.btn-ghost:hover { background: var(--color-bg-soft); }
.btn-ghost:disabled, .btn-danger:disabled { opacity: .6; cursor: not-allowed; }
.btn-danger { background: var(--color-error); color: #fff; border: none; }
.table-wrapper { display: none; background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { text-align: left; font-size: 12px; font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: .03em; padding: 12px 16px; border-bottom: 1px solid var(--color-border); }
.data-table td { padding: 10px 16px; border-bottom: 1px solid var(--color-border); font-size: 14px; vertical-align: middle; }
.data-table tr:last-child td { border-bottom: none; }
.thumb { width: 48px; height: 48px; border-radius: var(--radius-sm); object-fit: cover; display: flex; align-items: center; justify-content: center; overflow: hidden; background: var(--color-bg-soft); color: var(--color-text-muted); }
.thumb img { width: 100%; height: 100%; object-fit: cover; }
.thumb-empty { border: 1px dashed var(--color-border); }
.cell-description { max-width: 500px; color: var(--color-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cell-muted { color: var(--color-text-muted); font-size: 13px; }
.row-actions { display: flex; gap: 6px; justify-content: flex-end; }
.icon-btn { width: 30px; height: 30px; display: inline-flex; align-items: center; justify-content: center; background: transparent; border: none; border-radius: var(--radius-sm); cursor: pointer; color: var(--color-text-soft); }
.icon-btn-danger:hover { background: #fdecec; color: var(--color-error); }
.empty-state { text-align: center; padding: 40px 16px; color: var(--color-text-muted); font-size: 14px; }
.mobile-list { display: flex; flex-direction: column; gap: 10px; }
.mobile-card { display: flex; align-items: center; gap: 12px; background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 12px; }
.mobile-card-info { flex: 1; min-width: 0; }
.pagination { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 20px; }
.pagination-info { font-size: 14px; color: var(--color-text-muted); }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.4); display: flex; align-items: center; justify-content: center; padding: 16px; z-index: 100; }
.modal-card { background: var(--color-bg); border-radius: var(--radius-lg); padding: 24px; width: 100%; }
.modal-sm { max-width: 380px; }
.modal-title { font-size: 16px; font-weight: 600; color: var(--color-text); margin-bottom: 8px; }
.modal-text { font-size: 14px; color: var(--color-text-soft); margin-bottom: 20px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 8px; }
@media (min-width: 768px) { .table-wrapper { display: block; } .mobile-list { display: none; } }
</style>
