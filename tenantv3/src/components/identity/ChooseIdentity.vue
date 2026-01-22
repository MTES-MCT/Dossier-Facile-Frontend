<template>
  <RadioList :list-items="optionLinks" @analytics:bare="sendEvent" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import RadioList, { type OptionLink } from '../common/RadioList.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { computed, type ComputedRef } from 'vue'
import { useRoute } from 'vue-router'

const { t } = useI18n()

const route = useRoute()
const here = computed(() => route.path)

// WARN: both options send the same analytics
const sendEvent = () => AnalyticsService.tenantIdentitySelectSelf()

const optionLinks: ComputedRef<OptionLink[]> = computed(() => [
  {
    to: `${here.value}/pour-moi`,
    title: t('identity.self'),
    description: t('identity.self-hint')
  },
  {
    to: `${here.value}/pour-une-autre-personne`,
    title: t('identity.third-party'),
    description: t('identity.third-party-hint')
  }
])
</script>

<i18n>
    {
      "en": {
        "identity": {
            "self": "For you",
            "self-hint": "You are the future tenant",
            "third-party": "For someone else",
            "third-party-hint": "Your child, your employee, ..."
        }
      },
      "fr": {
        "identity": {
            "self": "Pour vous",
            "self-hint": "Vous êtes le futur locataire",
            "third-party": "Pour une autre personne",
            "third-party-hint": "Votre enfant, votre employé, ..."
        }
      }
    }
</i18n>
