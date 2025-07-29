<template>
  <div>
    <FooterContainer>
      <BackNext
        ref="back-next"
        :show-back="showBack"
        @on-next="nextAction()"
        @on-back="backAction()"
      >
      </BackNext>
    </FooterContainer>
  </div>
</template>

<script setup lang="ts">
import FooterContainer from './FooterContainer.vue'
import BackNext from './BackNext.vue'
import { computed, useTemplateRef } from 'vue'

const emit = defineEmits<{ 'on-next': []; 'on-back': [] }>()

withDefaults(
  defineProps<{
    showBack?: boolean
  }>(),
  {
    showBack: true
  }
)

const backNext = useTemplateRef('back-next')
defineExpose({ button: computed(() => backNext.value?.nextBtn?.button) })

function nextAction() {
  emit('on-next')
}

function backAction() {
  emit('on-back')
}
</script>
