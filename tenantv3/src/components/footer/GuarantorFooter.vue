<template>
  <FooterContainer class="guarantor-footer">
    <BackNext
      ref="back-next"
      :show-back="showBack"
      @on-next="nextAction()"
      @on-back="backAction()"
    />
  </FooterContainer>
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

const backNext = useTemplateRef<InstanceType<typeof BackNext>>('back-next')
defineExpose({ button: computed(() => backNext.value?.btnEl) })

function nextAction() {
  emit('on-next')
}

function backAction() {
  emit('on-back')
}
</script>
