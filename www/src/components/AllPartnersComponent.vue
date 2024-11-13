<template>
  <div class="fr-mb-7w">
    <h2 class="fr-h2 text-center">
      {{ t('s5.title1') }}
      <span class="color--secondary">{{ t('s5.title2') }}</span>
    </h2>
    <div class="fr-container">
      <div class="fr-grid-row fr-grid-row--gutters">
        <template v-for="partner in partners" :key="partner.name">
          <LogoPartnerComponent
            :image="partner.image"
            :height="partner.height"
            :href="partner.href"
            :name="partner.name"
            :width="partner.width"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LogoPartnerComponent from './LogoPartnerComponent.vue'
import { PARTNERS } from '../models/PartnerModel'
import { computed } from 'vue'

const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    limit?: number
  }>(),
  {
    limit: 200
  }
)

const partners = computed(() => PARTNERS.splice(0, props.limit))
</script>
