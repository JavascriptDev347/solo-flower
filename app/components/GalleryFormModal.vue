<script setup lang="ts">
import { ApiError } from "~/types/api";
import { useGalleryStore } from "~/stores/content/gallery";

const props = defineProps<{ modelValue: boolean }>();

const emit = defineEmits<{
    "update:modelValue": [value: boolean];
    saved: [];
}>();

const store = useGalleryStore();
const notify = useNotify();
const files = ref<File[]>([]);
const previews = ref<string[]>([]);
const description = ref("");
const error = ref("");
const isSubmitting = ref(false);
const fileInput = ref<HTMLInputElement>();

watch(
    () => props.modelValue,
    (open) => {
        if (open) {
            files.value = [];
            previews.value = [];
            description.value = "";
            error.value = "";
        }
    },
);

function onFileChange(event: Event) {
    const selected = Array.from((event.target as HTMLInputElement).files ?? []);
    if (!selected.length) return;
    if (files.value.length + selected.length > 3) {
        error.value = "Ko'pi bilan 3 ta rasm yuklash mumkin";
        return;
    }
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    const invalid = selected.find(
        (file) => !allowed.includes(file.type) || file.size > 3 * 1024 * 1024,
    );
    if (invalid) {
        error.value = !allowed.includes(invalid.type)
            ? "Faqat JPEG, PNG yoki WEBP formatdagi rasm yuklang"
            : "Har bir rasm hajmi 3MB dan oshmasligi kerak";
        return;
    }
    error.value = "";
    files.value.push(...selected);
    previews.value.push(...selected.map((file) => URL.createObjectURL(file)));
    if (fileInput.value) fileInput.value.value = "";
}

function removeFile(index: number) {
    URL.revokeObjectURL(previews.value[index]);
    files.value.splice(index, 1);
    previews.value.splice(index, 1);
}

function close() {
    emit("update:modelValue", false);
}

async function onSubmit() {
    isSubmitting.value = true;
    error.value = "";
    try {
        await store.create({
            images: files.value,
            description: description.value.trim() || undefined,
        });
        notify.success("Galereya posti yaratildi");
        emit("saved");
        close();
    } catch (e) {
        error.value = e instanceof ApiError ? e.message : "Xatolik yuz berdi";
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<template>
    <Teleport to="body">
        <div v-if="modelValue" class="modal-overlay" @click.self="close">
            <div class="modal-card">
                <h3 class="modal-title">Yangi galereya posti</h3>
                <div class="form-group">
                    <label>Rasmlar (ixtiyoriy, 3 tagacha)</label>
                    <div class="preview-grid">
                        <div v-for="(preview, index) in previews" :key="preview" class="preview-wrap">
                            <img :src="preview" class="preview" alt="" />
                            <button type="button" class="remove-preview" @click="removeFile(index)">×</button>
                        </div>
                    </div>
                    <button
                        v-if="files.length < 3"
                        type="button"
                        class="btn-ghost"
                        @click="fileInput?.click()"
                    >
                        Rasmlar tanlash
                    </button>
                    <input
                        ref="fileInput"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        class="hidden-input"
                        @change="onFileChange"
                    />
                    <p class="hint-text">JPEG, PNG yoki WEBP, har biri 3MB gacha</p>
                </div>
                <div class="form-group">
                    <label>Tavsif (ixtiyoriy)</label>
                    <textarea v-model="description" rows="4" placeholder="Post tavsifi" />
                </div>
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
.modal-card { background: var(--color-bg); border-radius: var(--radius-lg); padding: 24px; width: 100%; max-width: 480px; }
.modal-title { font-size: 16px; font-weight: 600; color: var(--color-text); margin-bottom: 20px; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-size: 13px; font-weight: 500; color: var(--color-text-soft); margin-bottom: 6px; }
.form-group textarea { width: 100%; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 10px 14px; font: 14px var(--font-sans); color: var(--color-text); resize: vertical; outline: none; }
.form-group textarea:focus { border-color: var(--color-primary); }
.preview-grid { display: flex; gap: 8px; margin-bottom: 10px; }
.preview-wrap { position: relative; }
.preview { width: 72px; height: 72px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--color-border); }
.remove-preview { position: absolute; top: -6px; right: -6px; width: 20px; height: 20px; border: 0; border-radius: 50%; background: var(--color-error); color: #fff; cursor: pointer; line-height: 18px; }
.hidden-input { display: none; }
.hint-text { font-size: 12px; color: var(--color-text-muted); margin-top: 8px; }
.error-text { font-size: 13px; color: var(--color-error); background: #fdecec; border-radius: var(--radius-sm); padding: 10px 12px; margin-bottom: 16px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 8px; margin-top: 4px; }
.btn-primary, .btn-ghost { border-radius: var(--radius-sm); padding: 9px 16px; font-size: 14px; font-family: var(--font-sans); cursor: pointer; }
.btn-primary { background: var(--color-primary); color: #fff; border: none; font-weight: 500; }
.btn-primary:hover { background: var(--color-primary-hover); }
.btn-primary:disabled { opacity: .6; cursor: not-allowed; }
.btn-ghost { background: transparent; border: 1px solid var(--color-border); color: var(--color-text); }
.btn-ghost:hover { background: var(--color-bg-soft); }
</style>
