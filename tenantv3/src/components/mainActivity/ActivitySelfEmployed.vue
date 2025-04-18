<template>
  <BackLinkRow :label="t('self-employed')" :to="parent" category="INDEPENDENT" />
  <p class="fr-mb-0">{{ t('please-provide') }}</p>
  <ul>
    <li>
      <i18n-t :keypath="'row-1-' + suffix">
        <strong>{{ t('business-card') }}</strong>
      </i18n-t>
    </li>
    <li>
      <i18n-t keypath="row-2">
        <template #kbis>
          <strong>{{ t('kbis') }}</strong>
        </template>
        <template #link>
          <a href="https://entreprendre.service-public.fr/vosdroits/F21000" target="_blank">{{
            t('get-kbis')
          }}</a>
        </template>
      </i18n-t>
    </li>
    <li>
      <i18n-t keypath="row-3">
        <template #sirene>
          <strong>{{ t('sirene') }}</strong>
        </template>
        <template #link>
          <a href="https://entreprendre.service-public.fr/vosdroits/R17969" target="_blank">{{
            t('get-sirene')
          }}</a>
        </template>
      </i18n-t>
    </li>
    <li>
      <i18n-t keypath="row-4">
        <template #registration>
          <strong>{{ t('registration') }}</strong>
        </template>
        <template #link>
          <a href="https://entreprendre.service-public.fr/vosdroits/R19859" target="_blank">{{
            t('get-registration-form')
          }}</a>
        </template>
      </i18n-t>
    </li>
  </ul>
  <p>{{ t('note') }}</p>
  <UploadFilesMainActivity category="INDEPENDENT" />
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
    "self-employed": "Self-employed",
    "please-provide":"Please provide one of the following:",
    "note": "Note: these procedures are completely free of charge.",
    "row-1-tenant": "your {0} (self-employed)",
    "row-1-other": "their {0} (self-employed)",
    "business-card": "business card",
    "row-2": "a {kbis} less than 3 months old ({link})",
    "kbis": "K ou Kbis certificate",
    "get-kbis": "obtain a K or Kbis certificate",
    "row-3": "a {sirene} less than 3 months old ({link})",
    "sirene": "notice of registration in the SIRENE register",
    "get-sirene": "obtain a SIRENE registration",
    "row-4": "a {registration} form form the Registre National des Entreprises less than 3 months old ({link})",
    "registration": "business registration",
    "get-registration-form": "obtain a registration form"
  },
  "fr": {
    "self-employed": "Indépendant",
    "please-provide":"Veuillez fournir l’un des documents suivants :",
    "note": "Note : ces démarches sont totalement gratuites.",
    "row-1-tenant": "votre {0} (profession libérale)",
    "row-1-other": "sa {0} (profession libérale)",
    "business-card": "carte professionnelle",
    "row-2": "un {kbis} de moins de 3 mois ({link})",
    "kbis": "extrait K ou Kbis",
    "get-kbis": "obtenir un extrait K ou Kbis",
    "row-3": "un {sirene} de moins de 3 mois ({link})",
    "sirene": "avis de situation au répertoire SIRENE",
    "get-sirene": "obtenir un avis de situation",
    "row-4": "une {registration} au Registre National des Entreprises de moins de 3 mois ({link})",
    "registration": "fiche d’immatriculation",
    "get-registration-form": "obtenir une fiche d’immatriculation"
  }
}
</i18n>
