<!-- Deprectated: This component is deprecated and should not be used for new development. It may be removed in a future release. Please use the AnalysisFooter component instead, which has a similar structure and functionality but is more generic and can be used across different contexts, not just for tax-related steps. -->

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
import { computed, useTemplateRef } from 'vue'
import BackNext from './BackNext.vue'
import FooterContainer from './FooterContainer.vue'

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

const backNext = useTemplateRef<InstanceType<typeof BackNext>>('back-next')
defineExpose({ button: computed(() => backNext.value?.btnEl) })

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
