<template>
  <BackLinkRow :label="label" @click="onClick">
    <ModalComponent v-if="showChangeSituation" @close="ignore">
      <template #body>
        <i18n-t keypath="will-delete" tag="p">
          <strong>{{ t('warning') }}</strong>
        </i18n-t>
        <p>{{ t('will-have-to-add') }}</p>
      </template>
      <template #footer>
        <ul class="fr-btns-group fr-btns-group--inline-md">
          <li>
            <DfButton primary @click="ignore">{{ t('cancel') }}</DfButton>
          </li>
          <li>
            <DfButton @click="confirm">{{ t('delete-docs') }}</DfButton>
          </li>
        </ul>
      </template>
    </ModalComponent>
  </BackLinkRow>
</template>

<script setup lang="ts">
import { useRoute, useRouter, type RouteLocationRaw } from 'vue-router'
import { computed, ref } from 'vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import ModalComponent from 'df-shared-next/src/components/ModalComponent.vue'
import { useTenantStore } from '@/stores/tenant-store'
import BackLinkRow from '@/components/common/BackLinkRow.vue'
import { useI18n } from 'vue-i18n'
import { useFinancialState } from '../financialState'
import { AnalyticsService } from '@/services/AnalyticsService'
import { updateFinancialURL } from './updateFinancialUrl'

const props = defineProps<{
  label: string
  to: RouteLocationRaw
  category: 'travail' | 'social' | 'pension' | 'rente' | 'bourse' | 'pas-de-revenus'
  step?: string
  substep?: string
}>()
const route = useRoute()
const router = useRouter()
const store = useTenantStore()
const { t } = useI18n()
const state = useFinancialState()

const showChangeSituation = ref(false)

const document = computed(() =>
  state.documents.value.find((d) => d.id === Number(route.params.docId))
)

function sendEditEvent() {
  if (props.substep && props.step) {
    AnalyticsService.editSituation3(state.category, props.category, props.step, props.substep)
  } else if (props.step) {
    AnalyticsService.editSituation2(state.category, props.category, props.step)
  } else {
    AnalyticsService.editSituation(state.category, props.category)
  }
}

const onClick = () => {
  sendEditEvent()
  if (document.value?.documentCategory) {
    showChangeSituation.value = true
  } else {
    router.push(props.to)
  }
}

const confirm = async () => {
  const docId = document.value?.id
  if (docId) {
    await store.deleteDocument(docId)
  }
  const to = typeof props.to === 'string' ? updateFinancialURL(props.to, docId) : props.to
  router.push(to)
}

const ignore = () => {
  showChangeSituation.value = false
}
</script>

<i18n>
{
  "en": {
    "cancel": "Cancel",
    "delete-docs": "Delete my documents",
    "warning": "Please note",
    "will-delete": "{0} that any change in your situation will remove your proof of income.",
    "will-have-to-add": "You will need to add the documents corresponding to your new situation."
  },
  "fr": {
    "cancel": "Annuler",
    "delete-docs": "Supprimer mes documents",
    "warning": "Attention",
    "will-delete": "{0}, toute modification de votre situation supprimera vos justificatifs de revenus.",
    "will-have-to-add": "Vous devrez ajouter les documents correspondant à votre nouvelle situation."
  }
}
</i18n>
