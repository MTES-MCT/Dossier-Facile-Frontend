<template>
  <div class="fr-mb-15w">
    <div>
      <div v-if="selectedGuarantor?.typeGuarantor === 'NATURAL_PERSON'">
        <div v-if="substep === 0">
          <TenantGuarantorName
            :tenant-id="tenantId"
            :guarantor="selectedGuarantor"
            @on-back="goBack"
            @on-next="goNext"
          >
          </TenantGuarantorName>
        </div>
        <div v-if="substep === 1">
          <GuarantorIdentification
            :is-cotenant="true"
            :tenant-id="tenantId"
            @on-back="goBack"
            @on-next="goToResidency"
          ></GuarantorIdentification>
        </div>
        <CoupleGuarantorResidency v-if="substep === 2"></CoupleGuarantorResidency>
        <div v-if="substep === 3">
          <GuarantorProfessional
            :tenant-id="tenantId"
            :is-cotenant="true"
            @on-back="goToResidency"
            @on-next="goNext"
          ></GuarantorProfessional>
        </div>
        <div v-if="substep === 4">
          <GuarantorFinancial
            :tenant-id="tenantId"
            @on-back="goBack"
            @on-next="goNext"
          ></GuarantorFinancial>
        </div>
        <div v-if="substep === 5">
          <GuarantorTax
            :tenant-id="tenantId"
            :is-cotenant="true"
            @on-back="goBack"
            @on-next="nextStep"
          ></GuarantorTax>
        </div>
      </div>
      <div v-if="selectedGuarantor?.typeGuarantor === 'ORGANISM'">
        <OrganismCert
          :is-cotenant="true"
          :guarantor="selectedGuarantor"
          :tenant-id="tenantId"
        ></OrganismCert>
        <GuarantorFooter @on-back="goBack" @on-next="nextStep"></GuarantorFooter>
      </div>
      <div v-if="selectedGuarantor?.typeGuarantor === 'LEGAL_PERSON'">
        <div v-if="substep === 0">
          <CorporationIdentification
            :tenant-id="tenantId"
            :guarantor="selectedGuarantor"
            @on-back="goBack"
            @on-next="goNext"
          ></CorporationIdentification>
        </div>
        <div v-if="substep === 1">
          <RepresentativeIdentification
            :tenant-id="tenantId"
            :guarantor="selectedGuarantor"
            @on-back="goBack"
            @on-next="nextStep"
          ></RepresentativeIdentification>
        </div>
      </div>
    </div>
    <ConfirmModal v-if="changeGuarantorVisible" @valid="validSelect()" @cancel="undoSelect()">
      <span>{{ t('tenantguarantordocuments.will-delete-guarantor') }}</span>
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
import TenantGuarantorName from './documents/naturalGuarantor/TenantGuarantorName.vue'
import RepresentativeIdentification from './documents/legalPersonGuarantor/RepresentativeIdentification.vue'
import CorporationIdentification from './documents/legalPersonGuarantor/CorporationIdentification.vue'
import OrganismCert from './documents/organismGuarantor/OrganismCert.vue'
import GuarantorIdentification from './documents/naturalGuarantor/GuarantorIdentification.vue'
import GuarantorProfessional from './documents/naturalGuarantor/GuarantorProfessional.vue'
import GuarantorFinancial from './documents/naturalGuarantor/GuarantorFinancial.vue'
import GuarantorTax from './documents/naturalGuarantor/GuarantorTax.vue'
import { User } from 'df-shared-next/src/models/User'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import GuarantorFooter from './footer/GuarantorFooter.vue'
import { ToastService } from '@/services/ToastService'
import { useTenantStore } from '@/stores/tenant-store'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import CoupleGuarantorResidency from './documents/naturalGuarantor/CoupleGuarantorResidency.vue'
import { makeCotenantGuarantorResidencyLink } from './guarantorResidency/makeGuarantorResidencyLink'

const route = useRoute()
const router = useRouter()
const emit = defineEmits<{ 'on-next': [] }>()

const store = useTenantStore()
const { t } = useI18n()

const selectedGuarantor = computed(() => store.selectedGuarantor)

const props = withDefaults(
  defineProps<{
    substep: number
    guarantorId: number
    tenantId: number
  }>(),
  {
    substep: 0
  }
)

const user = ref(new User())
const tmpGuarantorType = ref('')
const changeGuarantorVisible = ref(false)

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
  tmpGuarantorType.value = selectedGuarantor.value?.typeGuarantor || ''
  changeGuarantorVisible.value = false
}

function goBack() {
  if (props.substep > 0) {
    router.push({
      name: 'TenantGuarantorDocuments',
      params: {
        step: route.params.step,
        substep: (props.substep - 1).toString(),
        tenantId: route.params.tenantId,
        guarantorId: route.params.guarantorId
      }
    })
  } else {
    emit('on-next')
  }
}

function goNext() {
  router.push({
    name: 'TenantGuarantorDocuments',
    params: {
      step: route.params.step,
      substep: (props.substep + 1).toString(),
      tenantId: route.params.tenantId,
      guarantorId: route.params.guarantorId
    }
  })
}

function goToResidency() {
  const { tenantId, guarantorId } = route.params
  const coTenants = store.user.apartmentSharing?.tenants.filter((t) => t.id != store.user.id)
  const coTenant = coTenants?.find((r) => r.id === Number(tenantId))
  const guarantor = coTenant?.guarantors?.find((g) => g.id === Number(guarantorId))
  const document = guarantor?.documents?.find((d) => d.documentCategory === 'RESIDENCY')
  const link = makeCotenantGuarantorResidencyLink(Number(tenantId), Number(guarantorId), document)
  router.push(link)
}

function nextStep() {
  emit('on-next')
}
</script>

<style scoped lang="scss">
h2 {
  font-size: 1rem;
  margin: 0.5rem;
  display: inline-block;
  align-self: center;
  line-height: 1.5rem;
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
