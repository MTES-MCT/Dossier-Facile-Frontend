<template>
  <div class="v-gouv-fr-modal">
    <a href="#"
      data-rf-opened="false"
      aria-controls="rf-modal-1"
      title="Titre de modal simple (ouvre une fenêtre modale)"
    >
      <slot name="button">
      </slot>
    </a>
    <dialog
      aria-labelledby="rf-modal-title-modal-1"
      role="dialog"
      id="rf-modal-1"
      class="rf-modal"
    >
      <div class="rf-container--fluid rf-container-md">
        <div class="rf-grid-row rf-grid-row--center">
          <div class="rf-col-12 rf-col-md-6">
            <div class="rf-modal__body">
              <div class="rf-modal__header">
                <button
                  class="rf-link--close rf-link"
                  title="Fermer la fenêtre modale"
                  aria-controls="rf-modal-1"
                  target="_self"
                >
                  Fermer
                </button>
              </div>
              <div class="rf-modal__content">
                <h1 id="rf-modal-title-modal-1" class="rf-modal__title">
                  <span class="rf-fi-arrow-right-line rf-fi--lg"></span>
                <slot name="title">
                </slot>
                </h1>
                <slot name="content">
                </slot>
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
/*     const api = window["dsfr"]
    const MODAL_SELECTOR = api.core.ns.selector("modal");
    new window.api.core.Initializer(MODAL_SELECTOR, [api.build$5]); */
  }
};
</script>
