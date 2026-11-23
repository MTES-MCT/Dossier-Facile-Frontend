<template>
  <main class="fr-container fr-py-3w" style="max-width: 50rem">
    <h1 class="fr-h4">Avis d'imposition</h1>
    <AnalysisErrorBlock
      v-model="explanation"
      :failed-rules="rules"
      :strategy="strategy"
      :heading-level="2"
    >
      <template #guidance="{ failedRules }">
        <TaxAnalysisGuidance
          :failed-rules="failedRules"
          parents-to="/documents-locataire/5/sans-avis/parents"
          identity-to="/nom-locataire"
          :is-self="true"
        />
      </template>
    </AnalysisErrorBlock>
  </main>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import AnalysisErrorBlock from '@/components/analysis/AnalysisErrorBlock.vue'
import { TaxAnalysisErrorStrategy } from '@/components/analysis/strategies/TaxAnalysisErrorStrategy'
import TaxAnalysisGuidance from '@/components/tax/lib/TaxAnalysisGuidance.vue'
import { taxKey } from '@/components/tax/lib/taxState'
import { getTaxYearPeriod } from '@/components/tax/lib/taxYear'

defineProps<{ rules: DocumentRule[] }>()
const explanation = ref('')
const strategy = new TaxAnalysisErrorStrategy({
  period: getTaxYearPeriod(new Date(2026, 10, 18)),
  pageCount: 1,
  isSelf: true
})
provide(taxKey, {
  previousStep: '/',
  nextStep: '/',
  category: 'tax',
  textKey: 'tenant',
  userId: 123,
  action: 'saveTenantTax',
  document: ref(Object.assign(new DfDocument(), { id: 42 }))
})
</script>
