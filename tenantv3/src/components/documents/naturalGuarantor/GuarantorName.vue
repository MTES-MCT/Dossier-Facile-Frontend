<template>
  <div>
    <Form name="guarantorNameForm" @submit="onSubmit">
      <NakedCard class="fr-p-md-5w">
        <GuarantorBadge />
        <h1 class="fr-h4">{{ t('guarantorname.title') }}</h1>
        <DsfrAlert type="info" small>
          <p v-html="t('guarantorchoice.two-guarantors-warning')"></p>
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
      <GuarantorFooter ref="footer" @on-back="goBack" />
    </Form>
  </div>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import GuarantorFooter from '../../footer/GuarantorFooter.vue'
import { useTemplateRef } from 'vue'
import { useTenantStore } from '@/stores/tenant-store'
import { useI18n } from 'vue-i18n'
import { Form } from 'vee-validate'
import GuarantorBadge from '@/components/common/GuarantorBadge.vue'
import TextField from '@/components/form/TextField.vue'
import { DsfrAlert } from '@gouvminint/vue-dsfr'
import { useGuarantorNameForm } from './useGuarantorNameForm'

const { t } = useI18n()
const store = useTenantStore()
const footer = useTemplateRef('footer')

const emit = defineEmits<{ 'on-back': []; 'on-next': [] }>()

const { firstName, lastName, preferredName, save } = useGuarantorNameForm({
  guarantor: () => store.selectedGuarantor,
  onSuccess: () => emit('on-next')
})

function onSubmit() {
  save({ errorAnchor: footer.value?.button })
}

function goBack() {
  emit('on-back')
}
</script>
