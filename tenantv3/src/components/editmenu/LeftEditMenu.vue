<template>
  <div id="funnel-menu" class="left-edit-menu fr-pt-7w fr-pb-12w">
    <div class="inner-left-edit">
      <div class="step" :class="getClass(getStepNumber('information'))">
        <div class="step-number">{{ getStepNumber('information') }}</div>
        <div class="step-title">
          <router-link :to="{ name: 'TenantName', force: true }" class="fr-link">
            {{ t('personal-information') }}
          </router-link>
        </div>
      </div>
      <div class="vline" :class="getClass(getStepNumber('information'))">
        <div class="ml-5">
          <router-link :to="{ name: 'TenantName', force: true }">
            <ColoredTag
              :label="t('lefteditmenu.identity')"
              :text="UtilsService.tenantFullName(user)"
              status="NAME"
            />
          </router-link>
        </div>
        <div v-if="user.applicationType" class="ml-5">
          <router-link :to="{ name: 'TenantType', force: true }">
            <ColoredTag
              :label="t('lefteditmenu.file-type')"
              :text="t(`lefteditmenu.${user.applicationType}`)"
              :status="user.applicationType"
              :active="step < 2"
            ></ColoredTag>
          </router-link>
        </div>
      </div>
      <div class="step" :class="getClass(getStepNumber('documents'))">
        <div class="step-number">{{ getStepNumber('documents') }}</div>
        <div class="step-title">
          <router-link class="fr-link" :to="{ name: 'TenantIdentification', force: true }"
            >{{ t('my-document') }}
          </router-link>
        </div>
      </div>
      <div class="vline" :class="getClass(getStepNumber('documents'))">
        <div v-if="step === 2">
          <TenantDocumentLink :document-type="DocumentType.IDENTITY" />
          <TenantDocumentLink :document-type="DocumentType.RESIDENCY" />
          <TenantDocumentLink :document-type="DocumentType.PROFESSIONAL" />
          <TenantDocumentLink :document-type="DocumentType.FINANCIAL" />
          <TenantDocumentLink :document-type="DocumentType.TAX" />
        </div>
      </div>
      <div class="step" :class="getClass(getStepNumber('guarantor'))">
        <div class="step-number">{{ getStepNumber('guarantor') }}</div>
        <div class="step-title">
          <router-link class="fr-link" :to="getGuarantorLink()"
            >{{ t('my-guarantor') }}
          </router-link>
        </div>
      </div>
      <div class="vline" :class="getClass(getStepNumber('guarantor'))">
        <div v-if="step === getStepNumber('guarantor') && selectedGuarantor">
          <div
            v-if="
              selectedGuarantor.typeGuarantor === 'NATURAL_PERSON' &&
              selectedGuarantor.firstName !== undefined &&
              selectedGuarantor.lastName !== undefined
            "
          >
            <div v-for="(g, k) in user.guarantors" :key="k">
              <div class="ml-5 bold">
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
              </div>
              <GuarantorDocumentLink
                class="ml-10"
                :guarantor="g"
                :document-type="DocumentType.IDENTITY"
                :substep="1"
                :active="getGuarantorCurrentStep(1, g)"
              />
              <GuarantorDocumentLink
                class="ml-10"
                :guarantor="g"
                :document-type="DocumentType.RESIDENCY"
                :substep="2"
                :active="getGuarantorCurrentStep(2, g)"
              />
              <GuarantorDocumentLink
                class="ml-10"
                :guarantor="g"
                :document-type="DocumentType.PROFESSIONAL"
                :substep="3"
                :active="getGuarantorCurrentStep(3, g)"
              />
              <GuarantorDocumentLink
                class="ml-10"
                :guarantor="g"
                :document-type="DocumentType.FINANCIAL"
                :substep="4"
                :active="getGuarantorCurrentStep(4, g)"
              />
              <GuarantorDocumentLink
                class="ml-10"
                :guarantor="g"
                :document-type="DocumentType.TAX"
                :substep="5"
                :active="getGuarantorCurrentStep(5, g)"
              />
            </div>
          </div>
          <div v-if="selectedGuarantor.typeGuarantor === 'LEGAL_PERSON'">
            <GuarantorDocumentLink
              class="ml-5"
              :guarantor="selectedGuarantor"
              :document-type="DocumentType.IDENTIFICATION_LEGAL_PERSON"
              :substep="0"
              :active="getGuarantorCurrentStep(0, undefined)"
            />
            <GuarantorDocumentLink
              class="ml-5"
              :guarantor="selectedGuarantor"
              :document-type="DocumentType.IDENTIFICATION"
              :substep="1"
              :active="getGuarantorCurrentStep(1, undefined)"
            />
          </div>
          <div v-if="selectedGuarantor.typeGuarantor === 'ORGANISM'">
            <GuarantorDocumentLink
              class="ml-5"
              :guarantor="selectedGuarantor"
              :document-type="DocumentType.GUARANTEE_PROVIDER_CERTIFICATE"
              :substep="0"
              :active="getGuarantorCurrentStep(0, undefined)"
            />
          </div>
        </div>
      </div>
      <div v-if="isCouple()" class="step" :class="getClass(getStepNumber('coTenant'))">
        <div class="step-number">{{ getStepNumber('coTenant') }}</div>
        <div class="step-title">
          <router-link
            class="fr-link"
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
        </div>
      </div>
      <div v-if="isCouple()" class="vline" :class="getClass(getStepNumber('coTenant'))">
        <div v-if="step === getStepNumber('coTenant')">
          <div>
            <div v-for="(coTenant, k) in coTenants" :key="k">
              <div class="ml-5 bold">
                <router-link
                  :to="{
                    name: 'CoupleName',
                    force: true,
                    params: { tenantId: coTenant.id }
                  }"
                >
                  <ColoredTag
                    :text="getName(coTenant)"
                    status="NONE"
                    :active="getCurrentSubStep() == 0"
                  ></ColoredTag>
                </router-link>
              </div>
              <CoTenantDocumentLink
                class="ml-10"
                :co-tenant="coTenant"
                :document-type="DocumentType.IDENTITY"
                :active="routeMatch('CoupleIdentification')"
              />
              <CoTenantDocumentLink
                class="ml-10"
                :co-tenant="coTenant"
                :document-type="DocumentType.RESIDENCY"
                :active="routeMatch('CoupleResidency')"
              />
              <CoTenantDocumentLink
                class="ml-10"
                :co-tenant="coTenant"
                :document-type="DocumentType.PROFESSIONAL"
                :active="routeMatch('CoupleProfessional')"
              />
              <CoTenantDocumentLink
                class="ml-10"
                :co-tenant="coTenant"
                :document-type="DocumentType.FINANCIAL"
                :active="routeMatch('CoupleFinancial')"
              />
              <CoTenantDocumentLink
                class="ml-10"
                :co-tenant="coTenant"
                :document-type="DocumentType.TAX"
                :active="routeMatch('CoupleTax')"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-if="isCouple()" class="step" :class="getClass(getStepNumber('coTenantGuarantor'))">
        <div class="step-number">
          {{ getStepNumber('coTenantGuarantor') }}
        </div>
        <div class="step-title">
          <router-link
            class="fr-link"
            :to="getTenantGuarantorLink(getCoTenant(0), getStepNumber('coTenantGuarantor'))"
          >
            {{ t('my-cotenant-guarantor') }}
          </router-link>
        </div>
      </div>
      <div v-if="isCouple()" class="vline" :class="getClass(getStepNumber('coTenantGuarantor'))">
        <div v-if="step === getStepNumber('coTenantGuarantor')">
          <div
            v-if="
              selectedGuarantor &&
              selectedGuarantor.typeGuarantor === 'NATURAL_PERSON' &&
              selectedGuarantor.firstName !== undefined &&
              selectedGuarantor.lastName !== undefined
            "
          >
            <div v-for="(g, k) in getCoTenant(0).guarantors" :key="k">
              <div class="ml-5 bold">
                <router-link
                  :to="{
                    name: 'TenantGuarantorDocuments',
                    force: true,
                    params: {
                      step: getStepNumber('coTenantGuarantor'),
                      substep: '0',
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
              </div>
              <CoTenantGuarantorDocumentLink
                class="ml-10"
                :guarantor="g"
                :co-tenant="getCoTenant(0)"
                :document-type="DocumentType.IDENTITY"
                :substep="1"
                :active="getGuarantorCurrentStep(1, g)"
              />
              <CoTenantGuarantorDocumentLink
                class="ml-10"
                :guarantor="g"
                :co-tenant="getCoTenant(0)"
                :document-type="DocumentType.RESIDENCY"
                :substep="2"
                :active="getGuarantorCurrentStep(2, g)"
                :to="makeResidencyLink(g)"
              />
              <CoTenantGuarantorDocumentLink
                class="ml-10"
                :guarantor="g"
                :co-tenant="getCoTenant(0)"
                :document-type="DocumentType.PROFESSIONAL"
                :substep="3"
                :active="getGuarantorCurrentStep(3, g)"
              />
              <CoTenantGuarantorDocumentLink
                class="ml-10"
                :guarantor="g"
                :co-tenant="getCoTenant(0)"
                :document-type="DocumentType.FINANCIAL"
                :substep="4"
                :active="getGuarantorCurrentStep(4, g)"
              />
              <CoTenantGuarantorDocumentLink
                class="ml-10"
                :guarantor="g"
                :co-tenant="getCoTenant(0)"
                :document-type="DocumentType.TAX"
                :substep="5"
                :active="getGuarantorCurrentStep(5, g)"
              />
            </div>
          </div>
          <div v-if="selectedGuarantor?.typeGuarantor === 'LEGAL_PERSON'">
            <CoTenantGuarantorDocumentLink
              class="ml-5"
              :guarantor="selectedGuarantor"
              :co-tenant="getCoTenant(0)"
              :document-type="DocumentType.IDENTIFICATION_LEGAL_PERSON"
              :substep="0"
              :active="getGuarantorCurrentStep(0, selectedGuarantor)"
            />
            <CoTenantGuarantorDocumentLink
              class="ml-5"
              :guarantor="selectedGuarantor"
              :co-tenant="getCoTenant(0)"
              :document-type="DocumentType.IDENTIFICATION"
              :substep="1"
              :active="getGuarantorCurrentStep(1, selectedGuarantor)"
            />
          </div>
          <div v-if="selectedGuarantor?.typeGuarantor === 'ORGANISM'">
            <CoTenantGuarantorDocumentLink
              class="ml-5"
              :guarantor="selectedGuarantor"
              :co-tenant="getCoTenant(0)"
              :document-type="DocumentType.GUARANTEE_PROVIDER_CERTIFICATE"
              :substep="0"
              :active="getGuarantorCurrentStep(0, selectedGuarantor)"
            />
          </div>
        </div>
      </div>
      <div class="step" :class="getClass(getStepNumber('validate'))">
        <div class="step-number">{{ getStepNumber('validate') }}</div>
        <div class="step-title">
          <router-link
            class="fr-link"
            :to="{
              name: 'ValidateFileStep',
              force: true,
              params: { step: getStepNumber('validate') }
            }"
            >{{ t('validate-file') }}
          </router-link>
        </div>
      </div>

      <div class="spacer"></div>
    </div>
  </div>
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
import { DocumentType } from './documents/DocumentType'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'
import { makeCotenantGuarantorResidencyLink } from '../guarantorResidency/makeGuarantorResidencyLink'

const store = useTenantStore()
const route = useRoute()
const selectedGuarantor = computed(() => store.selectedGuarantor)
const user = computed(() => store.user)
const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    step: number
  }>(),
  {
    step: 0
  }
)

const coTenants = computed(() => {
  const c = user.value.apartmentSharing?.tenants?.filter((r) => {
    return r.id != user.value.id
  })
  if (!c) {
    return []
  }
  return c
})

function getClass(s: number) {
  if (s <= props.step) {
    return 'active'
  }
  return ''
}

function getGuarantorCurrentStep(substep: number, g: Guarantor | undefined): boolean {
  const s = Number(route.params.substep) || 0
  return (
    (props.step === 3 || props.step === 5) &&
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

function routeMatch(name: string) {
  return route.matched.some((r) => r.name === name)
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.left-edit-menu {
  background-color: var(--background-default-grey);
  @media all and (max-width: 768px) {
    display: none;
  }
}

.inner-left-edit {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-left: 10px;
}

.vline {
  margin-left: 23px;
  border-left: 1px solid var(--g400-t);
  z-index: 0;
  min-height: 25px;

  &.active {
    border-left: 1px solid var(--primary);
  }
}

.step {
  display: flex;
  align-items: center;
  height: 3rem;
}

.step-number {
  background-color: white;
  border: 1px solid var(--g400-t);
  margin: 0 5px;
  border-radius: 50%;
  height: 2.25rem;
  width: 2.25rem;
  min-width: 2.25rem;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.active .step-number {
  background-color: var(--primary);
  color: white;
}

.step-title {
  padding: 5px 5px 0;
}

.hidden {
  visibility: hidden;
}

.ml-5 {
  margin-left: -1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.ml-10 {
  margin-left: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.fr-link {
  width: fit-content;
  color: var(--g800-plain);
  font-size: 14px;
}

[href] {
  box-shadow: none;
  background-image: none;
}
</style>
