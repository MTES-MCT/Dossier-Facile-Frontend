<template>
  <p>{{ t('your-situation') }}</p>
  <BackLinkRow :label="t('you-have-a-tax-notice')" :to="grandParent" />
  <BackLinkRow :label="t('french')" :to="parent" />
  <i18n-t tag="p" keypath="add-tax-notice">
    <strong>{{ t('this-year-tax', [taxYear, taxYear - 1]) }}</strong>
  </i18n-t>
  <p>
    <strong>{{ t('warning') }}</strong>
    {{ t('does-not-replace') }}
  </p>
  <div class="fr-highlight fr-ml-0 fr-mb-3w">
    <i18n-t tag="p" keypath="download-tax-notice" class="fr-mb-0">
      <a href="https://www.impots.gouv.fr" target="_blank">impots.gouv.fr</a>
    </i18n-t>
  </div>
  <DfButton class="mx-auto fr-mb-3w" @click="showModal = true"
    >{{ t('see-which-doc') }} <RiEyeLine class="fr-ml-1v"
  /></DfButton>

  <ModalComponent v-if="showModal" @close="showModal = false">
    <template #header>
      <h2 class="modal-title">
        <RiAlertLine class="color--primary fr-mr-1v" />
        {{ t('modal.pay-attention-to-title') }}
      </h2>
    </template>
    <template #body>
      <h3 class="fr-h4 fr-text-default--warning fr-mb-1w">{{ t('modal.refused-doc') }}</h3>
      <img :src="avisKO" :alt="t('modal.img-ko')" width="600" />
      <hr class="fr-mt-3w" />
      <h3 class="fr-h4 fr-text-default--success fr-mb-1w">{{ t('modal.accepted-doc') }}</h3>
      <img :src="avisOK" :alt="t('modal.img-ok')" width="600" />
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
import { RiAlertLine, RiEyeLine } from '@remixicon/vue'
import { taxYear } from './lib/taxYear'
import ModalComponent from 'df-shared-next/src/components/ModalComponent.vue'
import { ref } from 'vue'
import avisOK from '@/assets/exemple avis ok.png'
import avisKO from '@/assets/exemple avis ko.png'
import UploadFilesTax from './lib/UploadFilesTax.vue'

const { t } = useI18n()
const parent = useParentRoute()
const grandParent = useParentRoute(2)

const showModal = ref(false)
</script>

<style scoped>
.modal-title {
  font-size: 1rem;
  font-weight: normal;
  line-height: 1.5;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  margin: auto;
}
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
    "your-situation": "Your situation:",
    "you-have-a-tax-notice": "You have a tax notice",
    "french": "french",
    "add-tax-notice": "Add your {0}. All pages are mandatory, even if the amount to be paid is 0€.",
    "this-year-tax": "{0} income tax notice of {1} or full non-taxation",
    "warning": "Warning:",
    "does-not-replace": "The declarative notice of situation does not replace a tax notice.",
    "download-tax-notice": "Download your tax notice from your space on {0}",
    "see-which-doc": "See which document to choose?",
    "modal": {
      "pay-attention-to-title": "Pay attention to the document title.",
      "refused-doc": "Document refused",
      "accepted-doc": "Document accepted",
      "img-ko": "Example of declarative situation notice - document refused",
      "img-ok": "Example of tax notice - document accepted",
    }
  },
  "fr": {
    "your-situation": "Votre situation :",
    "you-have-a-tax-notice": "Vous avez un avis d’impôt",
    "french": "français",
    "add-tax-notice": "Ajoutez votre {0}. Toutes les pages sont obligatoires, même si le montant à payer est de 0 €.",
    "this-year-tax": "avis d'impôt {0} sur les revenus de {1} ou de non-imposition complet",
    "warning": "Attention :",
    "does-not-replace": "L’avis de situation déclarative ne remplace pas un avis d’impôt.",
    "download-tax-notice": "Téléchargez votre avis d’impôt depuis votre espace sur {0}",
    "see-which-doc": "Voir quel document choisir ?",
    "modal": {
      "pay-attention-to-title": "Faites attention au titre du document.",
      "refused-doc": "Document refusé",
      "accepted-doc": "Document accepté",
      "img-ko": "Exemple d’avis de situation déclarative - document refusé",
      "img-ok": "Exemple d'avis d’impôt - document accepté",
    }
  }
}
</i18n>
