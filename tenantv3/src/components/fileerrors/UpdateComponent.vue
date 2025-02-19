<template>
  <div class="update-component">
    <div class="fr-grid-row file-item">
      <div>
        <slot></slot>
      </div>
      <!-- TODO : bouton voir -->
      <DfButton class="update-btn" @click="$emit('on-update')">
        <span class="desktop">{{ t('fileerrors.update') }}</span>
        <RiPencilLine size="1rem" class="color--primary mobile" />
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
const { t } = useI18n()

defineEmits<{ 'on-update': [] }>()
defineProps<{ userId?: number; document?: DfDocument }>()
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
