<script setup lang="ts">
import type { Product } from "~/types/product";
import { PACKAGING_TYPES, type PackagingType } from "~/types/product";
import { ApiError } from "~/types/api";
import { useProductsStore } from "~/stores/catalog/products";
import { useCategoriesStore } from "~/stores/catalog/categories";
import { productFormSchema, type ProductFormErrors } from "~/schemas/product";

const props = defineProps<{
    modelValue: boolean;
    product: Product | null;
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

// Asosiy
const name = ref("");
const slug = ref("");
const description = ref("");
const categoryId = ref("");
const packagingType = ref<PackagingType | "">("");

// Narx
const amount = ref<number | null>(null);
const currency = ref("UZS");
const discountAmount = ref<number | null>(null);
const clearDiscount = ref(false);

// Xususiyatlar
const color = ref("");
const stemCount = ref<number | null>(null);
const flowerTypesText = ref("");
const freshnessLifespan = ref<number | null>(null);
const careInstructions = ref("");
const clearCareInstructions = ref(false);
const occasionsText = ref("");
const compatibleAddonsText = ref("");

// Holat
const isAvailable = ref(true);
const rating = ref<number | null>(null);
const stock = ref<number | null>(null);

// Media
const videoUrlYoutube = ref("");
const videoUrlInstagram = ref("");
const imageFiles = ref<File[]>([]);
const imagePreviews = ref<string[]>([]);
const fileInput = ref<HTMLInputElement>();

const isSubmitting = ref(false);
const error = ref("");
const fieldErrors = ref<ProductFormErrors>({});

function toCsv(list: string[] | undefined) {
    return list?.join(", ") ?? "";
}

function fromCsv(text: string) {
    return text
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}

watch(
    () => props.modelValue,
    (open) => {
        if (!open) return;

        const p = props.product;
        name.value = p?.name ?? "";
        slug.value = p?.slug ?? "";
        description.value = p?.description ?? "";
        categoryId.value = p?.category_id ?? "";
        packagingType.value = p?.packaging_type ?? "";

        amount.value = p?.price_amount ?? null;
        currency.value = p?.price_currency ?? "UZS";
        discountAmount.value = p?.discount_amount ?? null;
        clearDiscount.value = false;

        color.value = p?.color ?? "";
        stemCount.value = p?.stem_count ?? null;
        flowerTypesText.value = toCsv(p?.flower_types);
        freshnessLifespan.value = p?.freshness_lifespan ?? null;
        careInstructions.value = p?.care_instructions ?? "";
        clearCareInstructions.value = false;
        occasionsText.value = toCsv(p?.occasions);
        compatibleAddonsText.value = toCsv(p?.compatible_addons);

        isAvailable.value = p?.is_available ?? true;
        rating.value = p?.rating ?? null;
        stock.value = p?.stock ?? null;

        videoUrlYoutube.value = p?.video_url_youtube ?? "";
        videoUrlInstagram.value = p?.video_url_instagram ?? "";
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
        name: name.value,
        categoryId: categoryId.value,
        packagingType: packagingType.value,
        amount: amount.value,
        currency: currency.value,
        discountAmount: discountAmount.value,
        clearDiscount: clearDiscount.value,
        rating: rating.value,
        freshnessLifespan: freshnessLifespan.value,
        stemCount: stemCount.value,
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
                name: name.value.trim(),
                description: description.value.trim() || undefined,
                video_url_youtube: videoUrlYoutube.value.trim() || undefined,
                video_url_instagram:
                    videoUrlInstagram.value.trim() || undefined,
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
                flower_types: fromCsv(flowerTypesText.value),
                color: color.value.trim() || undefined,
                stem_count: stemCount.value ?? undefined,
                packaging_type: packagingType.value as PackagingType,
                freshness_lifespan: freshnessLifespan.value ?? undefined,
                care_instructions: clearCareInstructions.value
                    ? undefined
                    : careInstructions.value.trim() || undefined,
                clear_care_instructions: clearCareInstructions.value,
                occasions: fromCsv(occasionsText.value),
                compatible_addons: fromCsv(compatibleAddonsText.value),
            });
            notify.success("Mahsulot yangilandi");
        } else {
            await store.create({
                name: name.value.trim(),
                description: description.value.trim() || undefined,
                category_id: categoryId.value,
                amount: amount.value!,
                currency: currency.value.trim(),
                discount_amount: discountAmount.value ?? undefined,
                slug: slug.value.trim() || undefined,
                video_url_youtube: videoUrlYoutube.value.trim() || undefined,
                video_url_instagram:
                    videoUrlInstagram.value.trim() || undefined,
                is_available: isAvailable.value,
                rating: rating.value ?? undefined,
                stock: stock.value ?? undefined,
                flower_types: fromCsv(flowerTypesText.value),
                color: color.value.trim() || undefined,
                stem_count: stemCount.value ?? undefined,
                packaging_type: packagingType.value as PackagingType,
                freshness_lifespan: freshnessLifespan.value ?? undefined,
                care_instructions: careInstructions.value.trim() || undefined,
                occasions: fromCsv(occasionsText.value),
                compatible_addons: fromCsv(compatibleAddonsText.value),
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

                <!-- Asosiy ma'lumotlar -->
                <div class="form-section">
                    <h4 class="section-title">Asosiy ma'lumotlar</h4>
                    <div class="form-group">
                        <label>Nomi *</label>
                        <input
                            v-model="name"
                            type="text"
                            :class="{ 'input-invalid': fieldErrors.name }"
                            placeholder="Masalan: 51 ta qizil atirgul"
                        />
                        <p v-if="fieldErrors.name" class="field-error">
                            {{ fieldErrors.name }}
                        </p>
                    </div>
                    <div class="form-grid">
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
                            <label>Qadoqlash turi *</label>
                            <select
                                v-model="packagingType"
                                :class="{ 'input-invalid': fieldErrors.packagingType }"
                            >
                                <option value="" disabled>Tanlang</option>
                                <option
                                    v-for="opt in PACKAGING_TYPES"
                                    :key="opt.value"
                                    :value="opt.value"
                                >
                                    {{ opt.label }}
                                </option>
                            </select>
                            <p v-if="fieldErrors.packagingType" class="field-error">
                                {{ fieldErrors.packagingType }}
                            </p>
                        </div>
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
                        <label>Tavsif</label>
                        <textarea
                            v-model="description"
                            rows="3"
                            placeholder="Mahsulot haqida qisqacha"
                        />
                    </div>
                </div>

                <!-- Narx -->
                <div class="form-section">
                    <h4 class="section-title">Narx</h4>
                    <p class="hint-text">
                        Narx API hujjatiga ko'ra eng kichik pul birligida
                        kiritiladi.
                    </p>
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Narx *</label>
                            <input
                                v-model.number="amount"
                                type="number"
                                min="0"
                                :class="{ 'input-invalid': fieldErrors.amount }"
                                placeholder="15000000"
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

                <!-- Xususiyatlar -->
                <div class="form-section">
                    <h4 class="section-title">Buket xususiyatlari</h4>
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Rangi</label>
                            <input
                                v-model="color"
                                type="text"
                                placeholder="Masalan: qizil"
                            />
                        </div>
                        <div class="form-group">
                            <label>Poya soni</label>
                            <input
                                v-model.number="stemCount"
                                type="number"
                                min="0"
                                :class="{ 'input-invalid': fieldErrors.stemCount }"
                                placeholder="51"
                            />
                            <p v-if="fieldErrors.stemCount" class="field-error">
                                {{ fieldErrors.stemCount }}
                            </p>
                        </div>
                    </div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Gul turlari</label>
                            <input
                                v-model="flowerTypesText"
                                type="text"
                                placeholder="rose, tulip"
                            />
                        </div>
                        <div class="form-group">
                            <label>Saqlanish muddati (kun)</label>
                            <input
                                v-model.number="freshnessLifespan"
                                type="number"
                                min="1"
                                max="7"
                                :class="{ 'input-invalid': fieldErrors.freshnessLifespan }"
                                placeholder="1–7"
                            />
                            <p v-if="fieldErrors.freshnessLifespan" class="field-error">
                                {{ fieldErrors.freshnessLifespan }}
                            </p>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Parvarish ko'rsatmasi</label>
                        <textarea
                            v-model="careInstructions"
                            rows="2"
                            :disabled="clearCareInstructions"
                            placeholder="Masalan: Har kuni suvini almashtiring"
                        />
                    </div>
                    <label v-if="isEdit" class="checkbox-label">
                        <input v-model="clearCareInstructions" type="checkbox" />
                        Ko'rsatmani olib tashlash
                    </label>
                    <div class="form-group">
                        <label>Munosabatlar (occasions)</label>
                        <input
                            v-model="occasionsText"
                            type="text"
                            placeholder="tug'ilgan kun, yubiley"
                        />
                    </div>
                    <div class="form-group">
                        <label>Mos qo'shimchalar</label>
                        <input
                            v-model="compatibleAddonsText"
                            type="text"
                            placeholder="shokolad qutisi, otkritka"
                        />
                    </div>
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
                </div>

                <!-- Media -->
                <div class="form-section">
                    <h4 class="section-title">Media</h4>
                    <div class="form-grid">
                        <div class="form-group">
                            <label>YouTube video havolasi</label>
                            <input
                                v-model="videoUrlYoutube"
                                type="text"
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                        </div>
                        <div class="form-group">
                            <label>Instagram video havolasi</label>
                            <input
                                v-model="videoUrlInstagram"
                                type="text"
                                placeholder="https://www.instagram.com/reel/..."
                            />
                        </div>
                    </div>

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
