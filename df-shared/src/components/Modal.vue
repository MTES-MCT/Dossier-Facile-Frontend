<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div
        class="modal fr-pt-2w"
        role="dialog"
        aria-labelledby="modalTitle"
      >
        <button
          class="fr-link--close fr-link fr-mr-1w"
          :title="$t('modal.close-alt')"
          :aria-label="$t('modal.close-alt')"
          @click="close()"
          type="button"
        >
          {{ $t("modal.close") }}
        </button>
        <header class="modal-header" id="modalTitle" v-if="!!$slots['header']">
          <slot name="header"
            ><span style="visibility: hidden">title</span></slot
          >
        </header>
        <section class="modal-body">
          <slot name="body"> </slot>
        </section>
        <footer class="modal-footer" v-if="!!$slots['footer']">
          <slot name="footer"> </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Modal extends Vue {
  close() {
    this.$emit("close");
  }
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
  position: relative;
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
