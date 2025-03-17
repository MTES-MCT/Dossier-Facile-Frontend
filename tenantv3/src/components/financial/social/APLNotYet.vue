<template>
  <BackLinkRow label="Aide sociale" @click="router.push(ancestor)" />
  <BackLinkRow
    label="Vous touchez l’aide personnalisée au logement (APL)"
    @click="router.push(grandparent)"
  />
  <BackLinkRow label="Vous ne touchez pas encore l’APL" @click="router.push(parent)" />
  <p class="fr-mb-1w">Saisissez le montant de vos revenus mensuels nets moyens&nbsp;:</p>
  <UploadFilesFinancial category="SOCIAL_SERVICE" step="SOCIAL_SERVICE_APL_NOT_YET">
    <template #incomeFilled>
      <p>
        Veuillez fournir une copie d’écran de la
        <a href="https://www.service-public.fr/particuliers/vosdroits/R2972" target="_blank"
          >simulation CAF d’aide au logement</a
        >.
      </p>
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
