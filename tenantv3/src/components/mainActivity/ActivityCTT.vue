<template>
  <BackLinkRow :label="t('ctt')" :to="parent" category="CTT" />
  <i18n-t tag="p" :keypath="'desc-ctt-' + suffix" class="fr-mb-0">
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
  <p>{{ t('tip-' + suffix) }}</p>
  <UploadFilesMainActivity category="CTT" />
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
    "ctt": "Temporary Work Contract",
    "desc-ctt-tenant":"Please provide your {0}. It must be:",
    "desc-ctt-other":"Please provide their {0}. It must be:",
    "contract": "employement contract",
    "row-0": "{0} (completed contracts are not accepted on their own);",
    "current": "current or future",
    "row-1": "{0} (all pages);",
    "complete": "complete",
    "row-2": {
      "tenant": "{0} by you and your employer.",
      "couple": "{0} by your spouse and their employer.",
      "guarantor": "{0} by your guarantor and their employer.",
      "couple-guarantor": "{0} by the guarantor and their employer.",
    },
    "signed": "signed",
    "tip-tenant": "Tip: you can also add your work certificates for the last 3 months or more if you have them. This will enable an owner to check that your assignments are regular and recurring.",
    "tip-other": "Tip: you can also add their work certificates for the last 3 months or more if you have them. This will enable an owner to check that their assignments are regular and recurring."
  },
  "fr": {
    "ctt": "Intérimaire",
    "desc-ctt-tenant":"Veuillez ajouter votre {0}. Il doit être :",
    "desc-ctt-other":"Veuillez ajouter son {0}. Il doit être :",
    "contract": "contrat de travail",
    "row-0": "{0} (les contrats terminés ne sont pas acceptés seuls) ;",
    "current": "en cours ou à venir",
    "row-1": "{0} (toutes les pages) ;",
    "complete": "complet",
    "row-2": {
      "tenant": "{0} par vous et votre employeur.",
      "couple": "{0} par votre conjoint et son employeur.",
      "guarantor": "{0} par votre garant et son employeur.",
      "couple-guarantor": "{0} par le garant et son employeur.",
    },
    "signed": "signé",
    "tip-tenant": "Conseil : vous pouvez également ajouter vos certificats de travail de ces 3 derniers mois ou plus si vous en disposez. Cela permettra à un propriétaire de s’assurer que vos missions sont régulières et récurrentes.",
    "tip-other": "Conseil : vous pouvez également ajouter ses certificats de travail de ces 3 derniers mois ou plus si vous en disposez. Cela permettra à un propriétaire de s’assurer que ses missions sont régulières et récurrentes."
  }
}
</i18n>
