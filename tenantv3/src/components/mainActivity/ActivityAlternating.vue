<template>
  <BackLinkRow :label="t('alternating')" :to="parent" category="ALTERNATION" />
  <i18n-t tag="p" :keypath="'please-provide-' + suffix" class="fr-mb-0">
    <strong>{{ t('contract-' + suffix) }}</strong>
  </i18n-t>
  <ul>
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
  <UploadFilesMainActivity category="ALTERNATION" />
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
    "alternating": "Alternating",
    "please-provide-tenant":"Please provide your current or future {0}. It must be:",
    "please-provide-other":"Please provide their current or future {0}. It must be:",
    "contract-tenant": "apprenticeship or professionalization contract",
    "contract-other": "apprenticeship or professionalization contract",
    "row-1": "{0} (all pages) ;",
    "complete": "complete",
    "row-2": {
      "tenant": "{0} by you and your employer.",
      "couple": "{0} by your spouse and their employer.",
      "guarantor": "{0} by your guarantor and their employer.",
      "couple-guarantor": "{0} by the guarantor and their employer.",
    },
    "signed": "signed"
  },
  "fr": {
    "alternating": "Alternance",
    "please-provide-tenant":"Veuillez fournir {0} en cours ou à venir. Il doit être :",
    "please-provide-other":"Veuillez fournir {0} en cours ou à venir. Il doit être :",
    "contract-tenant": "votre contrat d’apprentissage ou de professionnalisation",
    "contract-other": "son contrat d’apprentissage ou de professionnalisation",
    "row-1": "{0} (toutes les pages) ;",
    "complete": "complet",
    "row-2": {
      "tenant": "{0} par vous et votre employeur.",
      "couple": "{0} par votre conjoint et son employeur.",
      "guarantor": "{0} par votre garant et son employeur.",
      "couple-guarantor": "{0} par le garant et son employeur.",
    },
    "signed": "signé"
  }
}
</i18n>
