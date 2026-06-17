<script setup lang="ts">
import { Form } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import type { InvalidSubmissionContext } from 'vee-validate'
import LeftMenu from '../menu/LeftMenu.vue'
import TopMenu from '../menu/TopMenu.vue'
import BackNext from '../footer/BackNext.vue'
import FooterContainer from '../footer/FooterContainer.vue'

const emit = defineEmits<{ 'on-back': []; submit: [] }>()

withDefaults(
  defineProps<{
    skipForm?: boolean
  }>(),
  {
    skipForm: false
  }
)

const { t } = useI18n()
const toast = useToast()

function onSubmit() {
  emit('submit')
}

function onBack() {
  emit('on-back')
}

function onInvalidSubmit({ errors }: InvalidSubmissionContext) {
  toast.error(t('property-errors.form-invalid').toString(), {
    timeout: 7000
  })
  const firstField = Object.keys(errors)[0]
  if (firstField) {
    document.getElementById(firstField)?.focus()
  }
}
</script>

<template>
  <div class="full-height fr-grid-row-desktop fr-container fr-container-full-size">
    <TopMenu></TopMenu>
    <LeftMenu class="fr-col-md-4 fr-col-xl-3"></LeftMenu>
    <div
      class="fr-col-xl-9 fr-col-md-8 fr-col-xs-12 fr-pt-md-4w fr-pt-2w fr-grid-row fr-pb-10w fr-m-2w fr-m-md-0"
    >
      <div v-if="skipForm" class="fr-col-12 max-600 ml">
        <slot></slot>
      </div>
      <div v-if="!skipForm" class="fr-col-12 max-600 ml">
        <Form @submit="onSubmit" @invalid-submit="onInvalidSubmit">
          <slot></slot>
          <FooterContainer>
            <BackNext :show-back="true" @on-back="onBack"></BackNext>
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
