<template>
  <div class="root">
    <div v-if="!fileNotFound" class="fr-container">
      <FileHeader :user="user">
        <div class="fr-alert fr-alert--info bg-white">
          <p v-html="t('preview')" />
        </div>
      </FileHeader>

      <FileReinsurance
        :dossier-status="user?.status || 'TO_PROCESS'"
        :tax-document-status="taxDocumentStatus()"
        :france-connect-tenant-count="franceConnectTenantCount()"
        :tenant-count="user?.tenants?.length || 0"
        :tax-checked="isTaxChecked()"
      ></FileReinsurance>

      <section class="fr-mt-5w fr-mb-3w">
        <div class="fr-tabs">
          <ul class="fr-tabs__list" role="tablist" aria-label="tab-list">
            <li v-for="(tenant, k) in getTenants()" :key="`li${k}`" role="presentation">
              <button
                :id="`tabpanel-${k}`"
                class="fr-tabs__tab fr-tabs__tab--icon-right"
                :class="{ 'fr-fi-icon-fc-right': tenant.franceConnect }"
                :tabindex="tabIndex === k ? 0 : -1"
                role="tab"
                aria-selected="false"
                :aria-controls="`tabpanel-${k}-panel`"
                @click="tabIndex = k"
              >
                {{ UtilsService.tenantFullName(tenant) }}
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
            tabindex="k"
          >
            <div>
              <h2 class="fr-h4">
                {{ t('publicfile.personnal-file') }}
              </h2>
              <ul class="without-padding">
                <RowListItem
                  v-if="tenant.clarification !== undefined"
                  :label="t('tenantpanel.clarification-title')"
                  :sub-label="tenant.clarification"
                  :can-edit="false"
                />
                <FileRowListItem
                  :label="t('publicfile.identification')"
                  :document="document(tenant, 'IDENTIFICATION')"
                  :enable-download="false"
                  :can-edit="false"
                />
                <FileRowListItem
                  :label="t('publicfile.residency')"
                  :document="document(tenant, 'RESIDENCY')"
                  :enable-download="false"
                  :can-edit="false"
                />
                <FileRowListItem
                  :label="t('publicfile.professional')"
                  :document="document(tenant, 'PROFESSIONAL')"
                  :enable-download="false"
                  :can-edit="false"
                />
                <FileRowListItem
                  v-for="(doc, j) in getDocs(tenant, 'FINANCIAL')"
                  :key="doc.id"
                  :label="t('publicfile.financial') + (j >= 1 ? ' ' + (j + 1) : '')"
                  :document="doc"
                  :enable-download="false"
                  :can-edit="false"
                />
                <FileRowListItem
                  :label="t('publicfile.tax')"
                  :document="document(tenant, 'TAX')"
                  :tag-label="getTaxDocumentBadgeLabel(tenant)"
                  :enable-download="false"
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
                  {{ t('publicfile.guarant') }}
                </h2>
                <div v-if="tenant.guarantors">
                  <div v-for="g in tenant.guarantors" :key="g.id">
                    <ul v-if="g.typeGuarantor === 'NATURAL_PERSON'" class="without-padding">
                      <div>
                        <b>{{ UtilsService.guarantorFullName(g) }}</b>
                      </div>
                      <FileRowListItem
                        :label="t('publicfile.identification')"
                        :document="document(g, 'IDENTIFICATION')"
                        :enable-download="false"
                        :can-edit="false"
                      />
                      <FileRowListItem
                        :label="t('publicfile.residency')"
                        :document="document(g, 'RESIDENCY')"
                        :enable-download="false"
                        :can-edit="false"
                      />
                      <FileRowListItem
                        :label="t('publicfile.professional')"
                        :document="document(g, 'PROFESSIONAL')"
                        :enable-download="false"
                        :can-edit="false"
                      />
                      <FileRowListItem
                        v-for="(doc, j) in getDocs(g, 'FINANCIAL')"
                        :key="doc.id"
                        :label="t('publicfile.financial') + (j >= 1 ? ' ' + (j + 1) : '')"
                        :document="doc"
                        :enable-download="false"
                        :can-edit="false"
                      />
                      <FileRowListItem
                        :label="t('publicfile.tax')"
                        :document="document(g, 'TAX')"
                        :tag-label="getTaxDocumentBadgeLabel(g)"
                        :enable-download="false"
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
                        :label="t('publicfile.identification-legal-person')"
                        :document="document(g, 'IDENTIFICATION_LEGAL_PERSON')"
                        :enable-download="false"
                        :can-edit="false"
                      />
                      <FileRowListItem
                        :label="t('publicfile.identification')"
                        :document="document(g, 'IDENTIFICATION')"
                        :enable-download="false"
                        :can-edit="false"
                      />
                    </ul>
                    <ul v-if="g.typeGuarantor === 'ORGANISM'" class="without-padding">
                      <FileRowListItem
                        :label="t('publicfile.organism')"
                        :document="document(g, 'GUARANTEE_PROVIDER_CERTIFICATE')"
                        :enable-download="false"
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
    </div>
    <div v-if="fileNotFound" class="not-found-container fr-mt-5w">
      <FileNotFound></FileNotFound>
    </div>
    <section class="fr-container fr-mb-7w">
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
import FileRowListItem from '../components/documents/FileRowListItem.vue'
import FileHeader from '../components/FileHeader.vue'
import OwnerBanner from '../components/OwnerBanner.vue'
import RowListItem from '../components/documents/RowListItem.vue'
import FileNotFound from '../views/FileNotFound.vue'
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { UtilsService } from '../services/UtilsService'

const { t } = useI18n()

const user = ref(new FileUser())
const tabIndex = ref(0)
const fileNotFound = ref(false)
const route = useRoute()

function franceConnectTenantCount() {
  return user.value?.tenants?.filter((t) => t.franceConnect == true).length || 0
}

function isTaxChecked() {
  const hasAuthenticTax = (user: User) =>
    user.documents?.some(
      (document: DfDocument) =>
        document.documentCategory === 'TAX' && document.authenticityStatus === 'AUTHENTIC'
    )
  return user.value?.tenants?.some(hasAuthenticTax) ?? false
}

onMounted(() => {
  const token = Array.isArray(route.params.token) ? route.params.token[0] : route.params.token
  ProfileService.getPublicUserByToken(token)
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
})

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

function document(u: User | Guarantor, s: string) {
  return u.documents?.find((d) => {
    return d.documentCategory === s
  })
}

function hasGuarantor(tenant: User) {
  return tenant.guarantors && tenant.guarantors.length > 0
}

function getDocs(u: User | Guarantor, docType: string) {
  return u.documents?.filter((d: DfDocument) => {
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

.bg-white {
  background-color: #fff;
}
</style>

<i18n>
{
  "fr": {
    "preview": "Ce dossier est <strong>un aperçu sans document justificatif</strong>.<br />Si vous souhaitez consulter le dossier complet, vous devez demander au candidat de vous le transmettre."
  },
  "en": {
    "preview": "This file is <strong>a preview without supporting documents</strong>.<br />If you wish to consult the complete file, you must ask the candidate to send it to you."
  }
}
</i18n>
