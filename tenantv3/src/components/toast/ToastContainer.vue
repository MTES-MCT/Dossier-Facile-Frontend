<template>
  <div class="toast-container">
    <TransitionGroup tag="ul" name="toasts" class="toast-list">
      <li v-for="alert of alerts" :key="alert.id">
        <DsfrAlert :type="alert.type" small closeable role="alert" @close="removeToast(alert)">
          <p>{{ alert.label }}</p>
        </DsfrAlert>
      </li>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { DsfrAlert } from '@gouvminint/vue-dsfr'
import { alerts, removeToast } from './toastUtils'
</script>

<style scoped>
.toast-container {
  position: sticky;
  top: 0;
  right: 1rem;
  width: min(22rem, calc(100% - 2rem));
  margin-left: auto;
  z-index: 10000;
}

.toast-list {
  position: absolute;
  top: 1rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0;
  list-style: none;
  width: 100%;
}

.toast-container :deep(.fr-alert) {
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
