<template>
    <div class="auth-page">
        <div class="auth-card">
            <h1 class="auth-title">{{ t("auth.register.title") }}</h1>
            <p class="auth-subtitle">
                {{ t("auth.register.subtitle") }}
            </p>

            <form class="auth-form" @submit.prevent="onSubmit">
                <div class="form-group">
                    <label for="email">{{ t("auth.register.email") }}</label>
                    <input
                        id="email"
                        v-model="form.email"
                        type="email"
                        placeholder="email@example.com"
                        required
                        :class="{ 'input-error': errors.email }"
                    />
                    <span v-if="errors.email" class="field-error">{{
                        errors.email
                    }}</span>
                </div>

                <div class="form-group">
                    <label for="password">{{ t("auth.register.password") }}</label>
                    <input
                        id="password"
                        v-model="form.password"
                        type="password"
                        :placeholder="t('auth.register.passwordPlaceholder')"
                        required
                        :class="{ 'input-error': errors.password }"
                    />
                    <span v-if="errors.password" class="field-error">{{
                        errors.password
                    }}</span>
                </div>

                <button type="submit" class="btn-primary" :disabled="loading">
                    <span v-if="loading" class="spinner" />
                    <span>{{
                        loading
                            ? t("auth.register.submitting")
                            : t("auth.register.submit")
                    }}</span>
                </button>
            </form>

            <p class="auth-footer">
                {{ t("auth.register.haveAccount") }}
                <NuxtLink to="/auth/login">{{ t("auth.register.login") }}</NuxtLink>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/identity/auth';

definePageMeta({ middleware: "guest" });

const { t } = useI18n();
const authStore = useAuthStore();
const notify = useNotify();
const router = useRouter();

const form = reactive({ email: "", password: "" });
const errors = reactive({ email: "", password: "" });
const loading = ref(false);

function validate(): boolean {
    errors.email = "";
    errors.password = "";
    let valid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
        errors.email = t("auth.register.emailInvalid");
        valid = false;
    }
    if (form.password.length < 6) {
        errors.password = t("auth.register.passwordTooShort");
        valid = false;
    }
    return valid;
}

async function onSubmit() {
    if (!validate()) return;
    loading.value = true;
    try {
        await authStore.register({
            email: form.email,
            password: form.password,
        });
        notify.success(t("auth.register.success"));
        router.push("/auth/login");
    } catch (e) {
        // xatolik notification useApi ichida avtomatik chiqadi
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.auth-page {
    min-height: calc(100vh - 80px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    background: var(--color-bg-soft);
    font-family: var(--font-sans);
}

.auth-card {
    width: 100%;
    max-width: 400px;
    background: var(--color-bg);
    border-radius: var(--radius-lg);
    padding: 36px 28px;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
}

.auth-title {
    font-size: 22px;
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 6px;
    text-align: center;
}

.auth-subtitle {
    font-size: 14px;
    color: var(--color-text-muted);
    text-align: center;
    margin: 0 0 28px;
}

.auth-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-group label {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text);
}

.form-group input {
    padding: 12px 14px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: 14px;
    font-family: var(--font-sans);
    outline: none;
    transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease;
}

.form-group input:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-soft);
}

.input-error {
    border-color: var(--color-error) !important;
}

.field-error {
    font-size: 12px;
    color: var(--color-error);
}

.btn-primary {
    margin-top: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 13px;
    background: var(--color-primary);
    color: #fff;
    border: none;
    border-radius: var(--radius-md);
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s ease;
}

.btn-primary:hover:not(:disabled) {
    background: var(--color-primary-hover);
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.auth-footer {
    margin-top: 22px;
    text-align: center;
    font-size: 14px;
    color: var(--color-text-soft);
}

.auth-footer a {
    color: var(--color-primary);
    font-weight: 600;
    text-decoration: none;
}

.auth-footer a:hover {
    text-decoration: underline;
}

@media (max-width: 420px) {
    .auth-card {
        padding: 28px 20px;
    }
}
</style>
