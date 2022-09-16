<template>
  <div class="fr-container fr-container--fluid fluid-full-width position--relative">
    <div class="bg-pic position--absolute"></div>
    <div class="fr-container position--relative mt-100 fr-mb-5w">
      <div class="fr-grid-row space-between fr-mb-3w">
        <div class="fr-grid-row">
          <h1 class="title">{{ t('apply-to', [p.address]) }}</h1>
        </div>
      </div>
      <NakedCard class="subtitle">
        <div class="fr-grid-row align-items--center w100">
          <div class="fr-col-md-1 fr-col-2 text-center">
            <PropertyIcon :type="propertyType || ''"></PropertyIcon>
          </div>
          <div class="fr-col">
            <div>
              {{ t(titleKey) }} {{ t('rent1') }} <span class="blue-text">{{ p.rentCost }}€</span>
              {{ t('rent2') }} <span class="blue-text">{{ p.chargesCost }}€</span>
            </div>
          </div>
        </div>
      </NakedCard>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import NakedCard from 'df-shared-next/src/components/NakedCard.vue';
import { useI18n } from 'vue-i18n';
import PropertyIcon from './PropertyIcon.vue';
import useOwnerStore from '../../store/owner-store';

const { t } = useI18n();
const store = useOwnerStore();

const p = computed(() => store.getPropertyToConsult);
const propertyType = computed(() => store.getPropertyToConsult?.type);
const propertyFurnished = computed(() => store.getPropertyToConsult?.furniture);
const titleKey = computed(() => {
  if (propertyType.value === 'HOUSE') {
    if (propertyFurnished.value === 'FURNISHED') {
      return 'house-furnished';
    }
    return 'house-unfurnished';
  }
  if (propertyType.value === 'APARTMENT') {
    if (propertyFurnished.value === 'FURNISHED') {
      return 'apartment-furnished';
    }
    return 'apartment-unfurnished';
  }
  if (propertyFurnished.value === 'FURNISHED') {
    return 'other-furnished';
  }
  return 'other-unfurnished';
});
</script>

<style scoped lang="scss">
.subtitle {
  height: 100px;
  display: flex;
  align-items: center;
}

.title {
  color: white;
  margin-left: 2rem;
  font-size: 2rem;
  line-height: 2rem;
}

.mt-100 {
  margin-top: 200px;
}
.bg-pic {
  width: 100%;
  height: 320px;
  top: 0;
  left: 0;
  background-size: cover !important;
  background-position: 50% 40% !important;
  background-image: linear-gradient(0deg, rgba(22, 22, 22, 0.7), rgba(22, 22, 22, 0.7)),
    url('../../assets/salon.webp');
  background-color: #314467;
  z-index: 0;
}
</style>

<i18n>
{
  "en": {
    "apply-to": "Apply to {0}",
    "rent1": "with a rent of ",
    "rent2": " and charges of ",
  },
  "fr": {
    "apply-to": "Candidater au {0}",
    "rent1": "dont le loyer mensuel est de ",
    "rent2": " et les charges de ",
  }
}
</i18n>
