<template>
  <button type="button" :aria-controls="modalId" data-fr-opened="false" v-bind="$attrs">
    <slot name="button"> </slot>
  </button>
  <dialog :id="modalId" :aria-labelledby="titleId" class="fr-modal" :data-cy="testId">
    <div class="fr-container fr-container--fluid fr-container-md">
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12">
          <div class="fr-modal__body">
            <div class="fr-modal__header">
              <button
                class="fr-btn--close fr-btn"
                title="Fermer la fenêtre modale"
                :aria-controls="modalId"
                target="_self"
                type="button"
              >
                Fermer
              </button>
            </div>
            <div class="fr-modal__content">
              <h1 :id="titleId" class="fr-modal__title display--flex align-items--center">
                <RiArrowRightLine />
                <slot name="title"> </slot>
              </h1>
              <slot name="content"> </slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>
<script setup lang="ts">
import { RiArrowRightLine } from '@remixicon/vue'
import { useId } from 'vue'

defineProps<{ testId?: string }>()
const modalId = useId()
const titleId = `${modalId}-title`
</script>

<style scoped>
.fr-container-md {
  margin: auto;
}
</style>
