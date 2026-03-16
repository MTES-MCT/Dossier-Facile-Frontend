<template>
  <div>
    <FooterContainer>
      <BackNext
        ref="back-next"
        :show-back="showBack"
        :aria-disabled="nextDisabled || undefined"
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

const props = withDefaults(
  defineProps<{
    showBack?: boolean
    nextDisabled?: boolean
    beforeSubmit?: () => boolean
  }>(),
  {
    showBack: true,
    beforeSubmit: undefined
  }
)

const backNext = useTemplateRef('back-next')
defineExpose({ button: computed(() => backNext.value?.nextBtn?.button) })

function nextAction() {
  if (props.beforeSubmit && !props.beforeSubmit()) {
    return
  }
  emit('on-next')
}

function backAction() {
  emit('on-back')
}
</script>
