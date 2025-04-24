<template>
  <BackLinkRow :label="t('studies')" :to="parent" category="STUDENT" />
  <p class="fr-mb-0">{{ t('please-provide') }}</p>
  <ul>
    <li>
      <i18n-t :keypath="'row-1-' + suffix">
        <strong>{{ t('student-card') }}</strong>
      </i18n-t>
    </li>
    <li>
      <i18n-t :keypath="'row-2-' + suffix">
        <strong>{{ t('school-certificate') }}</strong>
      </i18n-t>
    </li>
    <li>
      <i18n-t keypath="row-3">
        <strong>{{ t('parcoursup') }}</strong>
      </i18n-t>
    </li>
  </ul>
  <p>{{ t('note-' + suffix) }}</p>
  <UploadFilesMainActivity category="STUDENT" />
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
    "studies": "Studies",
    "please-provide":"Please provide one of the following:",
    "row-1-tenant": "your {0}",
    "row-1-other": "their {0}",
    "student-card": "student card",
    "row-2-tenant": "your {0}",
    "row-2-other": "their {0}",
    "school-certificate": "school certificate",
    "row-3": "{0}",
    "parcoursup": "Parcoursup registration certificate",
    "note-tenant": "The document must include your name, the name of the school and the current or forthcoming school year.",
    "note-other": "The document must include their name, the name of the school and the current or forthcoming school year.",
  },
  "fr": {
    "studies": "Études",
    "please-provide":"Veuillez fournir l’un des documents suivants :",
    "row-1-tenant": "votre {0}",
    "row-1-other": "sa {0}",
    "student-card": "carte d’étudiant",
    "row-2-tenant": "votre {0}",
    "row-2-other": "son {0}",
    "school-certificate": "certificat de scolarité",
    "row-3": "une {0}",
    "parcoursup": "attestation d’inscription Parcoursup",
    "note-tenant": "Le document doit mentionner votre nom, le nom de l’établissement et l’année scolaire en cours ou à venir.",
    "note-other": "Le document doit mentionner son nom, le nom de l’établissement et l’année scolaire en cours ou à venir.",
  }
}
</i18n>
