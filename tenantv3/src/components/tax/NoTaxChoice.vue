<template>
  <p>{{ t(textKey + '.choose-situation') }}</p>
  <BackLinkRow :label="t(textKey + '.have-no-tax-notice')" :to="parent" />
  <RadioList>
    <RadioListItem :to="here + '/parents'" @click="sendEvent('parents')"
      >{{ t(textKey + '.parents') }}
      <HintText>{{ t('parents-text') }}</HintText>
    </RadioListItem>
    <RadioListItem :to="here + '/sans-declaration'" @click="sendEvent('no-declaration')"
      >{{ t(textKey + '.no-declaration') }}
      <HintText>{{ t('no-declaration-text') }}</HintText>
    </RadioListItem>
    <RadioListItem :to="here + '/pas-recu'" @click="sendEvent('not-received')"
      >{{ t(textKey + '.not-received') }}
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
const { textKey } = useTaxState()

const here = computed(() => route.path)

const sendEvent = (subcategory: string) =>
  AnalyticsService.selectSituation2(taxState.category, 'no-tax', subcategory)
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
    }
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
    }
  }
}
</i18n>
