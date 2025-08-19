<template>
  <BackLinkRow :label="t('stage')" :to="parent" category="INTERNSHIP" />
  <i18n-t tag="p" :keypath="'desc-stage-' + suffix" class="fr-mb-0">
    <strong>{{ t('agreement') }}</strong>
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
  <AttestationMesDroitsSociaux v-if="suffix === 'tenant'"/>
  <UploadFilesMainActivity category="INTERNSHIP" />
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/mainActivity/lib/ProfessionalBackRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import { useMainActivityState } from '@/components/mainActivity/lib/mainActivityState'
import { useI18n } from 'vue-i18n'
import UploadFilesMainActivity from './lib/UploadFilesMainActivity.vue'
import AttestationMesDroitsSociaux from './lib/AttestationMesDroitsSociaux.vue'
const { t } = useI18n()
const { suffix, textKey } = useMainActivityState()
const parent = useParentRoute()
</script>

<i18n>
{
  "en": {
    "stage": "Internship",
    "desc-stage-tenant":"Please provide your current or future {0}. It must be:",
    "desc-stage-other":"Please provide their current or future {0}. It must be:",
    "agreement": "internship agreement",
    "row-1": "{0} (all pages);",
    "complete": "complete",
    "row-2": {
      "tenant": "{0} by all parties (you, your tutor, your employer, etc.)",
      "couple": "{0} by all parties (your spouse, their tutor, their employer, etc.)",
      "guarantor": "{0} by all parties (your guarantor, their tutor, their employer, etc.)",
      "couple-guarantor": "{0} by all parties (their guarantor, their tutor, their employer, etc.)",
    },
    "signed": "signed",
  },
  "fr": {
    "stage": "Stage",
    "desc-stage-tenant":"Veuillez fournir votre {0} en cours ou à venir. Elle doit être :",
    "desc-stage-other":"Veuillez fournir sa {0} en cours ou à venir. Elle doit être :",
    "agreement": "convention de stage",
    "row-1": "{0} (toutes les pages) ;",
    "complete": "complète",
    "row-2": {
      "tenant": "{0} par toutes les parties (vous, votre tuteur, votre employeur etc.)",
      "couple": "{0} par toutes les parties (votre conjoint, son tuteur, son employeur etc.)",
      "guarantor": "{0} par toutes les parties (votre garant, son tuteur, son employeur etc.)",
      "couple-guarantor": "{0} par toutes les parties (son garant, son tuteur, son employeur etc.)",
    },
    "signed": "signée",
  }
}
</i18n>
