<template>
  <BackLinkRow :label="t('artist')" :to="parent" category="ARTIST" />
  <p class="fr-mb-0">{{ t('please-provide') }}</p>
  <ul>
    <li>
      <i18n-t keypath="row-1">
        <template #notice>
          <strong>{{ t('registration-notice') }}</strong>
        </template>
        <template #link>
          <a
            href="https://entreprendre.service-public.fr/vosdroits/R17969"
            :title="`${t('obtain-notice')} - ${t('new-window')}`"
            target="_blank"
            >{{ t('obtain-notice') }}</a
          >
        </template>
      </i18n-t>
    </li>
    <li>
      <i18n-t keypath="row-2">
        <strong>{{ t('certificate') }}</strong>
      </i18n-t>
    </li>
  </ul>
  <UploadFilesMainActivity category="ARTIST" />
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/mainActivity/lib/ProfessionalBackRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import { useI18n } from 'vue-i18n'
import UploadFilesMainActivity from './lib/UploadFilesMainActivity.vue'
const { t } = useI18n()
const parent = useParentRoute()
</script>

<i18n>
{
  "en": {
    "artist": "Artist-author",
    "please-provide":"Please provide one of the following:",
    "row-1": "a {notice} less than 3 months old ({link})",
    "registration-notice": "SIRENE registration notice",
    "obtain-notice": "obtain a registration notice",
    "row-2": "a {0}",
    "certificate": "certificate of affiliation"
  },
  "fr": {
    "artist": "Artiste-auteur",
    "please-provide":"Veuillez fournir l’un des documents suivants :",
    "row-1": "un {notice} de moins de 3 mois ({link})",
    "registration-notice": "avis de situation au répertoire SIRENE",
    "obtain-notice": "obtenir un avis de situation",
    "row-2": "une {0}",
    "certificate": "attestation d’affiliation"
  }
}
</i18n>
