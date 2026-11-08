<!-- frontend/src/views/SearchView.vue -->
<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold">Find Players</h1>
      <p class="text-dark-muted mt-1">Search for gaming partners</p>
    </div>

    <!-- Search Bar -->
    <div class="card">
      <div class="flex gap-4">
        <input
            v-model="searchQuery"
            @keyup.enter="searchPlayers"
            type="text"
            class="input flex-1"
            placeholder="Search by username, game, or genre..."
        />
        <button @click="searchPlayers" class="btn btn-primary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search
        </button>
      </div>
    </div>

    <!-- Results -->
    <div v-if="loading" class="text-center py-12 text-dark-muted">
      Searching...
    </div>

    <div v-else-if="players.length === 0" class="card text-center py-12 text-dark-muted">
      <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <p>No players found. Try a different search.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
          v-for="player in players"
          :key="player._id"
          class="card hover:border-primary transition-all cursor-pointer"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-xl font-bold text-white">
              {{ player.userId?.username?.charAt(0).toUpperCase() || '?' }}
            </div>
            <div>
              <h3 class="font-bold">{{ player.userId?.username || 'Unknown' }}</h3>
              <span :class="player.isOnline ? 'badge badge-success' : 'badge'">
                {{ player.isOnline ? 'Online' : 'Offline' }}
              </span>
            </div>
          </div>
          <span class="badge badge-warning">
            {{ player.skillLevel }}
          </span>
        </div>

        <p class="text-sm text-dark-muted mb-4 line-clamp-2">
          {{ player.bio || 'No bio available' }}
        </p>

        <div v-if="player.games && player.games.length > 0" class="mb-4">
          <p class="text-xs font-medium text-dark-muted mb-2">Favorite Games:</p>
          <div class="flex flex-wrap gap-1">
            <span
                v-for="game in player.games.slice(0, 3)"
                :key="game"
                class="text-xs px-2 py-1 bg-primary/20 text-primary rounded"
            >
              {{ game }}
            </span>
            <span v-if="player.games.length > 3" class="text-xs px-2 py-1 bg-dark-hover rounded">
              +{{ player.games.length - 3 }}
            </span>
          </div>
        </div>

        <div v-if="player.genres && player.genres.length > 0" class="mb-4">
          <p class="text-xs font-medium text-dark-muted mb-2">Genres:</p>
          <div class="flex flex-wrap gap-1">
            <span
                v-for="genre in player.genres.slice(0, 3)"
                :key="genre"
                class="text-xs px-2 py-1 bg-accent-yellow/20 text-accent-yellow rounded"
            >
              {{ genre }}
            </span>
          </div>
        </div>

        <button
            @click="sendMatchRequest(player)"
            :disabled="sendingRequest === player._id"
            class="btn btn-primary w-full"
        >
          <span v-if="sendingRequest === player._id">Sending...</span>
          <span v-else>Send Match Request</span>
        </button>
      </div>
    </div>

    <!-- Match Request Modal -->
    <div
        v-if="showMatchModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        @click.self="closeMatchModal"
    >
      <div class="card max-w-md w-full mx-4">
        <h2 class="text-xl font-bold mb-4">Send Match Request</h2>

        <div v-if="modalError" class="bg-accent-red/10 border border-accent-red text-accent-red px-4 py-3 rounded-lg mb-4">
          {{ modalError }}
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Game</label>
            <input
                v-model="matchRequest.game"
                type="text"
                required
                class="input"
                placeholder="CS:GO, Overwatch, etc."
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Message (Optional)</label>
            <textarea
                v-model="matchRequest.message"
                rows="3"
                class="input resize-none"
                placeholder="Hey! Want to play together?"
            />
          </div>
        </div>

        <div class="flex space-x-3 mt-6">
          <button @click="closeMatchModal" class="btn btn-secondary flex-1">
            Cancel
          </button>
          <button @click="confirmMatchRequest" class="btn btn-primary flex-1">
            Send Request
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { profileService } from '../services/profileService';
import { matchmakingService } from '../services/matchmakingService';

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const searchQuery = ref('');
const players = ref([]);
const loading = ref(false);
const sendingRequest = ref(null);

const showMatchModal = ref(false);
const selectedPlayer = ref(null);
const matchRequest = ref({
  game: '',
  message: '',
});
const modalError = ref('');
const myProfile = ref(null);

const searchPlayers = async () => {
  loading.value = true;
  try {
    if (searchQuery.value.trim()) {
      const results = await profileService.search(searchQuery.value);
      // Filter out current user's profile
      players.value = results.filter(p => p.userId?._id !== user.value?.id);
    } else {
      const results = await profileService.getAll();
      players.value = results.filter(p => p.userId?._id !== user.value?.id);
    }
  } catch (error) {
    console.error('Search error:', error);
    players.value = [];
  } finally {
    loading.value = false;
  }
};

const sendMatchRequest = (player) => {
  selectedPlayer.value = player;
  matchRequest.value = {
    game: player.games?.[0] || '',
    message: '',
  };
  showMatchModal.value = true;
};

const closeMatchModal = () => {
  showMatchModal.value = false;
  selectedPlayer.value = null;
  matchRequest.value = { game: '', message: '' };
  modalError.value = '';
};

const confirmMatchRequest = async () => {
  if (!matchRequest.value.game.trim()) {
    modalError.value = 'Please enter a game name';
    return;
  }

  modalError.value = '';
  sendingRequest.value = selectedPlayer.value._id;

  try {
    await matchmakingService.createMatchRequest(
        myProfile.value._id,
        selectedPlayer.value._id,
        matchRequest.value.game,
        matchRequest.value.message
    );
    closeMatchModal();
    alert('Match request sent successfully!');
  } catch (error) {
    modalError.value = error.response?.data?.message || 'Failed to send match request';
  } finally {
    sendingRequest.value = null;
  }
};

const loadMyProfile = async () => {
  try {
    myProfile.value = await profileService.getMyProfile();
  } catch (error) {
    console.error('Failed to load profile:', error);
  }
};

onMounted(() => {
  loadMyProfile();
  searchPlayers();
});
</script>