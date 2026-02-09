<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  headingLevel?: 'h2' | 'h3' | 'h4' | 'h5'
  formErrors: Record<string, string>
}
const { headingLevel = 'h3', formErrors } = defineProps<Props>()

const formattedErrors = computed(() => {
  // remove empty errors
  const cleanedErrors = Object.keys(formErrors).filter((key) => formErrors[key]?.length > 0)
  // create an errors Map
  const errorsMap = new Map(
    Object.entries(formErrors).filter(([_key, errors]) => {
      return errors.length > 0
    })
  )

  return { cleanedErrors, errorsMap }
})
</script>

<template>
  <div class="fr-my-4w fr-p-2w error-status" role="group" aria-labelledby="error-summary-title">
    <component :is="headingLevel" id="error-summary-title" tabindex="-1">
      Il y a {{ formattedErrors.errorsMap.size }} erreur<span
        v-if="formattedErrors.errorsMap.size > 1"
        >s</span
      >
      de saisie dans le formulaire.
    </component>
    <ol>
      <li v-for="(error, index) in formattedErrors.cleanedErrors" :key="index" class="error">
        <a :href="`#input-${error}`">{{ formattedErrors.errorsMap.get(error) }}</a>
      </li>
    </ol>
  </div>
</template>
