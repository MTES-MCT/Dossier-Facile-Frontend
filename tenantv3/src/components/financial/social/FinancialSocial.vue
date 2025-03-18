<template>
  <BackLinkRow label="Aide sociale" :to="parent" />
  <p>Vous touchez :</p>
  <RadioList>
    <RadioListItem :to="here + '/caf'" @click="sendEvent('caf')"
      >une aide de la CAF ou de la MSA
      <span class="fr-hint-text">RSA, prime d’activité…</span>
    </RadioListItem>
    <RadioListItem :to="here + '/france-travail'" @click="sendEvent('france-travail')"
      >une aide de France Travail
      <span class="fr-hint-text">chômage, aide au retour à l’emploi (ARE)…</span>
    </RadioListItem>
    <RadioListItem :to="here + '/apl'" @click="sendEvent('apl')"
      >l’aide personnalisée au logement (APL)
      <span class="fr-hint-text">ou bien vous allez la toucher</span>
    </RadioListItem>
    <RadioListItem :to="here + '/aah'" @click="sendEvent('aah')"
      >l’allocation aux adultes handicapés (AAH)</RadioListItem
    >
    <RadioListItem :to="here + '/autre'" @click="sendEvent('other')">une autre aide</RadioListItem>
  </RadioList>
  <FinancialFooter />
</template>

<script setup lang="ts">
import RadioList from '@/components/common/RadioList.vue'
import RadioListItem from '@/components/common/RadioListItem.vue'
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import FinancialFooter from '../lib/FinancialFooter.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'

const route = useRoute()
const here = computed(() => route.path)
const parent = useParentRoute()

const sendEvent = (subCategory: string) =>
  AnalyticsService.selectSituation2('financial', 'social', subCategory)
</script>
