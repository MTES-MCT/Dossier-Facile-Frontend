<template>
  <div>
    <dialog :id="modalId" :aria-labelledby="titleId" class="fr-modal">
      <div class="fr-container fr-container--fluid fr-container-md">
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
            <div class="fr-modal__body">
              <div class="fr-modal__header">
                <button
                  type="button"
                  class="fr-link--close fr-link"
                  title="Fermer la fenêtre modale"
                  :aria-controls="modalId"
                >
                  Fermer
                </button>
              </div>
              <div class="fr-modal__content">
                <h1 :id="titleId" class="fr-modal__title">
                  <slot name="header"><span style="visibility: hidden">title</span></slot>
                </h1>
                <slot name="body"> </slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  modalId: string
}>()
const titleId = `${props.modalId}-title`
</script>
