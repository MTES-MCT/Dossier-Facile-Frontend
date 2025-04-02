<template>
  <BackLinkRow :label="t('form.financial.retirement-or-pension')" :to="grandparent" />
  <BackLinkRow :label="t('unknown')" :to="parent" />
  <WarningUpdate />
  <EnterMonthlyIncome />
  <UploadFilesFinancial category="PENSION" step="PENSION_UNKNOWN" no-upload>
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
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import WarningUpdate from '../lib/WarningUpdate.vue'
import { useI18n } from 'vue-i18n'
import EnterMonthlyIncome from '../lib/EnterMonthlyIncome.vue'

const parent = useParentRoute()
const grandparent = useParentRoute(2)
const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "you-receive": "You receive a pension",
    "pension-statement": "You have a pension statement",
    "please-provide": "Please provide {0}.",
    "recent-statement": "a pension statement less than 2 years old",
    "auto-reject": "Our team automatically rejects pension slips older than 2 years.",
    "if-no": "If you do not have a document less than 2 years old, please indicate that {0}.",
    "no-statement": "you do not have a pension statement",
    "unknown": "Unknown"
  },
  "fr": {
    "you-receive": "Vous touchez une retraite",
    "pension-statement": "Vous avez un bulletin de pension",
    "please-provide": "Veuillez fournir {0}.",
    "recent-statement": "un bulletin de pension de moins de 2 ans",
    "auto-reject": "Notre équipe refuse automatiquement les bulletins de pension de plus de 2 ans.",
    "if-no": "Si vous n’avez pas de document de moins de 2 ans, veuillez indiquer que {0}.",
    "no-statement": "vous n’avez pas de bulletin de pension",
    "unknown": "Non renseigné"
  }
}
</i18n>
