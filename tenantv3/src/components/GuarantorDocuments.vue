<template>
  <div class="fr-mb-15w">
    <RouterView
      v-if="['NATURAL_PERSON', 'LEGAL_PERSON'].includes(guarantor?.typeGuarantor || '')"
      v-slot="{ Component }"
    >
      <component :is="Component" @on-back="goBack" @on-next="goNext"></component>
    </RouterView>
    <div v-if="guarantor?.typeGuarantor === 'ORGANISM'">
      <OrganismCert :guarantor="guarantor"></OrganismCert>
      <GuarantorFooter @on-back="goBack" @on-next="nextStep"></GuarantorFooter>
    </div>
    <ConfirmModal v-if="changeGuarantorVisible" @valid="validSelect()" @cancel="undoSelect()">
      <span>{{ t('guarantordocuments.will-delete-guarantor') }}</span>
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
import OrganismCert from './documents/organismGuarantor/OrganismCert.vue'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import GuarantorFooter from './footer/GuarantorFooter.vue'
import { UtilsService } from '@/services/UtilsService'
import { useTenantStore } from '@/stores/tenant-store'
import { computed, onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ToastService } from '@/services/ToastService'
import { useI18n } from 'vue-i18n'
import { makeGuarantorResidencyLink } from '@/components/guarantorResidency/makeGuarantorResidencyLink'
import { GUARANTOR_ROUTES } from './documents/naturalGuarantor/guarantorRoutes'

const { t } = useI18n()
const store = useTenantStore()
const route = useRoute()
const router = useRouter()

const guarantor = computed(() => store.selectedGuarantor)
const user = computed(() => store.user)
const substep = computed(() => Number(route.path.split('/')[2]) || 0)

const changeGuarantorVisible = ref(false)

onBeforeMount(() => {
  const currentGuarantor = guarantor.value?.typeGuarantor
    ? guarantor.value
    : UtilsService.getLastAddedGuarantor(user.value)
  store.setSelectedGuarantor(currentGuarantor)
})

function updateSubstep(s: number) {
  if (GUARANTOR_ROUTES[s] === 'GuarantorResidency' && guarantor.value) {
    const path = makeGuarantorResidencyLink(guarantor.value)
    router.push(path)
  } else {
    router.push({ name: GUARANTOR_ROUTES[s] })
  }
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
  if (substep.value > 0) {
    updateSubstep(substep.value - 1)
  } else {
    router.push({ name: 'GuarantorList' })
  }
}

function goNext() {
  if (substep.value < 5) {
    updateSubstep(substep.value + 1)
  } else {
    nextStep()
  }
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
