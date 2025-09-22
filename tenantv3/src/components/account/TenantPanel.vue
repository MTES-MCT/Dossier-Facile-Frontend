<template>
  <div>
    <div class="main-information">
      <h3 class="fr-h4">{{ t('tenantpanel.my-files') + props.tenant.firstName }}</h3>
      <ul class="fr-p-0">
        <RowListItem
          v-if="!isCotenant"
          :to="{ name: 'ValidateFile' }"
          :label="t('tenantpanel.clarification-title')"
          :sub-label="'clarification' in tenant ? tenant.clarification || '' : ''"
          :can-edit="showButtons"
        />
        <RowListItem
          :to="tenantNamePage"
          :label="UtilsService.tenantFullName(props.tenant)"
          :can-edit="showButtons"
        />
        <FileRowListItem
          :to="identityDocumentPage"
          :label="t('tenantpanel.identification')"
          :document="document(props.tenant, 'IDENTIFICATION')"
          :can-edit="showButtons"
          :enable-download="showButtons"
          @click-edit="AnalyticsService.editFromAccount(1)"
        />
        <FileRowListItem
          :to="residencyPage"
          :label="t('tenantpanel.residency')"
          :document="document(props.tenant, 'RESIDENCY')"
          :can-edit="showButtons"
          :enable-download="showButtons"
          @click-edit="AnalyticsService.editFromAccount(2)"
        />
        <FileRowListItem
          :to="mainActivityPage"
          :label="t('tenantpanel.professional')"
          :sub-label="getProfessionalSubCategory(props.tenant)"
          :document="document(props.tenant, 'PROFESSIONAL')"
          :can-edit="showButtons"
          :enable-download="showButtons"
          @click-edit="AnalyticsService.editFromAccount(3)"
        />
        <span v-if="documents(props.tenant, 'FINANCIAL').length > 1">
          <FileRowListItem
            v-for="doc in documents(props.tenant, 'FINANCIAL')"
            :key="doc.id"
            :to="financialPage"
            :label="t('tenantpanel.financial')"
            :sub-label="t(`documents.subcategory.${doc.documentSubCategory}`)"
            :document="doc"
            :can-edit="showButtons"
            :enable-download="showButtons"
            @click-edit="AnalyticsService.editFromAccount(4)"
          />
        </span>
        <FileRowListItem
          v-else
          :to="financialPage"
          :label="t('tenantpanel.financial')"
          :document="document(props.tenant, 'FINANCIAL')"
          :can-edit="showButtons"
          :enable-download="showButtons"
          @click-edit="AnalyticsService.editFromAccount(4)"
        />
        <FileRowListItem
          :to="taxPage"
          :label="t('tenantpanel.tax')"
          :document="document(props.tenant, 'TAX')"
          :can-edit="showButtons"
          :enable-download="showButtons"
          @click-edit="AnalyticsService.editFromAccount(5)"
        />
      </ul>
    </div>

    <GuarantorsSection
      :can-edit="showButtons"
      :enable-download="showButtons"
      :tenant="props.tenant"
    />
  </div>
</template>

<script setup lang="ts">
import { User } from 'df-shared-next/src/models/User'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { AnalyticsService } from '../../services/AnalyticsService'
import GuarantorsSection from '../../components/account/GuarantorsSection.vue'
import RowListItem from '../documents/RowListItem.vue'
import FileRowListItem from '../../components/documents/FileRowListItem.vue'
import { useI18n } from 'vue-i18n'
import { UtilsService } from '../../services/UtilsService'
import { computed } from 'vue'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'
import { DocumentService } from '@/services/DocumentService'
import { useTenantStore } from '@/stores/tenant-store'
import { makeActivityLink } from '../mainActivity/lib/useMainActivityLink'
import { makeResidencyLink } from '../residency/lib/useResidencyLink'
import { makeIdentityDocumentLink } from '../identityDocument/lib/identityDocumentLink'
import { makeTaxLink } from '../tax/lib/taxLink'

const props = withDefaults(
  defineProps<{
    tenant: User | CoTenant
    isCotenant?: boolean
    isCouple?: boolean
  }>(),
  {
    isCotenant: false,
    isCouple: false
  }
)

const { t } = useI18n()
const store = useTenantStore()

const showButtons = computed(() => {
  return !props.isCotenant || props.isCouple
})

const tenantNamePage = computed(() => {
  if (props.isCotenant) {
    return {
      name: 'CoupleName',
      params: {
        tenantId: props.tenant?.id.toString(),
        step: '4'
      }
    }
  } else {
    return { name: 'TenantName' }
  }
})

const identityDocumentPage = computed(() => {
  const tenant = props.isCotenant ? props.tenant : store.user
  const path = props.isCotenant
    ? `/documents-colocataire/${props.tenant.id}/4/1`
    : '/documents-locataire/1'
  const doc = tenant.documents?.find((d) => d.documentCategory === 'IDENTIFICATION')
  return makeIdentityDocumentLink(doc, path)
})

const residencyPage = computed(() => {
  const tenant = props.isCotenant ? props.tenant : store.user
  const path = props.isCotenant
    ? `/documents-colocataire/${props.tenant.id}/4/2`
    : '/documents-locataire/2'
  return makeResidencyLink(tenant, path)
})

const mainActivityPage = computed(() => {
  const tenant = props.isCotenant ? props.tenant : store.user
  const doc = DocumentService.getDoc('PROFESSIONAL', tenant.documents)
  const path = props.isCotenant
    ? `/documents-colocataire/${props.tenant.id}/4/3`
    : '/documents-locataire/3'
  return makeActivityLink(doc?.documentSubCategory, path)
})

const taxPage = computed(() => {
  const tenant = props.isCotenant ? props.tenant : store.user
  const doc = DocumentService.getDoc('TAX', tenant.documents)
  const path = props.isCotenant
    ? `/documents-colocataire/${props.tenant.id}/4/5`
    : '/documents-locataire/5'
  return makeTaxLink(doc, path)
})

const financialPage = computed(() => {
  if (props.isCotenant) {
    return {
      name: 'CoupleFinancial',
      params: {
        tenantId: props.tenant?.id.toString(),
        step: '4'
      }
    }
  } else {
    return { name: 'TenantFinancial' }
  }
})

function document(u: CoTenant, s: string) {
  return u.documents?.find((d) => {
    return d.documentCategory === s
  })
}

function documents(g: CoTenant, docType: string): DfDocument[] {
  return (
    g.documents?.filter((d: DfDocument) => {
      return d.documentCategory === docType
    }) || []
  )
}

function getProfessionalSubCategory(u: CoTenant): string {
  const professionalDocument = document(u, 'PROFESSIONAL')
  const translationKey = professionalDocument?.documentSubCategory
    ?.toLowerCase()
    .replaceAll('_', '-')
  return t(translationKey || '')
}
</script>

<style scoped lang="scss">
h1 {
  color: var(--bf500);
  font-size: 2rem;
}

h2 {
  color: var(--bf500);
  font-size: 2rem;
}

.align--center {
  text-align: center;
  margin: auto;
}

.bg-white {
  box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);
  background: var(--grey-1000-50);
}

.fr-btn.delete-btn {
  background-color: var(--error);
  --color-hover: rgba(246, 0, 0, 0.5);
  --color-active: rgba(255, 91, 91, 0.5);
}

.grp {
  display: block;
  position: relative;
}

.grp-btn {
  border-left: 1px solid var(--background-default-grey);
  position: relative;
}

p {
  word-break: break-word;
}

.edit-btn {
  position: absolute;
  right: 0;
  top: 0;

  box-shadow: none;
}

.description:first-letter {
  text-transform: uppercase;
}

hr {
  border: 0;
  margin-left: 20%;
  margin-right: 20%;
  border-top: 1px solid var(--g400);
}

.fr-tile__body {
  overflow: auto;
}

.cleana {
  &:after {
    content: none;
  }
  &:focus {
    outline-style: auto;
    outline-width: 2px;
    outline-offset: 4px;
    outline-color: #0a76f6;
  }
}

.alert-container {
  display: flex;
  flex-direction: row-reverse;
}

.red-alert {
  background-color: var(--error);
  color: white;
  border-radius: 2px;
  margin-right: 0;
  margin-left: auto;
  padding: 0.5rem;
}

.name-email-tile {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dflex {
  display: flex;
  align-items: center;
}

.mobile-margin {
  @media all and (max-width: 768px) {
    margin-bottom: 1rem;
  }
}

.btn-container {
  margin-left: auto;

  @media all and (max-width: 600px) {
    width: 100%;
  }
}

.share-file-description {
  max-width: fit-content;
}
</style>
