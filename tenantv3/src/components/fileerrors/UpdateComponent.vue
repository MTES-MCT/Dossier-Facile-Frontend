<template>
  <div class="update-component">
    <div class="fr-grid-row file-item">
      <div><slot></slot></div>
      <!-- TODO : bouton voir -->
      <DfButton class="update-btn" @on-click="update">
        <span class="desktop">{{ t("fileerrors.update") }}</span>
        <i class="color--primary ri-pencil-line fs-16 mobile"></i>
      </DfButton>
    </div>
    <div class="rules-container" v-if="brokenRules && brokenRules.length > 0">
      <p class="fr-badge fr-badge--error">{{ t("updatecomponent.invalid") }}</p>
      <p class="fr-mt-3w">
        <div v-for="(b, k) in brokenRules" :key="k">
          <strong>{{ b.message }}</strong>
        </div>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import DfButton from "df-shared-next/src/Button/Button.vue";
import { DocumentBrokenRule } from "df-shared-next/src/models/DocumentBrokenRule";
const { t } = useI18n();

const emit = defineEmits(["on-update"]);

const props = defineProps<{
  brokenRules?: DocumentBrokenRule[];
}>();

function update() {
  emit("on-update");
}
</script>

<style>
.update-component {
  background-color: var(--g200);
  padding: 1rem;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: nowrap;
}

.update-btn {
  @media all and (min-width: 768px) {
    min-width: 150px;
    justify-content: center;
  }
  @media all and (max-width: 767px) {
    padding: 0.5rem;
    min-height: 1rem;
    line-height: 1rem;
  }
}

.rules-container {
  margin-top: 1.5rem;
  padding: 1rem;
  border: 1px solid #b34000;
  background-color: white;
}
</style>
