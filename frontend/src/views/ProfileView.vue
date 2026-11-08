<!-- frontend/src/views/ProfileView.vue -->
<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold">My Profile</h1>
      <button
          v-if="!editing"
          @click="startEditing"
          class="btn btn-primary"
      >
        Edit Profile
      </button>
      <div v-else class="space-x-2">
        <button @click="cancelEditing" class="btn btn-secondary">
          Cancel
        </button>
        <button @click="saveProfile" class="btn btn-primary">
          Save Changes
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12 text-dark-muted">
      Loading profile...
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Profile Card -->
      <div class="card md:col-span-1">
        <div class="text-center">
          <div class="w-24 h-24 bg-primary rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-white">
            {{ user?.username?.charAt(0).toUpperCase() }}
          </div>
          <h2 class="text-xl font-bold mt-4">{{ user?.username }}</h2>
          <p class="text-dark-muted">{{ user?.email }}</p>
          <div class="mt-4">
            <span :class="profile?.isOnline ? 'badge badge-success' : 'badge'">
              {{ profile?.isOnline ? 'Online' : 'Offline' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Profile Details -->
      <div class="card md:col-span-2">
        <div v-if="error" class="bg-accent-red/10 border border-accent-red text-accent-red px-4 py-3 rounded-lg mb-4">
          {{ error }}
        </div>

        <div v-if="success" class="bg-accent-green/10 border border-accent-green text-accent-green px-4 py-3 rounded-lg mb-4">
          {{ success }}
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Bio</label>
            <textarea
                v-model="editForm.bio"
                :disabled="!editing"
                rows="4"
                class="input resize-none"
                :class="{ 'opacity-50 cursor-not-allowed': !editing }"
                placeholder="Tell others about yourself..."
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Favorite Games</label>
            <input
                v-model="gamesInput"
                :disabled="!editing"
                class="input"
                :class="{ 'opacity-50 cursor-not-allowed': !editing }"
                placeholder="CS:GO, Overwatch, Valorant (comma separated)"
            />
            <div v-if="editForm.games.length > 0" class="flex flex-wrap gap-2 mt-2">
              <span
                  v-for="(game, index) in editForm.games"
                  :key="index"
                  class="badge badge-success"
              >
                {{ game }}
              </span>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Genres</label>
            <input
                v-model="genresInput"
                :disabled="!editing"
                class="input"
                :class="{ 'opacity-50 cursor-not-allowed': !editing }"
                placeholder="FPS, MOBA, RPG (comma separated)"
            />
            <div v-if="editForm.genres.length > 0" class="flex flex-wrap gap-2 mt-2">
              <span
                  v-for="(genre, index) in editForm.genres"
                  :key="index"
                  class="badge badge-warning"
              >
                {{ genre }}
              </span>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Skill Level</label>
            <select
                v-model="editForm.skillLevel"
                :disabled="!editing"
                class="input"
                :class="{ 'opacity-50 cursor-not-allowed': !editing }"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Availability</label>
            <input
                v-model="availabilityInput"
                :disabled="!editing"
                class="input"
                :class="{ 'opacity-50 cursor-not-allowed': !editing }"
                placeholder="evenings, weekends, mornings (comma separated)"
            />
            <div v-if="editForm.availability.length > 0" class="flex flex-wrap gap-2 mt-2">
              <span
                  v-for="(time, index) in editForm.availability"
                  :key="index"
                  class="badge"
              >
                {{ time }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { profileService } from '../services/profileService';

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const profile = ref(null);
const editing = ref(false);
const loading = ref(true);
const error = ref('');
const success = ref('');

const editForm = ref({
  bio: '',
  games: [],
  genres: [],
  skillLevel: 'intermediate',
  availability: [],
});

const gamesInput = ref('');
const genresInput = ref('');
const availabilityInput = ref('');

const loadProfile = async () => {
  loading.value = true;
  try {
    const data = await profileService.getMyProfile();
    profile.value = data;
    editForm.value = {
      bio: data.bio || '',
      games: data.games || [],
      genres: data.genres || [],
      skillLevel: data.skillLevel || 'intermediate',
      availability: data.availability || [],
    };
    gamesInput.value = data.games?.join(', ') || '';
    genresInput.value = data.genres?.join(', ') || '';
    availabilityInput.value = data.availability?.join(', ') || '';
  } catch (err) {
    if (err.response?.status === 404) {
      // Profile doesn't exist, create one
      try {
        await profileService.create({
          userId: user.value.id,
          bio: '',
          games: [],
          genres: [],
          skillLevel: 'intermediate',
          availability: [],
        });
        await loadProfile();
      } catch (createErr) {
        error.value = 'Failed to create profile';
      }
    } else {
      error.value = 'Failed to load profile';
    }
  } finally {
    loading.value = false;
  }
};

watch(gamesInput, (val) => {
  if (editing.value) {
    editForm.value.games = val.split(',').map(g => g.trim()).filter(g => g);
  }
});

watch(genresInput, (val) => {
  if (editing.value) {
    editForm.value.genres = val.split(',').map(g => g.trim()).filter(g => g);
  }
});

watch(availabilityInput, (val) => {
  if (editing.value) {
    editForm.value.availability = val.split(',').map(a => a.trim()).filter(a => a);
  }
});

const startEditing = () => {
  editing.value = true;
};

const cancelEditing = () => {
  editing.value = false;
  editForm.value = {
    bio: profile.value?.bio || '',
    games: profile.value?.games || [],
    genres: profile.value?.genres || [],
    skillLevel: profile.value?.skillLevel || 'intermediate',
    availability: profile.value?.availability || [],
  };
  gamesInput.value = profile.value?.games?.join(', ') || '';
  genresInput.value = profile.value?.genres?.join(', ') || '';
  availabilityInput.value = profile.value?.availability?.join(', ') || '';
};

const saveProfile = async () => {
  error.value = '';
  success.value = '';

  try {
    const updated = await profileService.update(profile.value._id, {
      ...editForm.value,
      userId: user.value.id,
    });
    profile.value = updated;
    editing.value = false;
    success.value = 'Profile updated successfully!';
    setTimeout(() => {
      success.value = '';
    }, 3000);
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to update profile';
  }
};

onMounted(() => {
  loadProfile();
});
</script>