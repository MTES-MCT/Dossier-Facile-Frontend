<template>
  <ProfileContainer :step="3">
    <NakedCard class="fr-p-md-5w">
      <h1 class="fr-h5">
        {{ t('guarantorlistpage.my-guarantor') }}
      </h1>
      <div v-for="g in user.guarantors" :key="g.id">
        <CardRow @edit="editGuarantor(g)" @remove="isRemoveGuarantor = true">
          <template v-slot:tag>
            <div class="text-bold">{{ getGuarantorName(g) }}</div>
          </template>
          <template v-slot:text>
            <ColoredTag :text="t(getStatus(g))" :status="getStatus(g)"></ColoredTag>
          </template>
        </CardRow>
        <ConfirmModal
          v-if="isRemoveGuarantor"
          @valid="removeGuarantor(g)"
          @cancel="isRemoveGuarantor = false"
        >
          <span>{{ t('guarantorlistpage.remove-guarantor') }}</span>
        </ConfirmModal>
      </div>
      <div v-if="hasOneNaturalGuarantor()">
        <button @click.once="addNaturalGuarantor()" class="add-guarantor-btn">
          {{ t('guarantorlistpage.add-new-guarantor') }}
        </button>
      </div>
    </NakedCard>

    <GuarantorFooter @on-back="goBack" @on-next="goNext"></GuarantorFooter>
  </ProfileContainer>
</template>

<script setup lang="ts">
import { User } from 'df-shared-next/src/models/User'
import GuarantorFooter from '../components/footer/GuarantorFooter.vue'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import ColoredTag from 'df-shared-next/src/components/ColoredTag.vue'
import CardRow from 'df-shared-next/src/components/CardRow.vue'
import ProfileContainer from '../components/ProfileContainer.vue'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import useTenantStore from '@/stores/tenant-store'
import { computed, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ToastService } from '@/services/ToastService'

const { t } = useI18n()
const store = useTenantStore()
const user = computed(() => store.user)
const router = useRouter()

const isRemoveGuarantor = ref(false)

onBeforeMount(() => {
  store.setSelectedGuarantor(undefined)
})

function getGuarantorName(g: Guarantor) {
  if (g.firstName || g.lastName) {
    return `${g.firstName || ''} ${g.lastName || ''}`
  }
  if (g.typeGuarantor === 'LEGAL_PERSON' && g.legalPersonName) {
    return g.legalPersonName
  }
  return t('guarantorlistpage.guarantor.' + g.typeGuarantor)
}

function goBack() {
  if (user.value?.guarantors && user.value?.guarantors.length > 0) {
    router.push({ name: 'TenantDocuments', params: { substep: '5' } })
    return
  }
  router.push({
    name: 'GuarantorChoice'
  })
}

function goNext() {
  if (user.value.applicationType == 'COUPLE') {
    const cotenant = user.value.apartmentSharing?.tenants.find((t) => t.id != user.value.id) as User
    router.push({
      name: 'CoTenantDocuments',
      params: {
        step: '4',
        substep: '0',
        tenantId: cotenant.id.toString()
      }
    })
    return
  }
  router.push({
    name: 'ValidateFile'
  })
}

function getStatus(g: Guarantor) {
  if (!g.documents) {
    return ''
  }
  if (
    (g.typeGuarantor === 'NATURAL_PERSON' && g.documents.length < 5) ||
    (g.typeGuarantor === 'LEGAL_PERSON' && g.documents.length < 2) ||
    (g.typeGuarantor === 'ORGANISM' && g.documents.length < 1)
  ) {
    return 'INCOMPLETE'
  }

  const hasDeclined =
    g.documents?.find((d: DfDocument) => {
      return d.documentStatus === 'DECLINED'
    }) !== undefined
  if (hasDeclined) {
    return 'DECLINED'
  }

  const hasToProcess =
    g.documents?.find((d: DfDocument) => {
      return d.documentStatus === 'TO_PROCESS'
    }) !== undefined
  if (hasToProcess) {
    return 'TO_PROCESS'
  }

  return 'VALIDATED'
}

async function editGuarantor(g: Guarantor) {
  store.setSelectedGuarantor(g)
  router.push({
    name: 'GuarantorDocuments',
    params: { substep: '0' }
  })
}

function removeGuarantor(g: Guarantor) {
  store.deleteGuarantor(g).then(
    () => {
      if (!user.value.guarantors?.length || 0 >= 1) {
        router.push({ name: 'GuarantorChoice' })
      }
      isRemoveGuarantor.value = false
    },
    () => {
      ToastService.error()
    }
  )
}

function hasOneNaturalGuarantor() {
  return (
    user.value.guarantors &&
    user.value.guarantors.length === 1 &&
    user.value.guarantors[0].typeGuarantor === 'NATURAL_PERSON'
  )
}

function addNaturalGuarantor() {
  store.addNaturalGuarantor().then((data) => {
    router.push(data)
  })
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

.buttons {
  justify-content: space-between;
}

.guarantorselected {
  background-color: $light-blue-transparent;
}

.title-bar {
  display: flex;
  align-items: center;
  span {
    padding: 0.5rem;
    line-height: 1rem;
  }
}

.btn-group {
  width: fit-content;
}

h2 {
  line-height: 1.5rem;
}

.card {
  padding: 1rem;
}

.card-container {
  @media all and (min-width: 992px) {
    width: 100%;
  }
}

.small-font {
  font-size: 14px;
}

.add-guarantor-btn {
  border-radius: 0.5rem;
  padding: 1.75rem;
  color: var(--primary);
  border: 1px solid var(--primary);
  width: 100%;
  font-size: 16px;
  background: var(--blue-france-925);
  &:hover {
    background: var(--blue-france-hover);
  }
  &:active {
    background: var(--blue-france-active);
  }
}
</style>
