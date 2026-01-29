<template>
  <div class="bg-blue">
    <div class="fr-container">
      <Breadcrumb :current-page="t('contact.title')" />
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
import Breadcrumb from 'df-shared-next/src/components/dsfr/BreadcrumbItem.vue'
import { useSeoMeta } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { AnalyticsService } from '@/services/AnalyticsService'

const { t } = useI18n()

const title = 'Contactez-nous'
const description = 'Formulaire de contact'

const siteTitle = import.meta.env.VITE_SITE_TITLE
const seoTitle = `${title} - ${siteTitle}`

useSeoMeta({
  title: title,
  description: description,
  ogTitle: seoTitle,
  ogDescription: description,
  twitterTitle: seoTitle,
  twitterDescription: description
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
