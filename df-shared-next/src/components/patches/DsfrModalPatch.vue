<script lang="ts" setup>
/**
 * This is a patched modal component from vue-dsfr.
 * The original DsfrModal is not usable in this project.
 * The 'opened' props is used to trigger a lot of things at once,
 * which causes a delay in applying/updating properties here.
 * This component is simplified and more accessible.
 * I kept the original template for consistency with the doc.
 */

import type { DsfrModalProps } from '@gouvminint/vue-dsfr'
import { DsfrButtonGroup, useRandomId, VIcon } from '@gouvminint/vue-dsfr'

import { computed, onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'

const props = withDefaults(defineProps<DsfrModalProps>(), {
  modalId: () => useRandomId('modal', 'dialog'),
  actions: () => [],
  origin: () => ({ focus() {} }),
  icon: undefined,
  size: 'md',
  closeButtonLabel: 'Fermer'
})

/**
 * @model v-model:is-opened - A boolean ref representing the open/close status in the parent
 */
const isOpened = defineModel<boolean>('isOpened', { default: false })

defineSlots<{
  /**
   * Slot par défaut pour le contenu de la modale.
   * Sera dans `<div class="fr-modal__content">`
   */
  default: () => unknown
  /**
   * Slot pour le pied-de-page de la modale.
   * Sera dans `<div class="fr-modal__footer">`
   */
  footer?: () => unknown
}>()

const role = computed(() => {
  return props.isAlert ? 'alertdialog' : 'dialog'
})

const modal = useTemplateRef('modal')

watch(
  () => isOpened.value,
  (newValue) => {
    if (newValue) {
      modal.value?.showModal()
    }
    setAppropriateClassOnBody(newValue)
  }
)

function setAppropriateClassOnBody(on: boolean) {
  if (globalThis.window !== undefined) {
    document.body.classList.toggle('modal-open', on)
  }
}

onMounted(() => {
  // check if modal is opened by default
  if (isOpened.value) {
    modal.value?.showModal()
  }
  setAppropriateClassOnBody(isOpened.value)
})

onBeforeUnmount(() => {
  setAppropriateClassOnBody(false)
})

const close = () => {
  modal.value?.close()
  isOpened.value = false
}

const dsfrIcon = computed(() => typeof props.icon === 'string' && props.icon.startsWith('fr-icon-'))
const defaultScale = 2
const iconProps = computed(() => {
  if (dsfrIcon.value) return undefined

  if (typeof props.icon === 'string') {
    return { name: props.icon, scale: defaultScale }
  }

  if (props.icon && typeof props.icon === 'object') {
    return { scale: defaultScale, ...(props.icon as Record<string, unknown>) }
  }

  return undefined
})
</script>

<template>
  <dialog
    :id="modalId"
    ref="modal"
    :aria-labelledby="`${modalId}-title`"
    :role="role"
    class="fr-modal--patched"
    @cancel="close"
  >
    <div class="fr-container fr-container--fluid fr-container-md">
      <div class="fr-grid-row fr-grid-row--center">
        <div
          class="fr-col-12"
          :class="{
            'fr-col-md-8': size === 'lg',
            'fr-col-md-6': size === 'md',
            'fr-col-md-4': size === 'sm'
          }"
        >
          <div class="fr-modal__body">
            <div class="fr-modal__header">
              <button ref="closeBtn" class="fr-btn fr-btn--close" type="button" @click="close">
                <span>
                  {{ closeButtonLabel }}
                </span>
              </button>
            </div>
            <div class="fr-modal__content">
              <h1 :id="`${modalId}-title`" class="fr-modal__title">
                <span
                  v-if="dsfrIcon || iconProps"
                  :class="{
                    [String(icon)]: dsfrIcon
                  }"
                >
                  <VIcon v-if="icon && iconProps" v-bind="iconProps" />
                </span>
                {{ title }}
              </h1>
              <slot />
            </div>
            <div v-if="actions?.length || $slots.footer" class="fr-modal__footer">
              <slot name="footer" />
              <DsfrButtonGroup
                v-if="actions?.length"
                align="right"
                :buttons="actions"
                inline-layout-when="large"
                reverse
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.fr-modal--patched {
  padding: 0;
  color: var(--text-default-grey);
  background-color: transparent;
  border: none;
  opacity: 0;
  transition:
    opacity 0.3s,
    visibility 0.3s;
  visibility: hidden;
  z-index: 1750;
}
.fr-modal--patched[open] {
  opacity: 1;
  transition:
    opacity 0.3s,
    visibility 0.3s;
  visibility: visible;
}
.fr-modal--patched::backdrop {
  background-color: hsla(0, 0%, 9%, 0.64);
}
:global(body.modal-open) {
  overflow: hidden;
}
</style>
