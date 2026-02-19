<template>
  <div class="root" :class="{ 'blue-background': viewState === 'fileContent' }">
    <TrigramAuthentication
      v-if="viewState === 'trigram'"
      :has-error="trigramError"
      @submit="handleTrigramSubmit"
    />
    <div v-if="viewState === 'fileContent'" class="fr-container">
      <FileHeader :user="user">
        <DownloadFileButton
          ref="download-button"
          :show-progress-bar="showProgressBar"
          :disabled="!user || user.status !== 'VALIDATED'"
          @download="download"
        />
      </FileHeader>
      <FileReinsurance
        v-if="user !== null"
        :dossier-status="user.status"
        :tax-document-status="taxDocumentStatus()"
        :france-connect-tenant-count="franceConnectTenantCount()"
        :tenant-count="user.tenants?.length"
        :tax-checked="isTaxChecked()"
      ></FileReinsurance>

      <section class="fr-mt-5w fr-mb-3w">
        <div class="fr-tabs">
          <ul class="fr-tabs__list" role="tablist" aria-label="tab-list">
            <li v-for="(tenant, k) in getTenants()" :key="`li${k}`" role="presentation">
              <button
                :id="`tabpanel-${k}`"
                class="fr-tabs__tab fr-container--fluid"
                :tabindex="tabIndex === k ? 0 : -1"
                role="tab"
                aria-selected="false"
                :aria-controls="`tabpanel-${k}-panel`"
              >
                <div class="fr-grid-row">
                  <div class="name fr-col-xs-12 fr-col fr-mr-1w">
                    {{ UtilsService.tenantFullName(tenant) }}
                    <span
                      :class="{
                        'fr-fi-icon-fc': tenant.franceConnect && tenant.ownerType === 'SELF'
                      }"
                    ></span>
                  </div>
                  <div class="fr-col-xs-12 fr-col fr-mr-1w fr-grid-row">
                    <ColoredBadge
                      :status="tenant.status"
                      :warn="true"
                      :text="t(`dossier.warn-${tenant.status}`)"
                    />
                  </div>
                </div>
              </button>
            </li>
          </ul>
          <div
            v-for="(tenant, k) in getTenants()"
            :id="`tabpanel-${k}-panel`"
            :key="`t${k}`"
            class="fr-tabs__panel"
            aria-selected="false"
            role="tabpanel"
            :tabindex="k"
          >
            <div>
              <h2 class="fr-h4">
                {{ t('file.personnal-file') }}
              </h2>
              <ul class="without-padding">
                <RowListItem
                  v-if="tenant.clarification !== undefined"
                  :label="t('tenantpanel.clarification-title')"
                  :sub-label="tenant.clarification"
                  :can-edit="false"
                />
                <FileRowListItem
                  :label="t('file.identification')"
                  :document="document(tenant, 'IDENTIFICATION')"
                  :show-validated="true"
                  :can-edit="false"
                />
                <FileRowListItem
                  :label="t('file.residency')"
                  :document="document(tenant, 'RESIDENCY')"
                  :show-validated="true"
                  :can-edit="false"
                />
                <FileRowListItem
                  :label="t('file.professional')"
                  :document="document(tenant, 'PROFESSIONAL')"
                  :show-validated="true"
                  :can-edit="false"
                />
                <FileRowListItem
                  v-for="(doc, j) in getDocs(tenant, 'FINANCIAL')"
                  :key="doc.id"
                  :label="t('file.financial') + (j >= 1 ? ' ' + (j + 1) : '')"
                  :document="doc"
                  :show-validated="true"
                  :can-edit="false"
                />
                <FileRowListItem
                  :label="t('file.tax')"
                  :tag-label="getTaxDocumentBadgeLabel(tenant)"
                  :document="document(tenant, 'TAX')"
                  :show-validated="true"
                  :can-edit="false"
                >
                  <template #postTag>
                    <div v-if="isTaxAuthentic(tenant)">
                      <img
                        src="../assets/images/icons/dgfip-icon.png"
                        alt="Logo DGFIP"
                        class="icon-dgfip"
                      />
                    </div>
                  </template>
                </FileRowListItem>
              </ul>
              <div v-if="hasGuarantor(tenant)">
                <h2 class="fr-h4 fr-mt-5w">
                  {{ t('file.guarant') }}
                </h2>
                <div v-if="tenant.guarantors">
                  <div v-for="g in tenant.guarantors" :key="g.id">
                    <ul v-if="g.typeGuarantor === 'NATURAL_PERSON'" class="without-padding">
                      <div>
                        <b>{{ UtilsService.guarantorFullName(g) }}</b>
                      </div>
                      <FileRowListItem
                        :label="t('file.identification')"
                        :document="document(g, 'IDENTIFICATION')"
                        :show-validated="true"
                        :can-edit="false"
                      />
                      <FileRowListItem
                        :label="t('file.residency')"
                        :document="document(g, 'RESIDENCY')"
                        :show-validated="true"
                        :can-edit="false"
                      />
                      <FileRowListItem
                        :label="t('file.professional')"
                        :document="document(g, 'PROFESSIONAL')"
                        :show-validated="true"
                        :can-edit="false"
                      />
                      <FileRowListItem
                        v-for="(doc, j) in getDocs(g, 'FINANCIAL')"
                        :key="doc.id"
                        :label="t('file.financial') + (j >= 1 ? ' ' + (j + 1) : '')"
                        :document="doc"
                        :show-validated="true"
                        :can-edit="false"
                      />
                      <FileRowListItem
                        :label="t('file.tax')"
                        :tag-label="getTaxDocumentBadgeLabel(g)"
                        :document="document(g, 'TAX')"
                        :show-validated="true"
                        :can-edit="false"
                      >
                        <template #postTag>
                          <div v-if="isTaxAuthentic(g)">
                            <img
                              src="../assets/images/icons/dgfip-icon.png"
                              alt="Logo DGFIP"
                              class="icon-dgfip"
                            />
                          </div>
                        </template>
                      </FileRowListItem>
                    </ul>
                    <ul v-if="g.typeGuarantor === 'LEGAL_PERSON'" class="without-padding">
                      <FileRowListItem
                        :label="t('file.identification-legal-person')"
                        :document="document(g, 'IDENTIFICATION_LEGAL_PERSON')"
                        :show-validated="true"
                        :can-edit="false"
                      />
                      <FileRowListItem
                        :label="t('file.identification')"
                        :document="document(g, 'IDENTIFICATION')"
                        :show-validated="true"
                        :can-edit="false"
                      />
                    </ul>
                    <ul v-if="g.typeGuarantor === 'ORGANISM'" class="without-padding">
                      <FileRowListItem
                        :label="t('file.organism')"
                        :document="document(g, 'GUARANTEE_PROVIDER_CERTIFICATE')"
                        :show-validated="true"
                        :can-edit="false"
                      />
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="fr-mb-7w">
        <div class="text-center">
          <DownloadFileButton
            :show-progress-bar="showProgressBar"
            :disabled="!user || user.status !== 'VALIDATED'"
            @download="download"
          />
        </div>
      </section>
    </div>
    <div v-if="viewState === 'notFound'" class="fr-container fr-mt-5w">
      <FileNotFound></FileNotFound>
    </div>
    <div v-if="viewState === 'tooManyRequests'" class="fr-container fr-mt-5w">
      <FileTooManyRequest></FileTooManyRequest>
    </div>
    <div v-if="viewState === 'badLink'" class="fr-container fr-mt-5w">
      <FileBadLink></FileBadLink>
    </div>
    <section class="fr-mb-7w fr-container">
      <div class="fr-mt-3w fr-text--sm fr-label--disabled">
        {{ t('file.disclaimer') }}
      </div>
      <OwnerBanner></OwnerBanner>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { User } from 'df-shared-next/src/models/User'
import { FileUser } from 'df-shared-next/src/models/FileUser'
import { ProfileService } from '../services/ProfileService'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import FileReinsurance from '../components/FileReinsurance.vue'
import DownloadFileButton from '../components/DownloadFileButton.vue'
import FileRowListItem from '../components/documents/FileRowListItem.vue'
import OwnerBanner from '../components/OwnerBanner.vue'
import FileHeader from '../components/FileHeader.vue'
import RowListItem from '@/components/documents/RowListItem.vue'
import FileNotFound from '@/views/FileNotFound.vue'
import FileTooManyRequest from '@/views/FileTooManyRequest.vue'
import FileBadLink from '@/views/FileBadLink.vue'
import TrigramAuthentication from '@/components/TrigramAuthentication.vue'
import { useI18n } from 'vue-i18n'
import { onMounted, ref, useTemplateRef } from 'vue'
import { useRoute } from 'vue-router'
import { UtilsService } from '@/services/UtilsService'
import { toast } from '@/components/toast/toastUtils'
import { AnalyticsService } from '@/services/AnalyticsService'
import ColoredBadge from 'df-shared-next/src/components/ColoredBadge.vue'

type ViewState = 'fileContent' | 'trigram' | 'notFound' | 'tooManyRequests' | 'badLink'

const { t } = useI18n()
const route = useRoute()

const user = ref(new FileUser())
const tabIndex = ref(0)
const showProgressBar = ref(false)
const viewState = ref<ViewState>('fileContent')
const trigramValue = ref('')
const trigramError = ref(false)
const downloadButton = useTemplateRef('download-button')

function franceConnectTenantCount() {
  return user.value?.tenants?.filter((t) => t.franceConnect && t.ownerType === 'SELF').length
}

function isTaxChecked() {
  const hasAuthenticTax = (user: User) =>
    user.documents?.some(
      (document: DfDocument) =>
        document.documentCategory === 'TAX' && document.authenticityStatus === 'AUTHENTIC'
    )
  return user.value?.tenants?.some((t) => hasAuthenticTax(t))
}

function testIfLinkExists() {
  const token = Array.isArray(route.params.token) ? route.params.token[0] : route.params.token

  // Track opening of full link
  AnalyticsService.openFullLink()

  return ProfileService.testLinkByToken(token)
    .then((d) => {
      // Track display of trigram feature
      AnalyticsService.displayTrigramFeature()
      viewState.value = 'trigram'
    })
    .catch((error) => {
      handleAPIError(error.response?.status)
    })
}

function setUser(trigram: string) {
  const token = Array.isArray(route.params.token) ? route.params.token[0] : route.params.token
    
  ProfileService.getLinkByToken(token, trigram)
  .then((d) => {
    user.value = d.data
    if (user.value) {
      user.value.tenants = user.value?.tenants?.sort((t1, t2) => {
        return t1.tenantType === 'CREATE' && t2.tenantType !== 'CREATE' ? -1 : 1
      })
    }
    // Authentication successful, hide the trigram modal
    viewState.value = 'fileContent'
    trigramValue.value = trigram
    trigramError.value = false
  })
  .catch((error) => {
    handleAPIError(error.response?.status, trigram)
  })
}

function handleAPIError(statusCode: number, trigram?: string) {
  switch (statusCode) {
    case 404:
      viewState.value = 'notFound'
      break
    case 400:
      viewState.value = 'badLink'
      break
    case 429:
      viewState.value = 'tooManyRequests'
      break
    case 403:
      viewState.value = 'trigram'
      // If we were trying with a trigram, show error
      if (trigram) {
        trigramError.value = true
        AnalyticsService.trigramError()
      }
      break
    default:
      viewState.value = 'notFound'
  }
}

function handleTrigramSubmit(trigram: string) {
  trigramError.value = false
  setUser(trigram)
}

onMounted(() => testIfLinkExists())

function document(u: User | Guarantor, s: string) {
  return u.documents?.find((d) => {
    return d.documentCategory === s
  })
}

function getTenants() {
  return user.value?.tenants ?? []
}

function taxDocumentStatus() {
  const taxStatuses = user.value?.tenants?.map((tenant) => document(tenant, 'TAX')?.documentStatus)

  if (taxStatuses?.every((docStatus) => docStatus === 'VALIDATED')) {
    return 'ok'
  } else if (
    taxStatuses?.every((docStatus) => docStatus === 'VALIDATED' || docStatus === 'TO_PROCESS')
  ) {
    return 'to_process'
  }
  return 'nok'
}

function retryDownload(remainingCount: number) {
  setTimeout(() => {
    setUser(trigramValue.value)
    if (user.value?.dossierPdfDocumentStatus === 'COMPLETED' && user.value?.dossierPdfUrl) {
      downloadFile(user.value?.dossierPdfUrl)
    } else if (remainingCount > 0) {
      retryDownload(remainingCount - 1)
    } else {
      showProgressBar.value = false
      toast.error(t('file.download-failed-try-later'), downloadButton.value?.dfButton?.button)
    }
  }, 15000)
}

function downloadFile(url: string) {
  ProfileService.getFile(url)
    .then((response) => {
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const link = globalThis.document.createElement('a')
      link.href = globalThis.URL.createObjectURL(blob)
      // Récupère le nom du fichier depuis le header Content-Disposition
      const fileName = UtilsService.getFileNameFromHeaders(response.headers, 'dossierFacile.pdf')
      link.download = fileName
      link.click()
    })
    .catch((error) => {
      console.error(error)
      toast.error(t('file.download-failed'), downloadButton.value?.dfButton?.button)
    })
    .finally(() => (showProgressBar.value = false))
}

function download() {
  showProgressBar.value = true
  if (user.value?.dossierPdfDocumentStatus === 'COMPLETED' && user.value?.dossierPdfUrl) {
    downloadFile(user.value?.dossierPdfUrl)
  } else {
    const token = Array.isArray(route.params.token) ? route.params.token[0] : route.params.token
    ProfileService.postCreateFullPdf(token)
      .then(() => {
        retryDownload(6)
      })
      .catch(() => {
        showProgressBar.value = false
        toast.error(t('file.download-failed'), downloadButton.value?.dfButton?.button)
      })
  }
}

function hasGuarantor(tenant: User) {
  return tenant.guarantors && tenant.guarantors.length > 0
}

function getDocs(tenant: User | Guarantor, docType: string) {
  return tenant.documents?.filter((d: DfDocument) => {
    return d.documentCategory === docType
  })
}

function isTaxAuthentic(user: User | Guarantor) {
  const doc = document(user, 'TAX')
  return doc?.authenticityStatus === 'AUTHENTIC'
}

function getTaxDocumentBadgeLabel(user: User | Guarantor): string {
  const doc = document(user, 'TAX')
  return isTaxAuthentic(user)
    ? t('file.tax-verified')
    : t('documents.status.' + doc?.documentStatus)
}
</script>

<style scoped lang="scss">
.background {
  width: 100%;
  top: 0;
  left: 0;
  background-size: cover !important;
  background-position: 50% 50% !important;
  background-image: url('../assets/cover-features.webp');
  z-index: 0;

  @media (max-width: 768px) {
    background-image: url('../assets/cover-features-mobile.webp');
  }
}
.root {
  width: 100%;
}
.blue-background {
  background-color: var(--bf100-g750);
}
.without-padding {
  padding: 0;
}

.fr-tabs {
  background-color: var(--background-default-grey);
}

.fr-fi-icon-fc {
  &:before {
    content: '';
    background-color: transparent;
    background-image: url('../assets/images/icons/franceconnect-icon.png');
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    height: 21px;
    width: 24px;
    margin-left: 0.5rem;
  }
}

.icon-dgfip {
  height: 46px;
  margin-left: 2rem;
}

.fr-badge {
  --text-default-grey: #fff;
  --background-contrast-grey: #1d2437;
}
</style>
