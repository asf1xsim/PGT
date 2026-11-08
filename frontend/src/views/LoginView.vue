<!-- frontend/src/views/LoginView.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="card w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex w-16 h-16 bg-primary rounded-xl items-center justify-center mb-4">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold mb-2">Welcome Back</h1>
        <p class="text-dark-muted">Login to find your gaming partners</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div v-if="error" class="bg-accent-red/10 border border-accent-red text-accent-red px-4 py-3 rounded-lg">
          {{ error }}
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Email</label>
          <input
              v-model="email"
              type="email"
              required
              class="input"
              placeholder="your@email.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Password</label>
          <input
              v-model="password"
              type="password"
              required
              class="input"
              placeholder="**********"
          />
        </div>

        <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary w-full"
        >
          <span v-if="loading">Logging in...</span>
          <span v-else>Login</span>
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-dark-muted">
          Don't have an account?
          <router-link to="/register" class="text-primary hover:text-primary-hover">
            Register here
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  error.value = '';
  loading.value = true;

  try {
    await authStore.login(email.value, password.value);
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>