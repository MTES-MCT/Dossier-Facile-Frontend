<script setup lang="ts">
import cookies from 'js-cookie'
import { computed, onMounted, ref } from 'vue'
import { vSafeHtml } from '../services/SanitizeService'
import { useI18n } from 'vue-i18n'

const DOMAIN = `${import.meta.env.VITE_COOKIE_DOMAIN}`
const { t } = useI18n()

const announcementClosed = ref(false)

const { message, toFocus } = defineProps<{ message: string; toFocus?: HTMLElement | null }>()

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
  toFocus?.focus()
}
</script>

<template>
  <aside v-if="isVisible" class="announcement fr-pt-2w fr-pb-2w" aria-label="Annonce">
    <div class="fr-container message">
      <p class="fr-mb-0" v-safe-html="message"></p>
      <button
        type="button"
        title="Fermer l'annonce"
        class="fr-btn--close close"
        @click="closeAnnouncement()"
      >
        <span class="sr-only">{{ t('close') }}</span>
      </button>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.announcement {
  background-color: #18753c;
  color: #fff;
  & :focus-visible {
    outline-color: white;
  }
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

<i18n lang="json">
{
  "en": {
    "close": "Close the message"
  },
  "fr": {
    "close": "Fermer le message"
  }
}
</i18n>
