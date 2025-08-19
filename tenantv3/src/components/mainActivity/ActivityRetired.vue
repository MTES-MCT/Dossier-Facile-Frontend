<template>
  <BackLinkRow :label="t('retired')" :to="parent" category="RETIRED" />
  <p class="fr-mb-0">{{ t('please-provide') }}</p>
  <ul>
    <li>
      <i18n-t keypath="row-1">
        <strong>{{ t('pension-statement') }}</strong>
      </i18n-t>
    </li>
    <li>
      <i18n-t keypath="row-2">
        <template #proof>
          <strong>{{ t('proof-of-payment') }}</strong>
        </template>
        <template #link>
          <a
            href="https://services.info-retraite.fr/service/mes-attestations-de-paiement-retraite/"
            target="_blank"
            >{{ t('get-proof') }}</a
          >
        </template>
      </i18n-t>
    </li>
    <li>
      <i18n-t :keypath="'row-3-' + suffix">
        <strong>{{ t('pension-title') }}</strong>
      </i18n-t>
    </li>
    <li>
      <i18n-t :keypath="'row-4-' + suffix">
        <strong>{{ t('last') }}</strong>
      </i18n-t>
    </li>
  </ul>
  <p>{{ t('tip-' + suffix) }}</p>
  <UploadFilesMainActivity category="RETIRED" />
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/mainActivity/lib/ProfessionalBackRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import { useMainActivityState } from '@/components/mainActivity/lib/mainActivityState'
import { useI18n } from 'vue-i18n'
import UploadFilesMainActivity from './lib/UploadFilesMainActivity.vue'
const { t } = useI18n()
const { suffix } = useMainActivityState()
const parent = useParentRoute()
</script>

<i18n>
{
  "en": {
    "retired": "Retired",
    "please-provide":"Please provide one of the following:",
    "row-1": "{0} less than 2 years old",
    "pension-statement": "pension statement",
    "row-2": "{proof} less than 2 years old ({link})",
    "proof-of-payment": "proof of pension payment",
    "get-proof": "obtain proof of payment",
    "row-3": "your {0}",
    "pension-title": "retirement pension certificate",
    "row-4": "your {0} tax assessment (all pages)",
    "last": "last or penultimate",
    "tip-tenant": "Tip: the pension statement is the most suitable document. Only add your tax notice if you have no other document on the list.",
    "tip-other": "Tip: the pension statement is the most suitable document. Only add their tax notice if you have no other document on the list."
  },
  "fr": {
    "retired": "Retraite",
    "please-provide":"Veuillez fournir l’un des documents suivants :",
    "row-1": "un {0} de moins de 2 ans",
    "pension-statement": "bulletin de pension",
    "row-2": "une {proof} de moins de 2 ans ({link})",
    "proof-of-payment": "attestation de paiement de bulletin de pension",
    "get-proof": "obtenir une attestation de paiement",
    "row-3-tenant": "votre {0}",
    "row-3-other": "son {0}",
    "pension-title": "titre de pension de retraite",
    "row-4-tenant": "votre {0} avis d’imposition complet (toutes les pages)",
    "row-4-other": "son {0} avis d’imposition complet (toutes les pages)",
    "last": "dernier ou avant-dernier",
    "tip-tenant": "Conseil : le bulletin de pension est le document le plus adapté. N’ajoutez votre avis d’imposition que si vous n’avez aucun autre document de la liste.",
    "tip-other": "Conseil : le bulletin de pension est le document le plus adapté. N’ajoutez son avis d’imposition que si vous n’avez aucun autre document de la liste.",
  }
}
</i18n>
