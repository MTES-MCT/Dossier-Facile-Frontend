<template>
  <RadioList>
    <RadioListItem to="2/tenant">Locataire</RadioListItem>
    <RadioListItem to="2/guest"
      >Hébergé chez quelqu'un
      <span class="fr-hint-text">Chez vos parents, un ami, un proche…</span>
    </RadioListItem>
    <RadioListItem to="2/owner">Propriétaire</RadioListItem>
    <template v-if="showAllItems">
      <RadioListItem to="2/guest-company">Dans un logement de fonction</RadioListItem>
      <RadioListItem to="2/short-term-rental"
        >En location de type airbnb, à l'hôtel, au camping</RadioListItem
      >
      <RadioListItem to="2/guest-organism"
        >Hébergé par un organisme
        <span class="fr-hint-text">Hébergement d'urgence, placement</span>
      </RadioListItem>
      <RadioListItem to="2/other-residency"
        >En situation précaire
        <span class="fr-hint-text">sans-abri, victime de violences conjugales</span>
      </RadioListItem>
    </template>
  </RadioList>
  <DfButton v-if="!showAllItems" @click="showAllItems = true">Autres situations…</DfButton>
  <ResidencyFooter />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RadioList from './lib/RadioList.vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import RadioListItem from './lib/RadioListItem.vue'
import ResidencyFooter from './lib/ResidencyFooter.vue'
const showAllItems = ref(false)
</script>
