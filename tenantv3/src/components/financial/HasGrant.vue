<template>
  <BackLinkRow label="Vous êtes boursier" @click="router.push(parent)" />
  <p class="fr-mb-1w">Saisissez votre <strong>revenu mensuel net :</strong></p>
  <input placeholder="Montant en euros" class="fr-input fr-mb-2w" />
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
