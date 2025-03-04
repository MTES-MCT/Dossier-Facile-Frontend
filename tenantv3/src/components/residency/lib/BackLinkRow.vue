<template>
  <p class="display--flex align-items--center">
    <RiCheckboxCircleLine color="var(--primary)" size="20px" class="fr-mr-1w no-shrink" />
    <span>{{ label }}</span>
    <DfButton tertiary-no-outline class="fr-ml-auto" @click="onClick">
      {{ t('edit') }} <RiArrowGoBackLine size="1rem" class="fr-ml-1w" />
    </DfButton>

    <ModalComponent v-if="showChangeSituation" @close="ignore">
      <template #body>
        <i18n-t keypath="delete-notice" tag="p">
          <strong>{{ t('delete-warning') }}</strong>
        </i18n-t>
      </template>
      <template #footer>
        <ul class="fr-btns-group fr-btns-group--inline-md">
          <li>
            <DfButton primary @click="ignore">{{ t('cancel') }}</DfButton>
          </li>
          <li>
            <DfButton @click="confirm">{{ t('change-situation') }}</DfButton>
          </li>
        </ul>
      </template>
    </ModalComponent>
  </p>
</template>

<script setup lang="ts">
import { useRouter, type RouterLinkProps } from 'vue-router'
import { RiArrowGoBackLine, RiCheckboxCircleLine } from '@remixicon/vue'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import ModalComponent from 'df-shared-next/src/components/ModalComponent.vue'
import useTenantStore from '@/stores/tenant-store'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useResidencyState } from '../residencyState'

const props = defineProps<{ label: string; to: RouterLinkProps['to'] }>()
const emit = defineEmits<{ edit: [] }>()
const { t } = useI18n()
const router = useRouter()
const store = useTenantStore()
const { category, document } = useResidencyState()

const showChangeSituation = ref(false)

const onClick = () => {
  emit('edit')
  if (document.value) {
    AnalyticsService.showWarningModale(category)
    showChangeSituation.value = true
  } else {
    router.push(props.to)
  }
}

const confirm = async () => {
  AnalyticsService.confirmModale(category)
  const docId = document.value?.id
  if (docId) {
    await store.deleteDocument(docId)
  }
  router.push(props.to)
}

const ignore = () => {
  AnalyticsService.ignoreWarningModale(category)
  showChangeSituation.value = false
}
</script>

<style scoped>
.no-shrink {
  flex-shrink: 0;
}
</style>

<i18n>
{
  "en": {
    "edit": "Edit",
    "cancel": "Cancel",
    "change-situation": "Change your situation",
    "delete-warning": "if you change your situation, your supporting documents will be deleted",
    "delete-notice": "Please note: {0}. You will need to provide new supporting documents."
  },
  "fr": {
    "edit": "Modifier",
    "cancel": "Annuler",
    "change-situation": "Modifier votre situation",
    "delete-warning": "modifier votre situation entraîne la suppression de vos justificatifs",
    "delete-notice": "Attention : {0}. Vous devrez fournir de nouveaux justificatifs."
  }
}
</i18n>
