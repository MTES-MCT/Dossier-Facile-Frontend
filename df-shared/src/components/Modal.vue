<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div
        class="modal fr-pt-2w"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
      >
        <button
          class="fr-link--close fr-link fr-mr-1w"
          title="Fermer la fenêtre modale"
          aria-label="Fermer la fenêtre modale"
          @click="close()"
          type="button"
        >
          Fermer
        </button>
        <header class="modal-header" id="modalTitle">
          <slot name="header"
            ><span style="visibility: hidden">title</span></slot
          >
        </header>
        <section class="modal-body" id="modalDescription">
          <slot name="body"> </slot>
        </section>
        <!-- TODO add  v-if="!!this.$slots['footer']" -->
        <footer class="modal-footer">
          <slot name="footer"> </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
const emit = defineEmits(["close"]);

function close() {
  emit("close");
}
</script>

<style lang="scss">
.modal-backdrop {
  position: fixed;
  z-index: 10000;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  background-color: rgba(1, 7, 19, 0.5);
}

.modal {
  background-color: #fff;
  position: absolute;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  min-width: 400px;
  max-width: 90%;
  max-height: 98%;
  overflow: auto;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.1),
    0 16px 16px -16px rgba(0, 0, 0, 0.32);
}

.modal-header,
.modal-footer {
  padding: 15px;
  display: flex;
}

.modal-header {
  justify-content: space-between;
}

.modal-footer {
  justify-content: flex-end;
}

.modal-body {
  position: relative;
  padding: 5px 15px 20px 15px;
  overflow: auto;
}
</style>
