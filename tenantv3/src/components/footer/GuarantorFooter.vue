<template>
  <div>
    <FooterContainer>
      <BackNext :show-back="showBack" @on-next="nextAction()" @on-back="backAction()"> </BackNext>
    </FooterContainer>
  </div>
</template>

<script setup lang="ts">
import FooterContainer from './FooterContainer.vue'
import BackNext from './BackNext.vue'

const emit = defineEmits<{ 'on-next': []; 'on-back': [] }>()

withDefaults(
  defineProps<{
    showBack?: boolean
  }>(),
  {
    showBack: true
  }
)

function nextAction() {
  emit('on-next')
}

function backAction() {
  emit('on-back')
}
</script>
