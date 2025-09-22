<template>
  <RichRadioButtons
    v-model="checkedApplicationType"
    name="application-type-selector"
    :elements="applicationTypeOptions"
    @input="onChange"
  >
    <slot></slot>
  </RichRadioButtons>
  <ConfirmModal v-if="showConfirmationModal" @valid="validSelect()" @cancel="undoSelect()">
    <span>{{ getConfirmModalContent() }}</span>
  </ConfirmModal>
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
    displayConfirmationModal()
  } else {
    applicationType.value = checkedApplicationType.value
    emit('selected', checkedApplicationType.value)
  }
}

function undoSelect() {
  checkedApplicationType.value = applicationType.value
  hideConfirmationModal()
}

function validSelect() {
  applicationType.value = checkedApplicationType.value
  hideConfirmationModal()
  emit('selected', checkedApplicationType.value)
}

function getConfirmModalContent(): string {
  return applicationType.value === 'COUPLE'
    ? t('tenantinformationform.will-delete-couple')
    : t('tenantinformationform.will-delete-roommates')
}

function displayConfirmationModal() {
  showConfirmationModal.value = true
}

function hideConfirmationModal() {
  showConfirmationModal.value = false
}
</script>

<style scoped lang="scss">
@import '@gouvfr/dsfr/dist/utility/icons/icons-user/icons-user.min.css';
</style>
