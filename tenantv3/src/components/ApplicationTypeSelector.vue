<template>
  <RichRadioButtons
    v-model="checkedApplicationType"
    name="application-type-selector"
    :elements="applicationTypeOptions"
    @input="onChange"
  >
    <slot />
  </RichRadioButtons>
  <ConfirmModal
    v-model:is-opened="showConfirmationModal"
    :title="getConfirmModalContent"
    @valid="validSelect()"
    @cancel="undoSelect()"
  />
</template>

<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant-store'
import RichRadioButtons from 'df-shared-next/src/Button/RichRadioButtons.vue'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import { computed, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const store = useTenantStore()
const user = computed(() => store.user)
const roommates = computed(() => store.getRoommates)
const { t } = useI18n()
const emit = defineEmits<{ selected: [value: string] }>()

const applicationType = ref('')
const checkedApplicationType = ref('')

const showConfirmationModal = ref(false)

const applicationTypeOptions = [
  {
    id: 'alone-choice',
    labelKey: 'tenantinformationform.alone',
    iconClass: 'fr-icon-user-line',
    optionName: 'ALONE'
  },
  {
    id: 'couple-choice',
    labelKey: 'tenantinformationform.couple',
    iconClass: 'fr-icon-user-line',
    iconCount: 2,
    optionName: 'COUPLE'
  },
  {
    id: 'group-choice',
    labelKey: 'tenantinformationform.roommate',
    iconClass: 'fr-icon-team-line',
    optionName: 'GROUP'
  }
]

onBeforeMount(() => {
  applicationType.value = user.value.applicationType || 'ALONE'
  checkedApplicationType.value = applicationType.value
})

function onChange(value: string) {
  checkedApplicationType.value = value
  if (applicationType.value === checkedApplicationType.value) {
    return
  }
  if (roommates.value.length || 0 > 1) {
    showConfirmationModal.value = true
  } else {
    applicationType.value = checkedApplicationType.value
    emit('selected', checkedApplicationType.value)
  }
}

function undoSelect() {
  checkedApplicationType.value = applicationType.value
  showConfirmationModal.value = false
}

function validSelect() {
  applicationType.value = checkedApplicationType.value
  showConfirmationModal.value = false
  emit('selected', checkedApplicationType.value)
}

const getConfirmModalContent = computed(() => {
  return applicationType.value === 'COUPLE'
    ? t('tenantinformationform.will-delete-couple')
    : t('tenantinformationform.will-delete-roommates')
})
</script>
