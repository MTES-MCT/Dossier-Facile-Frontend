<script setup lang="ts">
import { onMounted, ref } from 'vue'
import cookies from 'js-cookie'

const MESSAGE = `${import.meta.env.VITE_ANNOUNCEMENT_MESSAGE || ''}`
const DOMAIN = `${import.meta.env.VITE_COOKIE_DOMAIN}`

const announcementClosedCookieKey = `announcement-closed-${btoa(MESSAGE)}`
const announcementClosed = ref(false)

onMounted(() => {
  if (cookies.get(announcementClosedCookieKey) === 'true') {
    announcementClosed.value = true
  }
})

function isVisible() {
  const isMessageSet = MESSAGE.trim().length > 0
  return isMessageSet && !announcementClosed.value
}

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
  <div class="announcement fr-pt-2w fr-pb-2w" v-if="isVisible()">
    <div class="fr-container message">
      <span v-html="MESSAGE"></span>
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
  word-break: break-all;
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
