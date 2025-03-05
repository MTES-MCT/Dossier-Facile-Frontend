<template>
  <div>
    <NakedCard class="fr-p-md-5w">
      <h1 class="fr-h5">
        {{ t('tenantguarantorlist.my-guarantor') }}
      </h1>
      <div v-for="g in guarantors" :key="g.id">
        <CardRow @edit="editGuarantor(g)" @remove="isRemoveGuarantor = true">
          <template #tag>
            <div class="text-bold">{{ getGuarantorName(g) }}</div>
          </template>
          <template #text>
            <ColoredTag :text="t(getStatus(g))" :status="getStatus(g)"></ColoredTag>
          </template>
        </CardRow>
        <ConfirmModal
          v-if="isRemoveGuarantor"
          @valid="removeGuarantor(g)"
          @cancel="isRemoveGuarantor = false"
        >
          <span>{{ t('tenantguarantorlist.remove-guarantor') }}</span>
        </ConfirmModal>
      </div>
      <div v-if="hasOneNaturalGuarantor()">
        <button class="add-guarantor-btn" @click.once="addNaturalGuarantor()">
          {{ t('tenantguarantorlist.add-new-guarantor') }}
        </button>
      </div>
    </NakedCard>
    <GuarantorFooter @on-back="goBack" @on-next="goNext"></GuarantorFooter>
  </div>
</template>

<script setup lang="ts">
import GuarantorFooter from '../components/footer/GuarantorFooter.vue'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import ColoredTag from 'df-shared-next/src/components/ColoredTag.vue'
import CardRow from 'df-shared-next/src/components/CardRow.vue'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import { ToastService } from '@/services/ToastService'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTenantStore } from '@/stores/tenant-store'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  guarantors: Guarantor[]
}>()

const route = useRoute()
const { t } = useI18n()
const store = useTenantStore()
const emit = defineEmits<{
  'on-back': []
  'on-next': []
  'on-edit': [guarantor: Guarantor]
  'on-delete': [guarantor: Guarantor]
}>()

const isRemoveGuarantor = ref(false)

function getGuarantorName(g: Guarantor) {
  if (g.firstName || g.lastName) {
    return `${g.firstName || ''} ${g.lastName || ''}`
  }
  if (g.typeGuarantor === 'LEGAL_PERSON' && g.legalPersonName) {
    return g.legalPersonName
  }
  return t('tenantguarantorlist.guarantor.' + g.typeGuarantor)
}

function goBack() {
  emit('on-back')
}

function goNext() {
  emit('on-next')
}

function getStatus(g: Guarantor): string {
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

function editGuarantor(g: Guarantor) {
  emit('on-edit', g)
}

function removeGuarantor(g: Guarantor) {
  store
    .deleteGuarantor(g)
    .then(() => {
      emit('on-delete', g)
    })
    .catch(() => {
      ToastService.error()
    })
    .finally(() => {
      isRemoveGuarantor.value = false
    })
}

function hasOneNaturalGuarantor() {
  return props.guarantors?.length === 1 && props.guarantors[0].typeGuarantor === 'NATURAL_PERSON'
}

function addNaturalGuarantor() {
  store
    .setGuarantorType({
      tenantId: Number(route.params.tenantId),
      typeGuarantor: 'NATURAL_PERSON'
    })
    .then(() => {
      emit('on-edit', props.guarantors[props.guarantors.length - 1])
    })
}
</script>

<style scoped lang="scss">
h2 {
  font-size: 1rem;
  margin: 0.5rem;
  display: inline-block;
  align-self: center;
  line-height: 1.5rem;
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
  background-color: var(--secondary);
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
  background-color: var(--light-blue-transparent);
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
