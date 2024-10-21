<template>
  <div class="bg-blue">
    <div class="fr-container">
      <Breadcrumb :currentPage="t('contact.title')" />
      <ContactForm
        @on-profile-change="profileChanged"
        @on-send-message="contactMessageSent"
        @on-accordion-clicked="accordionClicked"
        profile="tenant"
        :user="user"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ContactForm from 'df-shared-next/src/components/ContactForm.vue'
import Breadcrumb from 'df-shared-next/src/components/dsfr/Breadcrumb.vue'
import useTenantStore from '@/stores/tenant-store'
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { AnalyticsService } from '../services/AnalyticsService'

const store = useTenantStore()
const user = computed(() => {
  return store.user
})
const { t } = useI18n()

onMounted(() => {
  window.Beacon('init', 'e9f4da7d-11be-4b40-9514-ac7ce3e68f67')
})

onBeforeUnmount(() => {
  window.Beacon('destroy')
})

function profileChanged(profile: string) {
  if (profile === 'tenant') {
    AnalyticsService.contactEvent('contact_questions_rent')
  } else {
    AnalyticsService.contactEvent('contact_questions_owner')
  }
}

function contactMessageSent() {
  AnalyticsService.contactEvent('contact_send_message')
}

function accordionClicked(tag: string) {
  AnalyticsService.contactEvent(tag)
}
</script>

<style scoped lang="scss"></style>
