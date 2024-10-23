<template>
  <div>
    <FooterContainer id="footer-navigation">
      <BackNext
        :showBack="showBack"
        :nextLabel="nextLabel"
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
    disabled: false
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
