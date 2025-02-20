<template>
  <div>
    <FooterContainer>
      <BackNext
        :show-back="showBack"
        :next-label="nextLabel"
        :disabled="disabled"
        @on-next="nextAction()"
        @on-back="backAction()"
      ></BackNext>
    </FooterContainer>
  </div>
</template>

<script setup lang="ts">
import FooterContainer from './FooterContainer.vue'
import BackNext from './BackNext.vue'

withDefaults(
  defineProps<{
    showBack?: boolean
    disabled?: boolean
    nextLabel?: string
  }>(),
  {
    showBack: true,
    disabled: false,
    nextLabel: undefined
  }
)

const emit = defineEmits<{ 'on-next': []; 'on-back': [] }>()

function nextAction() {
  emit('on-next')
}

function backAction() {
  emit('on-back')
}
</script>

<style lang="scss"></style>
