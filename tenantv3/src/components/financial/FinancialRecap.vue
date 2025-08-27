<template>
  <NakedCard class="fr-p-md-5w fr-m-3v fr-mb-3w fr-grid-col">
    <GuarantorBadge v-if="state.textKey.endsWith('guarantor')" />
    <TenantBadge v-else />
    <h6>{{ t('income.' + state.textKey) }}</h6>
    <div class="fr-highlight fr-ml-0">
      <i18n-t keypath="documents-provided" tag="p">
        <strong>{{ t('financial-means') }}</strong>
      </i18n-t>
      <i18n-t keypath="you-can-add" tag="p">
        <strong>{{ t('as-much-income') }}</strong>
      </i18n-t>
      <i18n-t keypath="be-realistic" tag="p" class="fr-mb-0">
        <strong>{{ t('auto-reject') }}</strong>
      </i18n-t>
    </div>
    <div class="fr-grid-col income-wrapper">
      <div v-if="duplicateIds.size > 0" class="duplicate-alert fr-text--xs">
        <RiAlertFill size="1rem" style="flex-shrink: 0" aria-hidden="true" />
        <span>{{ t('duplicate-alert') }}</span>
      </div>
      <div
        v-for="doc of sortedFinancialDocs"
        :key="doc.id"
        class="income-card"
        :class="{ duplicate: doc.id && duplicateIds.has(doc.id) }"
      >
        <div class="first-row">
          <span class="fr-text--lg fr-mb-0 bold">{{ categoryLabel(doc) }}</span>
          <span>{{ doc.monthlySum }}€ {{ t('net-per-month') }}</span>
        </div>
        <span v-if="doc.documentCategoryStep" class="fr-text--sm fr-mb-0 text-grey">{{
          STEP_LABEL[doc.documentCategoryStep]
        }}</span>
        <span v-if="doc.documentStatus === 'DECLINED'" class="pill declined">
          <RiAlertFill size="1rem" aria-hidden="true" />
          {{ t('declined') }}</span
        >
        <span v-else-if="doc.documentStatus === 'VALIDATED'" class="pill validated">
          <RiCheckboxCircleFill size="1rem" aria-hidden="true" />
          {{ t('validated') }}</span
        >
        <span v-else-if="doc.documentStatus === 'TO_PROCESS'" class="pill to-process">
          <RiTimeFill size="1rem" aria-hidden="true" />
          {{ t('to-process') }}</span
        >
        <div class="fr-ml-auto fr-mt-2w">
          <router-link :to="makeLink(doc)" class="fr-link fr-mr-4w"
            >{{ t('edit') }}
            <RiEditLine size="1rem" aria-hidden="true" />
          </router-link>
          <button
            ref="delete-btn"
            type="button"
            class="btn-link color--primary"
            @click="showDeleteModale(doc)"
          >
            {{ t('delete') }}
            <RiDeleteBinLine size="1rem" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
    <router-link
      v-if="showAddIncome"
      :to="here + '/ajouter'"
      class="fr-btn fr-ml-auto fr-mt-3w"
      :class="{ 'fr-btn--secondary': financialDocuments.length > 0 }"
      @click="AnalyticsService.addIncome(state.category)"
      >{{ t(financialDocuments.length > 0 ? 'add-another-income' : 'add-income') }}
      <RiAddFill class="tr-5" size="20" aria-hidden="true"
    /></router-link>
  </NakedCard>
  <SimulationCaf class="fr-mx-3v" />
  <FinancialFooter
    :to="state.nextStep"
    :disabled="financialDocuments.length === 0"
    :on-submit="submit"
  >
    {{ t('confirm-step') }}
  </FinancialFooter>
  <ModalComponent v-if="showInfoModale" @close="showInfoModale = false">
    <template #header>
      <h4>{{ t('modal-title') }}</h4>
    </template>
    <template #body>
      <p>{{ t('modal-text') }}</p>
      <p>{{ t('modal-text-2') }}</p>
    </template>
    <template #footer>
      <DfButton class="large-btn" primary @click="showInfoModale = false">OK</DfButton>
    </template>
  </ModalComponent>
  <ModalComponent v-if="docToDelete" @close="hideDeleteModale">
    <template #body>
      <p class="fr-m-0">{{ t('sure-to-delete') }}</p>
    </template>
    <template #footer>
      <ul class="fr-btns-group fr-btns-group--inline-md btns-group">
        <li>
          <DfButton primary @click="deleteDoc">{{ t('delete') }}</DfButton>
        </li>
        <li>
          <DfButton @click="hideDeleteModale">{{ t('cancel') }}</DfButton>
        </li>
      </ul>
    </template>
  </ModalComponent>
  <ModalComponent
    v-if="showDuplicatesModale && firstDuplicate?.documentCategoryStep"
    @close="showDuplicatesModale = false"
  >
    <template #header>
      <h2 class="fr-h3 fr-mb-0">{{ t('duplicate-resource') }}</h2>
    </template>
    <template #body>
      <p class="bold fr-mb-0">{{ t('seem-duplicates') }}</p>
      <i18n-t tag="p" keypath="resources-added" class="fr-mb-0">
        <template #times>
          <strong>{{ duplicateIds.size }} {{ t('times') }}</strong>
        </template>
        <template #resource>
          <strong>{{ STEP_LABEL[firstDuplicate.documentCategoryStep] }}</strong>
        </template>
        <template #amount>
          <strong>{{ firstDuplicate.monthlySum }}€</strong>
        </template>
      </i18n-t>
      <i18n-t tag="p" keypath="remember-combine-docs" class="fr-mb-2w">
        <strong>{{ t('remember') }}</strong>
      </i18n-t>
      <p class="fr-mb-0">{{ t('recommend-check') }}</p>
    </template>
    <template #footer>
      <ul class="fr-btns-group fr-btns-group--inline-md btns-group">
        <li>
          <DfButton primary @click="showDuplicatesModale = false">{{ t('check-income') }}</DfButton>
        </li>
        <li>
          <DfButton @click="router.push(state.nextStep)">{{ t('go-next-step') }}</DfButton>
        </li>
      </ul>
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import SimulationCaf from '../documents/share/SimulationCaf.vue'
import {
  RiAddFill,
  RiAlertFill,
  RiCheckboxCircleFill,
  RiDeleteBinLine,
  RiEditLine,
  RiTimeFill
} from '@remixicon/vue'
import { useTenantStore } from '@/stores/tenant-store'
import { useI18n } from 'vue-i18n'
import { useLoading } from 'vue-loading-overlay'
import type { DfDocument, DocumentCategoryStep } from 'df-shared-next/src/models/DfDocument'
import FinancialFooter from './lib/FinancialFooter.vue'
import ModalComponent from 'df-shared-next/src/components/ModalComponent.vue'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { useFinancialState } from '@/components/financial/financialState'
import { useRoute, useRouter } from 'vue-router'
import { AnalyticsService } from '@/services/AnalyticsService'
import TenantBadge from '../common/TenantBadge.vue'
import GuarantorBadge from '../common/GuarantorBadge.vue'
import { toast } from '@/components/toast/toastUtils'

const store = useTenantStore()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const deleteBtn = useTemplateRef('delete-btn')
const showInfoModale = ref(false)
const showDuplicatesModale = ref(false)
const docToDelete = ref<DfDocument>()
const state = useFinancialState()
const financialDocuments = computed(() => state.documents.value)
const here = computed(() => route.path)
const showAddIncome = computed(
  () => !financialDocuments.value.some((d) => d.documentSubCategory === 'NO_INCOME')
)
const duplicateIds = computed(() => {
  const seen = new Map<string, number[]>()
  for (const doc of financialDocuments.value) {
    const key = `${doc.documentSubCategory}-${doc.monthlySum}`
    if (!seen.has(key)) {
      seen.set(key, [])
    }
    seen.get(key)?.push(doc.id || 0)
  }
  const firstGroup = Array.from(seen.entries()).filter(([, ids]) => ids.length > 1)[0]
  return new Set(firstGroup?.[1] || [])
})
const sortedFinancialDocs = computed(() =>
  // put duplicates first
  financialDocuments.value.slice().sort((a, b) => {
    const aIsDup = a.id && duplicateIds.value.has(a.id)
    const bIsDup = b.id && duplicateIds.value.has(b.id)
    if (aIsDup && !bIsDup) return -1
    if (!aIsDup && bIsDup) return 1
    return 0
  })
)
const firstDuplicate = computed(() => {
  const [firstId] = duplicateIds.value
  return financialDocuments.value.find((doc) => doc.id === firstId)
})

onMounted(() => {
  if (
    financialDocuments.value.some(
      (doc) =>
        doc.documentCategoryStep === 'SALARY_UNKNOWN' ||
        doc.documentCategoryStep === 'PENSION_UNKNOWN'
    )
  ) {
    showInfoModale.value = true
  }
})

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

const STEP_LABEL: { [P in DocumentCategoryStep]?: string } = {
  SALARY_EMPLOYED_LESS_3_MONTHS: 'Salarié',
  SALARY_EMPLOYED_MORE_3_MONTHS: 'Salarié',
  SALARY_EMPLOYED_NOT_YET: 'Salarié',
  SALARY_FREELANCE_AUTOENTREPRENEUR: 'Indépendant',
  SALARY_FREELANCE_OTHER: 'Indépendant',
  SALARY_INTERMITTENT: 'Intermittent',
  SALARY_ARTIST_AUTHOR: 'Artiste-auteur',
  SALARY_UNKNOWN: 'Non renseigné',
  SOCIAL_SERVICE_CAF_LESS_3_MONTHS: 'Aide de la CAF ou de la MSA',
  SOCIAL_SERVICE_CAF_MORE_3_MONTHS: 'Aide de la CAF ou de la MSA',
  SOCIAL_SERVICE_FRANCE_TRAVAIL_LESS_3_MONTHS: 'Aide de France Travail',
  SOCIAL_SERVICE_FRANCE_TRAVAIL_MORE_3_MONTHS: 'Aide de France Travail',
  SOCIAL_SERVICE_FRANCE_TRAVAIL_NOT_YET: 'Aide de France Travail',
  SOCIAL_SERVICE_APL_LESS_3_MONTHS: 'Aide personnalisée au logement (APL)',
  SOCIAL_SERVICE_APL_MORE_3_MONTHS: 'Aide personnalisée au logement (APL)',
  SOCIAL_SERVICE_APL_NOT_YET: 'Aide personnalisée au logement (APL)',
  SOCIAL_SERVICE_AAH_LESS_3_MONTHS: 'Allocation aux adultes handicapés (AAH)',
  SOCIAL_SERVICE_AAH_MORE_3_MONTHS: 'Allocation aux adultes handicapés (AAH)',
  SOCIAL_SERVICE_AAH_NOT_YET: 'Allocation aux adultes handicapés (AAH)',
  SOCIAL_SERVICE_OTHER: 'Autre type d’aide',
  PENSION_STATEMENT: 'Retraite',
  PENSION_NO_STATEMENT: 'Retraite',
  PENSION_DISABILITY_LESS_3_MONTHS: 'Pension d’invalidité',
  PENSION_DISABILITY_MORE_3_MONTHS: 'Pension d’invalidité',
  PENSION_DISABILITY_NOT_YET: 'Pension d’invalidité',
  PENSION_ALIMONY: 'Pension alimentaire',
  PENSION_UNKNOWN: 'Non renseigné',
  RENT_RENTAL_RECEIPT: 'Revenus locatifs',
  RENT_RENTAL_NO_RECEIPT: 'Revenus locatifs',
  RENT_ANNUITY_LIFE: 'Rente viagère',
  RENT_OTHER: 'Autre type de rente'
}

function categoryLabel(doc: DfDocument) {
  const key = doc.documentSubCategory?.toLowerCase().replaceAll('_', '-') || ''
  return t(`documents.${key}`)
}

function makeLink(doc: DfDocument) {
  const cat = doc.documentSubCategory
  if (!doc.id || !cat) {
    return here.value
  }
  const step = doc.documentCategoryStep && STEP_TO_PATH[doc.documentCategoryStep]
  const path = step || CATEGORY_TO_PATH[cat]
  const link = `${here.value}/${doc.id}/${path}`
  return link
}

function showDeleteModale(doc: DfDocument) {
  docToDelete.value = doc
  AnalyticsService.deleteIncome(state.category, 'ask')
}

function hideDeleteModale() {
  docToDelete.value = undefined
  AnalyticsService.deleteIncome(state.category, 'cancel')
}

function deleteDoc() {
  const id = docToDelete.value?.id
  if (id === undefined) {
    return
  }
  docToDelete.value = undefined
  AnalyticsService.deleteIncome(state.category, 'confirm')
  const $loading = useLoading()
  const loader = $loading.show()
  store
    .deleteDocument(id)
    .catch(() => {
      const index = sortedFinancialDocs.value.findIndex((d) => d.id === id)
      toast.error(t('delete-failed'), deleteBtn.value?.at(index))
    })
    .finally(() => {
      loader.hide()
    })
}

function submit() {
  if (duplicateIds.value.size > 0) {
    showDuplicatesModale.value = true
    return false
  }
  return true
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
  .first-row {
    display: flex;
    flex-direction: column;
    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: space-between;
    }
  }
}
.pill {
  border-radius: 4px;
  display: flex;
  padding: 0 6px;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
  width: fit-content;
}
.declined {
  color: var(--text-default-warning);
  background-color: var(--background-contrast-warning);
}
.validated {
  color: var(--text-default-success);
  background-color: var(--background-contrast-success);
}
.to-process {
  color: var(--purple-text);
  background-color: var(--background-alt-purple-glycine);
}
.large-btn {
  justify-content: center;
  flex-grow: 1;
  @media (min-width: 768px) {
    flex-grow: 0;
    width: 6rem;
  }
}
.btns-group {
  flex: 1;
  justify-content: flex-end;
}
.duplicate {
  border-color: #d64f00;
}
.duplicate-alert {
  color: #b34000;
  display: flex;
  gap: 4px;
  margin-bottom: -0.5rem;
}
</style>

<i18n>
{
  "en": {
    "documents-provided": "The documents you provide allow the owners to {0}.",
    "financial-means": "determine your financial means",
    "you-can-add": "You can add {0}: income from work, social benefits, pension, stock market…",
    "as-much-income": "as much income as you like",
    "be-realistic": "Be realistic : {0}.",
    "auto-reject": "our team automatically rejects overstimated amounts",
    "add-income": "Declare resources",
    "add-another-income": "Add another income",
    "modal-title": "DossierFacile évolue pour mieux vous accompagner",
    "modal-text": "En raison de l'évolution de cette étape, il est possible que certains de vos fichiers soient mal catégorisés. Nous vous invitons à vérifier et à ajuster les documents pour vous assurer qu'ils sont bien associés à la bonne catégorie.",
    "modal-text-2": "Nous nous excusons pour la gêne occasionnée.",
    "net-per-month": "net per month",
    "declined": "Change expected",
    "validated": "Validated",
    "to-process": "Waiting to be processed",
    "edit": "Edit",
    "delete": "Delete",
    "income": {
      "tenant": "Your income",
      "couple": "Your spouse's income",
      "guarantor": "Your guarantor's income",
      "couple-guarantor": "Income of your spouse's guarantor"
    },
    "sure-to-delete": "Are you sure you want to delete this income?",
    "delete-failed": "Unable to delete this income. Please try again.",
    "cancel": "Cancel",
    "confirm-step": "Confirm your income step",
    "duplicate-alert": "These resources appear identical. Remember to combine all the supporting documents from the same source in a single declaration.",
    "duplicate-resource": "Duplicate resource added",
    "seem-duplicates": "Some of the resources added seem to be duplicates.",
    "times": "times",
    "resources-added": "You have added {times} your resource {resource} amounting to {amount}.",
    "remember": "Remember:",
    "remember-combine-docs": "{0} for each source of income, remember to combine all the supporting documents in a single declaration.",
    "recommend-check": "We recommend that you check your files before completing this step.",
    "check-income": "Check my income",
    "go-next-step": "Go to next step"
  },
  "fr": {
    "documents-provided": "Les documents fournis permettent aux propriétaires de {0}.",
    "financial-means": "connaître vos moyens financiers",
    "you-can-add": "Vous pouvez ajouter {0} : revenus du travail, aides sociales, retraite, bourse…",
    "as-much-income": "autant de revenus que vous le souhaitez",
    "be-realistic": "Soyez réaliste : {0}.",
    "auto-reject": "notre équipe refuse automatiquement les montants surévalués",
    "add-income": "Déclarer ses ressources",
    "add-another-income": "Ajouter une autre ressource",
    "modal-title": "DossierFacile évolue pour mieux vous accompagner",
    "modal-text": "En raison de l'évolution de cette étape, il est possible que certains de vos fichiers soient mal catégorisés. Nous vous invitons à vérifier et à ajuster les documents pour vous assurer qu'ils sont bien associés à la bonne catégorie.",
    "modal-text-2": "Nous nous excusons pour la gêne occasionnée.",
    "net-per-month": "net mensuel",
    "declined": "Modification attendue",
    "validated": "Validé",
    "to-process": "En attente de traitement",
    "edit": "Modifier",
    "delete": "Supprimer",
    "income": {
      "tenant": "Vos revenus",
      "couple": "Revenus de votre conjoint",
      "guarantor": "Revenus de votre garant",
      "couple-guarantor": "Revenus du garant de votre conjoint"
    },
    "sure-to-delete": "Êtes-vous sûr de vouloir supprimer ce revenu ?",
    "delete-failed": "Impossible de supprimer ce revenu. Veuillez réessayer",
    "cancel": "Annuler",
    "confirm-step": "Valider l’étape de vos revenus",
    "duplicate-alert": "Ces ressources paraissent identiques. Pensez à regrouper tous les justificatifs d’une même source dans une seule déclaration.",
    "duplicate-resource": "Ressource ajoutée en double",
    "seem-duplicates": "Certaines ressources ajoutées semblent être en double.",
    "times": "fois",
    "resources-added": "Vous avez ajouté {times} votre ressource {resource} pour un montant de {amount}.",
    "remember": "Rappel :",
    "remember-combine-docs": "{0} pour chaque source de revenus, pensez à regrouper tous les justificatifs dans une seule déclaration. ",
    "recommend-check": "Nous vous recommandons de vérifier vos fichiers avant de valider cette étape.",
    "check-income": "Vérifier mes revenus",
    "go-next-step": "Passer à l’étape suivante"
  }
}
</i18n>
