<template>
  <div>
    <FooterContainer>
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
import FooterContainer from './FooterContainer.vue';
import BackNext from './BackNext.vue';

defineProps<{
  showBack: { type: boolean; required: false, default: true };
  disabled: { type: boolean; required: false, default: false };
  nextLabel: { type: string; required: false, default: '' };
}>();

const emit = defineEmits(['on-next', 'on-back']);

function nextAction() {
  emit('on-next');
}

function backAction() {
  emit('on-back');
}
</script>

<style lang="scss"></style>

<i18n>
{
"en": {
  "back": "Back",
  "continue": "Continue"
},
"fr": {
  "back": "Retour",
  "continue": "Continuer"
}
}
</i18n>
