<template>
  <BannerIconTextLine
    v-for="(month, index) in formattedMissingMonthList"
    :key="index"
    icon-name="ri:information-line"
    icon-color="#000091"
    :text="month"
    text-class="missing-month-text"
  />
</template>

<script setup lang="ts">
import BannerIconTextLine from '@/components/analysis/BannerIconTextLine.vue'
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
@import '../../../analysis/analysisBannerLayout.css';
</style>
