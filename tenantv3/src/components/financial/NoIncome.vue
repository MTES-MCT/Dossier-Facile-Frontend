<template>
  <BackLinkRow label="Vous n’avez pas de revenus" @click="router.push(parent)" />
  <p class="fr-mb-1w">
    Vous pouvez ajouter une explication sur votre situation ici si vous le souhaitez :
  </p>
  <textarea class="fr-input fr-mb-2w" />
  <FinancialFooter />
</template>

<script setup lang="ts">
import BackLinkRow from '../common/BackLinkRow.vue'
import { useRouter } from 'vue-router'
import FinancialFooter from './FinancialFooter.vue'
import { useParentRoute } from '../guarantorResidency/useParentRoute'

const router = useRouter()
const parent = useParentRoute()
</script>
