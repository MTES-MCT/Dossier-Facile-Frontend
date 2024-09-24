<template>
  <div>
    <RichRadioButtons
      name="guarantor-type-selector"
      v-model="checkedGuarantorType"
      @input="onButtonSelected($event)"
      :elements="guarantorTypeOptions"
    ></RichRadioButtons>
    <ConfirmModal
      v-if="confirmGuarantorChangeModal"
      @valid="confirmGuarantorTypeChange()"
      @cancel="undoGuarantorTypeChange()"
    >
      <span>{{ $t('guarantorchoice.will-delete-guarantor') }}</span>
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
import RichRadioButtons from 'df-shared-next/src/Button/RichRadioButtons.vue'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import { ToastService } from '@/services/ToastService'
import useTenantStore from '@/stores/tenant-store'
import { computed, onBeforeMount, ref } from 'vue'

const store = useTenantStore()
const user = computed(() => store.user)
const guarantor = computed(() => store.guarantor)

const props = withDefaults(
  defineProps<{
    isCotenant?: boolean
    localStorageKey: string
  }>(),
  {
    isCotenant: false
  }
)

const emit = defineEmits(['selected'])

const checkedGuarantorType = ref('')
const confirmGuarantorChangeModal = ref(false)

const guarantorTypeOptions = [
  {
    id: 'natural-person-choice',
    labelKey: 'guarantorchoice.natural-person.label',
    description: 'guarantorchoice.natural-person.description',
    iconClass: 'fr-icon-user-line',
    optionName: 'NATURAL_PERSON'
  },
  {
    id: 'organism-choice',
    labelKey: 'guarantorchoice.organism.label',
    description: 'guarantorchoice.organism.description',
    iconClass: 'fr-icon-award-line',
    optionName: 'ORGANISM'
  },
  {
    id: 'legal-person-choice',
    labelKey: 'guarantorchoice.legal-person.label',
    description: 'guarantorchoice.legal-person.description',
    iconClass: 'fr-icon-bank-line',
    optionName: 'LEGAL_PERSON'
  },
  {
    id: 'no-guarantor-choice',
    labelKey: `${props.isCotenant ? 'tenantguarantorchoice' : 'guarantorchoice'}.no-guarantor`,
    iconClass: 'fr-icon-close-line',
    optionName: 'NO_GUARANTOR'
  }
]

onBeforeMount(() => {
  if (guarantor.value?.typeGuarantor && !props.isCotenant) {
    checkedGuarantorType.value = guarantor.value.typeGuarantor
    selectType(guarantor.value.typeGuarantor)
  } else {
    resetType()
  }
})

function onButtonSelected($event: any) {
  checkedGuarantorType.value = $event
  if (
    guarantor.value?.typeGuarantor !== checkedGuarantorType.value &&
    (user.value.guarantors.length || 0) > 0 &&
    !props.isCotenant
  ) {
    confirmGuarantorChangeModal.value = true
  } else {
    selectType(checkedGuarantorType.value)
  }
}

function confirmGuarantorTypeChange() {
  store.deleteAllGuarantors().then(
    () => {
      confirmGuarantorChangeModal.value = false
      selectType(checkedGuarantorType.value)
    },
    () => {
      ToastService.error()
    }
  )
}

function undoGuarantorTypeChange() {
  resetType()
  confirmGuarantorChangeModal.value = false
}

function selectType(type: string) {
  // TODO store on back-end side
  localStorage.setItem(props.localStorageKey, type)
  emit('selected', checkedGuarantorType.value)
}

function resetType() {
  const type = localStorage.getItem(props.localStorageKey)
  if (type) {
    checkedGuarantorType.value = type
  }
  emit('selected', checkedGuarantorType.value)
}
</script>

<style scoped lang="scss">
@import '@gouvfr/dsfr/dist/utility/icons/icons-user/icons-user.css';
@import '@gouvfr/dsfr/dist/utility/icons/icons-buildings/icons-buildings.css';
</style>
