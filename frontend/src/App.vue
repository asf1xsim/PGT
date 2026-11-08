<!-- frontend/src/main.js -->
<template>
  <div id="app" class="min-h-screen bg-dark-bg">
    <Navbar v-if="isAuthenticated" />
    <main class="container mx-auto px-4 py-6">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from './stores/authStore';
import Navbar from './components/Navbar.vue';

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
</script>