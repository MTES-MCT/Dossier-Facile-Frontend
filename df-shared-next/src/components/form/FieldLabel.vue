<template>
  <label class="fr-label" :for="props.forInput">
    <slot></slot>
    <span v-if="props.required"> ({{ t('required') }})</span>
    <span v-else> ({{ t('optional') }})</span>
    <span>&nbsp;:</span>
  </label>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    required?: boolean
    forInput?: string
  }>(),
  {
    required: false,
    forInput: undefined
  }
)
const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "required" : "required",
		"optional": "optional"
  },
  "fr": {
    "required" : "obligatoire",
		"optional": "facultatif"
  }
}
</i18n>
