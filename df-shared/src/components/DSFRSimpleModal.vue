<template>
  <div>
    <dialog
      aria-labelledby="fr-modal-title-modal-1"
      role="dialog"
      :id="modalId"
      class="fr-modal"
    >
      <div class="fr-container fr-container--fluid fr-container-md">
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
            <div class="fr-modal__body">
              <div class="fr-modal__header">
                <button
                  class="fr-link--close fr-link"
                  title="Fermer la fenêtre modale"
                  :aria-controls="modalId"
                >
                  Fermer
                </button>
              </div>
              <div class="fr-modal__content">
                <h1 id="fr-modal-title-modal-1" class="fr-modal__title">
                  <slot name="header"
                    ><span style="visibility: hidden">title</span></slot
                  >
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
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Modal extends Vue {
  @Prop({ default: "fr-modal-1" }) modalId?: string;
}
</script>
