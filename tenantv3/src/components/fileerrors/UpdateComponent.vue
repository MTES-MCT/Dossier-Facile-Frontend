<template>
  <div class="update-component">
    <div class="fr-grid-row file-item">
      <p :id class="fr-mb-0"><slot></slot></p>
      <!-- TODO : bouton voir -->
      <DfButton class="update-btn" :aria-describedby="id" @click="$emit('on-update')">
        <span class="desktop">{{ t('fileerrors.update') }}</span>
        <RiPencilLine size="1rem" class="color--primary mobile" aria-hidden="true" />
      </DfButton>
    </div>
    <PreValidationMessages :user-id="userId" :document="document" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { RiPencilLine } from '@remixicon/vue'
import PreValidationMessages from '../documents/share/PreValidationMessages.vue'
import { useId } from 'vue'

defineEmits<{ 'on-update': [] }>()
defineProps<{ userId?: number; document?: DfDocument }>()

const { t } = useI18n()
const id = useId()
</script>

<style scoped>
.update-component {
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
</style>
