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
import { useRouter, type RouteLocationRaw } from 'vue-router'
import { computed, ref } from 'vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import ModalComponent from 'df-shared-next/src/components/ModalComponent.vue'
import BackLinkRow from '@/components/common/BackLinkRow.vue'
import { useI18n } from 'vue-i18n'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useTenantStore } from '@/stores/tenant-store'

const props = defineProps<{
  label: string
  to: RouteLocationRaw
  category:
    | 'identity-card'
    | 'passport'
    | 'residency-permit'
    | 'driving-licence'
    | 'france-identité'
    | 'other'
}>()
const router = useRouter()
const { t } = useI18n()
const store = useTenantStore()

const showChangeSituation = ref(false)
const document = computed(() => store.getTenantIdentificationDocument)

const onClick = () => {
  AnalyticsService.editSituation('identification', props.category)
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
  // const to = typeof props.to === 'string' ? updateFinancialURL(props.to, docId) : props.to
  router.push(props.to)
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
    "will-delete": "{0} that any change in your situation will remove your identification.",
    "will-have-to-add": "You will need to add the documents corresponding to your new situation."
  },
  "fr": {
    "cancel": "Annuler",
    "delete-docs": "Supprimer mes documents",
    "warning": "Attention",
    "will-delete": "{0}, toute modification de votre situation supprimera vos pièces d’identité.",
    "will-have-to-add": "Vous devrez ajouter les documents correspondant à votre nouvelle situation."
  }
}
</i18n>
