<template>
  <h2>Vos revenus</h2>
  <NakedCard class="fr-p-md-5w fr-mb-3w fr-grid-col">
    <div class="fr-highlight">
      <p>
        Les documents fournis permettent aux propriétaires de
        <strong>connaître vos moyens financiers</strong>.
      </p>
      <p>
        Vous pouvez ajouter <strong>autant de revenus que vous le souhaitez</strong> : revenus du
        travail, aides sociales, retraite, bourse...
      </p>
      <p>
        Soyez réaliste :
        <strong>notre équipe refuse automatiquement les montants surévalués</strong>.
      </p>
    </div>
    <div class="fr-grid-col income-wrapper">
      <div v-for="doc of store.tenantFinancialDocuments" :key="doc.id" class="income-card">
        <div class="display--flex">
          <span class="fr-text--lg bold">{{ t(`documents.${doc.documentType.key}`) }}</span>
          <span class="fr-ml-auto">{{ doc.monthlySum }}€ net mensuel</span>
        </div>
        <div class="fr-ml-auto">
          <router-link :to="makeLink(doc)" class="fr-link fr-mr-4w"
            >Modifier
            <RiEditLine size="1rem" />
          </router-link>
          <button type="button" class="btn-link color--primary" @click="deleteDoc(doc)">
            Supprimer
            <RiDeleteBinLine size="1rem" />
          </button>
        </div>
      </div>
    </div>
    <router-link to="4/ajouter" class="fr-btn fr-ml-auto fr-mt-3w"
      >Ajouter un revenu <RiAddFill class="tr-5"
    /></router-link>
  </NakedCard>
  <SimulationCaf />
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import SimulationCaf from '../documents/share/SimulationCaf.vue'
import { RiAddFill, RiDeleteBinLine, RiEditLine } from '@remixicon/vue'
import { useTenantStore } from '@/stores/tenant-store'
import { useI18n } from 'vue-i18n'
import type { FinancialDocument } from 'df-shared-next/src/models/FinancialDocument'
import { useLoading } from 'vue-loading-overlay'
import { ToastService } from '@/services/ToastService'
const store = useTenantStore()
const { t } = useI18n()

const STEP_ONE: Record<string, string> = {
  SALARY: 'travail',
  SOCIAL_SERVICE: 'social',
  PENSION: 'pension',
  RENT: 'rente',
  SCHOLARSHIP: 'bourse',
  NO_INCOME: 'pas-de-revenus'
}

function makeLink(doc: FinancialDocument) {
  const cat = doc.documentType.value
  if (!doc.id || !cat) {
    return '/documents-locataire/4'
  }
  // const step = doc.documentCategoryStep
  const link = `/documents-locataire/4/${doc.id}/${STEP_ONE[cat]}`
  return link
}

function deleteDoc(f: FinancialDocument) {
  if (f.id === undefined) {
    return
  }
  const $loading = useLoading()
  const loader = $loading.show()
  store
    .deleteDocument(f.id)
    .catch(() => {
      ToastService.error()
    })
    .finally(() => {
      loader.hide()
    })
}
</script>

<style scoped>
.tr-5 {
  translate: 5px;
}
.income-wrapper {
  gap: 1rem;
  margin-top: 1.5rem;
}
.income-card {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}
</style>
