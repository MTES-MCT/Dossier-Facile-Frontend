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
  <AnalysisWrapper ref="analysis-wrapper" :is-uploading="isUploading">
    <template #analysisBannerError="{ rule, notMatchingLabel, explainLinkLabel, onExplain }">
      <ResidencyAnalysisErrorBannerContent
        :rule="rule"
        :document="document"
        :not-matching-label="notMatchingLabel"
        :explain-link-label="explainLinkLabel"
        @explain="onExplain"
      >
        <template #expected-doc>
          <BannerIconTextLine
            icon-name="ri:check-line"
            icon-color="#18753c"
            :text="t('expected-description')"
            text-class="success-text"
          />
          <ul class="expected-month-list">
            <li v-for="(monthLabel, i) in expectedMonthsForBanner" :key="i" class="expected-month">
              {{ monthLabel }}
            </li>
          </ul>
        </template>
      </ResidencyAnalysisErrorBannerContent>
    </template>
    <template #fileUploader>
      <UploadFileWithAnalysis
        ref="upload-file-with-analysis"
        doc-category="residency"
        sub-category="TENANT"
        :analysis-in-progress="analysisInProgress"
      />
    </template>
  </AnalysisWrapper>
  <AnalysisFooter
    :previous-step="previousStep"
    :before-submit="analysisWrapper?.beforeSubmit"
    :next-disabled="analysisWrapper?.nextDisabled"
    :next-label="analysisWrapper?.nextLabel"
    :on-submit-action="onSubmit"
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
import { useTenantStore } from '@/stores/tenant-store'
import { type DsfrButtonProps } from '@gouvminint/vue-dsfr'
import dayjs from 'dayjs'
import DsfrModalPatch from 'df-shared-next/src/components/patches/DsfrModalPatch.vue'
import { computed, provide, ref, useTemplateRef, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import BannerIconTextLine from '../analysis/BannerIconTextLine.vue'
import AnalysisWrapper from '../analysis/AnalysisWrapper.vue'
import UploadFileWithAnalysis from '../analysis/UploadFileWithAnalysis.vue'
import { documentFormKey } from '../documents/documentFormState'
import AnalysisFooter from '../footer/AnalysisFooter.vue'
import BackLinkRow from './lib/BackLinkRow.vue'
import ResidencyAnalysisErrorBannerContent from './lib/ResidencyAnalysisErrorBannerContent.vue'
import { useResidencyState } from './residencyState'

const router = useRouter()
const store = useTenantStore()

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

const onSubmit = async () => {
  await analysisWrapper.value?.saveExplanation()
  checkFiles()
}

const uploadFileWithAnalysis = useTemplateRef('upload-file-with-analysis')
const analysisWrapper = useTemplateRef('analysis-wrapper')

const isUploading = computed(() => uploadFileWithAnalysis.value?.isUploading ?? false)
const analysisInProgress = computed(() => analysisWrapper.value?.analysisInProgress ?? false)

const previousStep = { name: 'TenantIdentification' }

provide(documentFormKey, {
  category: 'RESIDENCY',
  textKey: textKey,
  previousStep: previousStep,
  nextStep: nextStep,
  formFieldValue: 'typeDocumentResidency',
  document: document,
  storeAction: 'saveTenantResidency',
  userId: store.user.id,
  addData(formData) {
    formData.append('categoryStep', 'TENANT_RECEIPT')
    state.addData?.(formData)
  }
})

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

.success-text {
  color: #18753c;
}

.expected-month-list {
  margin: 0 0 0 1rem;
  list-style: none;
  padding-left: 0;
}

.expected-month {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5rem;
  margin-left: 1rem;
  color: #18753c;
}

.expected-month-list > .expected-month::marker {
  content: none;
}

.expected-month::before {
  content: '•';
  font-size: 1.25rem;
  line-height: 1;
  color: #18753c;
}
</style>

<i18n lang="json">
{
  "en": {
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
      "receipts-from": "receipts from",
      "warning-msg": "Did you send {last}? A rent receipt indicates to a landlord that your spouse is paying his/her rent on time. {notEnough}"
    }
  },
  "fr": {
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
