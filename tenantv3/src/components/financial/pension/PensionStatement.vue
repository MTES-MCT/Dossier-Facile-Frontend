<template>
  <BackLinkRow
    :label="t('form.financial.retirement-or-pension')"
    :to="ancestor"
    category="pension"
  />
  <BackLinkRow
    :label="t('you-receive.' + textKey)"
    :to="grandparent"
    category="pension"
    step="retraite"
  />
  <BackLinkRow
    :label="t('pension-statement.' + textKey)"
    :to="parent"
    category="pension"
    step="retraite"
    substep="bulletin"
  />
  <EnterMonthlyIncome />
  <UploadFilesFinancial category="PENSION" step="PENSION_STATEMENT">
    <template #incomeFilled>
      <i18n-t tag="p" keypath="please-provide"
        ><strong>{{ t('recent-statement') }}</strong></i18n-t
      >
      <div class="fr-alert fr-alert--warning fr-mb-3w">
        <p class="bold">{{ t('auto-reject') }}</p>
        <i18n-t tag="p" keypath="if-no">
          <RouterLink to="pas-de-bulletin">{{ t('no-statement') }}</RouterLink
          >.
        </i18n-t>
      </div>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import { useI18n } from 'vue-i18n'
import EnterMonthlyIncome from '../lib/EnterMonthlyIncome.vue'
import { useFinancialState } from '../financialState'

const parent = useParentRoute()
const grandparent = useParentRoute(2)
const ancestor = useParentRoute(3)
const { t } = useI18n()
const { textKey } = useFinancialState()
</script>

<i18n>
{
  "en": {
    "you-receive": {
      "tenant": "You receive a pension",
      "guarantor": "Your guarantor receives a pension",
      "couple": "Your spouse receives a pension",
      "couple-guarantor": "Their guarantor receives a pension",
    },
    "pension-statement": {
      "tenant": "You have a pension statement",
      "guarantor": "Your guarantor has a pension statement",
      "couple": "Your spouse has a pension statement",
      "couple-guarantor": "Their guarantor has a pension statement",
    },
    "please-provide": "Please provide {0}.",
    "recent-statement": "a pension statement less than 2 years old",
    "auto-reject": "Our team automatically rejects pension slips older than 2 years.",
    "if-no": "If you do not have a document less than 2 years old, please indicate that {0}.",
    "no-statement": "you do not have a pension statement"
  },
  "fr": {
    "you-receive": {
      "tenant": "Vous touchez une retraite",
      "guarantor": "Votre garant touche une retraite",
      "couple": "Votre conjoint touche une retraite",
      "couple-guarantor": "Son garant touche une retraite",
    },
    "pension-statement": {
      "tenant": "Vous avez un bulletin de pension",
      "guarantor": "Votre garant a un bulletin de pension",
      "couple": "Votre conjoint a un bulletin de pension",
      "couple-guarantor": "Son garant a un bulletin de pension",
    },
    "please-provide": "Veuillez fournir {0}.",
    "recent-statement": "un bulletin de pension de moins de 2 ans",
    "auto-reject": "Notre équipe refuse automatiquement les bulletins de pension de plus de 2 ans.",
    "if-no": "Si vous n’avez pas de document de moins de 2 ans, veuillez indiquer que {0}.",
    "no-statement": "vous n’avez pas de bulletin de pension"
  }
}
</i18n>
