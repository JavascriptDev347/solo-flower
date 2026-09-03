<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-title">{{ t('auth.login.title') }}</h1>
      <p class="auth-subtitle">{{ t('auth.login.subtitle') }}</p>

      <form class="auth-form" @submit.prevent="onSubmit">
        <div class="form-group">
          <label for="email">{{ t('auth.login.email') }}</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="email@example.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">{{ t('auth.login.password') }}</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            :placeholder="t('auth.login.passwordPlaceholder')"
            required
          />
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="loading" class="spinner" />
          <span>{{ loading ? t('auth.login.submitting') : t('auth.login.submit') }}</span>
        </button>
      </form>

      <p class="auth-footer">
        {{ t('auth.login.noAccount') }}
        <NuxtLink to="/auth/register">{{ t('auth.login.register') }}</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/identity/auth'

definePageMeta({ middleware: 'guest' })

const { t } = useI18n()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const form = reactive({ email: '', password: '' })
const loading = ref(false)

async function onSubmit() {
  loading.value = true
  try {
    await authStore.login({ email: form.email, password: form.password })
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch (e) {
    // xatolik notification useApi ichida avtomatik chiqadi
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* register.vue bilan bir xil — umumiy klasslarni components/auth/AuthCard.vue ga chiqarish tavsiya etiladi */
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
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.form-group input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-soft);
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
