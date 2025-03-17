<template>
  <BackLinkRow label="Retraite ou autre pension" @click="router.push(ancestor)" />
  <BackLinkRow label="Vous touchez une retraite" @click="router.push(grandparent)" />
  <BackLinkRow label="Vous avez un bulletin de pension" @click="router.push(parent)" />
  <p class="fr-mb-1w">Saisissez le montant de vos revenus mensuels nets moyens&nbsp;:</p>
  <UploadFilesFinancial category="PENSION" step="PENSION_STATEMENT">
    <template #incomeFilled>
      <p>Veuillez fournir <strong>un bulletin de pension de moins de 2 ans</strong>.</p>
      <div class="fr-alert fr-alert--warning">
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
  <FinancialFooter />
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/common/BackLinkRow.vue'
import { useRouter } from 'vue-router'
import FinancialFooter from '../lib/FinancialFooter.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'

const router = useRouter()
const parent = useParentRoute()
const grandparent = useParentRoute(2)
const ancestor = useParentRoute(3)
</script>
