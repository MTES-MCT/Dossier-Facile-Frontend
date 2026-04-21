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
import dayjs from 'dayjs'
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

const { t, locale } = useI18n()

const currentYearMonth = dayjs().format('YYYY-MM')

const formattedMissingMonthList = computed(() =>
  [...props.missingMonthList].sort().map((value) => {
    const formatted = formatYearMonth(value, locale.value)
    return value === currentYearMonth ? `${formatted} ${t('if-available')}` : formatted
  })
)
</script>

<style scoped>
@import '../../../analysis/analysisBannerLayout.css';
</style>

<i18n lang="json">
{
  "en": {
    "if-available": "(if available)"
  },
  "fr": {
    "if-available": "(si disponible)"
  }
}
</i18n>
