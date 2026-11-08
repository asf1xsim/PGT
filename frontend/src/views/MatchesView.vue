<!-- frontend/src/views/MatchesView.vue -->
<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold">My Matches</h1>
      <p class="text-dark-muted mt-1">Manage your gaming matches</p>
    </div>

    <!-- Tabs -->
    <div class="flex space-x-2 border-b border-dark-border">
      <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          :class="[
          'px-4 py-2 font-medium transition-colors',
          activeTab === tab
            ? 'text-primary border-b-2 border-primary'
            : 'text-dark-muted hover:text-dark-text'
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12 text-dark-muted">
      Loading matches...
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredMatches.length === 0" class="card text-center py-12">
      <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <p class="text-dark-muted">No matches yet. Start searching for players!</p>
      <router-link to="/search" class="btn btn-primary mt-4">
        Find Players
      </router-link>
    </div>

    <!-- Matches List -->
    <div v-else class="space-y-4">
      <div
          v-for="match in filteredMatches"
          :key="match._id"
          class="card hover:border-primary transition-all"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-2">
              <div class="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-lg">{{ match.game }}</h3>
                <p class="text-sm text-dark-muted">
                  Match ID: {{ match._id.slice(-8) }}
                </p>
              </div>
              <span :class="getStatusBadgeClass(match.status)">
                {{ match.status }}
              </span>
            </div>

            <div v-if="match.message" class="bg-dark-hover p-3 rounded-lg mt-3 mb-3">
              <p class="text-sm">{{ match.message }}</p>
            </div>

            <div class="flex items-center justify-between mt-4">
              <div class="text-sm text-dark-muted">
                Created {{ formatDate(match.createdAt) }}
              </div>

              <div class="flex space-x-2">
                <button
                    v-if="match.status === 'pending'"
                    @click="acceptMatch(match._id)"
                    class="btn btn-primary text-sm py-1"
                >
                  Accept
                </button>
                <button
                    v-if="match.status === 'pending'"
                    @click="declineMatch(match._id)"
                    class="btn btn-secondary text-sm py-1"
                >
                  Decline
                </button>
                <router-link
                    v-if="match.status === 'active' || match.status === 'accepted'"
                    :to="`/chat/${match._id}`"
                    class="btn btn-primary text-sm py-1"
                >
                  Open Chat
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { matchmakingService } from '../services/matchmakingService';

const tabs = ['All', 'Active', 'Pending', 'Declined'];
const activeTab = ref('All');
const matches = ref([]);
const loading = ref(true);

const filteredMatches = computed(() => {
  if (activeTab.value === 'All') return matches.value;
  return matches.value.filter(m =>
      m.status.toLowerCase() === activeTab.value.toLowerCase()
  );
});

const getStatusBadgeClass = (status) => {
  const classes = {
    active: 'badge badge-success',
    accepted: 'badge badge-success',
    pending: 'badge badge-warning',
    declined: 'badge badge-error',
  };
  return classes[status] || 'badge';
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const loadMatches = async () => {
  loading.value = true;
  try {
    const data = await matchmakingService.findMatches(1, 50);
    matches.value = data;
  } catch (error) {
    console.error('Failed to load matches:', error);
  } finally {
    loading.value = false;
  }
};

const acceptMatch = async (matchId) => {
  try {
    await matchmakingService.acceptMatch(matchId);
    await loadMatches();
  } catch (error) {
    alert('Failed to accept match');
  }
};

const declineMatch = async (matchId) => {
  try {
    await matchmakingService.declineMatch(matchId);
    await loadMatches();
  } catch (error) {
    alert('Failed to decline match');
  }
};

onMounted(() => {
  loadMatches();
});
</script>