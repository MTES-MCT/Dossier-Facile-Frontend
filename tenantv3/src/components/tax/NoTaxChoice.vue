<template>
  <p>{{ t(textKey + '.choose-situation') }}</p>
  <BackLinkRow :label="t(textKey + '.have-no-tax-notice')" :to="parent" />
  <RadioList :list-items="optionLinks" @analytics="sendEvent" />
  <JointTaxInfo :parent="parent" />
  <TaxFooter />
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/tax/lib/TaxBackLinkRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import RadioList, { type OptionLink } from '@/components/common/RadioList.vue'
import TaxFooter from '@/components/tax/lib/TaxFooter.vue'
import { useTaxState } from '@/components/tax/lib/taxState'
import { AnalyticsService } from '@/services/AnalyticsService'
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import JointTaxInfo from './lib/JointTaxInfo.vue'

const { t } = useI18n()
const route = useRoute()
const taxState = useTaxState()
const parent = useParentRoute()
const { textKey } = useTaxState()

const here = computed(() => route.path)

const sendEvent = (subcategory: string) =>
  AnalyticsService.selectSituation2(taxState.category, 'no-tax', subcategory)

const optionLinks: ComputedRef<OptionLink[]> = computed(() => [
  {
    to: `${here.value}/parents`,
    title: t(textKey + '.parents'),
    event: 'parents',
    description: t('parents-text')
  },
  {
    to: `${here.value}/sans-declaration`,
    title: t(textKey + '.no-declaration'),
    event: 'no-declaration',
    description: t('no-declaration-text')
  },
  {
    to: `${here.value}/pas-recu`,
    title: t(textKey + '.not-received'),
    event: 'not-received',
    description: t('not-received-text')
  },
  {
    to: `${here.value}/autre`,
    title: t('other-situation'),
    event: 'other',
    description: t('other-situation-text')
  }
])
</script>

<i18n>
{
  "en": {
    "parents-text": "Student, dependent on the parents",
    "no-declaration-text": "First job",
    "not-received-text": "First tax return",
    "other-situation": "Other situation",
    "other-situation-text": "European official, foreign student",
    "tenant": {
      "choose-situation": "Select the situation that applies to you:",
      "you-have-no-tax-notice": "You have no tax notice",
      "parents": "You are registered on your parents' tax return",
      "no-declaration": "You have not yet made your first tax return",
      "not-received": "You have not yet received your tax notice",
    },
    "guarantor": {
      "choose-situation": "Select the situation of your guarantor:",
      "you-have-no-tax-notice": "Your guarantor has no tax notice",
      "parents": "Your guarantor is registered on their parents' tax return",
      "no-declaration": "Your guarantor has not yet made their first tax return",
      "not-received": "Your guarantor has not yet received their tax notice",
    },
    "couple": {
      "choose-situation": "Select the situation of your spouse:",
      "you-have-no-tax-notice": "Your spouse has no tax notice",
      "parents": "Your spouse is registered on their parents' tax return",
      "no-declaration": "Your spouse has not yet made their first tax return",
      "not-received": "Your spouse has not yet received their tax notice",
    },
    "couple-guarantor": {
      "choose-situation": "Select the situation of their guarantor:",
      "you-have-no-tax-notice": "Their guarantor has no tax notice",
      "parents": "Their guarantor is registered on their parents' tax return",
      "no-declaration": "Their guarantor has not yet made their first tax return",
      "not-received": "Their guarantor has not yet received their tax notice",
    },
  },
  "fr": {
    "parents-text": "Étudiant, à charge des parents",
    "no-declaration-text": "Premier emploi",
    "not-received-text": "Première déclaration",
    "other-situation": "Autre situation",
    "other-situation-text": "Fonctionnaire européen, étudiant étranger",
    "tenant": {
      "choose-situation": "Choisissez la situation qui correspond à votre cas :",
      "have-no-tax-notice": "Vous n’avez pas d’avis d’impôt",
      "parents": "Vous êtes inscrit sur la déclaration d’impôt de vos parents",
      "no-declaration": "Vous n’avez pas encore fait votre première déclaration",
      "not-received": "Vous n’avez pas encore reçu votre avis d’impôt",
    },
    "guarantor": {
      "choose-situation": "Choisissez la situation de votre garant :",
      "have-no-tax-notice": "Votre garant n’a pas d’avis d’impôt",
      "parents": "Votre garant est inscrit sur la déclaration d’impôt de ses parents",
      "no-declaration": "Votre garant n’a pas encore fait sa première déclaration",
      "not-received": "Votre garant n’a pas encore reçu son avis d’impôt",
    },
    "couple": {
      "choose-situation": "Choisissez la situation de votre conjoint :",
      "have-no-tax-notice": "Votre conjoint n’a pas d’avis d’impôt",
      "parents": "Votre conjoint est inscrit sur la déclaration d’impôt de ses parents",
      "no-declaration": "Votre conjoint n’a pas encore fait sa première déclaration",
      "not-received": "Votre conjoint n’a pas encore reçu son avis d’impôt",
    },
    "couple-guarantor": {
      "choose-situation": "Choisissez la situation de son garant :",
      "have-no-tax-notice": "Son garant n’a pas d’avis d’impôt",
      "parents": "Son garant est inscrit sur la déclaration d’impôt de ses parents",
      "no-declaration": "Son garant n’a pas encore fait sa première déclaration",
      "not-received": "Son garant n’a pas encore reçu son avis d’impôt",
    },
  }
}
</i18n>
