<template>
  <div class="banner-content">
    <div class="banner-title">
      <VIcon name="ri:alert-fill" :scale="1.25" color="#b34000" />
      <span class="title-text">{{ getTitle() }}</span>
    </div>
    <div class="banner-description">
      <div class="current-doc">
        <p class="doc-label">{{ getFirstSubTitle() }}</p>
      </div>
      <div class="expected-doc">
        <MonthDescription
          v-if="hasToDisplayMonthDescription()"
          :expected-month-list="getExpectedMonthList()"
        />
        <IdentityDescription
          v-if="hasToDisplayIdentityDescription()"
          :expected-name="getExpectedName()"
        />
      </div>
    </div>
    <div v-if="hasToDisplayMissingMonthDescription()" class="banner-description">
      <div class="current-doc">
        <p class="doc-label">{{ getMissingDocumentsTitle() }}</p>
        <MissingMonthDescription :missing-month-list="getMissingMonthList()" />
      </div>
    </div>
    <div class="banner-description">
      <div class="current-doc">
        <p class="doc-label">{{ getSecondTitle() }}</p>
        <BannerIconTextLine
          v-for="(line, i) in getListOfErrors()"
          :key="'extracted-' + i"
          icon-name="ri:close-line"
          icon-color="#b34000"
          :text="line"
          text-class="error-text"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BannerIconTextLine from '@/components/analysis/BannerIconTextLine.vue'
import { VIcon } from '@gouvminint/vue-dsfr'
import { formatYearMonth } from 'df-shared-next/src/services/UtilsService'
import type {
  DocumentRule,
  PayslipClassificationEntry,
  PayslipContinuityEntry,
  Name
} from 'df-shared-next/src/models/DocumentRule'
import { useI18n } from 'vue-i18n'
import IdentityDescription from './IdentityDescription.vue'
import MonthDescription from './MonthDescription.vue'
import MissingMonthDescription from './MissingMonthDescription.vue'

const props = defineProps<{
  rule: DocumentRule
  index: number
}>()

const { t, locale } = useI18n()

function hasToDisplayMonthDescription(): boolean {
  return (
    (props.rule.rule === 'R_PAYSLIP_CONTINUITY' &&
      props.rule.ruleData?.type === 'R_PAYSLIP_CONTINUITY') ||
    (props.rule.rule === 'R_DOCUMENT_IA_CLASSIFICATION' &&
      props.rule.ruleData?.type === 'R_PAYSLIP_CLASSIFICATION')
  )
}

function hasToDisplayIdentityDescription(): boolean {
  return (
    props.rule.rule === 'R_PAYSLIP_NAME_MATCH' && props.rule.ruleData?.type === 'R_PAYSLIP_NAMES'
  )
}

function hasToDisplayMissingMonthDescription(): boolean {
  return (
    props.rule.rule === 'R_PAYSLIP_CONTINUITY' &&
    props.rule.ruleData?.type === 'R_PAYSLIP_CONTINUITY'
  )
}

function getTitle(): string {
  if (
    props.rule.rule === 'R_DOCUMENT_IA_CLASSIFICATION' &&
    props.rule.ruleData?.type === 'R_PAYSLIP_CLASSIFICATION'
  ) {
    return t('bad-classification.title')
  } else if (
    props.rule.rule === 'R_PAYSLIP_NAME_MATCH' &&
    props.rule.ruleData?.type === 'R_PAYSLIP_NAMES'
  ) {
    return t('payslip-name-match.title')
  } else if (
    props.rule.rule === 'R_PAYSLIP_CONTINUITY' &&
    props.rule.ruleData?.type === 'R_PAYSLIP_CONTINUITY'
  ) {
    return t('payslip-continuity.title')
  } else {
    return props.rule.message
  }
}

function getFirstSubTitle(): string {
  if (
    props.rule.rule === 'R_DOCUMENT_IA_CLASSIFICATION' &&
    props.rule.ruleData?.type === 'R_PAYSLIP_CLASSIFICATION'
  ) {
    return t('bad-classification.sub-title-one')
  } else if (
    props.rule.rule === 'R_PAYSLIP_NAME_MATCH' &&
    props.rule.ruleData?.type === 'R_PAYSLIP_NAMES'
  ) {
    return t('payslip-name-match.sub-title-one')
  } else if (
    props.rule.rule === 'R_PAYSLIP_CONTINUITY' &&
    props.rule.ruleData?.type === 'R_PAYSLIP_CONTINUITY'
  ) {
    return t('payslip-continuity.sub-title-one')
  } else {
    return t('payslip-continuity.sub-title-one')
  }
}

function getMissingDocumentsTitle(): string {
  if (
    props.rule.rule === 'R_PAYSLIP_CONTINUITY' &&
    props.rule.ruleData?.type === 'R_PAYSLIP_CONTINUITY'
  ) {
    return t('payslip-continuity.sub-title-missing')
  }
  return ''
}

function getSecondTitle(): string {
  if (
    props.rule.rule === 'R_DOCUMENT_IA_CLASSIFICATION' &&
    props.rule.ruleData?.type === 'R_PAYSLIP_CLASSIFICATION'
  ) {
    return t('bad-classification.sub-title-two')
  } else if (
    props.rule.rule === 'R_PAYSLIP_NAME_MATCH' &&
    props.rule.ruleData?.type === 'R_PAYSLIP_NAMES'
  ) {
    const count = getListOfErrors().length
    return t('payslip-name-match.sub-title-two', { count }, count)
  } else if (
    props.rule.rule === 'R_PAYSLIP_CONTINUITY' &&
    props.rule.ruleData?.type === 'R_PAYSLIP_CONTINUITY'
  ) {
    const count = getListOfErrors().length
    return t('payslip-continuity.sub-title-two', { count }, count)
  } else {
    return t('bad-classification.sub-title-two')
  }
}

function getExpectedMonthList(): string[] {
  const ruleData = props.rule.ruleData as
    | { expectedMonthList?: string[]; expectedMonths?: string[] }
    | undefined
  return ruleData?.expectedMonthList ?? ruleData?.expectedMonths ?? []
}

function getMissingMonthList(): string[] {
  if (props.rule.ruleData?.type !== 'R_PAYSLIP_CONTINUITY') {
    return []
  }
  return props.rule.ruleData.missingMonthList ?? []
}

function getExpectedName(): Name | undefined {
  if (props.rule.ruleData?.type !== 'R_PAYSLIP_NAMES') {
    return undefined
  }
  return props.rule.ruleData.expectedName
}

function getListOfErrors(): string[] {
  if (
    props.rule.rule === 'R_DOCUMENT_IA_CLASSIFICATION' &&
    props.rule.ruleData?.type === 'R_PAYSLIP_CLASSIFICATION'
  ) {
    return (
      props.rule.ruleData?.entriesInError.map(
        (entry: PayslipClassificationEntry) => entry.fileName
      ) ?? []
    )
  } else if (
    props.rule.rule === 'R_PAYSLIP_NAME_MATCH' &&
    props.rule.ruleData?.type === 'R_PAYSLIP_NAMES'
  ) {
    return props.rule.ruleData.payslipEntriesInError.map((entry) => {
      if (entry.extractedName) {
        return t('payslip-name-match.error-line-with-name', {
          fileName: entry.fileName,
          extractedName: entry.extractedName
        })
      }
      return t('payslip-name-match.error-line-missing-name', {
        fileName: entry.fileName
      })
    })
  } else if (
    props.rule.rule === 'R_PAYSLIP_CONTINUITY' &&
    props.rule.ruleData?.type === 'R_PAYSLIP_CONTINUITY'
  ) {
    return props.rule.ruleData.payslipEntriesInError.map((entry: PayslipContinuityEntry) => {
      if (entry.extractedMonth) {
        const month = formatYearMonth(entry.extractedMonth, locale.value)
        return t('payslip-continuity.error-line-with-month', {
          fileName: entry.fileName,
          month,
          monthWithPrep: formatFrenchMonthWithPreposition(month)
        })
      }
      return t('payslip-continuity.error-line-not-payslip', {
        fileName: entry.fileName
      })
    })
  } else {
    return []
  }
}

function formatFrenchMonthWithPreposition(formattedMonth: string): string {
  if (!locale.value.startsWith('fr')) {
    return formattedMonth
  }
  const startsWithVowelSound = /^[aeiouyàâäæéèêëîïôœùûü]/i.test(formattedMonth)
  return startsWithVowelSound ? `d'${formattedMonth}` : `de ${formattedMonth}`
}
</script>

<style scoped>
@import '../../../analysis/analysisBannerLayout.css';

.error-text {
  color: #b34000;
}
</style>

<i18n lang="json">
{
  "en": {
    "bad-classification": {
      "title": "Incorrect document type",
      "sub-title-one": "Documents to add",
      "sub-title-two": "Documents à remplacer"
    },
    "payslip-name-match": {
      "title": "Different identity on payslips",
      "sub-title-one": "Expected identity",
      "sub-title-two": "No current document | Current document | Current documents",
      "error-line-with-name": "{fileName}: this document is in the name of {extractedName}",
      "error-line-missing-name": "{fileName}: this document does not have the expected name"
    },
    "payslip-continuity": {
      "title": "Missing payslips",
      "sub-title-one": "Expected documents",
      "sub-title-missing": "Missing documents",
      "sub-title-two": "No current document | Current document | Current documents",
      "error-line-with-month": "{fileName}: this document is from {month}",
      "error-line-not-payslip": "{fileName}: this document is not a payslip"
    }
  },
  "fr": {
    "bad-classification": {
      "title": "Type de document incorrect",
      "sub-title-one": "Documents à ajouter",
      "sub-title-two": "Documents à remplacer"
    },
    "payslip-name-match": {
      "title": "Identité différente sur les bulletins",
      "sub-title-one": "Identité attendue",
      "sub-title-two": "Aucun document actuel | Document actuel | Documents actuels",
      "error-line-with-name": "{fileName} : ce document est au nom de {extractedName}",
      "error-line-missing-name": "{fileName} : ce document n'a pas le nom attendu"
    },
    "payslip-continuity": {
      "title": "Bulletins de salaire manquants",
      "sub-title-one": "Documents attendus",
      "sub-title-missing": "Documents manquants",
      "sub-title-two": "Aucun document actuel | Document actuel | Documents actuels",
      "error-line-with-month": "{fileName} : ce document est {monthWithPrep}",
      "error-line-not-payslip": "{fileName} : ce document n'est pas un bulletin de salaire"
    }
  }
}
</i18n>
