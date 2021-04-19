<template>
  <div class="v-gouv-fr-modal">
    <a
      href="#"
      class="fr-link"
      data-fr-opened="false"
      aria-controls="fr-modal-1"
      title="Titre de modal simple (ouvre une fenêtre modale)"
    >
      <slot name="button"> </slot>
    </a>
    <dialog
      aria-labelledby="fr-modal-title-modal-1"
      role="dialog"
      id="fr-modal-1"
      class="fr-modal"
    >
      <div class="fr-container--fluid fr-container-md">
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12 fr-col-md-6">
            <div class="fr-modal__body">
              <div class="fr-modal__header">
                <button
                  class="fr-link--close fr-link"
                  title="Fermer la fenêtre modale"
                  aria-controls="fr-modal-1"
                  target="_self"
                >
                  Fermer
                </button>
              </div>
              <div class="fr-modal__content">
                <h1 id="fr-modal-title-modal-1" class="fr-modal__title">
                  <span class="fr-fi-arrow-right-line fr-fi--lg"></span>
                  <slot name="title"> </slot>
                </h1>
                <slot name="content"> </slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  </div>
</template>
<script>
export default {
  name: "v-gouv-fr-modal",
  props: {},
  computed: {},
  methods: {},
  mounted: function() {
    window["dsfr"].Modal.build(document);
  }
};
</script>
