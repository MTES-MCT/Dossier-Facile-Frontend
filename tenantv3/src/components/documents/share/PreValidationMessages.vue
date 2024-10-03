<template>
  <div class="rules-container" v-if="brokenRules && brokenRules.length > 0">
    <p class="fr-badge fr-badge--error">{{ t('updatecomponent.invalid') }}</p>
    <div class="fr-mt-3w">
      <div v-for="(b, k) in brokenRules" :key="k">
        <strong>{{ b.message }}</strong>
      </div>
      <div class="form-container fr-mb-3w">
        <Form name="form" @submit="commentAnalysis">
          <FieldLabel for-input="comment">{{ t('updatecomponent.force-message') }}</FieldLabel>
          <Field name="comment" v-model="comment" v-slot="{ field, meta }">
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
          <DfButton class="fr-mt-2w" style="float: right" type="submit" :primary="false">{{
            t('register')
          }}</DfButton>
        </Form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useTenantStore from '../../../stores/tenant-store'
import { Form, Field, ErrorMessage } from 'vee-validate'
import DfButton from 'df-shared-next/src/Button/Button.vue'
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
.declined {
  padding: 1rem 1rem 0.75rem;
  border-radius: 0.25rem;
  background-color: #fce5e7;
  color: #525252;
  line-height: 2;
}

.rules-container {
  background-color: #f5f5fe;
  padding: 1rem;
  padding-bottom: 4rem;
  margin-bottom: 2rem;
}
</style>
