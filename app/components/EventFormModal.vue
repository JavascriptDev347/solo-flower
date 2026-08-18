<script setup lang="ts">
import type { Event } from "~/types/event";
import { ApiError } from "~/types/api";
import { useEventsStore } from "~/stores/catalog/events";
import { useCategoriesStore } from "~/stores/catalog/categories";

const props = defineProps<{
    modelValue: boolean;
    event: Event | null;
}>();

const emit = defineEmits<{
    "update:modelValue": [value: boolean];
    saved: [];
}>();

const store = useEventsStore();
const categoriesStore = useCategoriesStore();
const notify = useNotify();

const isEdit = computed(() => !!props.event);

const eyebrow = ref("");
const title = ref("");
const subtitle = ref("");
const cta = ref("");
const categoryId = ref("");
const isRoot = ref(false);
const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const isSubmitting = ref(false);
const error = ref("");
const fileInput = ref<HTMLInputElement>();

watch(
    () => props.modelValue,
    (open) => {
        if (open) {
            eyebrow.value = props.event?.eyebrow ?? "";
            title.value = props.event?.title ?? "";
            subtitle.value = props.event?.subtitle ?? "";
            cta.value = props.event?.cta ?? "";
            categoryId.value = props.event?.category_id ?? "";
            isRoot.value = props.event?.is_root ?? false;
            imageFile.value = null;
            imagePreview.value = props.event?.image ?? null;
            error.value = "";
            categoriesStore.fetchAll();
        }
    },
);

function onFileChange(event: globalThis.Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        error.value = "Faqat JPEG, PNG yoki WEBP formatdagi rasm yuklang";
        return;
    }
    if (file.size > 3 * 1024 * 1024) {
        error.value = "Rasm hajmi 3MB dan oshmasligi kerak";
        return;
    }

    error.value = "";
    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
}

function close() {
    emit("update:modelValue", false);
}

async function onSubmit() {
    if (!title.value.trim()) {
        error.value = "Sarlavha kiritilishi shart";
        return;
    }
    if (!categoryId.value) {
        error.value = "Kategoriya tanlanishi shart";
        return;
    }
    if (!isEdit.value && !imageFile.value) {
        error.value = "Rasm yuklash majburiy";
        return;
    }

    isSubmitting.value = true;
    error.value = "";

    try {
        if (isEdit.value && props.event) {
            await store.update(props.event.id, {
                eyebrow: eyebrow.value.trim(),
                title: title.value.trim(),
                subtitle: subtitle.value.trim(),
                cta: cta.value.trim(),
                category_id: categoryId.value,
                is_root: isRoot.value,
            });
            notify.success("Event yangilandi");
        } else {
            await store.create({
                eyebrow: eyebrow.value.trim(),
                title: title.value.trim(),
                subtitle: subtitle.value.trim(),
                cta: cta.value.trim(),
                category_id: categoryId.value,
                is_root: isRoot.value,
                image: imageFile.value!,
            });
            notify.success("Event yaratildi");
        }
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
                <h3 class="modal-title">
                    {{ isEdit ? "Eventni tahrirlash" : "Yangi event" }}
                </h3>

                <div class="form-group">
                    <label>Eyebrow (kichik ustki matn)</label>
                    <input
                        v-model="eyebrow"
                        type="text"
                        placeholder="Masalan: Bugungi taklif"
                    />
                </div>

                <div class="form-group">
                    <label>Sarlavha</label>
                    <input
                        v-model="title"
                        type="text"
                        placeholder="Masalan: Sevimlilar uchun gullar"
                    />
                </div>

                <div class="form-group">
                    <label>Subtitle</label>
                    <input
                        v-model="subtitle"
                        type="text"
                        placeholder="Sarlavha ostidagi matn"
                    />
                </div>

                <div class="form-group">
                    <label>Tugma matni (CTA)</label>
                    <input
                        v-model="cta"
                        type="text"
                        placeholder="Masalan: Mahsulotlarni ko'rish"
                    />
                </div>

                <div class="form-group">
                    <label>Kategoriya</label>
                    <select v-model="categoryId">
                        <option value="" disabled>Kategoriyani tanlang</option>
                        <option
                            v-for="cat in categoriesStore.items"
                            :key="cat.id"
                            :value="cat.id"
                        >
                            {{ cat.name }}
                        </option>
                    </select>
                </div>

                <label class="checkbox-label mb-4">
                    <input v-model="isRoot" type="checkbox" />
                    Bosh banner sifatida ko'rsatish (is_root)
                </label>

                <div v-if="!isEdit" class="form-group">
                    <label>Rasm</label>
                    <div class="image-picker">
                        <img
                            v-if="imagePreview"
                            :src="imagePreview"
                            class="preview"
                            alt=""
                        />
                        <button
                            type="button"
                            class="btn-ghost"
                            @click="fileInput?.click()"
                        >
                            Rasm tanlash
                        </button>
                        <input
                            ref="fileInput"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            class="hidden-input"
                            @change="onFileChange"
                        />
                    </div>
                </div>

                <p v-if="isEdit" class="hint-text">
                    Tahrirlashda rasm o'zgarmaydi — rasmni yangilash uchun
                    hozircha alohida imkoniyat yo'q.
                </p>

                <p v-if="error" class="error-text">{{ error }}</p>

                <div class="modal-footer">
                    <button class="btn-ghost" @click="close">
                        Bekor qilish
                    </button>
                    <button
                        class="btn-primary"
                        :disabled="isSubmitting"
                        @click="onSubmit"
                    >
                        {{
                            isSubmitting
                                ? "Saqlanmoqda..."
                                : isEdit
                                  ? "Saqlash"
                                  : "Yaratish"
                        }}
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    z-index: 100;
    overflow-y: auto;
}
.modal-card {
    background: var(--color-bg);
    border-radius: var(--radius-lg);
    padding: 24px;
    width: 100%;
    max-width: 460px;
    margin: auto;
}
.modal-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 16px;
}
.form-group label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-soft);
    margin-bottom: 6px;
}
.form-group input[type="text"],
.form-group select {
    width: 100%;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: 10px 14px;
    font-size: 14px;
    font-family: var(--font-sans);
    color: var(--color-text);
    outline: none;
    background: var(--color-bg);
}
.form-group input[type="text"]:focus,
.form-group select:focus {
    border-color: var(--color-primary);
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--color-text-soft);
    cursor: pointer;
}
.mb-4 {
    margin-bottom: 16px;
}

.image-picker {
    display: flex;
    align-items: center;
    gap: 12px;
}
.preview {
    width: 56px;
    height: 56px;
    border-radius: var(--radius-sm);
    object-fit: cover;
    border: 1px solid var(--color-border);
}
.hidden-input {
    display: none;
}

.hint-text {
    font-size: 13px;
    color: var(--color-text-muted);
    background: var(--color-bg-soft);
    border-radius: var(--radius-sm);
    padding: 10px 12px;
    margin-bottom: 16px;
}
.error-text {
    font-size: 13px;
    color: var(--color-error);
    background: #fdecec;
    border-radius: var(--radius-sm);
    padding: 10px 12px;
    margin-bottom: 16px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 4px;
}

.btn-primary {
    background: var(--color-primary);
    color: #fff;
    border: none;
    border-radius: var(--radius-sm);
    padding: 9px 18px;
    font-size: 14px;
    font-weight: 500;
    font-family: var(--font-sans);
    cursor: pointer;
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
</style>
