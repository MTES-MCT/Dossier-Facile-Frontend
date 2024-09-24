<template>
  <div>
    <div class="fr-grid-row">
      <div class="fr-col-lg-4">
        <NakedCard class="fr-mt-3w fr-mb-2w">
          <div class="fr-card__desc">
            <section>
              <div class="row">
                <div class="subtitle">Pièce d’identité</div>
                <div class="row align--center">
                  <ViewEditBtn
                    :canView="!isCotenant && hasFile('IDENTIFICATION')"
                    @view="openDoc('IDENTIFICATION')"
                    @edit="setTenantStep(1)"
                  ></ViewEditBtn>
                  <FileStatusIcon :status="getStatus('IDENTIFICATION')"></FileStatusIcon>
                </div>
              </div>
              <div class="row">
                <div class="subtitle">Justificatif de situation d'hébergement</div>
                <div class="row align--center">
                  <ViewEditBtn
                    :canView="!isCotenant && hasFile('RESIDENCY')"
                    @view="openDoc('RESIDENCY')"
                    @edit="setTenantStep(2)"
                  ></ViewEditBtn>
                  <FileStatusIcon :status="getStatus('RESIDENCY')"></FileStatusIcon>
                </div>
              </div>
              <div class="row">
                <div class="subtitle">Justificatif de situation professionnelle</div>
                <div class="row align--center">
                  <ViewEditBtn
                    :canView="!isCotenant && hasFile('PROFESSIONAL')"
                    @view="openDoc('PROFESSIONAL')"
                    @edit="setTenantStep(3)"
                  ></ViewEditBtn>
                  <FileStatusIcon :status="getStatus('PROFESSIONAL')"></FileStatusIcon>
                </div>
              </div>
              <div class="row">
                <div class="subtitle">Justificatif de ressources</div>
                <div class="row align--center">
                  <ViewEditBtn
                    :canView="!isCotenant && hasFile('FINANCIAL')"
                    @view="openDoc('FINANCIAL')"
                    @edit="setTenantStep(4)"
                  ></ViewEditBtn>
                  <FileStatusIcon :status="getStatus('FINANCIAL')"></FileStatusIcon>
                </div>
              </div>
              <div class="row">
                <div class="subtitle">Avis d’imposition</div>
                <div class="row align--center">
                  <ViewEditBtn
                    :canView="!isCotenant && hasFile('TAX')"
                    @view="openDoc('TAX')"
                    @edit="setTenantStep(5)"
                  ></ViewEditBtn>
                  <FileStatusIcon :status="getStatus('TAX')"></FileStatusIcon>
                </div>
              </div>
            </section>
          </div>
        </NakedCard>

        <div v-for="g in guarantors()" v-bind:key="g.id">
          <NakedCard v-if="g.typeGuarantor === 'NATURAL_PERSON'" class="fr-mt-3w fr-mb-2w">
            <div class="boxed boxed--lg boxed--border">
              <h5>Les documents du garant</h5>

              <div class="row">
                <div class="subtitle">Pièce d’identité</div>
                <div class="row align--center">
                  <ViewEditBtn
                    :canView="!isCotenant && guarantorHasFile(g, 'IDENTIFICATION')"
                    @view="openGuarantorDoc(g, 'IDENTIFICATION')"
                    @edit="setGuarantorSubStep(1, g)"
                  ></ViewEditBtn>
                  <FileStatusIcon
                    :status="getGuarantorStatus(g, 'IDENTIFICATION')"
                  ></FileStatusIcon>
                </div>
              </div>
              <div class="row">
                <div class="subtitle">Justificatif de situation d'hébergement</div>
                <div class="row align--center">
                  <ViewEditBtn
                    :canView="!isCotenant && guarantorHasFile(g, 'RESIDENCY')"
                    @view="guarantorHasFile(g, 'RESIDENCY')"
                    @edit="setGuarantorSubStep(2, g)"
                  ></ViewEditBtn>
                  <FileStatusIcon :status="getGuarantorStatus(g, 'RESIDENCY')"></FileStatusIcon>
                </div>
              </div>
              <div class="row">
                <div class="subtitle">Justificatif de situation professionnelle</div>
                <div class="row align--center">
                  <ViewEditBtn
                    :canView="!isCotenant && guarantorHasFile(g, 'PROFESSIONAL')"
                    @view="guarantorHasFile(g, 'PROFESSIONAL')"
                    @edit="setGuarantorSubStep(3, g)"
                  ></ViewEditBtn>
                  <FileStatusIcon :status="getGuarantorStatus(g, 'PROFESSIONAL')"></FileStatusIcon>
                </div>
              </div>
              <div class="row">
                <div class="subtitle">Justificatif de ressources</div>
                <div class="row align--center">
                  <ViewEditBtn
                    :canView="!isCotenant && guarantorHasFile(g, 'FINANCIAL')"
                    @view="guarantorHasFile(g, 'FINANCIAL')"
                    @edit="setGuarantorSubStep(4, g)"
                  ></ViewEditBtn>
                  <FileStatusIcon :status="getGuarantorStatus(g, 'FINANCIAL')"></FileStatusIcon>
                </div>
              </div>
              <div class="row">
                <div class="subtitle">Avis d’imposition</div>
                <div class="row align--center">
                  <ViewEditBtn
                    :canView="!isCotenant && guarantorHasFile(g, 'TAX')"
                    @view="openGuarantorDoc(g, 'TAX')"
                    @edit="setGuarantorSubStep(5, g)"
                  ></ViewEditBtn>
                  <FileStatusIcon :status="getGuarantorStatus(g, 'TAX')"></FileStatusIcon>
                </div>
              </div>
            </div>
          </NakedCard>
          <NakedCard v-if="g.typeGuarantor === 'ORGANISM'" class="fr-mt-3w fr-mb-2w">
            <div class="boxed boxed--lg boxed--border">
              <h5>Les documents de mon garant</h5>

              <div class="row">
                <div class="subtitle">{{ $t('messagespanel.organism') }}</div>
                <div class="row align--center">
                  <ViewEditBtn
                    :canView="!isCotenant && guarantorHasFile(g, 'GUARANTEE_PROVIDER_CERTIFICATE')"
                    @view="openGuarantorDoc(g, 'GUARANTEE_PROVIDER_CERTIFICATE')"
                    @edit="setGuarantorSubStep(1, g)"
                  ></ViewEditBtn>
                  <FileStatusIcon
                    :status="getGuarantorStatus(g, 'GUARANTEE_PROVIDER_CERTIFICATE')"
                  ></FileStatusIcon>
                </div>
              </div>
            </div>
          </NakedCard>
          <NakedCard v-if="g.typeGuarantor === 'LEGAL_PERSON'" class="fr-mt-3w fr-mb-2w">
            <div class="boxed boxed--lg boxed--border">
              <h5>Les documents de mon garant</h5>
              <div class="row">
                <div class="subtitle">
                  {{ $t('messagespanel.identification-legal-person') }}
                </div>
                <div class="row align--center">
                  <ViewEditBtn
                    :canView="!isCotenant && guarantorHasFile(g, 'IDENTIFICATION_LEGAL_PERSON')"
                    @view="openGuarantorDoc(g, 'IDENTIFICATION_LEGAL_PERSON')"
                    @edit="setGuarantorSubStep(0, g)"
                  ></ViewEditBtn>
                  <FileStatusIcon
                    :status="getGuarantorStatus(g, 'IDENTIFICATION_LEGAL_PERSON')"
                  ></FileStatusIcon>
                </div>
              </div>
              <div class="row">
                <div class="subtitle">
                  {{ $t('messagespanel.identity-represent') }}
                </div>
                <div class="row align--center">
                  <ViewEditBtn
                    :canView="!isCotenant && guarantorHasFile(g, 'IDENTIFICATION')"
                    @view="openGuarantorDoc(g, 'IDENTIFICATION')"
                    @edit="setGuarantorSubStep(1, g)"
                  ></ViewEditBtn>
                  <FileStatusIcon
                    :status="getGuarantorStatus(g, 'IDENTIFICATION')"
                  ></FileStatusIcon>
                </div>
              </div>
            </div>
          </NakedCard>
        </div>
        <NakedCard class="fr-mt-3w fr-mb-2w">
          <div class="fr-grid-row">
            <div class="fr-col-3 fr-p-2w">
              <i class="ri-checkbox-circle-line text-success fs-48"></i>
            </div>
            <div class="fr-col-9 fr-p-2w">Votre pièce est validée ! Plus besoin d’y toucher</div>
          </div>
        </NakedCard>
        <NakedCard class="fr-mt-3w fr-mb-2w">
          <div class="fr-grid-row">
            <div class="fr-col-3 fr-p-2w">
              <i class="ri-time-fill text-warning fs-48"></i>
            </div>
            <div class="fr-col-9 fr-p-2w">Nous sommes en cours de traitement de cette pièce</div>
          </div>
        </NakedCard>
        <NakedCard class="fr-mt-3w fr-mb-2w">
          <div class="fr-grid-row">
            <div class="fr-col-3 fr-p-2w">
              <i class="ri-close-circle-fill text-danger fs-48"></i>
            </div>
            <div class="fr-col-9 fr-p-2w">
              Vous devez modifier votre pièce afin que nous validions votre dossier
            </div>
          </div>
        </NakedCard>
      </div>

      <div class="fr-col-lg-8 fr-pl-5w fr-pr-3w">
        <div class="right-container">
          <div class="bg-orange fr-p-5w">
            <h1 class="fr-h4">Conversation</h1>
          </div>
          <div class="conversation__reply boxed boxed--border fr-p-3w" v-if="isNotValidated()">
            <div class="messages fr-mb-3w">
              <div
                v-for="m in tenantMessages"
                :key="m.id"
                class="message"
                :class="{
                  tenant: m.typeMessage === 'FROM_TENANT',
                  operator: m.typeMessage === 'TO_TENANT'
                }"
              >
                <p v-html="m.messageBody"></p>
                <div class="date">
                  {{ $d(new Date(m.creationDateTime || Date.now()), 'long') }}
                </div>
              </div>
            </div>

            <form name="form" @submit.prevent="handleSubmit">
              <div class="fr-grid-row">
                <div class="fr-col-12 fr-mb-3w">
                  <div class="fr-input-group">
                    <textarea
                      v-model="sendMessage"
                      class="form-control fr-input"
                      autocomplete="off"
                      autofocus
                      id="sendMessage"
                      placeholder="Tapez votre message ici"
                      rows="4"
                      name="sendMessage"
                      type="text"
                    />
                  </div>
                </div>

                <div class="fr-col-12 fr-mb-5w">
                  <button class="fr-btn" type="submit" :disabled="!sendMessage">Répondre</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <Modal v-if="isDocModalVisible" @close="isDocModalVisible = false">
      <template v-slot:body>
        <div class="fr-container">
          <div class="fr-grid-row justify-content-center">
            <div class="fr-col-12">
              <div v-for="f in files" v-bind:key="f.id">
                <ShowDoc :file="f"></ShowDoc>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import FileStatusIcon from 'df-shared-next/src/components/FileStatusIcon.vue'
import { DocumentService } from '../services/DocumentService'
import { DfFile } from 'df-shared-next/src/models/DfFile'
import Modal from 'df-shared-next/src/components/Modal.vue'
import ShowDoc from '../components/documents/share/ShowDoc.vue'
import { User } from 'df-shared-next/src/models/User'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import ViewEditBtn from '../components/ViewEditBtn.vue'
import { AnalyticsService } from '../services/AnalyticsService'
import useTenantStore from '@/stores/tenant-store'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useTenantStore()
const messageList = computed(() => store.messageList)

const sendMessage = ref('')
const files = ref([] as DfFile[])
const isDocModalVisible = ref(false)
const tenantMessages = computed(() => messageList.value[props.tenant.id])

const props = withDefaults(
  defineProps<{
    tenant: User
    isCotenant?: boolean
  }>(),
  {
    isCotenant: false
  }
)

function isNotValidated() {
  // TODO
  return true
}

function setTenantStep(n: number) {
  AnalyticsService.editFromAccount(n)
  if (props.isCotenant) {
    router.push({
      name: 'CoTenantDocuments',
      params: {
        tenantId: props.tenant?.id.toString(),
        step: '4',
        substep: n.toString()
      }
    })
  } else {
    router.push({
      name: 'TenantDocuments',
      params: { substep: n.toString() }
    })
  }
}
async function setGuarantorSubStep(n: number, g: Guarantor) {
  AnalyticsService.editFromAccount(n)
  const page = await store.setGuarantorPage(g, n, props.tenant.id)
  router.push(page)
}

function guarantors() {
  return props.tenant.guarantors
}

function hasDoc(docType: string) {
  return DocumentService.hasDoc(docType, props.tenant)
}
function hasFile(docType: string) {
  // TODO change to aggregate financial
  return DocumentService.hasFile(docType, props.tenant)
}
function guarantorHasFile(g: Guarantor, docType: string) {
  return DocumentService.guarantorHasFile(g, docType)
}
function guarantorHasDoc(g: Guarantor, docType: string) {
  return DocumentService.guarantorHasDoc(g, docType)
}

function openDoc(documentCategory: string) {
  AnalyticsService.viewFromMessage(documentCategory)
  files.value = DocumentService.getFiles(documentCategory)
  if (files.value.length > 0) {
    isDocModalVisible.value = true
  }
}
function openGuarantorDoc(g: Guarantor, documentCategory: string) {
  AnalyticsService.viewFromMessage(documentCategory)
  files.value = DocumentService.getGuarantorFiles(g, documentCategory)
  if (files.value.length > 0) {
    isDocModalVisible.value = true
  }
}

function handleSubmit() {
  store.sendMessage(sendMessage.value, props.tenant.id).then(() => {
    sendMessage.value = ''
  })
}

function getStatus(docType: string) {
  if (docType === 'FINANCIAL') {
    const docs = props.tenant.documents?.filter((d) => {
      return d.documentCategory === 'FINANCIAL'
    })
    return isFinancialValid(docs || [])
  }
  const doc = props.tenant.documents?.find((d: DfDocument) => {
    return d.documentCategory === docType
  })
  return doc?.documentStatus || 'INCOMPLETE'
}

function getGuarantorStatus(g: Guarantor, docType: string) {
  if (docType === 'FINANCIAL') {
    const docs = g.documents?.filter((d) => {
      return d.documentCategory === 'FINANCIAL'
    })
    return isFinancialValid(docs || [])
  }
  const doc = g.documents?.find((d: DfDocument) => {
    return d.documentCategory === docType
  })
  return doc?.documentStatus || 'INCOMPLETE'
}

function isFinancialValid(docs: any[]) {
  if (!docs || docs.length === 0) {
    return 'INCOMPLETE'
  }

  for (const doc of docs) {
    if (!doc.noDocument && (doc.files?.length || 0) <= 0) {
      return 'INCOMPLETE'
    }
  }

  for (const doc of docs) {
    if (doc.documentStatus === 'DECLINED') {
      return 'DECLINED'
    }
  }

  for (const doc of docs) {
    if (doc.documentStatus === 'TO_PROCESS') {
      return 'TO_PROCESS'
    }
  }

  return 'VALIDATED'
}
</script>

<style lang="scss" scoped>
.big-icon {
  font-size: 3em;
}

.right-container {
  border: 1px solid #ececec;
}

.edit-step-btn {
  align-self: center;
  padding: 0.2rem;
  cursor: pointer;
}

.subtitle {
  font-weight: bold;
}

.messages {
  max-height: 80vh;
  overflow-y: auto;
}

.message {
  padding: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  background-color: var(--g300);
  border-radius: 1rem;
}

.date {
  text-align: right;
  color: var(--g600);
  font-size: 0.8rem;
}

.tenant {
  max-width: 90%;
  margin-left: auto;
  background-color: var(--g200);
}

.operator {
  max-width: 90%;
}

.align--center {
  align-items: center;
}
</style>
