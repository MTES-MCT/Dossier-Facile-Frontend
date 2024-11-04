<template>
  <div>
    <div class="fr-grid-row space-around fr-mb-1w footer-btn">
      <slot name="additionalButton" v-if="isMobile()"></slot>
    </div>
    <div class="fr-grid-row btn-spacing footer-btn">
      <v-gouv-fr-button
        v-if="showBack"
        class="fr-mr-2w px40"
        :secondary="true"
        :btn-type="'button'"
        @click="backAction()"
        :aria-label="t('backnext.back')"
      >
        <RiArrowLeftSLine size="1rem" class="color--primary mobile no-shrink" />
        <span class="desktop">{{ t('backnext.back') }}</span>
      </v-gouv-fr-button>
      <div v-if="!showBack"></div>
      <div class="fr-grid-row flex-1">
        <slot name="additionalButton" v-if="!isMobile()"></slot>
        <v-gouv-fr-button
          class="next-btn"
          :secondary="false"
          :label="nextLabel ? nextLabel : t('backnext.continue')"
          :btn-type="'submit'"
          :disabled="disabled"
          @click="nextAction()"
          :aria-label="t('backnext.continue-aria-label')"
        ></v-gouv-fr-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VGouvFrButton from 'df-shared-next/src/Button/v-gouv-fr-button/VGouvFrButton.vue'
import { UtilsService } from '../../services/UtilsService'
import { useI18n } from 'vue-i18n'
import { RiArrowLeftSLine } from '@remixicon/vue'

const { t } = useI18n()

withDefaults(defineProps<{ showBack?: boolean; disabled?: boolean; nextLabel?: string }>(), {
  showBack: true,
  disabled: false
})

const emit = defineEmits<{ 'on-back': []; 'on-next': [] }>()

function isMobile() {
  return UtilsService.isMobile()
}

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
