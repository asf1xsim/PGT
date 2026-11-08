<!-- frontend/src/views/DashboardView.vue -->
<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Dashboard</h1>
        <p class="text-dark-muted mt-1">Welcome back, {{ user?.username }}!</p>
      </div>
      <router-link to="/search" class="btn btn-primary">
        Find Players
      </router-link>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-dark-muted text-sm">Active Matches</p>
            <p class="text-3xl font-bold mt-2">{{ stats.activeMatches }}</p>
          </div>
          <div class="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-dark-muted text-sm">Pending Requests</p>
            <p class="text-3xl font-bold mt-2">{{ stats.pendingRequests }}</p>
          </div>
          <div class="w-12 h-12 bg-accent-yellow/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-accent-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-dark-muted text-sm">Online Players</p>
            <p class="text-3xl font-bold mt-2">{{ stats.onlinePlayers }}</p>
          </div>
          <div class="w-12 h-12 bg-accent-green/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="card">
      <h2 class="text-xl font-bold mb-4">Recent Activity</h2>
      <div v-if="loading" class="text-center py-8 text-dark-muted">
        Loading...
      </div>
      <div v-else-if="recentMatches.length === 0" class="text-center py-8 text-dark-muted">
        No recent activity. Start by finding players!
      </div>
      <div v-else class="space-y-4">
        <div
            v-for="match in recentMatches"
            :key="match._id"
            class="flex items-center justify-between p-4 bg-dark-hover rounded-lg hover:bg-dark-border transition-colors cursor-pointer"
            @click="$router.push(`/chat/${match._id}`)"
        >
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
            </div>
            <div>
              <p class="font-medium">{{ match.game }}</p>
              <p class="text-sm text-dark-muted">Match with players</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span :class="getStatusBadgeClass(match.status)">
              {{ match.status }}
            </span>
            <svg class="w-5 h-5 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { matchmakingService } from '../services/matchmakingService';
import { profileService } from '../services/profileService';

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const stats = ref({
  activeMatches: 0,
  pendingRequests: 0,
  onlinePlayers: 0,
});

const recentMatches = ref([]);
const loading = ref(true);

const getStatusBadgeClass = (status) => {
  const classes = {
    active: 'badge badge-success',
    pending: 'badge badge-warning',
    declined: 'badge badge-error',
    accepted: 'badge badge-success',
  };
  return classes[status] || 'badge';
};

const loadDashboardData = async () => {
  loading.value = true;
  try {
    const matches = await matchmakingService.findMatches(1, 5);
    recentMatches.value = matches;

    const profiles = await profileService.getAll();
    stats.value.onlinePlayers = profiles.filter(p => p.isOnline).length;
    stats.value.activeMatches = matches.filter(m => m.status === 'active').length;
    stats.value.pendingRequests = matches.filter(m => m.status === 'pending').length;
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadDashboardData();
});
</script>