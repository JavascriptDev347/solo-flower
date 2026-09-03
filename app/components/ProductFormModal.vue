<script setup lang="ts">
import type { AdminProduct } from "~/types/product";
import { ApiError } from "~/types/api";
import { useProductsStore } from "~/stores/catalog/products";
import { useCategoriesStore } from "~/stores/catalog/categories";
import { productFormSchema, type ProductFormErrors } from "~/schemas/product";

const props = defineProps<{
    modelValue: boolean;
    product: AdminProduct | null;
}>();

const emit = defineEmits<{
    "update:modelValue": [value: boolean];
    saved: [];
}>();

const store = useProductsStore();
const categoriesStore = useCategoriesStore();
const notify = useNotify();

const isEdit = computed(() => !!props.product);

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 3 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Nomi va tavsifi (3 tilda)
const nameUz = ref("");
const nameEng = ref("");
const nameRu = ref("");
const descriptionUz = ref("");
const descriptionEng = ref("");
const descriptionRu = ref("");
const slug = ref("");
const categoryId = ref("");

// Belgi/badge (3 tilda)
const tagUz = ref("");
const tagEng = ref("");
const tagRu = ref("");
const clearTagUz = ref(false);
const clearTagEng = ref(false);
const clearTagRu = ref(false);

// Narx
const amount = ref<number | null>(null);
const currency = ref("UZS");
const discountAmount = ref<number | null>(null);
const clearDiscount = ref(false);

// Holat
const isAvailable = ref(true);
const rating = ref<number | null>(null);
const stock = ref<number | null>(null);
const soldCount = ref<number | null>(null);

// Media
const imageFiles = ref<File[]>([]);
const imagePreviews = ref<string[]>([]);
const fileInput = ref<HTMLInputElement>();

const isSubmitting = ref(false);
const error = ref("");
const fieldErrors = ref<ProductFormErrors>({});

watch(
    () => props.modelValue,
    (open) => {
        if (!open) return;

        const p = props.product;
        nameUz.value = p?.name_uz ?? "";
        nameEng.value = p?.name_eng ?? "";
        nameRu.value = p?.name_ru ?? "";
        descriptionUz.value = p?.description_uz ?? "";
        descriptionEng.value = p?.description_eng ?? "";
        descriptionRu.value = p?.description_ru ?? "";
        slug.value = p?.slug ?? "";
        categoryId.value = p?.category_id ?? "";

        tagUz.value = p?.tag_uz ?? "";
        tagEng.value = p?.tag_eng ?? "";
        tagRu.value = p?.tag_ru ?? "";
        clearTagUz.value = false;
        clearTagEng.value = false;
        clearTagRu.value = false;

        amount.value = p?.price_amount ?? null;
        currency.value = p?.price_currency ?? "UZS";
        discountAmount.value = p?.discount_amount ?? null;
        clearDiscount.value = false;

        isAvailable.value = p?.is_available ?? true;
        rating.value = p?.rating ?? null;
        stock.value = p?.stock ?? null;
        soldCount.value = p?.sold_count ?? null;

        imageFiles.value = [];
        imagePreviews.value = [];

        error.value = "";
        fieldErrors.value = {};
        categoriesStore.fetchAll();
    },
);

function onFilesChange(event: globalThis.Event) {
    const files = Array.from((event.target as HTMLInputElement).files ?? []);
    if (!files.length) return;

    for (const file of files) {
        if (imageFiles.value.length >= MAX_IMAGES) {
            error.value = `Eng ko'pi bilan ${MAX_IMAGES} ta rasm yuklash mumkin`;
            break;
        }
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            error.value = "Faqat JPEG, PNG yoki WEBP formatdagi rasm yuklang";
            continue;
        }
        if (file.size > MAX_IMAGE_SIZE) {
            error.value = "Har bir rasm hajmi 3MB dan oshmasligi kerak";
            continue;
        }
        imageFiles.value.push(file);
        imagePreviews.value.push(URL.createObjectURL(file));
    }

    if (fileInput.value) fileInput.value.value = "";
}

function removeImage(index: number) {
    imageFiles.value.splice(index, 1);
    imagePreviews.value.splice(index, 1);
}

function close() {
    emit("update:modelValue", false);
}

function validate(): boolean {
    const result = productFormSchema.safeParse({
        nameUz: nameUz.value,
        nameEng: nameEng.value,
        nameRu: nameRu.value,
        categoryId: categoryId.value,
        amount: amount.value,
        currency: currency.value,
        discountAmount: discountAmount.value,
        clearDiscount: clearDiscount.value,
        rating: rating.value,
        stock: stock.value,
    });

    if (result.success) {
        fieldErrors.value = {};
        return true;
    }

    const errors: ProductFormErrors = {};
    for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !errors[key as keyof ProductFormErrors]) {
            errors[key as keyof ProductFormErrors] = issue.message;
        }
    }
    fieldErrors.value = errors;
    return false;
}

async function onSubmit() {
    if (!validate()) {
        return;
    }

    isSubmitting.value = true;
    error.value = "";

    try {
        if (isEdit.value && props.product) {
            await store.update(props.product.id, {
                name_uz: nameUz.value.trim(),
                name_eng: nameEng.value.trim(),
                name_ru: nameRu.value.trim(),
                description_uz: descriptionUz.value.trim() || undefined,
                description_eng: descriptionEng.value.trim() || undefined,
                description_ru: descriptionRu.value.trim() || undefined,
                category_id: categoryId.value,
                amount: amount.value!,
                currency: currency.value.trim(),
                discount_amount: clearDiscount.value
                    ? undefined
                    : (discountAmount.value ?? undefined),
                clear_discount: clearDiscount.value,
                slug: slug.value.trim() || undefined,
                is_available: isAvailable.value,
                rating: rating.value ?? undefined,
                stock: stock.value ?? undefined,
                sold_count: soldCount.value ?? undefined,
                tag_uz: clearTagUz.value ? undefined : tagUz.value.trim() || undefined,
                tag_eng: clearTagEng.value ? undefined : tagEng.value.trim() || undefined,
                tag_ru: clearTagRu.value ? undefined : tagRu.value.trim() || undefined,
                clear_tag_uz: clearTagUz.value,
                clear_tag_eng: clearTagEng.value,
                clear_tag_ru: clearTagRu.value,
            });
            notify.success("Mahsulot yangilandi");
        } else {
            await store.create({
                name_uz: nameUz.value.trim(),
                name_eng: nameEng.value.trim(),
                name_ru: nameRu.value.trim(),
                description_uz: descriptionUz.value.trim() || undefined,
                description_eng: descriptionEng.value.trim() || undefined,
                description_ru: descriptionRu.value.trim() || undefined,
                category_id: categoryId.value,
                amount: amount.value!,
                currency: currency.value.trim(),
                discount_amount: discountAmount.value ?? undefined,
                slug: slug.value.trim() || undefined,
                is_available: isAvailable.value,
                rating: rating.value ?? undefined,
                stock: stock.value ?? undefined,
                tag_uz: tagUz.value.trim() || undefined,
                tag_eng: tagEng.value.trim() || undefined,
                tag_ru: tagRu.value.trim() || undefined,
                images: imageFiles.value,
            });
            notify.success("Mahsulot yaratildi");
        }
        emit("saved");
        close();
    } catch (e) {
        if (e instanceof ApiError) {
            error.value = e.serverMessage || e.message;
        } else {
            error.value = "Xatolik yuz berdi";
        }
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
                    {{ isEdit ? "Mahsulotni tahrirlash" : "Yangi mahsulot" }}
                </h3>

                <!-- Nomi (3 tilda) -->
                <div class="form-section">
                    <h4 class="section-title">Nomi</h4>
                    <div class="form-group">
                        <label>Nomi (o'zbekcha) *</label>
                        <input
                            v-model="nameUz"
                            type="text"
                            :class="{ 'input-invalid': fieldErrors.nameUz }"
                            placeholder="Masalan: 51 ta qizil atirgul"
                        />
                        <p v-if="fieldErrors.nameUz" class="field-error">
                            {{ fieldErrors.nameUz }}
                        </p>
                    </div>
                    <div class="form-group">
                        <label>Nomi (inglizcha) *</label>
                        <input
                            v-model="nameEng"
                            type="text"
                            :class="{ 'input-invalid': fieldErrors.nameEng }"
                            placeholder="e.g. 51 red roses"
                        />
                        <p v-if="fieldErrors.nameEng" class="field-error">
                            {{ fieldErrors.nameEng }}
                        </p>
                    </div>
                    <div class="form-group">
                        <label>Nomi (ruscha) *</label>
                        <input
                            v-model="nameRu"
                            type="text"
                            :class="{ 'input-invalid': fieldErrors.nameRu }"
                            placeholder="Например: 51 красная роза"
                        />
                        <p v-if="fieldErrors.nameRu" class="field-error">
                            {{ fieldErrors.nameRu }}
                        </p>
                    </div>
                </div>

                <!-- Asosiy ma'lumotlar -->
                <div class="form-section">
                    <h4 class="section-title">Asosiy ma'lumotlar</h4>
                    <div class="form-group">
                        <label>Kategoriya *</label>
                        <select
                            v-model="categoryId"
                            :class="{ 'input-invalid': fieldErrors.categoryId }"
                        >
                            <option value="" disabled>Tanlang</option>
                            <option
                                v-for="cat in categoriesStore.items"
                                :key="cat.id"
                                :value="cat.id"
                            >
                                {{ cat.name }}
                            </option>
                        </select>
                        <p v-if="fieldErrors.categoryId" class="field-error">
                            {{ fieldErrors.categoryId }}
                        </p>
                    </div>
                    <div class="form-group">
                        <label>Slug</label>
                        <input
                            v-model="slug"
                            type="text"
                            placeholder="Bo'sh qoldirsangiz nomdan avtomatik hosil bo'ladi"
                        />
                    </div>
                    <div class="form-group">
                        <label>Tavsif (o'zbekcha)</label>
                        <textarea
                            v-model="descriptionUz"
                            rows="2"
                            placeholder="Mahsulot haqida qisqacha"
                        />
                    </div>
                    <div class="form-group">
                        <label>Tavsif (inglizcha)</label>
                        <textarea
                            v-model="descriptionEng"
                            rows="2"
                            placeholder="Short description"
                        />
                    </div>
                    <div class="form-group">
                        <label>Tavsif (ruscha)</label>
                        <textarea
                            v-model="descriptionRu"
                            rows="2"
                            placeholder="Краткое описание"
                        />
                    </div>
                </div>

                <!-- Belgi/badge -->
                <div class="form-section">
                    <h4 class="section-title">Belgi (tag)</h4>
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Belgi (o'zbekcha)</label>
                            <input
                                v-model="tagUz"
                                type="text"
                                :disabled="clearTagUz"
                                placeholder="bestseller"
                            />
                            <label v-if="isEdit" class="checkbox-label">
                                <input v-model="clearTagUz" type="checkbox" />
                                Olib tashlash
                            </label>
                        </div>
                        <div class="form-group">
                            <label>Belgi (inglizcha)</label>
                            <input
                                v-model="tagEng"
                                type="text"
                                :disabled="clearTagEng"
                                placeholder="Bestseller"
                            />
                            <label v-if="isEdit" class="checkbox-label">
                                <input v-model="clearTagEng" type="checkbox" />
                                Olib tashlash
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Belgi (ruscha)</label>
                        <input
                            v-model="tagRu"
                            type="text"
                            :disabled="clearTagRu"
                            placeholder="хит продаж"
                        />
                        <label v-if="isEdit" class="checkbox-label">
                            <input v-model="clearTagRu" type="checkbox" />
                            Olib tashlash
                        </label>
                    </div>
                </div>

                <!-- Narx -->
                <div class="form-section">
                    <h4 class="section-title">Narx</h4>
                    <p class="hint-text">Narx so'mda, butun son sifatida kiritiladi.</p>
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Narx *</label>
                            <input
                                v-model.number="amount"
                                type="number"
                                min="0"
                                :class="{ 'input-invalid': fieldErrors.amount }"
                                placeholder="150000"
                            />
                            <p v-if="fieldErrors.amount" class="field-error">
                                {{ fieldErrors.amount }}
                            </p>
                        </div>
                        <div class="form-group">
                            <label>Valyuta *</label>
                            <input
                                v-model="currency"
                                type="text"
                                :class="{ 'input-invalid': fieldErrors.currency }"
                                placeholder="UZS"
                            />
                            <p v-if="fieldErrors.currency" class="field-error">
                                {{ fieldErrors.currency }}
                            </p>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Chegirma narxi</label>
                        <input
                            v-model.number="discountAmount"
                            type="number"
                            min="0"
                            :disabled="clearDiscount"
                            :class="{ 'input-invalid': fieldErrors.discountAmount }"
                            placeholder="Ixtiyoriy, asosiy narxdan kichik"
                        />
                        <p v-if="fieldErrors.discountAmount" class="field-error">
                            {{ fieldErrors.discountAmount }}
                        </p>
                    </div>
                    <label v-if="isEdit" class="checkbox-label">
                        <input v-model="clearDiscount" type="checkbox" />
                        Chegirmani olib tashlash
                    </label>
                </div>

                <!-- Holat -->
                <div class="form-section">
                    <h4 class="section-title">Holat</h4>
                    <label class="checkbox-label mb-3">
                        <input v-model="isAvailable" type="checkbox" />
                        Sotuvda mavjud
                    </label>
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Reyting (1–5)</label>
                            <input
                                v-model.number="rating"
                                type="number"
                                min="1"
                                max="5"
                                step="0.1"
                                :class="{ 'input-invalid': fieldErrors.rating }"
                                placeholder="4.5"
                            />
                            <p v-if="fieldErrors.rating" class="field-error">
                                {{ fieldErrors.rating }}
                            </p>
                        </div>
                        <div class="form-group">
                            <label>Ombordagi soni</label>
                            <input
                                v-model.number="stock"
                                type="number"
                                min="0"
                                :class="{ 'input-invalid': fieldErrors.stock }"
                                placeholder="12"
                            />
                            <p v-if="fieldErrors.stock" class="field-error">
                                {{ fieldErrors.stock }}
                            </p>
                        </div>
                    </div>
                    <div v-if="isEdit" class="form-group">
                        <label>Sotilganlar soni</label>
                        <input
                            v-model.number="soldCount"
                            type="number"
                            min="0"
                            placeholder="34"
                        />
                    </div>
                </div>

                <!-- Media -->
                <div class="form-section">
                    <h4 class="section-title">Media</h4>
                    <div v-if="!isEdit" class="form-group">
                        <label>Rasmlar (eng ko'pi bilan {{ MAX_IMAGES }} ta)</label>
                        <div v-if="imagePreviews.length" class="image-grid">
                            <div
                                v-for="(src, i) in imagePreviews"
                                :key="src"
                                class="image-thumb"
                            >
                                <img :src="src" alt="" />
                                <button
                                    type="button"
                                    class="image-remove"
                                    title="O'chirish"
                                    @click="removeImage(i)"
                                >
                                    <UIcon name="i-lucide-x" class="size-3" />
                                </button>
                            </div>
                        </div>
                        <button
                            v-if="imageFiles.length < MAX_IMAGES"
                            type="button"
                            class="btn-ghost"
                            @click="fileInput?.click()"
                        >
                            Rasm qo'shish
                        </button>
                        <input
                            ref="fileInput"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            class="hidden-input"
                            @change="onFilesChange"
                        />
                    </div>
                    <p v-else class="hint-text">
                        Tahrirlashda rasmlar o'zgarmaydi — rasmlarni yangilash
                        uchun hozircha alohida imkoniyat yo'q.
                    </p>
                </div>

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
    align-items: flex-start;
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
    max-width: 640px;
    margin: 24px auto;
}
.modal-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: 16px;
}

.form-section {
    padding: 16px 0;
    border-top: 1px solid var(--color-border);
}
.form-section:first-of-type {
    padding-top: 0;
    border-top: none;
}
.section-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: 12px;
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
}
@media (min-width: 560px) {
    .form-grid {
        grid-template-columns: 1fr 1fr;
    }
}

.form-group {
    margin-bottom: 16px;
}
.form-group:last-child {
    margin-bottom: 0;
}
.form-group label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-soft);
    margin-bottom: 6px;
}
.form-group input[type="text"],
.form-group input[type="number"],
.form-group select,
.form-group textarea {
    width: 100%;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: 10px 14px;
    font-size: 14px;
    font-family: var(--font-sans);
    color: var(--color-text);
    outline: none;
    background: var(--color-bg);
    resize: vertical;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    border-color: var(--color-primary);
}
.form-group input:disabled,
.form-group textarea:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
.form-group input.input-invalid,
.form-group select.input-invalid {
    border-color: var(--color-error);
}
.field-error {
    font-size: 12px;
    color: var(--color-error);
    margin: 6px 0 0;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--color-text-soft);
    cursor: pointer;
    margin-bottom: 16px;
    margin-top: 6px;
}
.mb-3 {
    margin-bottom: 12px;
}

.image-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 12px;
}
.image-thumb {
    position: relative;
    width: 64px;
    height: 64px;
}
.image-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
}
.image-remove {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--color-error);
    color: #fff;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
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
    margin: 16px 0 0;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 20px;
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
