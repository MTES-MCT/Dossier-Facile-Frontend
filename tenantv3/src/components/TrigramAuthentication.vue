<template>
  <DsfrModalPatch
    v-model:is-opened="isModalOpened"
    size="xl"
    :title="t('trigram.title')"
    :can-close="false"
  >
    <div class="trigram-content">
      <DsfrAlert type="info" :title="t('trigram.alert-title')" title-tag="h2" class="fr-mb-3w">
        <p class="fr-text--sm" v-html="t('trigram.alert-description')"></p>
        <p class="fr-text--sm">{{ t('trigram.alert-multiple') }}</p>
      </DsfrAlert>

      <form novalidate @submit.prevent="onSubmit">
        <div class="fr-input-group" :class="{ 'fr-input-group--error': isTrigramInvalid }">
          <DsfrInput
            id="input-trigram"
            ref="inputRefs"
            v-model="trigram"
            :label="t('trigram.title')"
            :label-visible="false"
            label-class="fr-sr-only"
            name="trigram"
            :aria-invalid="isTrigramInvalid ? true : undefined"
            :description-id="isTrigramInvalid ? 'errors-trigram trigram-hint' : 'trigram-hint'"
            type="text"
            autocomplete="off"
            required
            autofocus
            maxlength="3"
            pattern="[A-z]"
          >
            <template #required-tip> ({{ t('field-required') }})</template>
          </DsfrInput>
          <div id="trigram-hint" class="trigram-hint fr-mt-1w">
            <p class="fr-mx-auto fr-my-1w fr-text--sm">
              {{ t('trigram.examples-title') }}<br />
              Sophie <strong>Xu</strong>&nbsp;: <strong>XU</strong><br />
              Angela <strong>Hén</strong>ard&nbsp;: <strong>HEN</strong><br />
              Claude <strong>De R</strong>iva&nbsp;: <strong>DER</strong>
            </p>
          </div>
          <div v-if="submitCount > 0 && isTrigramInvalid" id="errors-trigram">
            <p v-if="errors.trigram" class="fr-error-text">
              {{ errors.trigram }}
            </p>
            <p v-if="hasError" class="fr-error-text">
              {{ t('trigram.error-message') }}
            </p>
          </div>
        </div>
        <DsfrButton type="submit">{{ t('trigram.submit') }}</DsfrButton>
      </form>

      <div class="fr-info-text fr-grid-row fr-grid-row--center">
        <router-link
          to="/contact"
          target="_blank"
          :title="`${t('trigram.support-link')} - ${t('new-window')}`"
        >
          {{ t('trigram.support-link') }}
        </router-link>
      </div>
    </div>
  </DsfrModalPatch>
</template>

<script setup lang="ts">
import { DsfrAlert, DsfrInput, DsfrButton } from '@gouvminint/vue-dsfr'
import { ref, onUnmounted, useTemplateRef, nextTick, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import debounce from 'lodash.debounce'
import DsfrModalPatch from 'df-shared-next/src/components/patches/DsfrModalPatch.vue'
import 'df-shared-next/src/validators/validationRules'
import { configure, useForm } from 'vee-validate'

const { t } = useI18n()

const emit = defineEmits<{
  submit: [trigram: string]
}>()

const hasError = defineModel<boolean>('hasError')
const isModalOpened = ref(true)
const inputRefs = useTemplateRef<HTMLInputElement>('inputRefs')
const isTrigramInvalid = computed(() => errors.value.trigram || hasError.value)

// FORM SETUP
configure({
  bails: false,
  // only validate on submit
  validateOnBlur: false,
  validateOnChange: false,
  validateOnModelUpdate: false,
  // translate fields and errors
  generateMessage: (ctx) => {
    const ruleName = ctx.rule?.name || ''
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params = ctx.rule?.params as any
    const value = Array.isArray(params) ? params[0] : params

    return t(`validation.${ruleName}`, {
      field: t(`fields.${ctx.field}`),
      // map 1st param to value for message interpolation
      [ruleName]: value,
      ...params
    })
  }
})

const { values, handleSubmit, defineField, errors, submitCount } = useForm({
  initialValues: {
    trigram: ''
  },
  validationSchema: {
    trigram: 'required|max:3|alpha'
  },
  validateOnMount: false
})

const onInvalidSubmit = () => {
  // reset server error in favor of client validation error
  hasError.value = false
  inputRefs.value?.focus()
}

const onSuccess = () => {
  // reset server error
  hasError.value = false
  debouncedSubmit(values.trigram)
}

const onSubmit = handleSubmit(onSuccess, onInvalidSubmit)

const [trigram] = defineField('trigram')

const debouncedSubmit = debounce((trigramValue: string) => {
  // Submit when we have at least 1 character (for short names like "O")
  if (trigramValue.length >= 1 && trigramValue.length <= 3) {
    emit('submit', trigramValue)
  }
}, 1000)

// Cancel debounced function on unmount to prevent memory leaks
onUnmounted(() => {
  debouncedSubmit.cancel()
})

// Watch for error to reset inputs and focus
watch(
  () => hasError.value,
  (hasError) => {
    if (hasError) {
      nextTick(() => {
        inputRefs.value?.focus()
      })
    }
  }
)
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
/* Hide close button as this is a blocking authentication modal */
:deep(.fr-btn--close) {
  display: none;
}

:deep(.fr-input-group) {
  max-width: 30ch;
}
:deep(.fr-input) {
  margin-inline: auto;
  padding: 2rem;
  font-size: 2rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1ch;
}
</style>

<i18n lang="json">
{
  "en": {
    "validation": {
      "required": "{field} is required",
      "alpha": "Only letters are allowed",
      "max": "{field} is over {max} characters"
    },
    "fields": {
      "trigram": "The trigram"
    }
  },
  "fr": {
    "validation": {
      "required": "{field} est obligatoire",
      "alpha": "Seules les lettres sont autorisées",
      "max": "{field} limité à {max} caractères"
    },
    "fields": {
      "trigram": "Le trigram"
    }
  }
}
</i18n>
