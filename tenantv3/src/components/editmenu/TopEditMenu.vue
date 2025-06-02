<template>
  <div class="top-edit-menu">
    <h1 class="blue-text text-center fr-mt-1w fr-mb-1v">
      {{ getStepTitle() }}
    </h1>
    <div class="inner-top-edit fr-mb-1w">
      <div class="hline" :class="getClass(0)"></div>
      <div class="hline" :class="getClass(1)"></div>
      <div class="hline" :class="getClass(2)"></div>
      <div class="hline" :class="getClass(3)"></div>
      <div v-if="isCouple()" class="hline" :class="getClass(4)"></div>
      <div v-if="isCouple()" class="hline" :class="getClass(5)"></div>
    </div>
    <hr v-if="step === 2 || step === 3" />
    <div v-if="step === 2" id="tcontainer" class="menu-grid-row">
      <TenantDocumentLink :document-type="DocumentType.IDENTITY" />
      <TenantDocumentLink :document-type="DocumentType.RESIDENCY" />
      <TenantDocumentLink :document-type="DocumentType.PROFESSIONAL" />
      <TenantDocumentLink :document-type="DocumentType.FINANCIAL" />
      <TenantDocumentLink :document-type="DocumentType.TAX" />
    </div>
    <h2 v-if="displayGuarantorName()" class="small-title">
      {{
        t('topeditmenu.i-add', [`${selectedGuarantor?.firstName} ${selectedGuarantor?.lastName}`])
      }}
    </h2>
    <div v-if="step === 3 && selectedGuarantor">
      <div
        v-if="
          selectedGuarantor.typeGuarantor === 'NATURAL_PERSON' &&
          selectedGuarantor.firstName !== undefined &&
          selectedGuarantor.lastName !== undefined
        "
        id="gcontainer"
        class="menu-grid-row"
      >
        <GuarantorDocumentLink
          id="gd1"
          class="ml-5"
          :guarantor="selectedGuarantor"
          :document-type="DocumentType.IDENTITY"
        />
        <GuarantorDocumentLink
          id="gd2"
          class="ml-5"
          :guarantor="selectedGuarantor"
          :document-type="DocumentType.RESIDENCY"
        />
        <GuarantorDocumentLink
          id="gd3"
          class="ml-5"
          :guarantor="selectedGuarantor"
          :document-type="DocumentType.PROFESSIONAL"
        />
        <GuarantorDocumentLink
          id="gd4"
          class="ml-5"
          :guarantor="selectedGuarantor"
          :document-type="DocumentType.FINANCIAL"
        />
        <GuarantorDocumentLink
          id="gd5"
          class="ml-5 mr-5"
          :guarantor="selectedGuarantor"
          :document-type="DocumentType.TAX"
        />
      </div>
      <div
        v-if="selectedGuarantor.typeGuarantor === 'LEGAL_PERSON'"
        id="gcontainer"
        class="menu-grid-row"
      >
        <GuarantorDocumentLink
          id="gd0"
          class="ml-5"
          :guarantor="selectedGuarantor"
          :document-type="DocumentType.IDENTIFICATION_LEGAL_PERSON"
        />
        <GuarantorDocumentLink
          id="gd1"
          class="ml-5"
          :guarantor="selectedGuarantor"
          :document-type="DocumentType.IDENTIFICATION"
        />
      </div>
      <div
        v-if="selectedGuarantor.typeGuarantor === 'ORGANISM'"
        id="gcontainer"
        class="menu-grid-row"
      >
        <GuarantorDocumentLink
          id="gd0"
          class="ml-5"
          :guarantor="selectedGuarantor"
          :document-type="DocumentType.GUARANTEE_PROVIDER_CERTIFICATE"
        />
      </div>
    </div>
    <div v-if="step === 4 && isCouple()" id="tcontainer" class="menu-grid-row">
      <CoTenantDocumentLink
        class="ml-5"
        :co-tenant="coTenants[0]"
        :document-type="DocumentType.IDENTITY"
      />
      <CoTenantDocumentLink
        class="ml-5"
        :co-tenant="coTenants[0]"
        :document-type="DocumentType.RESIDENCY"
      />
      <CoTenantDocumentLink
        class="ml-5"
        :co-tenant="coTenants[0]"
        :document-type="DocumentType.PROFESSIONAL"
      />
      <CoTenantDocumentLink
        class="ml-5"
        :co-tenant="coTenants[0]"
        :document-type="DocumentType.FINANCIAL"
      />
      <CoTenantDocumentLink
        class="ml-5"
        :co-tenant="coTenants[0]"
        :document-type="DocumentType.TAX"
      />
    </div>
    <div v-if="step === 5 && isCouple() && selectedGuarantor">
      <div
        v-if="
          selectedGuarantor.typeGuarantor === 'NATURAL_PERSON' &&
          selectedGuarantor.firstName !== undefined &&
          selectedGuarantor.lastName !== undefined
        "
        id="gcontainer"
        class="menu-grid-row"
      >
        <CoTenantGuarantorDocumentLink
          id="gd1"
          class="ml-5"
          :guarantor="selectedGuarantor"
          :co-tenant="coTenants[0]"
          :document-type="DocumentType.IDENTITY"
        />
        <CoTenantGuarantorDocumentLink
          id="gd2"
          class="ml-5"
          :guarantor="selectedGuarantor"
          :co-tenant="coTenants[0]"
          :document-type="DocumentType.RESIDENCY"
        />
        <CoTenantGuarantorDocumentLink
          id="gd3"
          class="ml-5"
          :guarantor="selectedGuarantor"
          :co-tenant="coTenants[0]"
          :document-type="DocumentType.PROFESSIONAL"
        />
        <CoTenantGuarantorDocumentLink
          id="gd4"
          class="ml-5"
          :guarantor="selectedGuarantor"
          :co-tenant="coTenants[0]"
          :document-type="DocumentType.FINANCIAL"
        />
        <CoTenantGuarantorDocumentLink
          id="gd5"
          class="ml-5"
          :guarantor="selectedGuarantor"
          :co-tenant="coTenants[0]"
          :document-type="DocumentType.TAX"
        />
      </div>
      <div
        v-if="selectedGuarantor.typeGuarantor === 'LEGAL_PERSON'"
        id="gcontainer"
        class="menu-grid-row"
      >
        <CoTenantGuarantorDocumentLink
          id="gd0"
          class="ml-5"
          :guarantor="selectedGuarantor"
          :co-tenant="coTenants[0]"
          :document-type="DocumentType.IDENTIFICATION_LEGAL_PERSON"
        />
        <CoTenantGuarantorDocumentLink
          id="gd1"
          class="ml-5"
          :guarantor="selectedGuarantor"
          :co-tenant="coTenants[0]"
          :document-type="DocumentType.IDENTIFICATION"
        />
      </div>
      <div
        v-if="selectedGuarantor.typeGuarantor === 'ORGANISM'"
        id="gcontainer"
        class="menu-grid-row"
      >
        <CoTenantGuarantorDocumentLink
          id="gd0"
          class="ml-5"
          :guarantor="selectedGuarantor"
          :co-tenant="getCoTenant(0)"
          :document-type="DocumentType.GUARANTEE_PROVIDER_CERTIFICATE"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User } from 'df-shared-next/src/models/User'
import TenantDocumentLink from './documents/TenantDocumentLink.vue'
import GuarantorDocumentLink from './documents/GuarantorDocumentLink.vue'
import CoTenantDocumentLink from './documents/CoTenantDocumentLink.vue'
import CoTenantGuarantorDocumentLink from './documents/CoTenantGuarantorDocumentLink.vue'
import { useI18n } from 'vue-i18n'
import { useTenantStore } from '@/stores/tenant-store'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { DocumentType } from './documents/DocumentType'
import { UtilsService } from '@/services/UtilsService'

const store = useTenantStore()
const selectedGuarantor = computed(() => store.selectedGuarantor)
const user = computed(() => store.user)
const coTenants = computed(() => store.coTenants)
const route = useRoute()

const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    step?: number
  }>(),
  {
    step: 0
  }
)

onMounted(() => {
  const substep = UtilsService.getParam(route.params.substep)
  const tel = document.getElementById('td' + substep)
  tel?.scrollIntoView()
  const gel = document.getElementById('gd' + substep)
  gel?.scrollIntoView()
})

function displayGuarantorName(): boolean {
  const isGuarantorSelected =
    !!selectedGuarantor.value?.lastName && !!selectedGuarantor.value?.firstName
  if (props.step === 3) {
    return isGuarantorSelected
  }
  if (props.step === 5 && isCouple()) {
    return isGuarantorSelected
  }
  return false
}

function getClass(s: number) {
  let res = ''
  if (props.step !== s + 1) {
    res += ' small '
  }
  if (props.step === 2 && s === 1) {
    res += ` rad${UtilsService.getParam(route.params.substep)} `
  }
  if (getStep(s)) {
    return res + 'active'
  }
  return res
}

function getStep(s: number) {
  switch (props.step) {
    case 0:
    case 1:
      return s <= 0
    case 2:
      return s <= 1
    case 3:
      return s <= 2
    case 4:
      return s <= 3
    case 5:
      return s <= 4
    case 6:
      return s <= 5
    default:
      return s <= 0
  }
}

function getStepTitle() {
  if (props.step <= 1) {
    return t('personal-information')
  }
  if (props.step === 2) {
    return t('my-document')
  }
  if (props.step === 3) {
    return t('my-guarantor')
  }
  if (props.step === 4 && isCouple()) {
    return t('my-cotenant')
  }
  if (props.step === 5 && isCouple()) {
    return t('my-cotenant-guarantor')
  }
  if (props.step === 6 && isCouple()) {
    return t('validate-file')
  }
  if (props.step === 4 && !isCouple()) {
    return t('validate-file')
  }
  return ''
}

function isCouple() {
  return user.value.applicationType === 'COUPLE'
}

function getCoTenant(index: number): User {
  return coTenants.value[index]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h1 {
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1rem;
  padding-top: 0.5rem;
}

.top-edit-menu {
  white-space: nowrap;
  background-color: var(--background-default-grey);
  @media all and (min-width: 769px) {
    display: none;
  }
}

.inner-top-edit {
  width: 100%;
  display: flex;
  flex-direction: row;
  overflow: scroll;
  justify-content: space-around;
}

.step {
  display: flex;
  align-items: center;
  height: 5px;
}

.step-title {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-bottom: 1.5rem;
  padding-top: 0.5rem;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  line-height: 6px;
}

.hidden {
  visibility: hidden;
}

.ml-5 {
  margin-left: 1rem;
  margin-top: 0.25rem;
  margin-bottom: 1rem;
}

.mr-5 {
  margin-right: 1rem;
}

.menu-grid-row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow: scroll;
}

hr {
  height: 1px;
  opacity: 0.25;
}

[href] {
  box-shadow: none;
  background-image: none;
}

.hline {
  height: 0.3rem;
  border-radius: 0.15rem;
  background-color: var(--g200);
  z-index: 0;
  margin: 2%;
  width: 60%;

  &.active {
    background-color: var(--primary);
  }
}

.small {
  width: 8% !important;
}

.rad1 {
  background: linear-gradient(90deg, var(--primary) 20%, var(--g200) 20%);
}

.rad2 {
  background: linear-gradient(90deg, var(--primary) 40%, var(--g200) 40%);
}

.rad3 {
  background: linear-gradient(90deg, var(--primary) 60%, var(--g200) 60%);
}

.rad4 {
  background: linear-gradient(90deg, var(--primary) 80%, var(--g200) 80%);
}

.small-title {
  font-size: 1rem;
  margin-bottom: 0;
  font-style: normal;
  font-weight: 400;
  margin-left: 1rem;
}
</style>
