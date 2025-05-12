<template>
  <div class="fr-container fr-container--fluid fluid-full-width position--relative">
    <div class="bg-pic position--absolute"></div>
    <div class="fr-container position--relative mt-100 fr-mb-5w">
      <div class="fr-grid-row space-between fr-mb-3w">
        <div class="fr-grid-row">
          <h1 class="title">
            {{ t('propertycontainer.apply-to', [p.address]) }}
          </h1>
        </div>
      </div>
      <NakedCard class="subtitle">
        <div class="fr-grid-row align-items--center w100">
          <div class="fr-col-md-1 fr-col-2 text-center">
            <PropertyIcon :type="propertyType || ''"></PropertyIcon>
          </div>
          <div class="fr-col">
            <div>
              {{ t(titleKey) }}
              {{
                !p.dpeNotRequired
                  ? t('propertycontainer.rentdpe') + dpe
                  : t('propertycontainer.no-dpe-required')
              }}
              {{ t('propertycontainer.rent1') }}
              <span class="blue-text">{{ p.rentCost }}€</span>
              {{ t('propertycontainer.rent2') }}
              <span class="blue-text">{{ p.chargesCost }}€</span>
            </div>
          </div>
        </div>
      </NakedCard>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { useI18n } from 'vue-i18n'
import PropertyIcon from './PropertyIcon.vue'
import useOwnerStore from '../../store/owner-store'
import DpeService from '../../services/DpeService'

const { t } = useI18n()
const store = useOwnerStore()

const p = computed(() => store.getPropertyToConsult)
const propertyType = computed(() => p.value?.type)
const propertyFurnished = computed(() => p.value?.furniture)
const titleKey = computed(() => {
  if (propertyType.value === 'HOUSE') {
    if (propertyFurnished.value === 'FURNISHED') {
      return 'house-furnished'
    }
    return 'house-unfurnished'
  }
  if (propertyType.value === 'APARTMENT') {
    if (propertyFurnished.value === 'FURNISHED') {
      return 'apartment-furnished'
    }
    return 'apartment-unfurnished'
  }
  if (propertyFurnished.value === 'FURNISHED') {
    return 'other-furnished'
  }
  return 'other-unfurnished'
})
const dpe = computed(() =>
  DpeService.getGlobalLetter(
    DpeService.getEnergyConsumptionLetter(p.value?.energyConsumption, p.value.livingSpace),
    DpeService.getCO2EmissionLetter(
      p.value?.co2Emission,
      p.value.livingSpace,
      p.value.ademeApiResult?.etiquetteEmission
    ),
    p.value
  )
)
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
  @media (max-width: 768px) {
    height: 550px;
  }
}
</style>
