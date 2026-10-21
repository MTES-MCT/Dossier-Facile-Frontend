<template>
  <div class="bg-blue">
    <div class="fr-container">
      <Breadcrumb :current-page="t('contact.title')" />
      <ContactPage
        @on-profile-change="profileChanged"
        @on-send-message="contactMessageSent"
        @on-accordion-clicked="accordionClicked"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ContactPage from 'df-shared-next/src/components/ContactPage.vue'
import Breadcrumb from 'df-shared-next/src/components/dsfr/BreadcrumbItem.vue'
import { useI18n } from 'vue-i18n'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useCanonicalUrl, useMeta } from 'df-shared-next/src/composables/useSeo'

const { t } = useI18n()

const description = 'Formulaire de contact'

useMeta({
  title: () => t('page-titles.contact'),
  description: () => description,
  canonicalUrl: useCanonicalUrl()
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
