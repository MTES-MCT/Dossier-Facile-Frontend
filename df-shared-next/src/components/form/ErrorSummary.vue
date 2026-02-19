<script lang="ts" setup>
import { DsfrAlert } from '@gouvminint/vue-dsfr'
import { computed, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Props {
  headingLevel?: 'h2' | 'h3' | 'h4' | 'h5'
  formErrors: Record<string, string | undefined>
}
const { headingLevel = 'h3', formErrors } = defineProps<Props>()

const formattedErrors = computed(() => {
  // remove empty errors
  const cleanedErrors = Object.keys(formErrors).filter(
    (key) => formErrors[key] && formErrors[key]?.length > 0
  )
  // create an errors Map
  const errorsMap = new Map(
    Object.entries(formErrors).filter(([_key, errors]) => errors && errors.length > 0)
  )

  return { cleanedErrors, errorsMap }
})

const errorSummary = useTemplateRef('errorSummary')
const summaryTitle = computed(() => {
  const errorNumber = formattedErrors.value.errorsMap.size
  const errorWord = t('error-word', { count: errorNumber })
  const errorMessage = t('error-message', { errorWord })

  return errorMessage
})

const focusTitle = () => {
  errorSummary.value?.$el.focus()
}

defineExpose({ focusTitle })
</script>

<template>
  <DsfrAlert
    ref="errorSummary"
    role="group"
    type="warning"
    small
    class="fr-my-4w"
    aria-labelledby="error-summary-title"
    tabindex="-1"
  >
    <component id="error-summary-title" :is="headingLevel" class="fr-alert__title">
      {{ summaryTitle }}
    </component>
    <ol>
      <li v-for="(error, index) in formattedErrors.cleanedErrors" :key="index">
        <a :href="`#input-${error}`">{{ formattedErrors.errorsMap.get(error) }}</a>
      </li>
    </ol>
  </DsfrAlert>
</template>

<i18n>
{
  "en": {
    "error-message": "{errorWord} found in your form.",
    "error-word": "1 error | {count} errors",
  },
  "fr": {
    "error-message": "Il y a {errorWord} de saisie dans le formulaire.",
    "error-word": "1 erreur | {count} erreurs",
  },
}
</i18n>
