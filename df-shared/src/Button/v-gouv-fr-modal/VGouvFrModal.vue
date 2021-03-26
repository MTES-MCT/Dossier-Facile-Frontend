<template>
  <div class="v-gouv-fr-modal">
    <button
      class="rf-btn"
      data-rf-opened="false"
      aria-controls="rf-modal-1"
      title="Titre de modal simple (ouvre une fenêtre modale)"
    >
      Titre de modal simple
    </button>
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
                  <span class="rf-fi-arrow-right-line rf-fi--lg"></span>Titre de
                  la modale
                </h1>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Maecenas varius tortor nibh, sit amet tempor nibh finibus et.
                  Aenean eu enim justo. Vestibulum aliquam hendrerit molestie.
                  Mauris malesuada nisi sit amet augue accumsan tincidunt.
                  Maecenas tincidunt, velit ac porttitor pulvinar, tortor eros
                  facilisis libero, vitae commodo nunc quam et ligula. Ut nec
                  ipsum sapien. Interdum et malesuada fames ac ante ipsum primis
                  in faucibus. Integer id nisi nec nulla luctus lacinia non eu
                  turpis. Etiam in ex imperdiet justo tincidunt egestas. Ut
                  porttitor urna ac augue cursus tincidunt sit amet sed orci.
                </p>
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
  methods: {}
};
</script>
