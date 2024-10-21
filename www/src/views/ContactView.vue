<template>
  <div class="bg-blue">
    <div class="fr-container">
      <Breadcrumb :currentPage="t('contact.title')" />
      <ContactForm
        @on-profile-change="profileChanged"
        @on-send-message="contactMessageSent"
        @on-accordion-clicked="accordionClicked"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ContactForm from 'df-shared-next/src/components/ContactForm.vue'
import Breadcrumb from 'df-shared-next/src/components/dsfr/Breadcrumb.vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { AnalyticsService } from '@/services/AnalyticsService'

const { t } = useI18n()

useHead({
  title: 'Contactez-nous - DossierFacile',
  meta: [
    {
      name: 'description',
      content: 'Formulaire de contact'
    }
  ]
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
