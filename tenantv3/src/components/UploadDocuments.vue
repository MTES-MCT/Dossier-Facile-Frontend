<template>
  <div class="fr-mb-15w">
    <div v-if="substep <= 1">
      <Identification></Identification>
      <ProfileFooter @on-back="goBack" @on-next="goNext"></ProfileFooter>
    </div>
    <div v-if="substep === 2">
      <Residency @on-back="goBack" @on-next="checkResidencyAndGoNext"></Residency>
    </div>
    <div v-if="substep === 3">
      <Professional></Professional>
      <ProfileFooter @on-back="goBack" @on-next="goNext"></ProfileFooter>
    </div>
    <div v-if="substep === 4">
      <Financial @on-back="goBack" @on-next="goNext"></Financial>
    </div>
    <div v-if="substep === 5">
      <Tax @on-back="goBack" @on-next="goNext"></Tax>
    </div>
    <ConfirmModal
      v-if="showNbDocumentsResidencyTenant"
      :validate-btn-text="t('uploaddocuments.accept-warning')"
      :cancel-btn-text="t('uploaddocuments.ignore-warning')"
      @cancel="cancelAndgoNext()"
      @close="showNbDocumentsResidencyTenant = false"
      @valid="showNbDocumentsResidencyTenant = false"
    >
      <p v-html="t('uploaddocuments.warning-need-residency-documents-tenant')"></p>
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
import Identification from './documents/tenant/Identification.vue'
import Residency from './documents/tenant/Residency.vue'
import Professional from './documents/tenant/Professional.vue'
import Financial from './documents/tenant/Financial.vue'
import Tax from './documents/tenant/Tax.vue'
import { AnalyticsService } from '../services/AnalyticsService'
import ProfileFooter from './footer/ProfileFooter.vue'
import { DocumentService } from '../services/DocumentService'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import useTenantStore from '../stores/tenant-store'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const store = useTenantStore()
const user = computed(() => store.user)
const router = useRouter()

const props = defineProps<{ substep: number }>()

const showNbDocumentsResidencyTenant = ref(false)

const { t } = useI18n()

function updateSubstep(s: number) {
  router.push({
    name: 'TenantDocuments',
    params: { substep: props.substep === s ? '0' : s.toString() }
  })
}

function goToGuarantor() {
  AnalyticsService.validateFunnel()
  if (user.value.guarantors.length > 0) {
    router.push({
      name: 'GuarantorList'
    })
    return
  }
  router.push({
    name: 'GuarantorChoice'
  })
}

function goBack() {
  if (props.substep > 1) {
    router.push({
      name: 'TenantDocuments',
      params: { substep: (props.substep - 1).toString() }
    })
  } else {
    router.push({
      name: 'TenantType'
    })
  }
}

function checkResidencyAndGoNext() {
  const docs = DocumentService.getDocs('RESIDENCY', user.value)
  if (docs.length === 1) {
    const d = docs[0]
    if (d.documentSubCategory === 'TENANT') {
      const nbPages = d.files?.reduce((s, a) => s + (a.numberOfPages || 0), 0)
      if ((nbPages || 0) < 3) {
        showNbDocumentsResidencyTenant.value = true
        AnalyticsService.missingResidencyDocumentDetected()
        return
      }
    }
  }
  goNext()
}

function cancelAndgoNext() {
  showNbDocumentsResidencyTenant.value = false
  AnalyticsService.forceMissingResidencyDocument()
  goNext()
}

function goNext() {
  if (props.substep < 5) {
    updateSubstep(props.substep + 1)
  } else {
    goToGuarantor()
  }
}
</script>

<style scoped lang="scss">
@import 'df-shared-next/src/scss/_variables.scss';

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
  background-color: $secondary;
}

.check {
  padding: 0.5rem;
  margin-left: auto;
  color: green;
}

.title-bar {
  display: flex;
  align-items: center;

  span {
    padding: 0.5rem;
    line-height: 1rem;
  }
}

h2 {
  line-height: 1.5rem;
}
</style>
