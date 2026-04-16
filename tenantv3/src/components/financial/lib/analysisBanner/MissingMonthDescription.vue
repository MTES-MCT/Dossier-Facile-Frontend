<template>
  <div v-for="(month, index) in formattedMissingMonthList" :key="index" class="missing-month-line">
    <VIcon name="ri:information-line" :scale="1.25" color="#000091" />
    <span class="missing-month-text fr-ml-1w">{{ month }}</span>
  </div>
</template>

<script setup lang="ts">
import { VIcon } from '@gouvminint/vue-dsfr'
import { formatYearMonth } from 'df-shared-next/src/services/UtilsService'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    missingMonthList?: string[]
  }>(),
  {
    missingMonthList: () => []
  }
)

const { locale } = useI18n()

const formattedMissingMonthList = computed(() =>
  props.missingMonthList.map((value) => formatYearMonth(value, locale.value))
)
</script>

<style scoped>
.missing-month-line {
  display: flex;
  align-items: flex-start;
}

.missing-month-text {
  font-size: 0.875rem;
  line-height: 1.5rem;
  color: #000091;
}
</style>
