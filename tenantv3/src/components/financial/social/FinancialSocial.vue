<template>
  <BackLinkRow :label="t('form.financial.social-aid')" :to="parent" category="social" />
  <p>{{ t('you-receive.' + textKey) }}</p>
  <RadioList>
    <RadioListItem :to="here + '/caf'" @click="sendEvent('caf')"
      >{{ t('form.financial.social.caf') }}
      <span class="fr-hint-text">{{ t('rsa') }}</span>
    </RadioListItem>
    <RadioListItem :to="here + '/france-travail'" @click="sendEvent('france-travail')"
      >{{ t('form.financial.social.france-travail') }}
      <span class="fr-hint-text">{{ t('unemployment') }}</span>
    </RadioListItem>
    <RadioListItem :to="here + '/apl'" @click="sendEvent('apl')"
      >{{ t('form.financial.social.apl') }}
      <span class="fr-hint-text">{{ t('or-you-will-' + suffix) }}</span>
    </RadioListItem>
    <RadioListItem :to="here + '/aah'" @click="sendEvent('aah')">{{
      t('form.financial.social.aah')
    }}</RadioListItem>
    <RadioListItem :to="here + '/autre'" @click="sendEvent('other')">{{
      t('form.financial.social.other')
    }}</RadioListItem>
  </RadioList>
  <FinancialFooter />
</template>

<script setup lang="ts">
import RadioList from '@/components/common/RadioList.vue'
import RadioListItem from '@/components/common/RadioListItem.vue'
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import FinancialFooter from '../lib/FinancialFooter.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import { useI18n } from 'vue-i18n'
import { useFinancialState } from '../financialState'

const { t } = useI18n()
const route = useRoute()
const here = computed(() => route.path)
const parent = useParentRoute()
const { category, suffix, textKey } = useFinancialState()

const sendEvent = (subCategory: string) =>
  AnalyticsService.selectSituation2(category, 'social', subCategory)
</script>

<i18n>
{
  "en": {
    "you-receive": {
      "tenant": "You receive:",
      "guarantor": "Your guarantor receive:",
      "couple": "Your spouse receive:",
      "couple-guarantor": "Their guarantor receive:",
    },
    "rsa": "RSA, activity allowance…",
    "unemployment": "unemployment, back-to-work assistance…",
    "or-you-will-tenant": "or you're about to receive it",
    "or-you-will-other": "or they're about to receive it"
  },
  "fr": {
    "you-receive": {
      "tenant": "Vous recevez :",
      "guarantor": "Votre garant touche :",
      "couple": "Votre conjoint touche :",
      "couple-guarantor": "Son garant touche :",
    },
    "rsa": "RSA, prime d’activité…",
    "unemployment": "chômage, aide au retour à l’emploi (ARE)…",
    "or-you-will-tenant": "ou bien vous allez la toucher",
    "or-you-will-other": "ou bien il va la toucher"
  }
}
</i18n>
