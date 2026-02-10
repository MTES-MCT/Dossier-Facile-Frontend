<template>
  <p>{{ t(textKey + '.your-situation') }}</p>
  <BackLinkRow :label="t(textKey + '.have-a-tax-notice')" :to="grandParent" />
  <BackLinkRow :label="t('french')" :to="parent" />
  <i18n-t tag="p" :keypath="textKey + '.add-tax-notice'">
    <strong>{{ t('this-year-tax', [taxYear, taxYear - 1]) }}</strong>
  </i18n-t>
  <p>
    <strong>{{ t('warning') }}</strong>
    {{ t('does-not-replace') }}
  </p>
  <div class="fr-highlight fr-ml-0 fr-mb-3w">
    <i18n-t tag="p" :keypath="textKey + '.download-tax-notice'" class="fr-mb-0">
      <a
        href="https://www.impots.gouv.fr"
        :title="`impots.gouv.fr - ${t('new-window')}`"
        target="_blank"
        >impots.gouv.fr</a
      >
    </i18n-t>
  </div>
  <DfButton class="mx-auto fr-mb-3w" @click="showModal = true"
    >{{ t('see-which-doc') }} <RiEyeLine class="fr-ml-1v"
  /></DfButton>

  <ModalComponent v-if="showModal" @close="showModal = false">
    <template #header>
      <!-- TODO change to a h1 when migrating modals -->
      <h2 class="fr-h4 fr-mb-0">{{ t('modal.sample-docs') }}</h2>
    </template>
    <template #body>
      <DsfrAlert type="warning" small>
        {{ t('modal.pay-attention-to-title') }}
      </DsfrAlert>

      <h3 class="fr-h4 fr-text-default--warning fr-my-1w">
        {{ t('modal.refused-doc-title') }}
      </h3>
      <p>{{ t('modal.refused-doc-caption') }}</p>

      <img :src="avisKO" alt="" width="600" />

      <h3 class="fr-h4 fr-text-default--success fr-mb-1w">
        {{ t('modal.accepted-doc-title') }}
      </h3>
      <p>{{ t('modal.accepted-doc-caption') }}</p>

      <img :src="avisOK" alt="" width="600" />
    </template>
    <template #footer>
      <DfButton class="large-btn" primary @click="showModal = false">OK</DfButton>
    </template>
  </ModalComponent>

  <UploadFilesTax category="MY_NAME" step="TAX_FRENCH_NOTICE" />
  <TaxFooter />
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/tax/lib/TaxBackLinkRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import TaxFooter from '@/components/tax/lib/TaxFooter.vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { useI18n } from 'vue-i18n'
import { RiEyeLine } from '@remixicon/vue'
import { taxYear } from './lib/taxYear'
import ModalComponent from 'df-shared-next/src/components/ModalComponent.vue'
import { ref } from 'vue'
import avisOK from '@/assets/avis_ok.png'
import avisKO from '@/assets/avis_ko.png'
import UploadFilesTax from './lib/UploadFilesTax.vue'
import { useTaxState } from './lib/taxState'
import { DsfrAlert, DsfrButton } from '@gouvminint/vue-dsfr'

const { t } = useI18n()
const parent = useParentRoute()
const grandParent = useParentRoute(2)
const { textKey } = useTaxState()

const showModal = ref(false)
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
</style>

<i18n>
{
  "en": {
    "french": "french",
    "this-year-tax": "{0} income tax notice of {1} or full non-taxation",
    "warning": "Warning:",
    "does-not-replace": "The declarative notice of situation does not replace a tax notice.",
    "see-which-doc": "See which document to choose",
    "tenant": {
      "your-situation": "Your situation:",
      "have-a-tax-notice": "You have a tax notice",
      "add-tax-notice": "Add your {0}. All pages are mandatory, even if the amount to be paid is 0€.",
      "download-tax-notice": "Download your tax notice from your space on {0}",
    },
    "guarantor": {
      "your-situation": "Your guarantor's situation:",
      "have-a-tax-notice": "Your guarantor has a tax notice",
      "add-tax-notice": "Add the {0} of your guarantor. All pages are mandatory, even if the amount to be paid is 0€.",
      "download-tax-notice": "Download their tax notice from their space on {0}",
    },
    "couple": {
      "your-situation": "Your spouse's situation:",
      "have-a-tax-notice": "Your spouse has a tax notice",
      "add-tax-notice": "Add the {0} of your spouse. All pages are mandatory, even if the amount to be paid is 0€.",
      "download-tax-notice": "Download their tax notice from their space on {0}",
    },
    "couple-guarantor": {
      "your-situation": "Their guarantor's situation:",
      "have-a-tax-notice": "Their guarantor has a tax notice",
      "add-tax-notice": "Add the {0} of their guarantor. All pages are mandatory, even if the amount to be paid is 0€.",
      "download-tax-notice": "Download their tax notice from their space on {0}",
    },
    "modal": {
      "sample-docs": "Sample documents",
      "pay-attention-to-title": "Pay attention to the document title.",
      "refused-doc-title": "Document refused",
      "refused-doc-caption": "A document bearing the words « Situation déclarative » is invalid.",
      "accepted-doc-title": "Document accepted",
      "accepted-doc-caption": "A document bearing the words « Avis d'impôt établi » is valid.",
      "img-ko": "Example of declarative situation notice - document refused",
      "img-ok": "Example of tax notice - document accepted",
    }
  },
  "fr": {
    "french": "français",
    "this-year-tax": "avis d'impôt {0} sur les revenus de {1} ou de non-imposition complet",
    "warning": "Attention :",
    "does-not-replace": "L’avis de situation déclarative ne remplace pas un avis d’impôt.",
    "see-which-doc": "Voir quel document choisir",
    "tenant": {
      "your-situation": "Votre situation :",
      "have-a-tax-notice": "Vous avez un avis d’impôt",
      "add-tax-notice": "Ajoutez votre {0}. Toutes les pages sont obligatoires, même si le montant à payer est de 0 €.",
      "download-tax-notice": "Téléchargez votre avis d’impôt depuis votre espace sur {0}",
    },
    "guarantor": {
      "your-situation": "La situation de votre garant :",
      "have-a-tax-notice": "Votre garant a un avis d’impôt",
      "add-tax-notice": "Ajoutez l’{0} de votre garant. Toutes les pages sont obligatoires, même si le montant à payer est de 0 €.",
      "download-tax-notice": "Téléchargez son avis d’impôt depuis son espace sur {0}",
    },
    "couple": {
      "your-situation": "La situation de votre conjoint :",
      "have-a-tax-notice": "Votre conjoint a un avis d’impôt",
      "add-tax-notice": "Ajoutez l’{0} de votre conjoint. Toutes les pages sont obligatoires, même si le montant à payer est de 0 €.",
      "download-tax-notice": "Téléchargez son avis d’impôt depuis son espace sur {0}",
    },
    "couple-guarantor": {
      "your-situation": "La situation de son garant :",
      "have-a-tax-notice": "Son garant a un avis d’impôt",
      "add-tax-notice": "Ajoutez l’{0} de son garant. Toutes les pages sont obligatoires, même si le montant à payer est de 0 €.",
      "download-tax-notice": "Téléchargez son avis d’impôt depuis son espace sur {0}",
    },
    "modal": {
      "sample-docs": "Exemple de documents",
      "pay-attention-to-title": "Faites attention au titre du document.",
      "refused-doc-title": "Document refusé",
      "refused-doc-caption": "Un document comportant la mention « Situation déclarative » est invalide.",
      "accepted-doc-title": "Document accepté",
      "accepted-doc-caption": "Un document comportant la mention « Avis d'impôt établi » est valide.",
      "img-ko": "Exemple d’avis de situation déclarative - document refusé",
      "img-ok": "Exemple d'avis d’impôt - document accepté",
    }
  }
}
</i18n>
