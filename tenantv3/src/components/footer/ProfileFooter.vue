<template>
  <FooterContainer class="profile-footer">
    <BackNext
      ref="back-next"
      :show-back
      :next-label
      :disabled
      :form-id
      @on-next="nextAction()"
      @on-back="backAction()"
    />
  </FooterContainer>
</template>

<script setup lang="ts">
import FooterContainer from './FooterContainer.vue'
import BackNext from './BackNext.vue'
import { computed, useTemplateRef } from 'vue'

withDefaults(
  defineProps<{
    showBack?: boolean
    disabled?: boolean
    nextLabel?: string
    formId?: string
  }>(),
  {
    showBack: true,
    disabled: false,
    nextLabel: undefined,
    formId: undefined
  }
)

const emit = defineEmits<{ 'on-next': []; 'on-back': [] }>()
const backNext = useTemplateRef<InstanceType<typeof BackNext>>('back-next')
defineExpose({ nextBtn: computed(() => backNext.value?.btnEl) })

function nextAction() {
  emit('on-next')
}

function backAction() {
  emit('on-back')
}
</script>
