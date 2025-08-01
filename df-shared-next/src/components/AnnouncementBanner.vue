<script setup lang="ts">
import cookies from 'js-cookie';
import { computed, onMounted, ref } from 'vue';

const DOMAIN = `${import.meta.env.VITE_COOKIE_DOMAIN}`

const announcementClosed = ref(false)

const { message } = defineProps<{ message: string }>()

const announcementClosedCookieKey = `announcement-closed-${btoa(message)}`

onMounted(() => {
  if (cookies.get(announcementClosedCookieKey) === 'true') {
    announcementClosed.value = true
  }
})

const isVisible = computed(() => {
  const isMessageSet = message.trim().length > 0
  return isMessageSet && !announcementClosed.value
})

function createAnnouncementClosedCookie() {
  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + 1)

  cookies.set(announcementClosedCookieKey, 'true', {
    expires: expirationDate,
    path: '/',
    domain: DOMAIN
  })
}

function closeAnnouncement() {
  createAnnouncementClosedCookie()
  announcementClosed.value = true
}
</script>

<template>
  <div v-if="isVisible" class="announcement fr-pt-2w fr-pb-2w">
    <div class="fr-container message">
      <span v-html="message"></span>
      <button
        title="Fermer l'annonce"
        class="fr-btn--close close"
        @click="closeAnnouncement()"
      ></button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.announcement {
  background-color: #18753c;
  color: #fff;
}
.message {
  display: flex;
  align-items: center;
  > span {
    overflow: hidden;
  }
}
.close {
  color: #fff;
  &:hover {
    background-color: rgba(250, 250, 250, 0.7);
    color: #000;
  }
}

.fr-btn--close {
  display: flex;
  align-items: center;
  justify-content: center;
  &:before {
    margin-left: 0;
  }
}
</style>
