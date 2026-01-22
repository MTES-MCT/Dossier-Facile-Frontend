<template>
  <p class="fr-highlight fr-ml-0">
    {{ t('submit-identity-document') }} <strong>{{ t('valid-doc') }}</strong>
  </p>
  <RadioList :list-items="optionLinks" @analytics="sendEvent" />
  <IdentificationFooter />
</template>

<script setup lang="ts">
import RadioList, { type optionLink } from '@/components/common/RadioList.vue'
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import IdentificationFooter from './lib/IdentificationFooter.vue'
import { AnalyticsService } from '@/services/AnalyticsService'

const { t } = useI18n()
const route = useRoute()

const sendEvent = (subcategory: string) =>
  AnalyticsService.selectSituation('identification', subcategory)

const here = computed(() => route.path)

const optionLinks: ComputedRef<optionLink[]> = computed(() => [
  {
    to: `${here.value}/carte`,
    title: t('identity-card'),
    event: 'identity-card',
    description: t('french-or-foreign-f')
  },
  {
    to: `${here.value}/passeport`,
    title: t('passport'),
    event: 'passport',
    description: t('french-or-foreign')
  },
  {
    to: `${here.value}/titre-sejour`,
    title: t('permit'),
    event: 'permit'
  },
  {
    to: `${here.value}/permis-conduire`,
    title: t('drivers-license'),
    event: 'drivers-license',
    description: t('french-or-foreign')
  },
  {
    to: `${here.value}/france-identite`,
    title: t('france-identite'),
    event: 'france-identite'
  },
  {
    to: `${here.value}/autre`,
    title: t('other'),
    event: 'other'
  }
])
</script>

<i18n>
{
  "en": {
    "submit-identity-document": "Submit a {0} identity document",
    "valid-doc": "valid",
    "other-doc": "Other document",
    "french-or-foreign": "French or foreign",
    "french-or-foreign-f": "French or foreign",
  },
  "fr": {
    "submit-identity-document": "Déposez une pièce d’identité {0}",
    "valid-doc": "en cours de validité",
    "other-doc": "Autre document",
    "french-or-foreign": "Français ou étranger",
    "french-or-foreign-f": "Française ou étrangère",
  }
}
</i18n>
