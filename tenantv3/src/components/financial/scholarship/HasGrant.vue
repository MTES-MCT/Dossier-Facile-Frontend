<template>
  <BackLinkRow :label="t('scholarship.' + textKey)" :to="parent" category="bourse" />
  <i18n-t tag="p" class="fr-mb-1w" :keypath="'enter-income-' + suffix">
    <strong>{{ t('net-income') }}</strong>
  </i18n-t>
  <UploadFilesFinancial category="SCHOLARSHIP">
    <template #incomeFilled>
      <i18n-t tag="p" :keypath="'please-provide-' + suffix">
        <strong>{{ t('award-notice') }}</strong>
      </i18n-t>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import { useI18n } from 'vue-i18n'
import { useFinancialState } from '../financialState'

const parent = useParentRoute()
const { t } = useI18n()
const { suffix, textKey } = useFinancialState()
</script>

<i18n>
{
  "en": {
    "scholarship": {
      "tenant": "You have a scholarship",
      "guarantor": "Your guarantor has a scholarship",
      "couple": "Your spouse has a scholarship",
      "couple-guarantor": "Their guarantor has a scholarship",
    },
    "enter-income-tenant": "Enter your {0}:",
    "enter-income-other": "Enter their {0}:",
    "net-income": "net monthly income",
    "please-provide-tenant": "Please provide your {0}.",
    "please-provide-other": "Please provide their {0}.",
    "award-notice": "most recent notice of award"
  },
  "fr": {
    "scholarship": {
      "tenant": "Vous êtes boursier",
      "guarantor": "Votre garant est boursier",
      "couple": "Votre conjoint est boursier",
      "couple-guarantor": "Son garant est boursier",
    },
    "enter-income-tenant": "Saisissez votre {0} :",
    "enter-income-other": "Saisissez son {0} :",
    "net-income": "revenu mensuel net",
    "please-provide-tenant": "Veuillez fournir votre {0}.",
    "please-provide-other": "Veuillez fournir son {0}.",
    "award-notice": "dernier avis d’attribution de bourse"
  }
}
</i18n>
