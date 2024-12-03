<template>
  <div>
    <div class="fr-grid-row btn-spacing footer-btn">
      <VGouvFrButton
        v-if="showBack"
        class="fr-mr-2w px40"
        :secondary="true"
        :btn-type="'button'"
        @click="backAction()"
        :aria-label="t('backnext.back-aria-label')"
      >
        <RiArrowLeftSLine size="1rem" class="color--primary mobile no-shrink" />
        <span class="desktop">{{ t('backnext.back') }}</span>
      </VGouvFrButton>
      <div v-if="!showBack"></div>
      <div class="fr-grid-row flex-1">
        <VGouvFrButton
          class="next-btn"
          :secondary="false"
          :label="nextLabel ? nextLabel : t('backnext.continue')"
          :btn-type="'submit'"
          :disabled="disabled"
          @click="nextAction()"
          :aria-label="t('backnext.continue-aria-label')"
        ></VGouvFrButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VGouvFrButton from 'df-shared-next/src/Button/VGouvFrButton.vue'
import { useI18n } from 'vue-i18n'
import { withDefaults } from 'vue'
import { RiArrowLeftSLine } from '@remixicon/vue'

withDefaults(
  defineProps<{
    showBack?: boolean
    disabled?: boolean
    nextLabel?: string
  }>(),
  {
    showBack: true,
    disabled: false,
    nextLabel: ''
  }
)

const emit = defineEmits<{ 'on-back': []; 'on-next': [] }>()

const { t } = useI18n()

function backAction() {
  emit('on-back')
}

function nextAction() {
  emit('on-next')
}
</script>

<style lang="scss" scoped>
.btn-spacing {
  @media (min-width: 768px) {
    justify-content: space-around;
  }
}

.next-btn {
  @media (min-width: 769px) {
    margin-left: 16px !important;
  }
}

.flex-1 {
  @media (max-width: 768px) {
    max-width: 400px;
    flex: 1;
  }
}

.px40 {
  @media (max-width: 768px) {
    width: 40px !important;
  }
}

.no-shrink {
  flex-shrink: 0;
}
</style>

<style lang="scss">
.footer-btn .fr-btn {
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
}

.footer-btn .v-gouv-fr-button {
  @media (max-width: 768px) {
    width: 100%;
  }
}
</style>
