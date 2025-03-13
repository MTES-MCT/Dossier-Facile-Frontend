<template>
  <div v-if="brokenRules && brokenRules.length > 0" class="rules-container">
    <template v-for="(b, k) in brokenRules" :key="k">
      <h6>{{ b.message }}</h6>
      <template v-if="isRuleWithCustomText(b.rule)">
        <p>{{ t(`prevalidation.${b.rule}.p1`) }}</p>
        <p>{{ t(`prevalidation.${b.rule}.p2`) }}</p>
      </template>
      <p v-else>{{ t('prevalidation.force-message') }}</p>
    </template>
    <div class="form-container">
      <Form name="form" class="fr-grid-col" @submit="commentAnalysis">
        <Field
          v-slot="{ field, meta }"
          v-model="comment"
          name="comment"
          :rules="{ required: true }"
        >
          <textarea
            v-bind="field"
            type="text"
            :value="comment"
            class="validate-required form-control fr-input"
            :class="{
              'fr-input--valid': meta.valid,
              'fr-input--error': !meta.valid
            }"
            maxlength="2000"
            rows="4"
          />
          <ErrorMessage v-slot="{ message }" name="comment">
            <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
          </ErrorMessage>
        </Field>
        <DfButton class="fr-mt-2w fr-ml-auto" type="submit" primary>{{ t('register') }}</DfButton>
      </Form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTenantStore } from '../../../stores/tenant-store'
import { Form, Field, ErrorMessage } from 'vee-validate'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { ToastService } from '../../../services/ToastService'
import { AnalyticsService } from '@/services/AnalyticsService'

const { t } = useI18n()
const store = useTenantStore()

const comment = ref('')

onMounted(() => {
  comment.value = props.document?.documentAnalysisReport?.comment || ''
  if (brokenRules.value.find((r) => r.rule === 'R_RENT_RECEIPT_NB_DOCUMENTS')) {
    AnalyticsService.warningRentReceipts()
  }
})

const props = defineProps<{
  userId?: number
  document?: DfDocument
}>()

const brokenRules = computed(() => {
  return props.document?.documentAnalysisReport?.brokenRules || []
})

function commentAnalysis() {
  const params = {
    documentId: props.document?.id,
    tenantId: props.userId,
    comment: comment.value
  }

  store.commentAnalysis(params).then(() => {
    ToastService.saveSuccess()
  })
}

const isRuleWithCustomText = (rule: string | undefined) =>
  rule &&
  ['R_RENT_RECEIPT_NAME', 'R_RENT_RECEIPT_MONTHS', 'R_RENT_RECEIPT_NB_DOCUMENTS'].includes(rule)
</script>

<style scoped>
.rules-container {
  background-color: #fff5f5;
  border-left: 4px solid var(--background-flat-error);
  font-size: 1.125rem;
  padding: 1rem;
}
</style>

<i18n>
{
  "fr": {
    "prevalidation": {
      "force-message": "Si vous pensez que notre outil fait erreur, vous pouvez expliquer le problème ci-dessous.",
      "R_RENT_RECEIPT_NAME": {
        "p1": "Notre outil ne trouve pas de nom et prénom sur ce document.",
        "p2": "Si notre outil fait erreur (par exemple, si les quittances sont au nom de jeune fille), vous pouvez expliquer le problème ci-dessous."
      },
      "R_RENT_RECEIPT_NB_DOCUMENTS": {
        "p1": "Notre outil ne détecte qu'un seul document. Avez-vous bien fourni 3 dernières quittances ?",
        "p2": "Si notre outil fait erreur (par exemple, si 3 quittances sont réunies sur un seul document), vous pouvez expliquer le problème ci-dessous."
      },
      "R_RENT_RECEIPT_MONTHS": {
        "p1": "Notre outil détecte des quittances trop anciennes.",
        "p2": "Si notre outil fait erreur (par exemple, si une seule quittance correspond à plusieurs mois), vous pouvez expliquer le problème ci-dessous."
      }
    }
  },
  "en": {
    "prevalidation": {
      "force-message": "If you think our tool is making a mistake, you can explain the problem below",
      "R_RENT_RECEIPT_NAME": {
        "p1": "Our tool cannot find a first and last name on this document",
        "p2": "If our tool makes a mistake (for example, if the receipts are in the maiden's name), you can explain the problem below."
      },
      "R_RENT_RECEIPT_NB_DOCUMENTS": {
        "p1": "Our tool detects only one document. Have you provided the last 3 receipts?",
        "p2": "If our tool makes a mistake (for example, if 3 receipts are combined in a single document), you can explain the problem below."
      },
      "R_RENT_RECEIPT_MONTHS": {
        "p1": "Our tool detects receipts that are too old.",
        "p2": "If our tool makes a mistake (for example, if a single receipt covers several months), you can explain the problem below."
      }
    }
  }
}
</i18n>
