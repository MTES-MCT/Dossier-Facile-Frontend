<template>
  <BackLinkRow label="Retraite ou autre pension" :to="grandparent" />
  <BackLinkRow label="Non renseigné" :to="parent" />
  <WarningUpdate />
  <p class="fr-mb-1w">Saisissez le montant de vos revenus mensuels nets moyens&nbsp;:</p>
  <UploadFilesFinancial category="PENSION" step="PENSION_UNKNOWN" no-upload>
    <template #incomeFilled>
      <p>Veuillez fournir <strong>un bulletin de pension de moins de 2 ans</strong>.</p>
      <div class="fr-alert fr-alert--warning fr-mb-3w">
        <p class="bold">
          Notre équipe refuse automatiquement les bulletins de pension de plus de 2 ans.
        </p>
        <p>
          Si vous n’avez pas de document de moins de 2 ans, veuillez indiquer que
          <RouterLink to="pas-de-bulletin">vous n’avez pas de bulletin de pension</RouterLink>.
        </p>
      </div>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import WarningUpdate from '../lib/WarningUpdate.vue'

const parent = useParentRoute()
const grandparent = useParentRoute(2)
</script>
