<template>
  <TransitionGroup tag="ul" name="toasts" class="toast-container">
    <li v-for="alert of alerts" :key="alert.id">
      <DsfrAlert :type="alert.type" small closeable role="alert" @close="removeToast(alert)">
        <p>{{ alert.label }}</p>
      </DsfrAlert>
    </li>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { DsfrAlert } from '@gouvminint/vue-dsfr'
import { alerts, removeToast } from './toastUtils'
</script>

<style scoped>
.toast-container {
  position: absolute;
  top: 0;
  right: 0;
  margin: 0;
  width: 22rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  list-style: none;
  z-index: 10000;
}

.toast-container > li {
  width: 20rem;
}

.toast-container .fr-alert {
  box-shadow: 0 1px 3px 0 #0000001a;
  background-color: white;
}

.toasts-enter-active,
.toasts-leave-active {
  transition: all 0.5s ease;
}

.toasts-enter-from,
.toasts-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
