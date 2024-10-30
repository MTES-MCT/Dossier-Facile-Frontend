<template>
  <div class="root" :class="{ 'blue-background': !fileNotFound }">
    <div class="fr-container" v-if="!fileNotFound">
      <FileHeader :user="user">
        <div>
          <DfButton v-if="showProgressBar" :primary="true"
            >{{ t('file.download-all-inprogress')
            }}<span><ProgressIndicator diameter="22px" border="3px" /></span>
          </DfButton>
          <DfButton
            :disabled="!user || user.status !== 'VALIDATED'"
            v-else
            :title="t('file.download-disabled-title')"
            :primary="true"
            @on-click="download"
            >{{ t('file.download-all') }}</DfButton
          >
        </div>
      </FileHeader>
      <FileReinsurance
        v-if="user !== null"
        :dossierStatus="user.status"
        :taxDocumentStatus="taxDocumentStatus()"
        :franceConnectTenantCount="franceConnectTenantCount()"
        :tenantCount="user.tenants?.length"
        :taxChecked="isTaxChecked()"
      ></FileReinsurance>

      <section class="fr-mt-5w fr-mb-3w">
        <div class="fr-tabs">
          <ul class="fr-tabs__list" role="tablist" aria-label="tab-list">
            <li v-for="(tenant, k) in getTenants()" v-bind:key="`li${k}`" role="presentation">
              <button
                class="fr-tabs__tab fr-tabs__tab--icon-right"
                :class="{ 'fr-fi-icon-fc-right': tenant.franceConnect }"
                :id="`tabpanel-${k}`"
                :tabindex="tabIndex === k ? 0 : -1"
                role="tab"
                aria-selected="false"
                :aria-controls="`tabpanel-${k}-panel`"
              >
                {{ UtilsService.tenantFullName(tenant) }}
              </button>
            </li>
          </ul>
          <div
            v-for="(tenant, k) in getTenants()"
            v-bind:key="`t${k}`"
            :id="`tabpanel-${k}-panel`"
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
                  :subLabel="tenant.clarification"
                  :canEdit="false"
                />
                <FileRowListItem
                  :label="t('file.identification')"
                  :document="document(tenant, 'IDENTIFICATION')"
                  :showValidated="true"
                  :canEdit="false"
                />
                <FileRowListItem
                  :label="t('file.residency')"
                  :document="document(tenant, 'RESIDENCY')"
                  :showValidated="true"
                  :canEdit="false"
                />
                <FileRowListItem
                  :label="t('file.professional')"
                  :document="document(tenant, 'PROFESSIONAL')"
                  :showValidated="true"
                  :canEdit="false"
                />
                <FileRowListItem
                  v-for="(doc, k) in getDocs(tenant, 'FINANCIAL')"
                  v-bind:key="doc.id"
                  :label="t('file.financial') + (k >= 1 ? ' ' + (k + 1) : '')"
                  :document="doc"
                  :showValidated="true"
                  :canEdit="false"
                />
                <FileRowListItem
                  :label="t('file.tax')"
                  :tagLabel="getTaxDocumentBadgeLabel(tenant)"
                  :document="document(tenant, 'TAX')"
                  :showValidated="true"
                  :canEdit="false"
                >
                  <template v-slot:postTag>
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
                  <div v-for="g in tenant.guarantors" v-bind:key="g.id">
                    <ul v-if="g.typeGuarantor === 'NATURAL_PERSON'" class="without-padding">
                      <div>
                        <b>{{ UtilsService.guarantorFullName(g) }}</b>
                      </div>
                      <FileRowListItem
                        :label="t('file.identification')"
                        :document="document(g, 'IDENTIFICATION')"
                        :showValidated="true"
                        :canEdit="false"
                      />
                      <FileRowListItem
                        :label="t('file.residency')"
                        :document="document(g, 'RESIDENCY')"
                        :showValidated="true"
                        :canEdit="false"
                      />
                      <FileRowListItem
                        :label="t('file.professional')"
                        :document="document(g, 'PROFESSIONAL')"
                        :showValidated="true"
                        :canEdit="false"
                      />
                      <FileRowListItem
                        v-for="(doc, k) in getDocs(g, 'FINANCIAL')"
                        v-bind:key="doc.id"
                        :label="t('file.financial') + (k >= 1 ? ' ' + (k + 1) : '')"
                        :document="doc"
                        :showValidated="true"
                        :canEdit="false"
                      />
                      <FileRowListItem
                        :label="t('file.tax')"
                        :tagLabel="getTaxDocumentBadgeLabel(g)"
                        :document="document(g, 'TAX')"
                        :showValidated="true"
                        :canEdit="false"
                      >
                        <template v-slot:postTag>
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
                        :showValidated="true"
                        :canEdit="false"
                      />
                      <FileRowListItem
                        :label="t('file.identification')"
                        :document="document(g, 'IDENTIFICATION')"
                        :showValidated="true"
                        :canEdit="false"
                      />
                    </ul>
                    <ul v-if="g.typeGuarantor === 'ORGANISM'" class="without-padding">
                      <FileRowListItem
                        :label="t('file.organism')"
                        :document="document(g, 'GUARANTEE_PROVIDER_CERTIFICATE')"
                        :showValidated="true"
                        :canEdit="false"
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
          <DfButton v-if="showProgressBar" :primary="true"
            >{{ t('file.download-all-inprogress')
            }}<span><ProgressIndicator diameter="22px" border="3px" /></span>
          </DfButton>
          <DfButton
            :disabled="!user || user.status != 'VALIDATED'"
            v-else
            :title="t('file.download-disabled-title')"
            :primary="true"
            @on-click="download"
            >{{ t('file.download-all') }}</DfButton
          >
        </div>
      </section>
    </div>
    <div v-if="fileNotFound" class="not-found-container fr-mt-5w">
      <FileNotFound></FileNotFound>
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
import DfButton from 'df-shared-next/src/Button/Button.vue'
import { ProfileService } from '../services/ProfileService'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import FileReinsurance from '../components/FileReinsurance.vue'
import ProgressIndicator from 'df-shared-next/src/Button/ProgressIndicator.vue'
import FileRowListItem from '../components/documents/FileRowListItem.vue'
import OwnerBanner from '../components/OwnerBanner.vue'
import FileHeader from '../components/FileHeader.vue'
import RowListItem from '@/components/documents/RowListItem.vue'
import FileNotFound from '@/views/FileNotFound.vue'
import { ToastService } from '@/services/ToastService'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { UtilsService } from '@/services/UtilsService'

const { t } = useI18n()
const route = useRoute()

const user = ref(new FileUser())
const tabIndex = ref(0)
const showProgressBar = ref(false)
const fileNotFound = ref(false)

function franceConnectTenantCount() {
  return user.value?.tenants?.filter((t) => t.franceConnect == true).length
}

function isTaxChecked() {
  const hasAuthenticTax = (user: User) =>
    user.documents?.some(
      (document: DfDocument) =>
        document.documentCategory === 'TAX' && document.authenticityStatus === 'AUTHENTIC'
    )
  return user.value?.tenants?.some((t) => hasAuthenticTax(t))
}

function setUser() {
  const token = Array.isArray(route.params.token) ? route.params.token[0] : route.params.token
  ProfileService.getUserByToken(token)
    .then((d) => {
      user.value = d.data
      if (user.value) {
        user.value.tenants = user.value?.tenants?.sort((t1, t2) => {
          return t1.tenantType === 'CREATE' && t2.tenantType !== 'CREATE' ? -1 : 1
        })
      }
    })
    .catch(() => {
      fileNotFound.value = true
    })
}

function document(u: User | Guarantor, s: string) {
  return u.documents?.find((d) => {
    return d.documentCategory === s
  })
}

function getTenants() {
  const users: User[] = []
  user.value?.tenants?.forEach((t) => {
    if (t.firstName && t.lastName && t.firstName !== '' && t.lastName !== '') {
      users.push(t)
    }
  })

  return users
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
    setUser()
    if (user.value?.dossierPdfDocumentStatus === 'COMPLETED' && user.value?.dossierPdfUrl) {
      downloadFile(user.value?.dossierPdfUrl)
    } else if (remainingCount > 0) {
      retryDownload(remainingCount - 1)
    } else {
      showProgressBar.value = false
      ToastService.error('file.download-failed')
    }
  }, 15000)
}

function downloadFile(url: string) {
  ProfileService.getFile(url)
    .then((response) => {
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const link = window.document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      const token = Array.isArray(route.params.token) ? route.params.token[0] : route.params.token
      link.download = 'dossierFacile-' + token + '.pdf'
      link.click()
    })
    .catch((error) => {
      console.error(error)
      ToastService.error()
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
        ToastService.error()
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
  const doc = document(user, 'TAX') as DfDocument
  return doc.authenticityStatus === 'AUTHENTIC'
}

function getTaxDocumentBadgeLabel(user: User | Guarantor): string {
  const doc = document(user, 'TAX') as DfDocument
  return isTaxAuthentic(user) ? t('file.tax-verified') : t('documents.status.' + doc.documentStatus)
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

.fr-fi-icon-fc-right {
  flex-direction: row-reverse;

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
.not-found-container {
  width: 100vw;
  display: flex;
  justify-content: center;
}

.fr-badge {
  --text-default-grey: #fff;
  --background-contrast-grey: #1d2437;
}
</style>
