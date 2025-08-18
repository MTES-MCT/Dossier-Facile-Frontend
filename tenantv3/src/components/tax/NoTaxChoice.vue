<template>
  <p>{{ t('choose-situation') }}</p>
  <BackLinkRow :label="t('you-have-no-tax-notice')" :to="parent" />
  <RadioList>
    <RadioListItem :to="here + '/parents'" @click="sendEvent('parents')"
      >{{ t('parents') }}
      <HintText>{{ t('parents-text') }}</HintText>
    </RadioListItem>
    <RadioListItem :to="here + '/sans-declaration'" @click="sendEvent('no-declaration')"
      >{{ t('no-declaration') }}
      <HintText>{{ t('no-declaration-text') }}</HintText>
    </RadioListItem>
    <RadioListItem :to="here + '/pas-recu'" @click="sendEvent('not-received')"
      >{{ t('not-received') }}
      <HintText>{{ t('not-received-text') }}</HintText>
    </RadioListItem>
    <RadioListItem :to="here + '/autre'" @click="sendEvent('other')"
      >{{ t('other-situation') }}
      <HintText>{{ t('other-situation-text') }}</HintText>
    </RadioListItem>
  </RadioList>
  <JointTaxInfo :parent="parent" />
  <TaxFooter />
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/tax/lib/TaxBackLinkRow.vue'
import HintText from '@/components/common/HintText.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import RadioList from '@/components/common/RadioList.vue'
import RadioListItem from '@/components/common/RadioListItem.vue'
import TaxFooter from '@/components/tax/lib/TaxFooter.vue'
import { useTaxState } from '@/components/tax/lib/taxState'
import { AnalyticsService } from '@/services/AnalyticsService'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import JointTaxInfo from './lib/JointTaxInfo.vue'

const { t } = useI18n()
const route = useRoute()
const taxState = useTaxState()
const parent = useParentRoute()

const here = computed(() => route.path)

const sendEvent = (subcategory: string) =>
  AnalyticsService.selectSituation2(taxState.category, 'no-tax', subcategory)
</script>

<i18n>
{
  "en": {
    "choose-situation": "Select the situation that applies to you:",
    "you-have-no-tax-notice": "You have no tax notice",
    "parents": "You are registered on your parents' tax return",
    "parents-text": "Student, dependent on the parents",
    "no-declaration": "You have not yet made your first tax return",
    "no-declaration-text": "First job,",
    "not-received": "You have not yet received your tax notice",
    "not-received-text": "First tax return",
    "other-situation": "Other situation",
    "other-situation-text": "European official, foreign student",
  },
  "fr": {
    "choose-situation": "Choisissez la situation qui correspond à votre cas :",
    "you-have-no-tax-notice": "Vous n’avez pas d’avis d’impôt",
    "parents": "Vous êtes inscrit sur la déclaration d’impôt de vos parents",
    "parents-text": "Étudiant, à charge des parents",
    "no-declaration": "Vous n’avez pas encore fait votre première déclaration",
    "no-declaration-text": "Premier emploi,",
    "not-received": "Vous n’avez pas encore reçu votre avis d’impôt",
    "not-received-text": "Première déclaration",
    "other-situation": "Autre situation",
    "other-situation-text": "Fonctionnaire européen, étudiant étranger",
  }
}
</i18n>
