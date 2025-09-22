<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'

const { t } = useI18n()
</script>

<template>
  <NakedCard class="fr-pl-3w fr-pr-3w">
    <div style="display: flex; justify-content: space-between">
      <div>
        <h2 class="fr-h6">{{ t('gmbi-ad.title') }}</h2>
        <a href="https://cfspart.impots.gouv.fr/enp/gmbi.do">
          <DfButton class="gmbi-button" :primary="true"
            >{{ t('gmbi-ad.call-to-action') }}
          </DfButton>
        </a>
      </div>
      <img src="../assets/logo_GMBI.svg" alt="Gérer mes biens immobiliers" />
    </div>
    <div class="fr-mt-2w made-by">
      <span class="fr-text--sm">{{ t('gmbi-ad.made-by') }}</span>
      <img src="../assets/logo_impots_gouv.svg" alt="Logo impots.gouv.fr" />
    </div>
  </NakedCard>
</template>

<style scoped lang="scss">
.gmbi-button {
  background-color: #1a1919;
}

.gmbi-button:hover {
  background-color: #2b2b2b;
}

.made-by {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 0.25rem;
}
</style>
