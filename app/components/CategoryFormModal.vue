<script setup lang="ts">
import type { AdminCategory } from "~/types/category";
import { ApiError } from "~/types/api";
import { useCategoriesStore } from "~/stores/catalog/categories";

const props = defineProps<{
    modelValue: boolean;
    category: AdminCategory | null;
}>();

const emit = defineEmits<{
    "update:modelValue": [value: boolean];
    saved: [];
}>();

const store = useCategoriesStore();
const notify = useNotify();

const isEdit = computed(() => !!props.category);
const nameUz = ref("");
const nameEng = ref("");
const nameRu = ref("");
const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const isSubmitting = ref(false);
const error = ref("");
const fileInput = ref<HTMLInputElement>();

watch(
    () => props.modelValue,
    (open) => {
        if (open) {
            nameUz.value = props.category?.name_uz ?? "";
            nameEng.value = props.category?.name_eng ?? "";
            nameRu.value = props.category?.name_ru ?? "";
            imageFile.value = null;
            imagePreview.value = props.category?.image_url ?? null;
            error.value = "";
        }
    },
);

function onFileChange(event: Event) {
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
    if (!nameUz.value.trim() || !nameEng.value.trim() || !nameRu.value.trim()) {
        error.value = "Nomi barcha tillarda kiritilishi shart";
        return;
    }
    if (!isEdit.value && !imageFile.value) {
        error.value = "Rasm yuklash majburiy";
        return;
    }

    isSubmitting.value = true;
    error.value = "";

    try {
        if (isEdit.value && props.category) {
            await store.update(props.category.id, {
                name_uz: nameUz.value.trim(),
                name_eng: nameEng.value.trim(),
                name_ru: nameRu.value.trim(),
            });
            notify.success("Kategoriya yangilandi");
        } else {
            await store.create({
                name_uz: nameUz.value.trim(),
                name_eng: nameEng.value.trim(),
                name_ru: nameRu.value.trim(),
                image: imageFile.value!,
            });
            notify.success("Kategoriya yaratildi");
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
                    {{
                        isEdit ? "Kategoriyani tahrirlash" : "Yangi kategoriya"
                    }}
                </h3>

                <div class="form-group">
                    <label>Nomi (o'zbekcha)</label>
                    <input
                        v-model="nameUz"
                        type="text"
                        placeholder="Masalan: Elektronika"
                    />
                </div>
                <div class="form-group">
                    <label>Nomi (inglizcha)</label>
                    <input
                        v-model="nameEng"
                        type="text"
                        placeholder="e.g. Electronics"
                    />
                </div>
                <div class="form-group">
                    <label>Nomi (ruscha)</label>
                    <input
                        v-model="nameRu"
                        type="text"
                        placeholder="Например: Электроника"
                    />
                </div>

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
                    Tahrirlashda faqat nomni o'zgartirish mumkin, rasm
                    o'zgarmaydi.
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
}
.modal-card {
    background: var(--color-bg);
    border-radius: var(--radius-lg);
    padding: 24px;
    width: 100%;
    max-width: 420px;
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
.form-group input[type="text"] {
    width: 100%;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: 10px 14px;
    font-size: 14px;
    font-family: var(--font-sans);
    color: var(--color-text);
    outline: none;
}
.form-group input[type="text"]:focus {
    border-color: var(--color-primary);
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
