<template>
  <Form name="guarantorNameForm" @submit="onSubmit">
    <NakedCard class="fr-p-md-5w">
      <GuarantorBadge v-if="showBadge" />
      <h1 class="fr-h4">{{ t(textKey + '.title') }}</h1>
      <DsfrAlert type="info" small>
        <p v-html="t(choiceKey + '.two-guarantors-warning')"></p>
      </DsfrAlert>
      <div class="fr-mt-4w">
        <TextField
          v-model.trim="lastName"
          name="lastname"
          :field-label="t('nameinformationform.lastname')"
          validation-rules="required|onlyAlpha"
        />
        <TextField
          v-model.trim="preferredName"
          name="preferredname"
          :field-label="t('nameinformationform.preferredname')"
          :hint="t('nameinformationform.preferredname-hint')"
          validation-rules="onlyAlpha"
        />
        <TextField
          v-model.trim="firstName"
          name="firstname"
          :field-label="t('nameinformationform.firstname')"
          validation-rules="required|onlyAlpha"
        />
      </div>
    </NakedCard>
    <GuarantorFooter ref="footer" @on-back="$emit('on-back')" />
  </Form>
</template>

<script setup lang="ts">
import { computed, toRef, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { Form } from 'vee-validate'
import { DsfrAlert } from '@gouvminint/vue-dsfr'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import type { Guarantor } from 'df-shared-next/src/models/Guarantor'
import GuarantorBadge from '@/components/common/GuarantorBadge.vue'
import GuarantorFooter from '@/components/footer/GuarantorFooter.vue'
import TextField from '@/components/form/TextField.vue'
import { useGuarantorNameForm } from './useGuarantorNameForm'

const props = defineProps<{
  textKey: 'guarantor' | 'couple-guarantor'
  guarantor: Guarantor
  tenantId?: number
  showBadge?: boolean
}>()
const emit = defineEmits<{ 'on-back': []; 'on-saved': [] }>()

const { t } = useI18n()
const footer = useTemplateRef('footer')

const choiceKey = computed(() =>
  props.textKey === 'guarantor' ? 'guarantorchoice' : 'tenantguarantorchoice'
)

const { firstName, lastName, preferredName, save } = useGuarantorNameForm({
  guarantor: toRef(props, 'guarantor'),
  tenantId: toRef(props, 'tenantId'),
  onSuccess: () => emit('on-saved')
})

function onSubmit() {
  save({ errorAnchor: footer.value?.button })
}
</script>

<i18n lang="json">
{
  "en": {
    "guarantor": { "title": "Guarantor's Identity" },
    "couple-guarantor": { "title": "Spouse's Guarantor Identity" }
  },
  "fr": {
    "guarantor": { "title": "Identité de votre garant" },
    "couple-guarantor": { "title": "Identité de son garant" }
  }
}
</i18n>
