<template>
  <ModalComponent @close="handleClose">
    <template #header>
      <h2 class="fr-h5 text-center fr-mb-0">{{ t('trigram.title') }}</h2>
    </template>
    <template #body>
      <div class="trigram-content">
        <DsfrAlert type="info" small class="fr-mb-3w">
          <p class="fr-mb-0 fr-text--bold">{{ t('trigram.alert-title') }}</p>
          <p class="fr-mb-0 fr-text--sm" v-html="t('trigram.alert-description')"></p>
          <p class="fr-mb-0 fr-text--sm">{{ t('trigram.alert-multiple') }}</p>
        </DsfrAlert>

        <fieldset class="trigram-fieldset">
          <legend class="sr-only">{{ t('trigram.title') }}</legend>
          <div class="trigram-inputs fr-mb-2w">
            <input
              v-for="(_, index) in 3"
              :key="index"
              ref="inputRefs"
              v-model="trigram[index]"
              type="text"
              maxlength="1"
              class="trigram-input"
              :class="{ 'trigram-input--error': hasError }"
              :aria-label="t('trigram.letter-label', [index + 1])"
              :aria-invalid="hasError"
              :aria-describedby="hasError ? errorMessageId : undefined"
              :aria-required="true"
              autocomplete="off"
              @input="handleInput(index)"
              @keydown="handleKeydown($event, index)"
              @paste="handlePaste"
            />
          </div>
        </fieldset>

        <div
          v-if="hasError"
          :id="errorMessageId"
          class="fr-error-text text-center fr-mb-3w"
          role="alert"
          aria-live="polite"
        >
          {{ t('trigram.error-message') }}
        </div>

        <div class="examples fr-mb-3w">
          <p class="fr-mb-1w text-center">{{ t('trigram.examples-title') }}</p>
          <p class="fr-mb-0 text-center">
            Angela <strong>Hén</strong>ard : <strong>HEN</strong>
          </p>
          <p class="fr-mb-0 text-center">
            Sophie <strong>Xu</strong> : <strong>XU</strong>
          </p>
          <p class="fr-mb-0 text-center">
            Claude <strong>De R</strong>iva : <strong>DER</strong>
          </p>
        </div>

        <div class="fr-info-text fr-grid-row fr-grid-row--center">
          <a
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
            :title="`${t('trigram.support-link')} - ${t('new-window')}`"
          >
            {{ t('trigram.support-link') }}
          </a>
        </div>
      </div>
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
import { DsfrAlert } from '@gouvminint/vue-dsfr'
import { ref, watch, nextTick, useTemplateRef, onMounted, onUnmounted, useId } from 'vue'
import { useI18n } from 'vue-i18n'
import debounce from 'lodash.debounce'
import ModalComponent from 'df-shared-next/src/components/ModalComponent.vue'

const { t } = useI18n()

const emit = defineEmits<{
  submit: [trigram: string]
}>()

const props = defineProps<{
  hasError?: boolean
}>()

// Handle close event - but don't allow closing as this is a blocking modal
function handleClose() {
  // Modal is blocking, so we don't emit close event
  // The parent component controls visibility via v-if
}

const trigram = ref<string[]>(['', '', ''])
const inputRefs = useTemplateRef<HTMLInputElement[]>('inputRefs')
const errorMessageId = useId()

function handleInput(index: number) {
  const value = trigram.value[index]
  
  // Only allow letters
  const cleanedValue = value.replaceAll(/[^a-zA-Z]/g, '').toUpperCase()
  trigram.value[index] = cleanedValue

  if (cleanedValue && index < 2) {
    // Move to next input
    nextTick(() => {
      inputRefs.value?.[index + 1]?.focus()
    })
  }

  // Check if all inputs are filled
  checkAndSubmit()
}

function handleKeydown(event: KeyboardEvent, index: number) {
  // Handle Backspace: move to previous input if current is empty
  if (event.key === 'Backspace' && !trigram.value[index] && index > 0) {
    event.preventDefault()
    nextTick(() => {
      inputRefs.value?.[index - 1]?.focus()
    })
  }

  // Handle ArrowLeft: move to previous input
  if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault()
    nextTick(() => {
      inputRefs.value?.[index - 1]?.focus()
    })
  }

  // Handle ArrowRight: move to next input
  if (event.key === 'ArrowRight' && index < 2) {
    event.preventDefault()
    nextTick(() => {
      inputRefs.value?.[index + 1]?.focus()
    })
  }

  // Handle Enter: submit if all fields are filled
  if (event.key === 'Enter') {
    event.preventDefault()
    checkAndSubmit()
  }
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault()
  const pastedText = event.clipboardData?.getData('text') || ''
  const letters = pastedText.replaceAll(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 3)
  
  for (let i = 0; i < 3; i++) {
    trigram.value[i] = letters[i] || ''
  }

  // Focus on the last filled input or the first empty one
  nextTick(() => {
    const lastFilledIndex = letters.length - 1
    const focusIndex = Math.min(lastFilledIndex + 1, 2)
    inputRefs.value?.[focusIndex]?.focus()
  })

  checkAndSubmit()
}

function checkAndSubmit() {
  debouncedSubmit(trigram.value.join(''))
}

const debouncedSubmit = debounce((trigramValue: string) => {
  // Submit when we have at least 2 characters (for short names like "Xu")
  if (trigramValue.length >= 2 && (trigramValue.length === 3 || trigram.value[2] === '')) {
    emit('submit', trigramValue)
  }
}, 1000)

// Focus on first input when component is mounted (RGAA: focus initial)
onMounted(() => {
  nextTick(() => {
    inputRefs.value?.[0]?.focus()
  })
})

// Cancel debounced function on unmount to prevent memory leaks
onUnmounted(() => {
  debouncedSubmit.cancel()
})

// Watch for error to reset inputs and focus (only for 3-letter trigrams)
watch(
  () => props.hasError,
  (hasError) => {
    if (hasError) {
      const currentLength = trigram.value.join('').length
      // Only reset if trigram was 3 characters (for short names like "XU", keep the value)
      if (currentLength === 3) {
        trigram.value = ['', '', '']
        nextTick(() => {
          inputRefs.value?.[0]?.focus()
        })
      }
    }
  }
)
</script>

<style scoped lang="scss">
// Override modal max-width to match original design
:deep(.modal) {
  max-width: min(40rem, 90%);
}

// Hide close button as this is a blocking authentication modal
:deep(.fr-btn--close) {
  display: none;
}

.trigram-content {
  padding: 1rem;
}

.trigram-inputs {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.trigram-fieldset {
  border: none;
  padding: 0;
  margin: 0;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.trigram-input {
  width: 4rem;
  height: 5rem;
  font-size: 2rem;
  text-align: center;
  text-transform: uppercase;
  border: none;
  border-bottom: 3px solid var(--grey-625-425);
  background-color: var(--background-alt-grey);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  // Focus visible - utiliser outline ou box-shadow avec contraste suffisant
  &:focus {
    outline: 2px solid var(--blue-france-sun-113-625);
    outline-offset: 2px;
    border-bottom-color: var(--blue-france-sun-113-625);
  }

  // Focus visible en mode clavier uniquement (pas au clic)
  &:focus-visible {
    outline: 2px solid var(--blue-france-sun-113-625);
    outline-offset: 2px;
    border-bottom-color: var(--blue-france-sun-113-625);
  }

  &--error {
    border-bottom-color: var(--error-425-625);
    
    &:focus,
    &:focus-visible {
      outline-color: var(--error-425-625);
      border-bottom-color: var(--error-425-625);
    }
  }
}

.examples {
  font-size: 0.875rem;
}

.fr-error-text {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

