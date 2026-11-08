<!-- frontend/src/views/RegisterView.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="card w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex w-16 h-16 bg-primary rounded-xl items-center justify-center mb-4">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold mb-2">Create Account</h1>
        <p class="text-dark-muted">Join the gaming community</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div v-if="error" class="bg-accent-red/10 border border-accent-red text-accent-red px-4 py-3 rounded-lg">
          {{ error }}
        </div>

        <div v-if="success" class="bg-accent-green/10 border border-accent-green text-accent-green px-4 py-3 rounded-lg">
          {{ success }}
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Username</label>
          <input
              v-model="username"
              type="text"
              required
              minlength="3"
              class="input"
              placeholder="gamer123"
          />
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
              minlength="6"
              class="input"
              placeholder="*********"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Confirm Password</label>
          <input
              v-model="confirmPassword"
              type="password"
              required
              class="input"
              placeholder="*********"
          />
        </div>

        <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary w-full"
        >
          <span v-if="loading">Creating Account...</span>
          <span v-else>Register</span>
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-dark-muted">
          Already have an account?
          <router-link to="/login" class="text-primary hover:text-primary-hover">
            Login here
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

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const success = ref('');
const loading = ref(false);

const handleRegister = async () => {
  error.value = '';
  success.value = '';

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match';
    return;
  }

  loading.value = true;

  try {
    await authStore.register(username.value, email.value, password.value);
    success.value = 'Account created successfully! Redirecting to login...';
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>