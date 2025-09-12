<template>
  <BackLinkRow :label="t('stay-at-home-parent')" :to="parent" category="STAY_AT_HOME_PARENT" />
  <i18n-t tag="p" :keypath="'please-provide-' + suffix">
    <template #proof>
      <strong>{{ t('proof-of-payment') }}</strong>
    </template>
    <template #link>
      <a
        href="https://www.caf.fr/allocataires/caf-du-nord/offre-de-service/thematique-libre/telecharger-une-attestation"
        :title="`${t('obtain-proof')} - ${t('new-window')}`"
        target="_blank"
        >{{ t('obtain-proof') }}</a
      >
    </template>
  </i18n-t>
  <i18n-t tag="p" :keypath="'if-no-income-' + suffix">
    <template #statement>
      <strong>{{ t('statement') }}</strong>
    </template>
    <template #model>
      <a
        href="https://www.service-public.fr/simulateur/calcul/AttestationHonneur"
        :title="`${t('model')} - ${t('new-window')}`"
        target="_blank"
        >{{ t('model') }}</a
      >
    </template>
  </i18n-t>
  <UploadFilesMainActivity category="STAY_AT_HOME_PARENT" />
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
    "stay-at-home-parent": "stay-at-home-parent",
    "please-provide-tenant": "If you receive RSA, please provide {proof} less than 3 months old ({link}).",
    "please-provide-other": "If this person receives RSA, please provide {proof} less than 3 months old ({link}).",
    "proof-of-payment": "proof of payment from CAF",
    "obtain-proof": "obtain proof of payment",
    "if-no-income-tenant": "If you have no income, please provide a {statement} explaining your situation as a stay-at-home father/mother. You can use this {model}.",
    "if-no-income-other": "If this person has no income, please provide a {statement} explaining their situation as a stay-at-home father/mother. You can use this {model}.",
    "statement": "sworn statement",
    "model": "model certificate"
  },
  "fr": {
    "stay-at-home-parent": "Parent au foyer",
    "please-provide-tenant": "Si vous touchez le RSA, veuillez fournir une {proof} de moins de 3 mois ({link}).",
    "please-provide-other": "Si cette personne touche le RSA, veuillez fournir une {proof} de moins de 3 mois ({link}).",
    "proof-of-payment": "attestation de paiement de la CAF",
    "obtain-proof": "obtenir une attestation de paiement",
    "if-no-income-tenant": "Si vous n’avez pas de revenus, veuillez fournir une {statement} qui explique votre situation de père/mère au foyer. Vous pouvez utiliser ce {model}.",
    "if-no-income-other": "Si cette personne n’a pas de revenus, veuillez fournir une {statement} qui explique sa situation de père/mère au foyer. Vous pouvez utiliser ce {model}.",
    "statement": "attestation sur l’honneur",
    "model": "modèle d’attestation"
  }
}
</i18n>
