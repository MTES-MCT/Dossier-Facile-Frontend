<template>
  <Form name="tenantGuarantorNameForm" @submit="onSubmit">
    <NakedCard class="fr-p-md-5w">
      <h1 class="fr-h4">{{ t('tenantguarantorname.title') }}</h1>
      <DsfrAlert type="info" small>
        <p v-html="t('tenantguarantorchoice.two-guarantors-warning')"></p>
      </DsfrAlert>
      <div class="fr-grid-row fr-grid-row--center fr-mt-4w">
        <div class="fr-col-12">
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
      </div>
    </NakedCard>
    <GuarantorFooter ref="footer" @on-back="goBack" />
  </Form>
</template>

<script setup lang="ts">
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import GuarantorFooter from '../../footer/GuarantorFooter.vue'
import { useTemplateRef, toRef } from 'vue'
import { Form } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { makeSpouseGuarantorIdDocLink } from '@/components/identityDocument/lib/identityDocumentLink'
import { useRouter } from 'vue-router'
import { DsfrAlert } from '@gouvminint/vue-dsfr'
import TextField from '@/components/form/TextField.vue'
import { useGuarantorNameForm } from './useGuarantorNameForm'

const { t } = useI18n()

const props = defineProps<{
  tenantId: number
  guarantor: Guarantor
}>()
const emit = defineEmits<{ 'on-back': [] }>()
const router = useRouter()
const footer = useTemplateRef('footer')

const { firstName, lastName, preferredName, save } = useGuarantorNameForm({
  guarantor: toRef(props, 'guarantor'),
  tenantId: toRef(props, 'tenantId'),
  onSuccess: () => {
    router.push(makeSpouseGuarantorIdDocLink(props.guarantor, props.tenantId))
  }
})

function onSubmit() {
  save({ errorAnchor: footer.value?.button })
}

function goBack() {
  emit('on-back')
}
</script>
