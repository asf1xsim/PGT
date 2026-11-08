<!-- frontend/src/views/NotificationsView.vue -->
<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Notifications</h1>
        <p class="text-dark-muted mt-1">Stay updated with your gaming activity</p>
      </div>
      <button
          v-if="unreadNotifications.length > 0"
          @click="markAllAsRead"
          class="btn btn-secondary text-sm"
      >
        Mark all as read
      </button>
    </div>

    <div v-if="loading" class="text-center py-12 text-dark-muted">
      Loading notifications...
    </div>

    <div v-else-if="notifications.length === 0" class="card text-center py-12">
      <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      <p class="text-dark-muted">No notifications yet</p>
    </div>

    <div v-else class="space-y-3">
      <div
          v-for="notification in notifications"
          :key="notification._id"
          :class="[
          'card hover:border-primary transition-all cursor-pointer',
          !notification.isRead && 'border-primary/50 bg-primary/5'
        ]"
          @click="markAsRead(notification._id)"
      >
        <div class="flex items-start space-x-4">
          <div :class="[
            'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
            getNotificationIconBg(notification.type)
          ]">
            <component :is="getNotificationIcon(notification.type)" class="w-6 h-6" />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between mb-1">
              <h3 class="font-semibold">{{ notification.title }}</h3>
              <div class="flex items-center space-x-2">
                <span v-if="!notification.isRead" class="w-2 h-2 bg-primary rounded-full"></span>
                <button
                    @click.stop="deleteNotification(notification._id)"
                    class="text-dark-muted hover:text-accent-red transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <p class="text-sm text-dark-muted mb-2">{{ notification.message }}</p>

            <div class="flex items-center space-x-4 text-xs text-dark-muted">
              <span :class="getTypeBadgeClass(notification.type)">
                {{ formatType(notification.type) }}
              </span>
              <span>{{ formatDate(notification.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { notificationService } from '../services/notificationService';

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const notifications = ref([]);
const loading = ref(true);

const unreadNotifications = computed(() =>
    notifications.value.filter(n => !n.isRead)
);

const getNotificationIcon = (type) => {
  const icons = {
    match_request: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
      class: 'text-primary'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
      })
    ]),
    match_accepted: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
      class: 'text-accent-green'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
      })
    ]),
    match_declined: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
      class: 'text-accent-red'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
      })
    ]),
    new_message: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
      class: 'text-accent-yellow'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
      })
    ]),
  };
  return icons[type] || icons.match_request;
};

const getNotificationIconBg = (type) => {
  const classes = {
    match_request: 'bg-primary/20',
    match_accepted: 'bg-accent-green/20',
    match_declined: 'bg-accent-red/20',
    new_message: 'bg-accent-yellow/20',
  };
  return classes[type] || 'bg-primary/20';
};

const getTypeBadgeClass = (type) => {
  const classes = {
    match_request: 'badge badge-warning',
    match_accepted: 'badge badge-success',
    match_declined: 'badge badge-error',
    new_message: 'badge',
  };
  return classes[type] || 'badge';
};

const formatType = (type) => {
  return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const formatDate = (date) => {
  const now = new Date();
  const notifDate = new Date(date);
  const diff = now - notifDate;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return notifDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

const loadNotifications = async () => {
  loading.value = true;
  try {
    const data = await notificationService.getNotifications(user.value.id);
    notifications.value = data;
  } catch (error) {
    console.error('Failed to load notifications:', error);
  } finally {
    loading.value = false;
  }
};

const markAsRead = async (notificationId) => {
  try {
    await notificationService.markAsRead(notificationId);
    const notification = notifications.value.find(n => n._id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
  } catch (error) {
    console.error('Failed to mark as read:', error);
  }
};

const markAllAsRead = async () => {
  for (const notification of unreadNotifications.value) {
    await markAsRead(notification._id);
  }
};

const deleteNotification = async (notificationId) => {
  try {
    await notificationService.deleteNotification(notificationId);
    notifications.value = notifications.value.filter(n => n._id !== notificationId);
  } catch (error) {
    console.error('Failed to delete notification:', error);
  }
};

onMounted(() => {
  loadNotifications();
});
</script>