<template>
  <div v-if="g.typeGuarantor === 'NATURAL_PERSON'">
    <NakedCard v-if="!documentsGuarantorFilled(g) || !namesGuarantorFilled(g)" class="fr-p-md-5w">
      <div v-if="!namesGuarantorFilled(g)">
        <div class="fr-text--bold">
          {{ t(`fileerrors.${keyprefix}-invalid-names-guarantor`) }}
        </div>
        <UpdateComponent :user-id="user.id" @on-update="openGuarantor(g, 0)">{{
          t('fileerrors.user-names')
        }}</UpdateComponent>
      </div>
      <div v-if="!documentsGuarantorFilled(g)" class="fr-text--bold">
        {{ t(`fileerrors.${keyprefix}-invalid-document-guarantor`) }}
      </div>

      <div
        v-for="(v, k) in ['IDENTIFICATION', 'RESIDENCY', 'PROFESSIONAL', 'FINANCIAL', 'TAX']"
        :key="k"
      >
        <div v-if="!isGuarantorDocumentValid(v)">
          <UpdateComponent
            :document="getDocument(g, v)"
            :user-id="user.id"
            @on-update="openGuarantor(g, k + 1)"
            >{{ t(`fileerrors.${v}`) }}</UpdateComponent
          >
        </div>
      </div>
    </NakedCard>
  </div>
  <div v-if="g.typeGuarantor === 'LEGAL_PERSON'">
    <NakedCard v-if="!documentsGuarantorFilled(g) || !namesGuarantorFilled(g)" class="fr-p-5w">
      <div v-if="!namesGuarantorFilled(g)">
        <div class="fr-text--bold">
          {{ t(`fileerrors.${keyprefix}-invalid-names-guarantor`) }}
        </div>
        <UpdateComponent @on-update="openGuarantor(g, 0)">{{
          t('fileerrors.user-names')
        }}</UpdateComponent>
      </div>
      <div class="fr-text--bold">
        {{ t(`fileerrors.${keyprefix}-invalid-document-guarantor`) }}
      </div>
      <div v-if="!isGuarantorDocumentValid('IDENTIFICATION')">
        <UpdateComponent
          :document="getDocument(g, 'IDENTIFICATION')"
          @on-update="openGuarantor(g, 1)"
          >{{ t('fileerrors.corporation-identification') }}</UpdateComponent
        >
      </div>
      <div v-if="!isGuarantorDocumentValid('IDENTIFICATION_LEGAL_PERSON')">
        <UpdateComponent
          :document="getDocument(g, 'IDENTIFICATION_LEGAL_PERSON')"
          @on-update="openGuarantor(g, 2)"
          >{{ t('fileerrors.representative-identification') }}</UpdateComponent
        >
      </div>
    </NakedCard>
  </div>
  <div v-if="g.typeGuarantor === 'ORGANISM'">
    <NakedCard v-if="!documentsGuarantorFilled(g)" class="fr-p-5w">
      <div class="fr-text--bold">
        {{ t(`fileerrors.${keyprefix}-invalid-document-guarantor`) }}
      </div>
      <div v-if="!isGuarantorDocumentValid('GUARANTEE_PROVIDER_CERTIFICATE')">
        <UpdateComponent
          :document="getDocument(g, 'GUARANTEE_PROVIDER_CERTIFICATE')"
          @on-update="openGuarantor(g, 1)"
          >{{ t('fileerrors.organism-cert') }}</UpdateComponent
        >
      </div>
    </NakedCard>
  </div>
</template>

<script setup lang="ts">
import { User } from 'df-shared-next/src/models/User'
import { useI18n } from 'vue-i18n'
import useTenantStore from '../../stores/tenant-store'
import { useRouter } from 'vue-router'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { UtilsService } from '../../services/UtilsService'
import UpdateComponent from './UpdateComponent.vue'
import { onMounted } from 'vue'
import { AnalyticsService } from '../../services/AnalyticsService'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'

const store = useTenantStore()
const { t } = useI18n()
const router = useRouter()
const props = defineProps<{
  g: Guarantor
  user: User | CoTenant
  keyprefix: string
}>()

onMounted(() => {
  if (
    import.meta.env.VITE_FEATURE_FLIPPING_PRE_VALIDATE !== 'true' ||
    ('preValidationActivated' in props.user && !props.user.preValidationActivated)
  ) {
    return
  }
  for (const v of ['IDENTIFICATION', 'RESIDENCY', 'PROFESSIONAL', 'FINANCIAL', 'TAX']) {
    if (isGuarantorDocumentValid(v)) {
      AnalyticsService.prevalidationEvent(v, 'CHECKED')
    } else {
      AnalyticsService.prevalidationEvent(v, 'DENIED')
    }
  }
})

function getDocument(g: Guarantor, docType: string) {
  // TODO: handle multiple financial documents
  return g.documents?.find((d) => d.documentCategory === docType)
}

function isGuarantorDocumentValid(docType: string) {
  return UtilsService.isGuarantorDocumentValid(docType, props.g)
}
function namesGuarantorFilled(g: Guarantor) {
  return (
    (g.typeGuarantor === 'NATURAL_PERSON' && g.firstName && g.lastName) ||
    (g.typeGuarantor === 'LEGAL_PERSON' && g.legalPersonName) ||
    g.typeGuarantor === 'ORGANISM'
  )
}

function documentsGuarantorFilled(g: Guarantor) {
  return store.guarantorDocumentsFilled(g)
}

async function openGuarantor(g: Guarantor, substep: number) {
  const page = await store.setGuarantorPage(g, substep, props.user.id)
  router.push(page)
}
</script>
