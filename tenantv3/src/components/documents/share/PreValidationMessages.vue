<template>
  <div class="rules-container" v-if="brokenRules && brokenRules.length > 0">
    <h5 v-for="(b, k) in brokenRules" :key="k">
      {{ b.message }}
    </h5>
    <div class="form-container">
      <Form name="form" @submit="commentAnalysis">
        <FieldLabel for-input="comment">{{ t('updatecomponent.force-message') }}</FieldLabel>
        <Field
          name="comment"
          v-model="comment"
          v-slot="{ field, meta }"
          :rules="{ required: true }"
        >
          <textarea
            v-bind="field"
            id="comment"
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
          <ErrorMessage name="comment" v-slot="{ message }">
            <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
          </ErrorMessage>
        </Field>
        <DfButton class="fr-mt-2w" type="submit" primary>{{ t('register') }}</DfButton>
      </Form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useTenantStore from '../../../stores/tenant-store'
import { Form, Field, ErrorMessage } from 'vee-validate'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import FieldLabel from 'df-shared-next/src/components/form/FieldLabel.vue'
import { ToastService } from '../../../services/ToastService'

const { t } = useI18n()
const store = useTenantStore()

const comment = ref('')

onMounted(() => {
  comment.value = props.document?.documentAnalysisReport?.comment || ''
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
</script>

<style scoped>
.rules-container {
  background-color: #fff5f5;
  border-left: 4px solid var(--background-flat-error);
  font-size: 1.125rem;
  padding: 1rem;
}
</style>
