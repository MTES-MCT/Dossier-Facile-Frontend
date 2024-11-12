<template>
  <div>
    <div v-if="guarantors.length > 0" class="main-guarantor-information">
      <div v-for="g in guarantors" :key="g.id">
        <hr />
        <div class="inline-block-flex item-action">
          <h4>
            {{ guarantorTitle(g) }}
          </h4>
          <a
            href=""
            :title="t('guarantorssection.delete-guarantor')"
            @click.prevent="openConfirmModal(g)"
            >{{ t('guarantorssection.delete-guarantor') }}</a
          >
        </div>
        <div v-if="g.typeGuarantor === 'NATURAL_PERSON'">
          <ul class="without-padding">
            <FileRowListItem
              :label="t('guarantorssection.identification')"
              :document="document(g, 'IDENTIFICATION')"
              @click-edit="setGuarantorSubStep(1, g)"
              :can-edit="canEdit"
              :enable-download="enableDownload"
            />
            <FileRowListItem
              :label="t('guarantorssection.residency')"
              :document="document(g, 'RESIDENCY')"
              @click-edit="setGuarantorSubStep(2, g)"
              :can-edit="canEdit"
              :enable-download="enableDownload"
            />
            <FileRowListItem
              :label="t('guarantorssection.professional')"
              :document="document(g, 'PROFESSIONAL')"
              @click-edit="setGuarantorSubStep(3, g)"
              :can-edit="canEdit"
              :enable-download="enableDownload"
            />
            <span v-if="documents(g, 'FINANCIAL').length > 1">
              <FileRowListItem
                v-for="(doc, k) in documents(g, 'FINANCIAL')"
                :key="doc.id"
                :label="
                  t('guarantorssection.financial') +
                  (' ' + (k + 1) + ' - ') +
                  t('documents.subcategory.' + doc.documentSubCategory)
                "
                :document="doc"
                @click-edit="setGuarantorSubStep(4, g)"
                :can-edit="canEdit"
                :enable-download="enableDownload"
              />
            </span>
            <FileRowListItem
              v-else
              :label="t('guarantorssection.financial')"
              :document="document(g, 'FINANCIAL')"
              @click-edit="setGuarantorSubStep(4, g)"
              :can-edit="canEdit"
              :enable-download="enableDownload"
            />
            <FileRowListItem
              :label="t('guarantorssection.tax')"
              :document="document(g, 'TAX')"
              @click-edit="setGuarantorSubStep(5, g)"
              :can-edit="canEdit"
              :enable-download="enableDownload"
            />
          </ul>
        </div>
        <div v-else-if="g.typeGuarantor === 'ORGANISM'">
          <ul class="without-padding">
            <FileRowListItem
              :label="t('guarantorssection.organism-identification')"
              :document="document(g, 'GUARANTEE_PROVIDER_CERTIFICATE')"
              @click-edit="setGuarantorSubStep(1, g)"
              :can-edit="canEdit"
              :enable-download="enableDownload"
            />
          </ul>
        </div>
        <div v-else-if="g.typeGuarantor === 'LEGAL_PERSON'">
          <ul class="without-padding">
            <FileRowListItem
              :label="t('guarantorssection.identification-legal-person')"
              :document="document(g, 'IDENTIFICATION_LEGAL_PERSON')"
              @click-edit="setGuarantorSubStep(0, g)"
              :can-edit="canEdit"
              :enable-download="enableDownload"
            />
          </ul>
          <ul class="without-padding">
            <FileRowListItem
              :label="t('guarantorssection.identity-represent')"
              :document="document(g, 'IDENTIFICATION')"
              @click-edit="setGuarantorSubStep(1, g)"
              :can-edit="canEdit"
              :enable-download="enableDownload"
            />
          </ul>
        </div>
      </div>
      <ConfirmModal
        v-if="showConfirmModal"
        @valid="removeSelectedGuarantor()"
        @cancel="closeConfirmModal()"
      >
        <div>{{ t('guarantorssection.confirm-delete-guarantor') }}</div>
      </ConfirmModal>
    </div>

    <div
      v-if="
        canEdit &&
        (guarantors.length === 0 ||
          (guarantors.length === 1 && guarantors[0].typeGuarantor === 'NATURAL_PERSON'))
      "
    >
      <hr />
      <h4 v-if="guarantors.length === 0">
        {{ t('guarantorssection.guarantors-information') }}
      </h4>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-md-6 fr-col-xl-4 fr-pt-1w">
          <button class="bg-purple add-guarantor-btn" @click.prevent="setAddGuarantorStep()">
            {{ t('guarantorssection.add-guarantor') }}
          </button>
        </div>

        <div v-if="guarantors.length === 0" class="fr-col-12 fr-col-md-6 fr-col-xl-4 fr-pt-1w">
          <a
            class="cleana"
            href="https://www.visale.fr/#!/"
            rel="noreferrer"
            target="_blank"
            :title="t('guarantorssection.go-to-visale').toString()"
          >
            <div class="fr-tile bg-purple">
              <div class="inline-block-flex space-between">
                <div>
                  <div class="fr-h5">
                    {{ t('guarantorssection.visale-title') }}
                  </div>
                </div>
                <div>
                  <img alt="logo visale" class="logo-visale" src="../../assets/visale.svg" />
                </div>
              </div>
              <div>{{ t('guarantorssection.visale-text') }}</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { AnalyticsService } from '../../services/AnalyticsService'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import { User } from 'df-shared-next/src/models/User'
import FileRowListItem from '../documents/FileRowListItem.vue'
import useTenantStore from '../../stores/tenant-store'
import { computed, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ToastService } from '../../services/ToastService'

const store = useTenantStore()
const router = useRouter()

const props = withDefaults(
  defineProps<{
    tenant?: User
    canEdit?: boolean
    enableDownload?: boolean
  }>(),
  {
    tenant: undefined,
    canEdit: false,
    enableDownload: false
  }
)

const user = computed(() => store.user)
const guarantors = ref<Guarantor[]>([])
const showConfirmModal = ref(false)
let selectedGuarantor: Guarantor | undefined

const { t } = useI18n()

onBeforeMount(() => {
  if (props.tenant?.guarantors !== undefined) {
    guarantors.value = props.tenant.guarantors
  }
})

function guarantorTitle(g: Guarantor) {
  if (g.typeGuarantor === 'NATURAL_PERSON')
    return (
      t('guarantorssection.my-guarantor') +
      (g.firstName || g.lastName ? ' ' + g.firstName + ' ' + g.lastName : '')
    )
  else if (g.typeGuarantor === 'LEGAL_PERSON' && g.legalPersonName) {
    return t('guarantorssection.my-guarantor') + ' ' + g.legalPersonName
  }
  return t('guarantorssection.guarantors-information')
}

function document(g: Guarantor, s: string) {
  return g.documents?.find((d) => {
    return d.documentCategory === s
  })
}

function documents(g: Guarantor, docType: string): DfDocument[] {
  return (
    g.documents?.filter((d: DfDocument) => {
      return d.documentCategory === docType
    }) || []
  )
}

async function setGuarantorSubStep(n: number, g: Guarantor) {
  AnalyticsService.editFromAccount(n)
  const page = await store.setGuarantorPage(g, n, props.tenant?.id)
  router.push(page)
}

function setAddGuarantorStep() {
  AnalyticsService.editAccount('guarantor')

  if (user.value.id === props.tenant?.id) {
    if (guarantors.value.length > 0) {
      store.addNaturalGuarantor().then((data) => {
        router.push(data)
      })
    } else {
      router.push({ name: 'GuarantorChoice' })
    }
  } else {
    if (guarantors.value.length > 0) {
      store
        .setGuarantorType({
          tenantId: props.tenant?.id,
          typeGuarantor: 'NATURAL_PERSON'
        })
        .then(() => {
          if (!props.tenant?.id) {
            return
          }
          guarantors.value = store.getTenant(props.tenant?.id).guarantors
          const g = guarantors.value[guarantors.value.length - 1]
          router.push({
            name: 'TenantGuarantorDocuments',
            params: {
              step: '5',
              substep: '0',
              tenantId: props.tenant.id.toString(),
              guarantorId: g.id?.toString()
            }
          })
        })
    } else {
      router.push({
        name: 'TenantGuarantors',
        params: {
          tenantId: props.tenant?.id.toString(),
          step: '5'
        }
      })
    }
  }
}

function openConfirmModal(g: Guarantor) {
  showConfirmModal.value = true
  selectedGuarantor = g
}
function closeConfirmModal() {
  showConfirmModal.value = false
  selectedGuarantor = undefined
}

function removeSelectedGuarantor() {
  if (selectedGuarantor === undefined) {
    return
  }
  store.deleteGuarantor(selectedGuarantor).then(
    () => {
      ToastService.deleteSuccess()
      guarantors.value = guarantors.value.filter((g) => g.id != selectedGuarantor?.id)
      closeConfirmModal()
    },
    () => {
      ToastService.deleteFailed()
      closeConfirmModal()
    }
  )
}
</script>

<style lang="scss" scoped>
hr {
  border: 0;
  margin-top: 2rem;
  margin-left: 20%;
  margin-right: 20%;
  border-top: 1px solid var(--g400);
}

.inline-block-flex {
  display: flex;
  flex-direction: row;

  .fr-h5 {
    font-size: 1rem;
  }
}
.item-action {
  gap: 2em;
  align-items: baseline;
  a {
    font-size: 1rem;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: #000091;
    text-decoration: none;
  }

  a[href] {
    text-decoration: none;
    box-shadow: none;
  }
}

.add-guarantor-btn {
  border-radius: 0.5rem;
  border: 1px solid var(--primary);
  min-height: 7.5rem;
  padding: 1.75rem;
  color: var(--primary);
  width: 100%;
  height: 100%;
  font-size: 1rem;
  background: var(--blue-france-925);
  &:hover {
    background: var(--blue-france-hover);
  }
  &:active {
    background: var(--blue-france-active);
  }
}

.bg-purple {
  margin: 0px;
  background-color: var(--blue-france-925);
}

.logo-visale {
  width: 138px;
  height: 45px;
  margin-bottom: 1rem;
}

.cleana {
  &:after {
    content: none;
  }
}
a.cleana:focus {
  outline-style: auto;
}
</style>
