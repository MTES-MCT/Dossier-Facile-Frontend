<template>
  <div class="expected-description">
    <VIcon name="ri:check-line" :scale="1.25" color="#18753c" />
    <span class="success-text fr-ml-1w">{{ t('expected-description') }}</span>
  </div>
  <ul v-if="formattedExpectedMonthList.length > 0" class="expected-month-list">
    <li v-for="(month, index) in formattedExpectedMonthList" :key="index" class="expected-month">
      {{ month }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { VIcon } from '@gouvminint/vue-dsfr'
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
.expected-description {
  display: flex;
  align-items: flex-start;
}

.success-text {
  font-size: 0.875rem;
  line-height: 1.5rem;
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
