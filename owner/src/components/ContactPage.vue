<template>
  <div class="bg-blue">
    <div class="fr-container">
      <Breadcrumb :current-page="t('contact.title')" />
      <ContactForm
        :user="user"
        profile="owner"
        @on-profile-change="profileChanged"
        @on-send-message="contactMessageSent"
        @on-accordion-clicked="accordionClicked"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ContactForm from 'df-shared-next/src/components/ContactForm.vue'
import Breadcrumb from 'df-shared-next/src/components/dsfr/BreadcrumbItem.vue'
import { useI18n } from 'vue-i18n'
import useOwnerStore from '../store/owner-store'
import AnalyticsService from '../services/AnalyticsService'

const store = useOwnerStore()
const user = store.getUser
const { t } = useI18n()

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
