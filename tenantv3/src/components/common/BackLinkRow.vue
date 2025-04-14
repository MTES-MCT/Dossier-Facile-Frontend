<template>
  <p class="display--flex align-items--center">
    <RiCheckboxCircleLine color="var(--primary)" size="20px" class="fr-mr-1w no-shrink" />
    <span>{{ label }}</span>
    <DfButton tertiary-no-outline class="fr-ml-auto" :disabled="disabled" @click="$emit('click')">
      {{ t('edit') }} <RiArrowGoBackLine size="1rem" class="fr-ml-1w" />
    </DfButton>
    <slot></slot>
  </p>
</template>

<script setup lang="ts">
import { RiArrowGoBackLine, RiCheckboxCircleLine } from '@remixicon/vue'
import { useI18n } from 'vue-i18n'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'

const { label, disabled = false } = defineProps<{
  label: string
  disabled?: boolean
}>()

defineEmits<{ click: [] }>()
const { t } = useI18n()
</script>

<style scoped>
.no-shrink {
  flex-shrink: 0;
}
</style>

<i18n>
{
  "en": {
    "edit": "Edit",
  },
  "fr": {
    "edit": "Modifier",
  }
}
</i18n>
