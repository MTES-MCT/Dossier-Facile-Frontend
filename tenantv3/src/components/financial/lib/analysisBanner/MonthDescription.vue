<template>
  <BannerIconTextLine
    icon-name="ri:check-line"
    icon-color="#18753c"
    :text="t('expected-description')"
    text-class="success-text"
  />
  <ul v-if="formattedExpectedMonthList.length > 0" class="expected-month-list">
    <li v-for="(month, index) in formattedExpectedMonthList" :key="index" class="expected-month">
      {{ month }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import BannerIconTextLine from '@/components/analysis/BannerIconTextLine.vue'
import { formatYearMonth } from 'df-shared-next/src/services/UtilsService'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    expectedMonthList?: string[]
  }>(),
  {
    expectedMonthList: () => []
  }
)

const { t, locale } = useI18n()

const formattedExpectedMonthList = computed(() =>
  props.expectedMonthList.map((value) => formatYearMonth(value, locale.value))
)
</script>

<style scoped>
.success-text {
  color: #18753c;
}

.expected-month-list {
  margin: 0 0 0 1rem;
  list-style: none;
  padding-left: 0;
}

.expected-month {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5rem;
  margin-left: 1rem;
  color: #18753c;
}

.expected-month-list > .expected-month::marker {
  content: none;
}

.expected-month::before {
  content: '•';
  font-size: 1.25rem;
  line-height: 1;
  color: #18753c;
}
</style>

<i18n lang="json">
{
  "en": {
    "expected-description": "Three pay slips among the following months: "
  },
  "fr": {
    "expected-description": "Trois bulletins de salaire parmi les mois suivants : "
  }
}
</i18n>
