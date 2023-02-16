<script setup lang="ts">
import { Form } from 'vee-validate';
import NakedCard from 'df-shared-next/src/components/NakedCard.vue';
import LeftMenu from '../menu/LeftMenu.vue';
import TopMenu from '../menu/TopMenu.vue';
import BackNext from '../footer/BackNext.vue';
import FooterContainer from '../footer/FooterContainer.vue';

const emit = defineEmits(['submit', 'on-back']);

function onSubmit() {
  emit('propertypage.submit');
}

function onBack() {
  emit('propertypage.on-back');
}
</script>

<template>
  <div class="full-height fr-grid-row-desktop fr-container fr-container-full-size">
    <TopMenu tMenu></TopMenu>
    <LeftMenu tMenu class="fr-col-md-4 fr-col-xl-3"></LeftMenu>
    <div
      class="fr-col-xl-9 fr-col-md-8 fr-col-xs-12 fr-pt-md-4w fr-pt-2w fr-grid-row fr-pb-10w fr-m-2w fr-m-md-0"
    >
      <div class="fr-col-12 max-600 ml">
        <Form @submit="onSubmit">
          <NakedCard class="fr-p-md-5w">
            <slot></slot>
          </NakedCard>
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
