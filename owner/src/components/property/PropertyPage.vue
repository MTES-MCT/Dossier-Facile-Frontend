<script setup lang="ts">
import { Form } from 'vee-validate'
import LeftMenu from '../menu/LeftMenu.vue'
import TopMenu from '../menu/TopMenu.vue'
import BackNext from '../footer/BackNext.vue'
import FooterContainer from '../footer/FooterContainer.vue'

const emit = defineEmits(['submit', 'on-back'])

withDefaults(
  defineProps<{
    skipForm?: boolean
  }>(),
  {
    skipForm: false
  }
)

function onSubmit() {
  emit('submit')
}

function onBack() {
  emit('on-back')
}
</script>

<template>
  <div class="full-height fr-grid-row-desktop fr-container fr-container-full-size">
    <TopMenu tMenu></TopMenu>
    <LeftMenu tMenu class="fr-col-md-4 fr-col-xl-3"></LeftMenu>
    <div
      class="fr-col-xl-9 fr-col-md-8 fr-col-xs-12 fr-pt-md-4w fr-pt-2w fr-grid-row fr-pb-10w fr-m-2w fr-m-md-0"
    >
      <div class="fr-col-12 max-600 ml" v-if="skipForm">
        <slot></slot>
      </div>
      <div class="fr-col-12 max-600 ml" v-if="!skipForm">
        <Form @submit="onSubmit">
          <slot></slot>
          <FooterContainer>
            <BackNext @on-back="onBack" :show-back="true"></BackNext>
          </FooterContainer>
        </Form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ml {
  @media all and (min-width: 768px) {
    margin-left: 10%;
  }
}

.fr-grid-row-desktop {
  @media all and (min-width: 768px) {
    display: flex;
  }
}
</style>
