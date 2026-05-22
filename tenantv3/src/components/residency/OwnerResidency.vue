<template>
  <BackLinkRow
    :label="t(textKey + '.you-owner')"
    to="../2"
    @edit="AnalyticsService.editSituation(category, 'owner')"
  />
  <i18n-t :keypath="textKey + '.please-provide'" tag="p">
    <template #notice>
      <strong>{{ t('tax-notice', [taxYear]) }}</strong>
    </template>
    <template #link>
      <a
        href="https://www.impots.gouv.fr/accueil"
        :title="`${t('tax-website')} - ${t('new-window')}`"
        target="_blank"
        >{{ t('tax-website') }}</a
      >
    </template>
  </i18n-t>
  <ResidencyAnalysisStep
    :previous-step="previousStep"
    sub-category="OWNER"
    :banner-title="t('analysis-error-title', [taxYear])"
    :banner-sub-title="t('analysis-error-sub-title')"
    :banner-info-text="t('banner-info-text', [taxYear])"
  />
</template>

<script setup lang="ts">
import { taxYear } from '@/components/residency/lib/taxYear'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useI18n } from 'vue-i18n'
import BackLinkRow from './lib/BackLinkRow.vue'
import ResidencyAnalysisStep from './lib/ResidencyAnalysisStep.vue'
import { useResidencyState } from './residencyState'

const { t } = useI18n()
const state = useResidencyState()
const { category, textKey } = state

const previousStep = { name: 'TenantIdentification' }
</script>

<i18n lang="json">
{
  "en": {
    "analysis-error-title": "Add your property tax notice {0}",
    "analysis-error-sub-title": "Expected document",
    "banner-info-text": "Property tax {0} (minimum 2 pages)",
    "tax-notice": "{0} property tax notice",
    "tax-website": "tax website",
    "tenant": {
      "you-owner": "You are the owner",
      "please-provide": "Please provide your {notice}. You can download it from the {link}."
    },
    "couple": {
      "you-owner": "You are the owner",
      "please-provide": "Please provide your {notice}. You can download it from the {link}."
    }
  },
  "fr": {
    "analysis-error-title": "Ajoutez votre avis de taxe foncière {0}",
    "analysis-error-sub-title": "Document attendu",
    "banner-info-text": "Taxe foncière {0} (2 pages minimum)",
    "tax-notice": "avis de taxe foncière {0}",
    "tax-website": "site internet des impôts",
    "tenant": {
      "you-owner": "Vous êtes propriétaire",
      "please-provide": "Veuillez fournir votre {notice}. Vous pouvez le télécharger sur le {link}."
    },
    "couple": {
      "you-owner": "Votre conjoint est propriétaire",
      "please-provide": "Veuillez fournir son {notice}. Vous pouvez le télécharger sur le {link}."
    }
  }
}
</i18n>
