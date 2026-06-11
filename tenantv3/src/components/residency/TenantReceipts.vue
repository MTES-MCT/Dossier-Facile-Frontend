<template>
  <BackLinkRow
    :label="t(`${textKey}.you-tenant`)"
    to="../../2"
    @edit="AnalyticsService.editSituation(category, 'tenant')"
  />
  <BackLinkRow
    :label="t(`${textKey}.have-receipts`)"
    to="../tenant"
    @edit="AnalyticsService.editSituation2(category, 'tenant', 'receipts')"
  />
  <i18n-t keypath="please-provide" tag="p" class="fr-mb-0">
    <strong>{{ t('receipts-from') }}</strong>
  </i18n-t>
  <ul class="text-lg">
    <li v-for="(m, i) of monthsLabels" :key="i">
      <strong>{{ m }}</strong>
    </li>
  </ul>
  <p>{{ t('can-add-receipt', [month.format('MMMM')]) }}</p>
  <ResidencyAnalysisStep
    :previous-step="previousStep"
    sub-category="TENANT"
    category-step="TENANT_RECEIPT"
    :banner-title="t('analysis-error-title')"
    :banner-sub-title="t('analysis-error-sub-title')"
    :banner-info-text="t('expected-description')"
    :expected-items="expectedMonthsForBanner"
    :on-submit-action="checkFiles"
  />
  <DsfrModalPatch v-model:is-opened="isModalOpened" :title="t('confirm')" :actions="modalActions">
    <i18n-t :keypath="`${textKey}.warning-msg`" tag="p">
      <template #last>
        <strong>{{ t('last-3-receipts') }}</strong>
      </template>
      <template #notEnough>
        <strong>{{ t('not-enough') }}</strong>
      </template>
    </i18n-t>
    <p>
      <strong>{{ t('cannot-be-approved') }}</strong>
    </p>
  </DsfrModalPatch>
</template>

<script setup lang="ts">
import { AnalyticsService } from '@/services/AnalyticsService'
import { type DsfrButtonProps } from '@gouvminint/vue-dsfr'
import dayjs from 'dayjs'
import DsfrModalPatch from 'df-shared-next/src/components/patches/DsfrModalPatch.vue'
import { computed, ref, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import BackLinkRow from './lib/BackLinkRow.vue'
import ResidencyAnalysisStep from './lib/ResidencyAnalysisStep.vue'
import { useResidencyState } from './residencyState'

const router = useRouter()

const state = useResidencyState()
const { category, document, nextStep, textKey } = state

const isModalOpened = ref(false)
const modalActions: ComputedRef<DsfrButtonProps[]> = computed(() => [
  {
    label: t('ignore-warning'),
    onClick() {
      ignoreAndgoNext()
    },
    secondary: true
  },
  {
    label: t('accept-warning'),
    onClick() {
      isModalOpened.value = false
    }
  }
])

const { t } = useI18n()

const previousStep = { name: 'TenantIdentification' }

function ignoreAndgoNext() {
  isModalOpened.value = false
  AnalyticsService.forceMissingResidencyDocument()
  router.push(nextStep)
}

function checkFiles() {
  const d = document.value
  if (d?.documentSubCategory === 'TENANT') {
    const nbPages = d.files?.reduce((s, a) => s + (a.numberOfPages || 0), 0) || 0
    if (nbPages < 3) {
      isModalOpened.value = true
      AnalyticsService.missingResidencyDocumentDetected()
      return
    }
  }
  router.push(nextStep)
}

const month = dayjs().subtract(dayjs().date() < 16 ? 2 : 1, 'month')
const monthsLabels = [3, 2, 1].map((d) => month.subtract(d, 'month').format('MMMM'))

function formatMonthWithYear(date: dayjs.Dayjs): string {
  const formatted = date.format('MMMM YYYY')
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

const expectedMonthsForBanner = [
  ...[3, 2, 1].map((d) => formatMonthWithYear(month.subtract(d, 'month'))),
  formatMonthWithYear(dayjs())
]
</script>

<style scoped>
.text-lg {
  font-size: 1.125rem;
}
</style>

<i18n lang="json">
{
  "en": {
    "analysis-error-title": "Add your rent receipts",
    "analysis-error-sub-title": "Expected documents",
    "confirm": "Confirmation",
    "expected-description": "Three rent receipts among:",
    "can-add-receipt": "You can add the {0} receipt if you have it.",
    "please-provide": "Please provide {0}:",
    "receipts-from": "receipts from",
    "not-enough": "A document that only mentions an address (such as an EDF bill) is not sufficient in this case.",
    "cannot-be-approved": "Your application cannot be approved without these 3 rent receipts.",
    "accept-warning": "Add new documents",
    "ignore-warning": "Proceed to the next step",
    "last-3-receipts": "the last 3 rent receipts",
    "tenant": {
      "you-tenant": "You are a tenant",
      "have-receipts": "You have your last 3 rent receipts",
      "warning-msg": "Did you send {last}? A rent receipt indicates to a landlord that you are paying your rent on time. {notEnough}"
    },
    "couple": {
      "you-tenant": "Your spouse is a tenant",
      "have-receipts": "Your spouse has his/her last 3 rent receipts",
      "warning-msg": "Did you send {last}? A rent receipt indicates to a landlord that your spouse is paying his/her rent on time. {notEnough}"
    }
  },
  "fr": {
    "analysis-error-title": "Ajoutez vos quittances de loyer",
    "analysis-error-sub-title": "Documents attendus",
    "confirm": "Confirmation",
    "expected-description": "Trois quittances parmi :",
    "can-add-receipt": "Vous pouvez ajouter la quittance de {0} si vous l'avez.",
    "please-provide": "Veuillez fournir {0} :",
    "receipts-from": "les quittances de",
    "not-enough": "Un document qui ne mentionne que l'adresse (une facture d'électricité par exemple) ne suffit pas ici.",
    "cannot-be-approved": "Votre dossier ne pourra pas être validé sans ces 3 quittances.",
    "accept-warning": "Ajouter de nouveaux documents",
    "ignore-warning": "Passer à l'étape suivante",
    "last-3-receipts": "les 3 dernières quittances",
    "tenant": {
      "you-tenant": "Vous êtes locataire",
      "have-receipts": "Vous avez vos 3 dernières quittances de loyer",
      "warning-msg": "Avez-vous bien transmis {last} ? Une quittance indique à un propriétaire que vous payez bien votre loyer. {notEnough}"
    },
    "couple": {
      "you-tenant": "Votre conjoint est locataire",
      "have-receipts": "Votre conjoint a ses 3 dernières quittances de loyer",
      "warning-msg": "Avez-vous bien transmis {last} ? Une quittance indique à un propriétaire que votre conjoint paie bien son loyer. {notEnough}"
    }
  }
}
</i18n>
