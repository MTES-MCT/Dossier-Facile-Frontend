<template>
  <BackLinkRow :label="t('cdd')" :to="parent" category="CDD" />
  <i18n-t tag="p" :keypath="'desc-cdd-' + suffix" class="fr-mb-0">
    <strong>{{ t('contract') }}</strong>
  </i18n-t>
  <ul>
    <li>
      <i18n-t keypath="row-0">
        <strong>{{ t('current') }}</strong>
      </i18n-t>
    </li>
    <li>
      <i18n-t keypath="row-1">
        <strong>{{ t('complete') }}</strong>
      </i18n-t>
    </li>
    <li>
      <i18n-t :keypath="'row-2.' + textKey">
        <strong>{{ t('signed') }}</strong>
      </i18n-t>
    </li>
  </ul>
  <p>{{ t('if-no-contract-' + suffix) }}</p>
  <UploadFilesMainActivity category="CDD" />
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/mainActivity/lib/ProfessionalBackRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import { useMainActivityState } from '@/components/mainActivity/lib/mainActivityState'
import { useI18n } from 'vue-i18n'
import UploadFilesMainActivity from './lib/UploadFilesMainActivity.vue'
const { t } = useI18n()
const { suffix, textKey } = useMainActivityState()
const parent = useParentRoute()
</script>

<i18n>
{
  "en": {
    "cdd": "Fixed-term Contract",
    "desc-cdd-tenant":"Please provide your {0}. It must be:",
    "desc-cdd-other":"Please provide their {0}. It must be:",
    "contract": "employement contract",
    "row-0": "{0} (completed fixed-term contracts are not accepted);",
    "current": "current or future",
    "row-1": "{0} (all pages);",
    "complete": "complete",
    "row-2": {
      "tenant": "{0} by you and your employer.",
      "couple": "{0} by your spouse and their employer.",
      "guarantor": "{0} by your guarantor and their employer.",
      "couple-guarantor": "{0} by their guarantor and their employer.",
    },
    "signed": "signed",
    "if-no-contract-tenant": "If you don't have your employment contract, you can add a certificate from your employer less than 3 months old.",
    "if-no-contract-other": "If you don't have their employment contract, you can add a certificate from their employer less than 3 months old."
  },
  "fr": {
    "cdd": "CDD",
    "desc-cdd-tenant":"Veuillez fournir votre {0}. Il doit être :",
    "desc-cdd-other":"Veuillez fournir son {0}. Il doit être :",
    "contract": "contrat de travail",
    "row-0": "{0} (les CDD terminés ne sont pas acceptés) ;",
    "current": "en cours ou à venir",
    "row-1": "{0} (toutes les pages) ;",
    "complete": "complet",
    "row-2": {
      "tenant": "{0} par vous et votre employeur.",
      "couple": "{0} par votre conjoint et son employeur.",
      "guarantor": "{0} par votre garant et son employeur.",
      "couple-guarantor": "{0} par son garant et son employeur.",
    },
    "signed": "signé",
    "if-no-contract-tenant": "Si vous ne disposez pas de votre contrat de travail, vous pouvez ajouter une attestation de votre employeur de moins de 3 mois.",
    "if-no-contract-other": "Si vous ne disposez pas de son contrat de travail, vous pouvez ajouter une attestation de son employeur de moins de 3 mois."
  }
}
</i18n>
