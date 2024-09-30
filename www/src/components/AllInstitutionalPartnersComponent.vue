<template>
  <div class="fr-mb-7w">
    <h2 class="fr-h2 text-center">
      {{ t('s6.title') }}
    </h2>
    <div class="fr-container">
      <div class="fr-grid-row fr-grid-row--gutters">
        <template v-for="partner in partners" v-bind:key="partner.name">
          <LogoInstitutionalPartnerComponent
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
import LogoInstitutionalPartnerComponent from './LogoInstitutionalPartnerComponent.vue'
import { INSTITUTIONAL_PARTNERS } from '../models/PartnerModel'
import { computed } from 'vue'

const { t } = useI18n()

const partners = computed(() => INSTITUTIONAL_PARTNERS.splice(0, props.limit))

const props = withDefaults(
  defineProps<{
    limit: number
  }>(),
  {
    limit: 200
  }
)
</script>
