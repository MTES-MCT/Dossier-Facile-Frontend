<template>
  <ol id="funnel-menu" class="left-edit-menu fr-pt-7w fr-pb-12w">
    <li class="step" :class="{ active: isActive('information') }">
      <router-link :to="{ name: 'TenantName', force: true }" class="step-title">
        {{ t('personal-information') }}
      </router-link>
      <ul class="vline">
        <li class="ml-5">
          <router-link :to="{ name: 'TenantName', force: true }">
            <ColoredTag
              :label="t('lefteditmenu.identity')"
              :text="UtilsService.tenantFullName(user)"
              status="NAME"
            />
          </router-link>
        </li>
        <li v-if="user.applicationType" class="ml-5">
          <router-link :to="{ name: 'TenantType', force: true }">
            <ColoredTag
              :label="t('lefteditmenu.file-type')"
              :text="t(`lefteditmenu.${user.applicationType}`)"
              :status="user.applicationType"
              :active="step < 2"
            ></ColoredTag>
          </router-link>
        </li>
      </ul>
    </li>
    <li class="step" :class="{ active: isActive('documents') }">
      <router-link class="step-title" :to="idDocLink">{{ t('my-document') }} </router-link>
      <ul v-if="step === 2" class="vline">
        <li v-for="docType of TENANT_DOCUMENTS" :key="docType">
          <TenantDocumentLink :document-type="docType" />
        </li>
      </ul>
    </li>
    <li class="step" :class="{ active: isActive('guarantor') }">
      <router-link class="step-title" :to="getGuarantorLink()"
        >{{ t('my-guarantor') }}
      </router-link>
      <ul v-if="step === getStepNumber('guarantor') && selectedGuarantor" class="vline">
        <template
          v-if="
            selectedGuarantor.typeGuarantor === 'NATURAL_PERSON' &&
            selectedGuarantor.firstName !== undefined &&
            selectedGuarantor.lastName !== undefined
          "
        >
          <template v-for="(g, k) in user.guarantors" :key="k">
            <li class="ml-5 bold">
              <router-link
                :to="{
                  name: 'GuarantorName',
                  params: { guarantorId: g.id }
                }"
              >
                <ColoredTag
                  :text="`${g.firstName} ${g.lastName}`"
                  status="NONE"
                  :active="getGuarantorCurrentStep(0, g)"
                ></ColoredTag>
              </router-link>
            </li>
            <li v-for="docType of TENANT_DOCUMENTS" :key="docType" class="ml-10">
              <GuarantorDocumentLink :guarantor="g" :document-type="docType" />
            </li>
          </template>
        </template>
        <template v-if="selectedGuarantor.typeGuarantor === 'LEGAL_PERSON'">
          <li class="ml-5">
            <GuarantorDocumentLink
              :guarantor="selectedGuarantor"
              :document-type="DocumentType.IDENTIFICATION_LEGAL_PERSON"
            />
          </li>
          <li class="ml-5">
            <GuarantorDocumentLink
              :guarantor="selectedGuarantor"
              :document-type="DocumentType.IDENTIFICATION"
            />
          </li>
        </template>
        <li v-if="selectedGuarantor.typeGuarantor === 'ORGANISM'" class="ml-5">
          <GuarantorDocumentLink
            :guarantor="selectedGuarantor"
            :document-type="DocumentType.GUARANTEE_PROVIDER_CERTIFICATE"
          />
        </li>
      </ul>
    </li>
    <li v-if="isCouple()" class="step" :class="{ active: isActive('coTenant') }">
      <router-link
        class="step-title"
        :to="{
          name: 'CoupleName',
          force: true,
          params: {
            step: getStepNumber('coTenant'),
            tenantId: getCoTenant(0).id
          }
        }"
        >{{ t('my-cotenant') }}
      </router-link>
      <ul v-if="step === getStepNumber('coTenant')" class="vline">
        <template v-for="(coTenant, k) in coTenants" :key="k">
          <li class="ml-5 bold">
            <router-link
              :to="{
                name: 'CoupleName',
                force: true,
                params: { tenantId: coTenant.id, step: 4 }
              }"
            >
              <ColoredTag
                :text="getName(coTenant)"
                status="NONE"
                :active="getCurrentSubStep() == 0"
              ></ColoredTag>
            </router-link>
          </li>
          <li v-for="docType in TENANT_DOCUMENTS" :key="docType" class="ml-10">
            <CoTenantDocumentLink :co-tenant="coTenant" :document-type="docType" />
          </li>
        </template>
      </ul>
    </li>

    <li v-if="isCouple()" class="step" :class="{ active: isActive('coTenantGuarantor') }">
      <router-link
        class="step-title"
        :to="getTenantGuarantorLink(getCoTenant(0), getStepNumber('coTenantGuarantor'))"
      >
        {{ t('my-cotenant-guarantor') }}
      </router-link>
      <ul v-if="step === getStepNumber('coTenantGuarantor')" class="vline">
        <template
          v-if="
            selectedGuarantor &&
            selectedGuarantor.typeGuarantor === 'NATURAL_PERSON' &&
            selectedGuarantor.firstName !== undefined &&
            selectedGuarantor.lastName !== undefined
          "
        >
          <template v-for="(g, k) in getCoTenant(0).guarantors" :key="k">
            <li class="ml-5 bold">
              <router-link
                :to="{
                  name: 'TenantGuarantorName',
                  force: true,
                  params: {
                    step: 5,
                    tenantId: getCoTenant(0).id,
                    guarantorId: g.id
                  }
                }"
              >
                <ColoredTag
                  :text="`${g.firstName} ${g.lastName}`"
                  status="NONE"
                  :active="getGuarantorCurrentStep(0, g)"
                ></ColoredTag>
              </router-link>
            </li>
            <li class="ml-10">
              <CoTenantGuarantorDocumentLink
                :guarantor="g"
                :co-tenant="getCoTenant(0)"
                :document-type="DocumentType.IDENTITY"
                :to="makeSpouseGuarantorIdDocLink(g, getCoTenant(0).id)"
              />
            </li>
            <li class="ml-10">
              <CoTenantGuarantorDocumentLink
                :guarantor="g"
                :co-tenant="getCoTenant(0)"
                :document-type="DocumentType.RESIDENCY"
                :to="makeResidencyLink(g)"
              />
            </li>
            <li class="ml-10">
              <CoTenantGuarantorDocumentLink
                :guarantor="g"
                :co-tenant="getCoTenant(0)"
                :document-type="DocumentType.PROFESSIONAL"
                :to="makeProfessionalLink(g)"
              />
            </li>
            <li class="ml-10">
              <CoTenantGuarantorDocumentLink
                :guarantor="g"
                :co-tenant="getCoTenant(0)"
                :document-type="DocumentType.FINANCIAL"
              />
            </li>
            <li class="ml-10">
              <CoTenantGuarantorDocumentLink
                :guarantor="g"
                :co-tenant="getCoTenant(0)"
                :document-type="DocumentType.TAX"
                :to="makeTaxLink(g)"
              />
            </li>
          </template>
        </template>
        <template v-if="selectedGuarantor?.typeGuarantor === 'LEGAL_PERSON'">
          <li class="ml-5">
            <CoTenantGuarantorDocumentLink
              :guarantor="selectedGuarantor"
              :co-tenant="getCoTenant(0)"
              :document-type="DocumentType.IDENTIFICATION_LEGAL_PERSON"
            />
          </li>
          <li class="ml-5">
            <CoTenantGuarantorDocumentLink
              :guarantor="selectedGuarantor"
              :co-tenant="getCoTenant(0)"
              :document-type="DocumentType.IDENTIFICATION"
            />
          </li>
        </template>
        <li v-if="selectedGuarantor?.typeGuarantor === 'ORGANISM'" class="ml-5">
          <CoTenantGuarantorDocumentLink
            :guarantor="selectedGuarantor"
            :co-tenant="getCoTenant(0)"
            :document-type="DocumentType.GUARANTEE_PROVIDER_CERTIFICATE"
          />
        </li>
      </ul>
    </li>
    <li class="step" :class="{ active: isActive('validate') }">
      <router-link
        class="step-title"
        :to="{
          name: 'ValidateFileStep',
          force: true,
          params: { step: getStepNumber('validate') }
        }"
        >{{ t('validate-file') }}
      </router-link>
    </li>
  </ol>
</template>

<script setup lang="ts">
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import ColoredTag from 'df-shared-next/src/components/ColoredTag.vue'
import { User } from 'df-shared-next/src/models/User'
import GuarantorDocumentLink from './documents/GuarantorDocumentLink.vue'
import TenantDocumentLink from './documents/TenantDocumentLink.vue'
import CoTenantDocumentLink from './documents/CoTenantDocumentLink.vue'
import CoTenantGuarantorDocumentLink from './documents/CoTenantGuarantorDocumentLink.vue'
import { useTenantStore } from '@/stores/tenant-store'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { UtilsService } from '@/services/UtilsService'
import { useI18n } from 'vue-i18n'
import { DocumentType, TENANT_DOCUMENTS } from './documents/DocumentType'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'
import { makeCotenantGuarantorResidencyLink } from '../guarantorResidency/makeGuarantorResidencyLink'
import { makeGuarantorCoupleActivityLink } from '../mainActivity/lib/useMainActivityLink'
import {
  makeSpouseGuarantorIdDocLink,
  useIdentityDocumentLink
} from '../identityDocument/lib/identityDocumentLink'
import { makeSpouseGuarantorTaxLink } from '../tax/lib/taxLink'

const store = useTenantStore()
const route = useRoute()
const selectedGuarantor = computed(() => store.selectedGuarantor)
const user = computed(() => store.user)
const { t } = useI18n()
const idDocLink = useIdentityDocumentLink()

const { step = 0 } = defineProps<{ step?: number }>()

const coTenants = computed(() => {
  const c = user.value.apartmentSharing?.tenants?.filter((r) => {
    return r.id != user.value.id
  })
  if (!c) {
    return []
  }
  return c
})

const isActive = (name: string) => getStepNumber(name) <= step

function getGuarantorCurrentStep(substep: number, g: Guarantor | undefined): boolean {
  const s = Number(route.params.substep) || 0
  return (
    (step === 3 || step === 5) &&
    s === substep &&
    (g === undefined || selectedGuarantor.value?.id === g.id)
  )
}

function getCurrentSubStep() {
  return Number(route.params.substep) || 0
}

function getGuarantorLink() {
  if (user.value.guarantors.length > 0) {
    return { name: 'GuarantorList', force: true }
  }
  return { name: 'GuarantorChoice', force: true }
}

function getTenantGuarantorLink(tenant: CoTenant, stepNum: number) {
  return {
    name: 'TenantGuarantors',
    force: true,
    params: { tenantId: Number(tenant.id), step: stepNum }
  }
}

function isCouple() {
  return user.value.applicationType === 'COUPLE'
}

function getCoTenant(index: number): CoTenant {
  if (coTenants.value[index]) {
    return coTenants.value[index]
  }
  return new User()
}

function getStepNumber(stepName: string): number {
  switch (stepName) {
    case 'information':
      return 1
    case 'documents':
      return 2
    case 'guarantor':
      return 3
    case 'coTenant':
      return 4
    case 'coTenantGuarantor':
      return 5
    case 'validate':
      return user.value.applicationType == 'COUPLE' ? 6 : 4
  }

  return -1
}

function getName(user: CoTenant): string {
  if (user.preferredName) {
    return `${user.firstName} ${user.preferredName}`
  }
  return `${user.firstName} ${user.lastName}`
}

function makeResidencyLink(g: Guarantor) {
  const doc = g.documents?.find((d) => d.documentCategory === 'RESIDENCY')
  return makeCotenantGuarantorResidencyLink(getCoTenant(0).id, g.id!, doc)
}

function makeProfessionalLink(g: Guarantor) {
  return makeGuarantorCoupleActivityLink(g, coTenants.value[0].id)
}

function makeTaxLink(g: Guarantor) {
  return makeSpouseGuarantorTaxLink(g, coTenants.value[0].id)
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.left-edit-menu {
  background-color: var(--background-default-grey);
  min-height: 300px;
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  --border-color: var(--g400-t);
  @media all and (max-width: 768px) {
    display: none;
  }
}

.vline {
  list-style: none;
  padding-left: 0;
  padding-block: 1rem;
  margin-block: 0;
  margin-left: 18px;
  border-left: 1px solid var(--border-color);
  min-height: 25px;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  & li {
    padding-bottom: 0;
  }
}

.active {
  --border-color: var(--primary);
}

.step {
  display: flex;
  flex-direction: column;
  counter-increment: step;
  position: relative;
  padding-bottom: 0;
}
.step::before {
  content: counter(step);
  position: absolute;
  left: 0;
  top: 5px;
  background-color: white;
  border: 1px solid var(--g400-t);
  border-radius: 50%;
  height: 2.25rem;
  width: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.step.active::before {
  background-color: var(--primary);
  color: white;
}

.step-title {
  margin-left: 2.75rem;
  margin-block: 0.8rem;
  color: var(--g800-plain);
  font-size: 14px;
  display: flex;
  width: fit-content;
  align-items: center;
}

.step:has(.step-title:only-child):not(:last-of-type)::after {
  content: '';
  height: 1.25rem;
  border-left: 1px solid var(--border-color);
  margin-left: 18px;
}

.ml-5 {
  margin-left: -1rem;
}

.ml-10 {
  margin-left: 0.5rem;
}

[href] {
  box-shadow: none;
  background-image: none;
}
</style>
