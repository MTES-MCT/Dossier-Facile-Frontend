<template>
  <BackLinkRow
    :label="t(textKey + '.you-owner')"
    to="../2"
    @edit="AnalyticsService.editSituation(category, 'owner')"
  />
  <i18n-t :keypath="textKey + '.please-provide'" tag="p">
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
import { AnalyticsService } from '@/services/AnalyticsService'
import { useResidencyState } from './residencyState'
const { t } = useI18n()
const { category, textKey } = useResidencyState()
</script>

<i18n>
{
  "en": {
    "tax-notice": "2024 property tax notice",
    "tax-website": "tax website",
    "valid-docs": "Only the latest property tax notice is a valid document here. Any other document (older notice, for example) will be refused.",
    "tenant": {
      "you-owner": "You are the owner",
      "please-provide": "Please provide your {notice}. You can download it from the {link}.",
    },
    "couple": {
      "you-owner": "You are the owner",
      "please-provide": "Please provide your {notice}. You can download it from the {link}.",
    }
  },
  "fr": {
    "tax-notice": "avis de taxe foncière 2024",
    "tax-website": "site internet des impôts",
    "valid-docs": "Seul le dernier avis de taxe foncière est un document valide ici. Tout autre document (avis plus ancien par exemple) sera refusé.",
    "tenant": {
      "you-owner": "Vous êtes propriétaire",
      "please-provide": "Veuillez fournir votre {notice}. Vous pouvez le télécharger sur le {link}.",
    },
    "couple": {
      "you-owner": "Votre conjoint est propriétaire",
      "please-provide": "Veuillez fournir son {notice}. Vous pouvez le télécharger sur le {link}.",
    }
  }
}
</i18n>
