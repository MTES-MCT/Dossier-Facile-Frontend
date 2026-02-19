<template>
  <BackLinkRow :label="t('no-income')" :to="parent" category="pas-de-revenus" />
  <label for="explanation" class="fr-mb-1w">{{ t('can-add-explanation') }}</label>
  <textarea id="explanation" ref="custom-text" v-model="customText" class="fr-input fr-mb-2w" />
  <FinancialFooter :on-submit="save" />
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useRoute } from 'vue-router'
import FinancialFooter from '../lib/FinancialFooter.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import { computed, ref, useTemplateRef } from 'vue'
import { useTenantStore } from '@/stores/tenant-store'
import { useLoading } from 'vue-loading-overlay'
import { UtilsService } from '@/services/UtilsService'
import { useFinancialState } from '../financialState'
import { useI18n } from 'vue-i18n'
import { getNextBtnInFooter, toast } from '@/components/toast/toastUtils'

const { t } = useI18n()
const route = useRoute()
const parent = useParentRoute()
const store = useTenantStore()
const { documents, action, addData } = useFinancialState()

const document = computed(() => documents.value.find((d) => d.id === Number(route.params.docId)))
const customText = ref(document.value?.customText || '')
const customTextElt = useTemplateRef('custom-text')

async function save(): Promise<boolean> {
  const formData = new FormData()
  formData.append('typeDocumentFinancial', 'NO_INCOME')
  formData.append('noDocument', 'true')
  formData.append('customText', customText.value || '-')
  formData.append('monthlySum', '0')
  if (document.value?.id) {
    formData.append('id', document.value.id.toString())
  }
  addData?.(formData)

  const $loading = useLoading()
  const loader = $loading.show()
  try {
    await store[action](formData)
    toast.keep.success(t('save-success'), getNextBtnInFooter)
    return true
  } catch (err) {
    UtilsService.handleCommonSaveError(err, customTextElt.value)
    return false
  } finally {
    loader.hide()
  }
}
</script>

<i18n>
{
  "en": {
    "no-income": "You have no income",
    "can-add-explanation": "You can add an explanation of your situation here if you wish:"
  },
  "fr": {
    "no-income": "Vous n’avez pas de revenus",
    "can-add-explanation": "Vous pouvez ajouter une explication sur votre situation ici si vous le souhaitez :"
  }
}
</i18n>
