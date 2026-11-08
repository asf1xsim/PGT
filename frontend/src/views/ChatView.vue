<!-- frontend/src/views/ChatView.vue -->
<template>
  <div class="max-w-6xl mx-auto h-[calc(100vh-120px)] flex flex-col">
    <!-- Chat Header -->
    <div class="card mb-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <router-link to="/matches" class="text-dark-muted hover:text-dark-text">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </router-link>
          <div>
            <h1 class="text-xl font-bold">{{ match?.game || 'Loading...' }}</h1>
            <p class="text-sm text-dark-muted">Match Chat</p>
          </div>
        </div>
        <span v-if="match" :class="getStatusBadgeClass(match.status)">
          {{ match.status }}
        </span>
      </div>
    </div>

    <!-- Chat Messages -->
    <div class="card flex-1 flex flex-col overflow-hidden">
      <div
          ref="messagesContainer"
          class="flex-1 overflow-y-auto space-y-4 p-4"
      >
        <div v-if="loadingMessages" class="text-center py-8 text-dark-muted">
          Loading messages...
        </div>

        <div
            v-for="message in messages"
            :key="message._id"
            :class="[
            'flex',
            message.senderId === myProfileId ? 'justify-end' : 'justify-start'
          ]"
        >
          <div
              :class="[
              'max-w-md rounded-lg p-3',
              message.senderId === myProfileId
                ? 'bg-primary text-white'
                : 'bg-dark-hover text-dark-text'
            ]"
          >
            <p class="break-words">{{ message.content }}</p>
            <p
                :class="[
                'text-xs mt-1',
                message.senderId === myProfileId
                  ? 'text-primary-light'
                  : 'text-dark-muted'
              ]"
            >
              {{ formatTime(message.timestamp) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Message Input -->
      <div class="border-t border-dark-border p-4">
        <form @submit.prevent="sendMessage" class="flex space-x-2">
          <input
              v-model="newMessage"
              type="text"
              class="input flex-1"
              placeholder="Type a message..."
              :disabled="!connected"
          />
          <button
              type="submit"
              :disabled="!newMessage.trim() || !connected"
              class="btn btn-primary"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        <p v-if="!connected" class="text-xs text-accent-red mt-2">
          Connecting to chat...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { chatService } from '../services/chatService';
import { matchmakingService } from '../services/matchmakingService';
import { profileService } from '../services/profileService';

const route = useRoute();
const authStore = useAuthStore();
const user = computed(() => authStore.user);

const matchId = ref(route.params.matchId);
const match = ref(null);
const messages = ref([]);
const newMessage = ref('');
const loadingMessages = ref(true);
const connected = ref(false);
const messagesContainer = ref(null);
const myProfileId = ref(null);

const getStatusBadgeClass = (status) => {
  const classes = {
    active: 'badge badge-success',
    accepted: 'badge badge-success',
    pending: 'badge badge-warning',
    declined: 'badge badge-error',
  };
  return classes[status] || 'badge';
};

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const loadMatch = async () => {
  try {
    const data = await matchmakingService.getMatch(matchId.value);
    match.value = data;
  } catch (error) {
    console.error('Failed to load match:', error);
  }
};

const loadMessages = async () => {
  loadingMessages.value = true;
  try {
    const history = await chatService.getHistory(matchId.value);
    messages.value = history;
    scrollToBottom();
  } catch (error) {
    console.error('Failed to load messages:', error);
  } finally {
    loadingMessages.value = false;
  }
};

const loadMyProfile = async () => {
  try {
    const profile = await profileService.getMyProfile();
    myProfileId.value = profile._id;
  } catch (error) {
    console.error('Failed to load profile:', error);
  }
};

const sendMessage = () => {
  if (!newMessage.value.trim() || !connected.value) return;

  chatService.sendMessage(matchId.value, myProfileId.value, newMessage.value);
  newMessage.value = '';
};

const setupWebSocket = () => {
  const socket = chatService.connect();

  socket.on('connect', () => {
    connected.value = true;
    chatService.joinMatch(matchId.value);
  });

  socket.on('disconnect', () => {
    connected.value = false;
  });

  chatService.onMessage((message) => {
    messages.value.push(message);
    scrollToBottom();
  });
};

onMounted(async () => {
  await loadMyProfile();
  await loadMatch();
  await loadMessages();
  setupWebSocket();
});

onUnmounted(() => {
  chatService.leaveMatch(matchId.value);
  chatService.offMessage();
  chatService.disconnect();
});
</script>