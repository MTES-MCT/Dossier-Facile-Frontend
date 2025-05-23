<template>
  <BackLinkRow
    :label="t('you-tenant')"
    to="../../2"
    @edit="AnalyticsService.editSituation(category, 'tenant')"
  />
  <BackLinkRow
    :label="t('have-receipts')"
    to="../tenant"
    @edit="AnalyticsService.editSituation2(category, 'tenant', 'receipts')"
  />
  <i18n-t :keypath="textKey + '.please-provide'" tag="p" class="fr-mb-0">
    <strong>{{ t('receipts-from') }}</strong>
  </i18n-t>
  <ul class="text-lg">
    <li v-for="(m, i) of monthsLabels" :key="i">
      <strong>{{ m }}</strong>
    </li>
  </ul>
  <p>{{ t('can-add-receipt', [month.format('MMMM')]) }}</p>
  <div class="fr-alert fr-alert--warning fr-mb-2w">
    <p>{{ t('valid-docs') }}</p>
  </div>
  <UploadFiles category="TENANT" step="TENANT_RECEIPT" />
  <ResidencyFooter :on-submit="checkFiles" />
  <ModalComponent
    v-if="showNbDocumentsResidencyTenant"
    @close="showNbDocumentsResidencyTenant = false"
  >
    <template #body>
      <i18n-t :keypath="textKey + '.warning-residency.msg'" tag="p">
        <template #last>
          <strong>{{ t('warning-residency.last-3-receipts') }}</strong>
        </template>
        <template #notEnough>
          <strong>{{ t('warning-residency.not-enough') }}</strong>
        </template>
      </i18n-t>
      <p>
        <strong>{{ t('warning-residency.cannot-be-approved') }}</strong>
      </p>
    </template>
    <template #footer>
      <ul class="fr-btns-group fr-btns-group--inline-md">
        <li>
          <DfButton primary @click="ignoreAndgoNext">{{
            t('warning-residency.ignore-warning')
          }}</DfButton>
        </li>
        <li>
          <DfButton @click="showNbDocumentsResidencyTenant = false">{{
            t('warning-residency.accept-warning')
          }}</DfButton>
        </li>
      </ul>
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BackLinkRow from './lib/BackLinkRow.vue'
import UploadFiles from './lib/UploadFiles.vue'
import ModalComponent from 'df-shared-next/src/components/ModalComponent.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useRouter } from 'vue-router'
import ResidencyFooter from './lib/ResidencyFooter.vue'
import dayjs from 'dayjs'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { useResidencyState } from './residencyState'

const i18n = useI18n()
const router = useRouter()
const { category, document, nextStep, textKey } = useResidencyState()
const showNbDocumentsResidencyTenant = ref(false)

const t = (key: string, params?: [string]) =>
  params ? i18n.t(`${textKey}.${key}`, params) : i18n.t(`${textKey}.${key}`)

function ignoreAndgoNext() {
  showNbDocumentsResidencyTenant.value = false
  AnalyticsService.forceMissingResidencyDocument()
  router.push(nextStep)
}

function checkFiles() {
  const d = document.value
  if (d?.documentSubCategory === 'TENANT') {
    const nbPages = d.files?.reduce((s, a) => s + (a.numberOfPages || 0), 0) || 0
    if (nbPages < 3) {
      showNbDocumentsResidencyTenant.value = true
      AnalyticsService.missingResidencyDocumentDetected()
      return
    }
  }
  router.push(nextStep)
}

const month = dayjs().subtract(dayjs().date() < 15 ? 2 : 1, 'month')
const monthsLabels = [3, 2, 1].map((d) => month.subtract(d, 'month').format('MMMM'))
</script>

<style scoped>
.text-lg {
  font-size: 1.125rem;
}
</style>

<i18n>
{
  "en": {
    "tenant": {
      "you-tenant": "You are a tenant",
      "have-receipts": "You have your last 3 rent receipts",
      "can-add-receipt": "You can add the {0} receipt if you have it.",
      "please-provide": "Please provide {0}:",
      "receipts-from": "receipts from",
      "valid-docs": "Only rental receipts are valid documents here. All other documents will be refused.",
      "warning-residency": {
        "msg": "Did you send {last}? A rent receipt indicates to a landlord that you are paying your rent on time. {notEnough}",
        "last-3-receipts": "your last 3 rent receipts",
        "not-enough": "A document that only mentions your address (such as an EDF bill) is not sufficient in this case.",
        "cannot-be-approved": "Your application cannot be approved without these 3 rent receipts.",
        "accept-warning": "Add new documents",
        "ignore-warning": "Proceed to the next step"
      }
    },
    "couple": {
      "you-tenant": "Your spouse is a tenant",
      "have-receipts": "Your spouse has his/her last 3 rent receipts",
      "can-add-receipt": "You can add the {0} receipt if you have it.",
      "please-provide": "Please provide {0}:",
      "receipts-from": "receipts from",
      "valid-docs": "Only rental receipts are valid documents here. All other documents will be refused.",
      "warning-residency": {
        "msg": "Did you send {last}? A rent receipt indicates to a landlord that your spouse is paying his/her rent on time. {notEnough}",
        "last-3-receipts": "his/her last 3 rent receipts",
        "not-enough": "A document that only mentions his/her address (such as an EDF bill) is not sufficient in this case.",
        "cannot-be-approved": "Your application cannot be approved without these 3 rent receipts.",
        "accept-warning": "Add new documents",
        "ignore-warning": "Proceed to the next step"
      }
    }
  },
  "fr": {
    "tenant": {
      "you-tenant": "Vous êtes locataire",
      "have-receipts": "Vous avez vos 3 dernières quittances de loyer",
      "can-add-receipt": "Vous pouvez ajouter la quittance de {0} si vous l'avez.",
      "please-provide": "Veuillez fournir {0} :",
      "receipts-from": "les quittances de",
      "valid-docs": "Seules les quittances de loyer sont des documents valides ici. Tout autre document sera refusé.",
      "warning-residency": {
        "msg": "Avez-vous bien transmis {last} ? Une quittance indique à un propriétaire que vous payez bien votre loyer. {notEnough}",
        "last-3-receipts": "vos 3 dernières quittances",
        "not-enough": "Un document qui ne mentionne que votre adresse (une facture d'électricité par exemple) ne suffit pas ici.",
        "cannot-be-approved": "Votre dossier ne pourra pas être validé sans ces 3 quittances.",
        "accept-warning": "Ajouter de nouveaux documents",
        "ignore-warning": "Passer à l'étape suivante"
      }
    },
    "couple": {
      "you-tenant": "Votre conjoint est locataire",
      "have-receipts": "Votre conjoint a ses 3 dernières quittances de loyer",
      "can-add-receipt": "Vous pouvez ajouter sa quittance de {0} si vous l'avez.",
      "please-provide": "Veuillez fournir {0} :",
      "receipts-from": "ses quittances de",
      "valid-docs": "Seules les quittances de loyer sont des documents valides ici. Tout autre document sera refusé.",
      "warning-residency": {
        "msg": "Avez-vous bien transmis {last} ? Une quittance indique à un propriétaire que votre conjoint paie bien son loyer. {notEnough}",
        "last-3-receipts": "les 3 dernières quittances de votre conjoint",
        "not-enough": "Un document qui ne mentionne que son adresse (une facture d'électricité par exemple) ne suffit pas ici.",
        "cannot-be-approved": "Votre dossier ne pourra pas être validé sans ces 3 quittances.",
        "accept-warning": "Ajouter de nouveaux documents",
        "ignore-warning": "Passer à l'étape suivante"
      }
    }
  }
}
</i18n>
