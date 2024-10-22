<template>
  <div class="update-component">
    <div class="fr-grid-row file-item">
      <div>
        <slot></slot>
      </div>
      <!-- TODO : bouton voir -->
      <DfButton class="update-btn" @on-click="update">
        <span class="desktop">{{ t('fileerrors.update') }}</span>
        <i class="color--primary ri-pencil-line fs-16 mobile"></i>
      </DfButton>
    </div>
    <div class="rules-container" v-if="brokenRules && brokenRules.length > 0">
      <p class="fr-badge fr-badge--error">{{ t('updatecomponent.invalid') }}</p>
      <p class="fr-mt-3w"></p>
      <div v-for="(b, k) in brokenRules" :key="k">
        <strong>{{ b.message }}</strong>
      </div>
      <div class="form-container fr-mb-3w">
        <Form name="form" @submit="commentAnalysis">
          <FieldLabel for-input="comment">{{ t('updatecomponent.force-message') }}</FieldLabel>
          <Field
            name="comment"
            v-model="comment"
            v-slot="{ field, meta }"
            :rules="{
              required: true
            }"
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
          <DfButton class="fr-mt-2w" style="float: right" type="submit" :primary="false">{{
            t('register')
          }}</DfButton>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DfButton from 'df-shared-next/src/Button/Button.vue'
import useTenantStore from '../../stores/tenant-store'
import { Form, Field, ErrorMessage } from 'vee-validate'
import FieldLabel from 'df-shared-next/src/components/form/FieldLabel.vue'
import { computed, ref } from 'vue'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
const { t } = useI18n()

const emit = defineEmits(['on-update'])
const store = useTenantStore()

const props = defineProps<{
  userId?: number
  document?: DfDocument
}>()

const comment = ref('')

const brokenRules = computed(() => {
  return props.document?.documentAnalysisReport?.brokenRules || []
})

function update() {
  emit('on-update')
}

function commentAnalysis() {
  const params = {
    documentId: props.document?.id,
    tenantId: props.userId,
    comment: comment.value
  }
  store.commentAnalysis(params)
}
</script>

<style>
.update-component {
  background-color: var(--g200);
  padding: 1rem;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: nowrap;
}

.update-btn {
  @media all and (min-width: 768px) {
    min-width: 150px;
    justify-content: center;
  }

  @media all and (max-width: 767px) {
    padding: 0.5rem;
    min-height: 1rem;
    line-height: 1rem;
  }
}

.rules-container {
  margin-top: 1.5rem;
  padding: 1rem;
  border: 1px solid #b34000;
  background-color: white;
}

.form-container {
  display: flex;
  flex-direction: column;
}
</style>
