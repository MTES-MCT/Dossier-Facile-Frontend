<template>
  <div class="trigram-modal">
    <div class="trigram-container">
      <h2 class="fr-h5 text-center fr-mb-3w">{{ t('trigram.title') }}</h2>

      <DsfrAlert type="info" small class="fr-mb-3w">
        <p class="fr-mb-0 fr-text--bold">{{ t('trigram.alert-title') }}</p>
        <p class="fr-mb-0 fr-text--sm" v-html="t('trigram.alert-description')"></p>
        <p class="fr-mb-0 fr-text--sm">{{ t('trigram.alert-multiple') }}</p>
      </DsfrAlert>

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
          @input="handleInput(index)"
          @keydown="handleKeydown($event, index)"
          @paste="handlePaste"
        />
      </div>

      <div v-if="hasError" class="fr-error-text text-center fr-mb-3w" role="alert">
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
  </div>
</template>

<script setup lang="ts">
import { DsfrAlert } from '@gouvminint/vue-dsfr'
import { ref, watch, nextTick, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits<{
  submit: [trigram: string]
}>()

const props = defineProps<{
  hasError?: boolean
}>()

const trigram = ref<string[]>(['', '', ''])
const inputRefs = useTemplateRef<HTMLInputElement[]>('inputRefs')

function handleInput(index: number) {
  const value = trigram.value[index]
  
  // Only allow letters
  const cleanedValue = value.replace(/[^a-zA-Z]/g, '').toUpperCase()
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
  if (event.key === 'Backspace' && !trigram.value[index] && index > 0) {
    // Move to previous input on backspace if current is empty
    nextTick(() => {
      inputRefs.value?.[index - 1]?.focus()
    })
  }

  if (event.key === 'Enter') {
    checkAndSubmit()
  }
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault()
  const pastedText = event.clipboardData?.getData('text') || ''
  const letters = pastedText.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 3)
  
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
  const fullTrigram = trigram.value.join('')
  // Submit when we have at least 2 characters (for short names like "Xu")
  if (fullTrigram.length >= 2 && (fullTrigram.length === 3 || trigram.value[2] === '')) {
    // Wait a bit for UX before submitting
    setTimeout(() => {
      const finalTrigram = trigram.value.join('')
      if (finalTrigram.length >= 2) {
        emit('submit', finalTrigram)
      }
    }, 1000)
  }
}

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
.trigram-modal {
  position: fixed;
  z-index: 10000;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  background-color:rgba(1, 7, 19, 0.729);
}

.trigram-container {
  background-color: #fff;
  padding: 2rem;
  border-radius: 0.25rem;
  max-width: min(40rem, 90%);
  width: 100%;
  box-shadow:
    0 8px 16px 0 rgba(0, 0, 0, 0.1),
    0 16px 16px -16px rgba(0, 0, 0, 0.32);
}

.trigram-inputs {
  display: flex;
  justify-content: center;
  gap: 1rem;
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
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-bottom-color: var(--blue-france-sun-113-625);
  }

  &--error {
    border-bottom-color: var(--error-425-625);
    
    &:focus {
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

