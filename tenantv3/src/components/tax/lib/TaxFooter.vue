<template>
  <FooterContainer class="tax-footer">
    <RouterLink :to="previousStep" class="fr-btn fr-btn--secondary">
      <RiArrowLeftSLine size="1rem" class="color--primary mobile no-shrink" />
      <span class="desktop">{{ t('profilefooter.back') }}</span>
    </RouterLink>
    <form @submit.prevent="submit">
      <DfButton ref="next-btn" primary data-cy="next-btn">{{
        t('profilefooter.continue')
      }}</DfButton>
    </form>
  </FooterContainer>
</template>

<script setup lang="ts">
import type { TaxCategory } from '@/components/documents/share/DocumentTypeConstants'
import FooterContainer from '@/components/footer/FooterContainer.vue'
import { useTaxState } from '@/components/tax/lib/taxState'
import { getNextBtnInFooter, toast } from '@/components/toast/toastUtils'
import { AnalyticsService } from '@/services/AnalyticsService'
import { UtilsService } from '@/services/UtilsService'
import { useTenantStore } from '@/stores/tenant-store'
import { RiArrowLeftSLine } from '@remixicon/vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

type TaxStep = 'TAX_NOT_RECEIVED' | 'TAX_NO_DECLARATION'

const props = defineProps<{ category?: TaxCategory; step?: TaxStep; explanation?: string }>()

const { t } = useI18n()
const router = useRouter()
const { previousStep, nextStep, category: stateCategory, action, addData, document } = useTaxState()
const store = useTenantStore()

const nextBtn = useTemplateRef('next-btn')

async function save(category: TaxCategory, step?: TaxStep) {
  const formData = new FormData()
  formData.append('typeDocumentTax', category)
  if (step) {
    formData.append('categoryStep', step)
  }
  formData.append('noDocument', String(document.value?.files?.length === 0))
  if (props.explanation) {
    formData.append('customText', props.explanation)
  }
  addData?.(formData)

  return await store[action](formData)
    .then(() => {
      toast.keep.success(t('file-saved'), getNextBtnInFooter)
      return true
    })
    .catch((err) => {
      UtilsService.handleCommonSaveError(err, nextBtn.value?.button)
      return false
    })
}

const submit = async () => {
  AnalyticsService.validateFunnelStep(stateCategory)
  const saveOk = props.category ? await save(props.category, props.step) : true
  if (saveOk) {
    router.push(nextStep.value)
  }
}
</script>

<style scoped>
.tax-footer {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 1rem;
}
</style>
