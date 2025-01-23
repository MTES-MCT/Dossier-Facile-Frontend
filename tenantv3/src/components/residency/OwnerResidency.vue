<template>
  <BackLinkRow :label="t('you-owner')" to="/documents-locataire/2" />
  <i18n-t keypath="please-provide" tag="p">
    <template #notice>
      <strong>{{ t('tax-notice') }}</strong>
    </template>
    <template #link>
      <a href="https://www.impots.gouv.fr/accueil" target="_blank">{{ t('tax-website') }}</a>
    </template>
  </i18n-t>
  <div class="fr-alert fr-alert--warning fr-mb-2w">
    <p>{{ t('valid-docs') }}</p>
  </div>
  <UploadFiles category="OWNER" />
  <ResidencyFooter />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BackLinkRow from './lib/BackLinkRow.vue'
import ResidencyFooter from './lib/ResidencyFooter.vue'
import UploadFiles from './lib/UploadFiles.vue'
const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "you-owner": "You are the owner",
    "please-provide": "Please provide your {notice}. You can download it from the {link}.",
    "valid-docs": "Only the latest property tax notice is a valid document here. Any other document (older notice, for example) will be refused.",
    "tax-notice": "2024 property tax notice",
    "tax-website": "tax website"
  },
  "fr": {
    "you-owner": "Vous êtes propriétaire",
    "please-provide": "Veuillez fournir votre {notice}. Vous pouvez le télécharger sur le {link}.",
    "valid-docs": "Seul le dernier avis de taxe foncière est un document valide ici. Tout autre document (avis plus ancien par exemple) sera refusé.",
    "tax-notice": "avis de taxe foncière 2024",
    "tax-website": "site internet des impôts"
  }
}
</i18n>
