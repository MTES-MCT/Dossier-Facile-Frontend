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
      <div v-for="doc of store.financialDocuments" :key="doc.id" class="income-card">
        <div class="display--flex">
          <span class="fr-text--lg bold">{{ categoryLabel(doc) }}</span>
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
import { useLoading } from 'vue-loading-overlay'
import { ToastService } from '@/services/ToastService'
import type { DfDocument, DocumentCategoryStep } from 'df-shared-next/src/models/DfDocument'
const store = useTenantStore()
const { t } = useI18n()

const CATEGORY_TO_PATH: Record<string, string> = {
  SALARY: 'travail',
  SOCIAL_SERVICE: 'social',
  PENSION: 'pension',
  RENT: 'rente',
  SCHOLARSHIP: 'bourse',
  NO_INCOME: 'pas-de-revenus'
}

const STEP_TO_PATH: { [P in DocumentCategoryStep]?: string } = {
  SALARY_EMPLOYED_LESS_3_MONTHS: 'travail/salarie/moins-3-mois',
  SALARY_EMPLOYED_MORE_3_MONTHS: 'travail/salarie/plus-3-mois',
  SALARY_EMPLOYED_NOT_YET: 'travail/salarie/pas-encore',
  SALARY_FREELANCE_AUTOENTREPRENEUR: 'travail/independant/auto-entrepreneur',
  SALARY_FREELANCE_OTHER: 'travail/independant/autre',
  SALARY_INTERMITTENT: 'travail/intermittent',
  SALARY_ARTIST_AUTHOR: 'travail/artiste-auteur',
  SALARY_UNKNOWN: 'travail/inconnu',
  SOCIAL_SERVICE_CAF_LESS_3_MONTHS: 'social/caf/moins-3-mois',
  SOCIAL_SERVICE_CAF_MORE_3_MONTHS: 'social/caf/plus-3-mois',
  SOCIAL_SERVICE_FRANCE_TRAVAIL_LESS_3_MONTHS: 'social/france-travail/moins-3-mois',
  SOCIAL_SERVICE_FRANCE_TRAVAIL_MORE_3_MONTHS: 'social/france-travail/plus-3-mois',
  SOCIAL_SERVICE_FRANCE_TRAVAIL_NOT_YET: 'social/france-travail/pas-encore',
  SOCIAL_SERVICE_APL_LESS_3_MONTHS: 'social/apl/moins-3-mois',
  SOCIAL_SERVICE_APL_MORE_3_MONTHS: 'social/apl/plus-3-mois',
  SOCIAL_SERVICE_APL_NOT_YET: 'social/apl/pas-encore',
  SOCIAL_SERVICE_AAH_LESS_3_MONTHS: 'social/aah/moins-3-mois',
  SOCIAL_SERVICE_AAH_MORE_3_MONTHS: 'social/aah/plus-3-mois',
  SOCIAL_SERVICE_AAH_NOT_YET: 'social/aah/pas-encore',
  SOCIAL_SERVICE_OTHER: 'social/autre',
  PENSION_STATEMENT: 'pension/retraite/bulletin',
  PENSION_NO_STATEMENT: 'pension/retraite/pas-de-bulletin',
  PENSION_DISABILITY_LESS_3_MONTHS: 'pension/invalidite/moins-3-mois',
  PENSION_DISABILITY_MORE_3_MONTHS: 'pension/invalidite/plus-3-mois',
  PENSION_DISABILITY_NOT_YET: 'pension/invalidite/pas-encore',
  PENSION_ALIMONY: 'pension/alimentaire',
  PENSION_UNKNOWN: 'pension/inconnu',
  RENT_RENTAL_RECEIPT: 'rente/revenus-locatifs/quittance',
  RENT_RENTAL_NO_RECEIPT: 'rente/revenus-locatifs/pas-de-quittance',
  RENT_ANNUITY_LIFE: 'rente/viagere',
  RENT_OTHER: 'rente/autre'
}

function categoryLabel(doc: DfDocument) {
  const key = doc.documentSubCategory?.toLowerCase().replaceAll('_', '-') || ''
  return t(`documents.${key}`)
}

function makeLink(doc: DfDocument) {
  const cat = doc.documentSubCategory
  if (!doc.id || !cat) {
    return '/documents-locataire/4'
  }
  const step = doc.documentCategoryStep && STEP_TO_PATH[doc.documentCategoryStep]
  const path = step || CATEGORY_TO_PATH[cat]
  const link = `/documents-locataire/4/${doc.id}/${path}`
  return link
}

function deleteDoc(f: DfDocument) {
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
