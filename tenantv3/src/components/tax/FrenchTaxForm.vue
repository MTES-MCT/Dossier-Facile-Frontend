<template>
  <p>{{ t(textKey + '.your-situation') }}</p>
  <BackLinkRow :label="t(textKey + '.have-a-tax-notice')" :to="grandParent" />
  <BackLinkRow :label="t('french')" :to="parent" />
  <AnalysisWrapper ref="analysis-wrapper" :is-uploading="isUploading">
    <template #fileSpecificDescription>
      <i18n-t tag="p" :keypath="textKey + '.add-tax-notice'">
        <strong>{{ t('this-year-tax', [taxYear, taxYear - 1]) }}</strong>
      </i18n-t>
      <p>
        <strong>{{ t('warning') }}</strong>
        {{ t('does-not-replace') }}
      </p>
      <DsfrAlert type="info" small class="fr-ml-0 fr-mb-3w">
        <i18n-t tag="p" :keypath="textKey + '.download-tax-notice'">
          <a
            href="https://www.impots.gouv.fr"
            :title="`impots.gouv.fr - ${t('new-window')}`"
            target="_blank"
            >impots.gouv.fr</a
          >
        </i18n-t>
      </DsfrAlert>
      <DsfrButton
        icon="ri:eye-line"
        :icon-right="true"
        :label="t('see-which-doc')"
        secondary
        class="fr-mb-3w"
        @click="isModalOpened = true"
      />
      <DsfrModalPatch v-model:is-opened="isModalOpened" :title="t('modal.sample-docs')" size="xl">
        <DsfrAlert type="warning" small>
          {{ t('modal.pay-attention-to-title') }}
        </DsfrAlert>

        <h2 class="fr-h4 fr-text-default--warning fr-my-1w">
          {{ t('modal.refused-doc-title') }}
        </h2>
        <p>{{ t('modal.refused-doc-text') }}</p>

        <img :src="avisKO" alt="" width="600" />

        <h2 class="fr-h4 fr-text-default--success fr-mb-1w">
          {{ t('modal.accepted-doc-title') }}
        </h2>
        <p>{{ t('modal.accepted-doc-text') }}</p>

        <img :src="avisOK" alt="" width="600" height="850" />
      </DsfrModalPatch>
    </template>
    <template #fileUploader>
      <UploadFileTaxWithAnalysis
        ref="upload-file-tax-with-analysis"
        sub-category="MY_NAME"
        step="TAX_FRENCH_NOTICE"
        :analysis-in-progress="analysisInProgress"
      />
    </template>
  </AnalysisWrapper>
  <TaxFooter
    :next-disabled="analysisWrapper?.nextDisabled"
    :next-label="analysisWrapper?.nextLabel"
    :before-submit="analysisWrapper?.beforeSubmit"
  />
</template>

<script setup lang="ts">
import avisKO from '@/assets/avis_ko.png'
import avisOK from '@/assets/avis_ok.png'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import BackLinkRow from '@/components/tax/lib/TaxBackLinkRow.vue'
import TaxFooter from '@/components/tax/lib/TaxFooter.vue'
import { DsfrAlert, DsfrButton } from '@gouvminint/vue-dsfr'
import DsfrModalPatch from 'df-shared-next/src/components/patches/DsfrModalPatch.vue'
import { computed, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import AnalysisWrapper from '../analysis/AnalysisWrapper.vue'
import { useDocumentFormKey } from '../documents/documentFormState'
import UploadFileTaxWithAnalysis, {
  type UploadFileTaxWithAnalysisExposed
} from './lib/UploadFileTaxWithAnalysis.vue'
import { taxYear } from './lib/taxYear'

const { t } = useI18n()
const parent = useParentRoute()
const grandParent = useParentRoute(2)
const { textKey } = useDocumentFormKey()

const uploadFileTaxWithAnalysis = useTemplateRef<UploadFileTaxWithAnalysisExposed>(
  'upload-file-tax-with-analysis'
)
const analysisWrapper = useTemplateRef('analysis-wrapper')

const isModalOpened = ref(false)
const isUploading = computed(() => uploadFileTaxWithAnalysis.value?.isUploading ?? false)
const analysisInProgress = computed(() => analysisWrapper.value?.analysisInProgress ?? false)
</script>

<style scoped>
.large-btn {
  justify-content: center;
  flex-grow: 1;
  @media (min-width: 768px) {
    flex-grow: 0;
    width: 6rem;
  }
}
.error-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background-color: #ffe9e6;
  border-radius: 4px;
  padding: 0 0.5rem;
  width: fit-content;
}

.badge-icon {
  width: 1rem;
  height: 1rem;
}

.badge-text {
  font-weight: 700;
  font-size: 0.875rem;
  line-height: 1.5rem;
  color: #b34000;
  text-transform: uppercase;
}
</style>

<i18n lang="json">
{
  "en": {
    "avis-detected": "Declarative Situation Notice Detected",
    "avis-text1": "You have provided a declarative statement notice (see document title). This document is not valid. Please replace it with your tax assessment notice.",
    "avis-btn": "Submit a valid document",
    "avis-link-to-doc": "Need help ? Check our documentation",
    "errors-count": "{count} error to correct | {count} errors to correct",
    "french": "french",
    "this-year-tax": "{0} income tax notice of {1} or full non-taxation",
    "warning": "Warning:",
    "does-not-replace": "The declarative notice of situation does not replace a tax notice.",
    "see-which-doc": "See which document to choose",
    "tenant": {
      "your-situation": "Your situation:",
      "have-a-tax-notice": "You have a tax notice",
      "add-tax-notice": "Add your {0}. All pages are mandatory, even if the amount to be paid is 0€.",
      "download-tax-notice": "Download your tax notice from your space on {0}"
    },
    "guarantor": {
      "your-situation": "Your guarantor's situation:",
      "have-a-tax-notice": "Your guarantor has a tax notice",
      "add-tax-notice": "Add the {0} of your guarantor. All pages are mandatory, even if the amount to be paid is 0€.",
      "download-tax-notice": "Download their tax notice from their space on {0}"
    },
    "couple": {
      "your-situation": "Your spouse's situation:",
      "have-a-tax-notice": "Your spouse has a tax notice",
      "add-tax-notice": "Add the {0} of your spouse. All pages are mandatory, even if the amount to be paid is 0€.",
      "download-tax-notice": "Download their tax notice from their space on {0}"
    },
    "couple-guarantor": {
      "your-situation": "Their guarantor's situation:",
      "have-a-tax-notice": "Their guarantor has a tax notice",
      "add-tax-notice": "Add the {0} of their guarantor. All pages are mandatory, even if the amount to be paid is 0€.",
      "download-tax-notice": "Download their tax notice from their space on {0}"
    },
    "modal": {
      "sample-docs": "Sample documents",
      "pay-attention-to-title": "Pay attention to the document title.",
      "refused-doc-title": "Document refused",
      "refused-doc-text": "A document bearing the words « Situation déclarative » is invalid.",
      "accepted-doc-title": "Document accepted",
      "accepted-doc-text": "A document bearing the words « Avis d'impôt établi » is valid.",
      "img-ko": "Example of declarative situation notice - document refused",
      "img-ok": "Example of tax notice - document accepted"
    }
  },
  "fr": {
    "avis-detected": "Avis de situation déclarative détecté",
    "avis-text1": "Vous avez fourni un avis de situation déclarative (voir titre du document). Ce document n'est pas valide. Merci de le remplacer par votre avis d'imposition.",
    "avis-btn": "Déposer votre avis d'imposition",
    "avis-link-to-doc": "Besoin d'aide ? Consultez notre aide en ligne",
    "errors-count": "{count} erreur à corriger | {count} erreurs à corriger",
    "french": "français",
    "this-year-tax": "avis d'impôt {0} sur les revenus de {1} ou de non-imposition complet",
    "warning": "Attention :",
    "does-not-replace": "L’avis de situation déclarative ne remplace pas un avis d’impôt.",
    "see-which-doc": "Voir quel document choisir",
    "tenant": {
      "your-situation": "Votre situation :",
      "have-a-tax-notice": "Vous avez un avis d’impôt",
      "add-tax-notice": "Ajoutez votre {0}. Toutes les pages sont obligatoires, même si le montant à payer est de 0 €.",
      "download-tax-notice": "Téléchargez votre avis d’impôt depuis votre espace sur {0}"
    },
    "guarantor": {
      "your-situation": "La situation de votre garant :",
      "have-a-tax-notice": "Votre garant a un avis d’impôt",
      "add-tax-notice": "Ajoutez l’{0} de votre garant. Toutes les pages sont obligatoires, même si le montant à payer est de 0 €.",
      "download-tax-notice": "Téléchargez son avis d’impôt depuis son espace sur {0}"
    },
    "couple": {
      "your-situation": "La situation de votre conjoint :",
      "have-a-tax-notice": "Votre conjoint a un avis d’impôt",
      "add-tax-notice": "Ajoutez l’{0} de votre conjoint. Toutes les pages sont obligatoires, même si le montant à payer est de 0 €.",
      "download-tax-notice": "Téléchargez son avis d’impôt depuis son espace sur {0}"
    },
    "couple-guarantor": {
      "your-situation": "La situation de son garant :",
      "have-a-tax-notice": "Son garant a un avis d’impôt",
      "add-tax-notice": "Ajoutez l’{0} de son garant. Toutes les pages sont obligatoires, même si le montant à payer est de 0 €.",
      "download-tax-notice": "Téléchargez son avis d’impôt depuis son espace sur {0}"
    },
    "modal": {
      "sample-docs": "Exemple de documents",
      "pay-attention-to-title": "Faites attention au titre du document.",
      "refused-doc-title": "Document refusé",
      "refused-doc-text": "Un document comportant la mention « Situation déclarative » est invalide.",
      "accepted-doc-title": "Document accepté",
      "accepted-doc-text": "Un document comportant la mention « Avis d'impôt établi » est valide.",
      "img-ko": "Exemple d’avis de situation déclarative - document refusé",
      "img-ok": "Exemple d'avis d’impôt - document accepté"
    }
  }
}
</i18n>
