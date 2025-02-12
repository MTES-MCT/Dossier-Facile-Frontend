<template>
  <div class="fr-mb-15w">
    <div>
      <div v-if="guarantor?.typeGuarantor === 'NATURAL_PERSON'">
        <div v-if="substep === 0">
          <GuarantorName @on-back="goBack" @on-next="goNext"></GuarantorName>
        </div>
        <div v-if="substep === 1">
          <GuarantorIdentification></GuarantorIdentification>
          <GuarantorFooter @on-back="goBack" @on-next="goNext"></GuarantorFooter>
        </div>
        <div v-if="substep === 2">
          <NakedCard class="fr-p-md-5w">
            <h6>{{ t('guarantor-residency-situation') }}</h6>
            <router-view />
          </NakedCard>
        </div>
        <div v-if="substep === 3">
          <GuarantorProfessional></GuarantorProfessional>
          <GuarantorFooter @on-back="goBack" @on-next="goNext"></GuarantorFooter>
        </div>
        <div v-if="substep === 4">
          <GuarantorFinancial @on-back="goBack" @on-next="goNext"></GuarantorFinancial>
        </div>
        <div v-if="substep === 5">
          <GuarantorTax @on-back="goBack" @on-next="nextStep"></GuarantorTax>
        </div>
      </div>
      <div v-if="guarantor?.typeGuarantor === 'ORGANISM'">
        <OrganismCert :guarantor="guarantor"></OrganismCert>
        <GuarantorFooter @on-back="goBack" @on-next="nextStep"></GuarantorFooter>
      </div>
      <div v-if="guarantor?.typeGuarantor === 'LEGAL_PERSON'">
        <div v-if="substep === 0">
          <CorporationIdentification
            @on-back="goBack"
            @on-next="goNext"
          ></CorporationIdentification>
        </div>
        <div v-if="substep === 1">
          <RepresentativeIdentification
            @on-back="goBack"
            @on-next="nextStep"
          ></RepresentativeIdentification>
        </div>
      </div>
    </div>
    <ConfirmModal v-if="changeGuarantorVisible" @valid="validSelect()" @cancel="undoSelect()">
      <span>{{ t('guarantordocuments.will-delete-guarantor') }}</span>
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
import GuarantorIdentification from './documents/naturalGuarantor/GuarantorIdentification.vue'
import GuarantorName from './documents/naturalGuarantor/GuarantorName.vue'
import RepresentativeIdentification from './documents/legalPersonGuarantor/RepresentativeIdentification.vue'
import CorporationIdentification from './documents/legalPersonGuarantor/CorporationIdentification.vue'
import OrganismCert from './documents/organismGuarantor/OrganismCert.vue'
import GuarantorProfessional from './documents/naturalGuarantor/GuarantorProfessional.vue'
import GuarantorFinancial from './documents/naturalGuarantor/GuarantorFinancial.vue'
import GuarantorTax from './documents/naturalGuarantor/GuarantorTax.vue'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import GuarantorFooter from './footer/GuarantorFooter.vue'
import { UtilsService } from '@/services/UtilsService'
import useTenantStore from '@/stores/tenant-store'
import { computed, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ToastService } from '@/services/ToastService'
import { useI18n } from 'vue-i18n'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'

const { t } = useI18n()
const store = useTenantStore()
const guarantor = computed(() => {
  return store.selectedGuarantor
})
const user = computed(() => {
  return store.user
})

const props = withDefaults(
  defineProps<{
    substep: number
  }>(),
  {
    substep: 0
  }
)

const router = useRouter()

const changeGuarantorVisible = ref(false)

onBeforeMount(() => {
  const currentGuarantor = guarantor.value?.typeGuarantor
    ? guarantor.value
    : UtilsService.getLastAddedGuarantor(user.value)
  store.setSelectedGuarantor(currentGuarantor)
})

function updateSubstep(s: number) {
  router.push({
    name: 'GuarantorDocuments',
    params: { substep: props.substep === s ? '0' : s.toString() }
  })
}

function validSelect() {
  store.deleteAllGuarantors().then(
    () => {
      changeGuarantorVisible.value = false
      if (!user.value.guarantors.length || 0 >= 1) {
        router.push({ name: 'GuarantorChoice' })
      }
    },
    () => {
      ToastService.error()
    }
  )
}

function undoSelect() {
  changeGuarantorVisible.value = false
}

function goBack() {
  if (props.substep > 0) {
    router.push({
      name: 'GuarantorDocuments',
      params: { substep: (props.substep - 1).toString() }
    })
  } else {
    router.push({
      name: 'GuarantorList'
    })
  }
}

function goNext() {
  updateSubstep(props.substep + 1)
}

function nextStep() {
  router.push({
    name: 'GuarantorList'
  })
}
</script>

<style scoped lang="scss">
h2 {
  font-size: 1rem;
  margin: 0.5rem;
  display: inline-block;
  align-self: center;
}

.icon {
  align-self: center;
}

.document-title {
  border: 1px solid #ececec;
  border-radius: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  display: flex;
}

.selected {
  background-color: var(--secondary);
}

.check {
  padding: 0.5rem;
  margin-left: auto;
  color: green;
}

.buttons {
  justify-content: space-between;
}

.guarantorselected {
  background-color: var(--light-blue-transparent);
}

.title-bar {
  display: flex;
  align-items: center;
  span {
    padding: 0.5rem;
    line-height: 1rem;
  }
}

.btn-group {
  width: fit-content;
}

h2 {
  line-height: 1.5rem;
}

.remark {
  background-color: #e5e5f4;
  padding: 1rem;
  border-radius: 0.25rem;
}

.card {
  padding: 1rem;
}

.card-container {
  @media all and (min-width: 992px) {
    width: fit-content;
  }
}

.small-font {
  font-size: 14px;
}
</style>

<i18n>
{
  "en": {
    "guarantor-residency-situation" : "Your guarantor's housing situation"
  },
  "fr": {
    "guarantor-residency-situation" : "Situation d'hébergement de votre garant"
  }
}
</i18n>
