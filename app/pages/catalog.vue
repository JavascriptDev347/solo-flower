<template>
    <div class="catalog-page">
        <!-- Chap tomonda kategoriya nomi -->
        <aside class="catalog-sidebar">
            <div class="category-badge">
                <span class="category-label">Kategoriya</span>
                <h1 class="category-title">
                    {{ categoryName || "Barcha mahsulotlar" }}
                </h1>
            </div>
        </aside>

        <!-- Mahsulotlar qismi -->
        <main class="catalog-content">
            <div class="empty-state">
                <div class="empty-icon">
                    <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M3 9L4.5 4h15L21 9M3 9v10a1 1 0 001 1h16a1 1 0 001-1V9M3 9h18M9 13a3 3 0 006 0"
                            stroke="#B0B0B8"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </div>
                <p class="empty-title">Mahsulotlar hozircha yo'q</p>
                <p class="empty-subtitle">
                    "{{ categoryName }}" bo'yicha mahsulotlar tez orada
                    qo'shiladi
                </p>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
const route = useRoute();

const categoryName = computed(() => (route.query.category as string) || "");

useHead(() => ({
    title: categoryName.value ? `${categoryName.value} — Katalog` : "Katalog",
}));
</script>

<style scoped>
.catalog-page {
    max-width: 1100px;
    margin: 0 auto;
    padding: 32px 16px;
    gap: 32px;
}

/* Chap panel */
.catalog-sidebar {
    flex: 0 0 220px;
}

.category-badge {
    position: sticky;
    top: 24px;
}

.category-label {
    display: block;
    font-size: 12px;
    color: #9a9aa2;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 6px;
}

.category-title {
    font-size: 22px;
    font-weight: 700;
    color: #1a1a1a;
    line-height: 1.3;
    margin: 0;
}

/* O'ng qism */
.catalog-content {
    flex: 1;
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
}

.empty-icon {
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
    opacity: 0.8;
}

.empty-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0 0 6px;
}

.empty-subtitle {
    font-size: 14px;
    color: #9a9aa2;
    margin: 0;
}

/* Mobil */
@media (max-width: 640px) {
    .catalog-page {
        flex-direction: column;
        gap: 20px;
    }

    .catalog-sidebar {
        flex: none;
    }

    .category-badge {
        position: static;
    }
}
</style>
