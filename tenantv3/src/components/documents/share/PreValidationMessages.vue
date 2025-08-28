<template>
  <div v-if="failedRules && failedRules.length > 0" class="rules-container">
    <template v-for="(b, k) in failedRules" :key="k">
      <h6>{{ b.message }}</h6>
      <template v-if="isRuleWithCustomText(b.rule)">
        <p>{{ t(`prevalidation.${b.rule}.p1`) }}</p>
        <p>{{ t(`prevalidation.${b.rule}.p2`) }}</p>
      </template>
      <p v-else>{{ t('prevalidation.force-message') }}</p>
    </template>
    <div v-if="!isSingleValidationRuleWithoutForm" class="form-container">
      <Form name="form" class="fr-grid-col" @submit="commentAnalysis">
        <Field
          v-slot="{ field, meta }"
          v-model="comment"
          name="comment"
          :rules="{ required: true }"
        >
          <textarea
            v-bind="field"
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
        <DfButton ref="submit-btn" class="fr-mt-2w fr-ml-auto" type="submit" primary>{{
          t('register')
        }}</DfButton>
      </Form>
    </div>
    <DfButton v-else class="fr-mt-2w fr-ml-auto" type="button" primary @click="commentAnalysis">{{
      customRegisterButtonLabel
    }}</DfButton>
  </div>
</template>
<script setup lang="ts">
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTenantStore } from '../../../stores/tenant-store'
import { Form, Field, ErrorMessage } from 'vee-validate'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { toast } from '@/components/toast/toastUtils'

const { t } = useI18n()
const store = useTenantStore()

const comment = ref('')
const submitButton = useTemplateRef('submit-btn')

onMounted(() => {
  comment.value = props.document?.documentAnalysisReport?.comment || ''
  if (failedRules.value.find((r) => r.rule === 'R_RENT_RECEIPT_NB_DOCUMENTS')) {
    AnalyticsService.warningRentReceipts()
  }
})

const props = defineProps<{
  userId?: number
  document?: DfDocument
}>()

const isSingleValidationRuleWithoutForm = computed(() => {
  return failedRules.value.length === 1 && failedRules.value[0].rule === 'R_BLURRY_FILE'
})

const customRegisterButtonLabel = computed(() =>
  isSingleValidationRuleWithoutForm.value ? t(`register.${failedRules.value[0].rule}`) : ''
)

const failedRules = computed(() => {
  return props.document?.documentAnalysisReport?.failedRules || []
})

function commentAnalysis() {
  const params = {
    documentId: props.document?.id,
    tenantId: props.userId,
    comment: isSingleValidationRuleWithoutForm.value
      ? 'Je certifie que le document est lisible'
      : comment.value
  }

  store.commentAnalysis(params).then(() => {
    toast.success(t('save-success'), submitButton.value?.button)
  })
}

const isRuleWithCustomText = (rule: string | undefined) =>
  rule &&
  [
    'R_RENT_RECEIPT_NAME',
    'R_RENT_RECEIPT_MONTHS',
    'R_RENT_RECEIPT_NB_DOCUMENTS',
    'R_BLURRY_FILE'
  ].includes(rule)
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
      },
      "R_BLURRY_FILE": {
        "p1": "Notre système a détecté un flou qui pourrait empêcher la validation de votre document par notre équipe.",
        "p2": "Si vous le jugez suffisamment lisible, validez-le. Sinon veuillez le remplacer."
      }
    },
    "register": {
      "R_BLURRY_FILE": "Valider ce document comme lisible",
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
      },
      "R_BLURRY_FILE": {
        "p1": "Our system has detected a blur that could prevent your document from being validated by our team.",
        "p2": "If you consider it sufficiently readable, validate it. Otherwise, please replace it.",
      },
    },
    "register": {
      "R_BLURRY_FILE": "Validate this document as readable",
    }
  }
}
</i18n>
