<template>
  <BannerIconTextLine
    icon-name="ri:check-line"
    icon-color="#18753c"
    :text="t('expected-description', { name: formattedName })"
    text-class="success-text"
  />
</template>

<script setup lang="ts">
import BannerIconTextLine from '@/components/analysis/BannerIconTextLine.vue'
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
.success-text {
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
