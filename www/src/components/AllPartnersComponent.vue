<template>
  <div class="fr-mb-7w">
    <h2 class="fr-h2 text-center">
      {{ t('s5.title1') }}
      <span class="color--secondary">{{ t('s5.title2') }}</span>
    </h2>
    <div class="fr-container">
      <ul class="fr-grid-row fr-grid-row--gutters hidden-list">
        <li v-for="partner in partners" :key="partner.name" class="fr-col-md-3 fr-col-6">
          <LogoPartnerComponent
            logo-class="fr-background-alt--grey"
            :image="partner.image"
            :height="partner.height"
            :href="partner.href"
            :name="partner.name"
            :width="partner.width"
          />
        </li>
      </ul>
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

const partners = computed(() => PARTNERS.slice(0, props.limit))
</script>

<style scoped>
.hidden-list {
  list-style: none;
  padding: 0;
}
</style>
