<template>
  <FooterContainer class="tax-footer">
    <RouterLink :to="previousStep" class="fr-btn fr-btn--secondary">
      <VIcon icon="ri:arrow-left-s-line" />
      <span class="desktop">{{ t('profilefooter.back') }}</span>
    </RouterLink>

    <DsfrButton
      ref="next-btn"
      data-cy="next-btn"
      :type="submit ? 'submit' : 'button'"
      :form="formId ?? null"
      :label="t('profilefooter.continue')"
      :disabled
      icon="ri:check-line"
      @click="handleSubmit"
    />
  </FooterContainer>
</template>

<script setup lang="ts">
import { useNextStep } from '@/components/common/lib/useNextStep'
import type { TaxCategory } from '@/components/documents/share/DocumentTypeConstants'
import FooterContainer from '@/components/footer/FooterContainer.vue'
import { useTaxState } from '@/components/tax/lib/taxState'
import { UtilsService } from '@/services/UtilsService'
import { useTenantStore } from '@/stores/tenant-store'
import { DsfrButton, VIcon } from '@gouvminint/vue-dsfr'
import { useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'

type TaxStep = 'TAX_NOT_RECEIVED' | 'TAX_NO_DECLARATION'

const props = defineProps<{
  category?: TaxCategory
  step?: TaxStep
  explanation?: string
  disabled?: boolean
  submit?: boolean
  formId?: string
}>()

const { t } = useI18n()
const { previousStep, nextStep, category: stateCategory, action, addData, document } = useTaxState()
const store = useTenantStore()
const { goNext } = useNextStep(stateCategory, nextStep)

const nextBtn = useTemplateRef('next-btn')

async function save(category: TaxCategory, step?: TaxStep) {
  const formData = new FormData()
  formData.append('typeDocumentTax', category)
  if (step) {
    formData.append('categoryStep', step)
  }
  formData.append('noDocument', String((document.value?.files?.length || 0) === 0))
  if (props.explanation) {
    formData.append('customText', props.explanation)
  }
  addData?.(formData)

  try {
    await store[action](formData)
    return true
  } catch (error) {
    UtilsService.handleCommonSaveError(error, nextBtn.value?.$el)
    return false
  }
}

const handleSubmit = async () => {
  const saveOk = props.category ? await save(props.category, props.step) : true
  if (saveOk) {
    goNext()
  }
}
</script>
