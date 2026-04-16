<template>
  <div class="expected-description">
    <VIcon name="ri:check-line" :scale="1.25" color="#18753c" />
    <span class="success-text fr-ml-1w">{{
      t('expected-description', { name: formattedName })
    }}</span>
  </div>
</template>

<script setup lang="ts">
import { VIcon } from '@gouvminint/vue-dsfr'
import type { PayslipNameMatchRuleData } from 'df-shared-next/src/models/DocumentRule'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  expectedName?: PayslipNameMatchRuleData['expectedName']
}>()

const { t } = useI18n()

const formattedName = computed(() => {
  const firstNames = props.expectedName?.firstNames ?? ''
  const lastName = props.expectedName?.lastName ?? ''
  return `${firstNames} ${lastName}`.trim()
})
</script>

<style scoped>
.expected-description {
  display: flex;
  align-items: flex-start;
}

.success-text {
  font-size: 0.875rem;
  line-height: 1.5rem;
  color: #18753c;
}
</style>

<i18n lang="json">
{
  "en": {
    "expected-description": "Pay slips in the name of: {name}"
  },
  "fr": {
    "expected-description": "Bulletins de salaire au nom de : {name}"
  }
}
</i18n>
