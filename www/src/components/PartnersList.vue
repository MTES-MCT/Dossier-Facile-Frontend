<template>
  <div class="fr-mb-7w">
    <h2 class="fr-h2 text-center">
      <slot name="title">{{ title }}</slot>
    </h2>
    <div class="fr-container">
      <ul class="fr-grid-row fr-grid-row--gutters" role="list">
        <li v-for="partner in list" :key="partner.name" class="fr-col-md-3 fr-col-6">
          <LogoPartnerComponent
            :logo-class="backgroundGrey ? 'fr-background-alt--grey' : ''"
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
import type { Partner } from '../models/PartnerModel'
import { computed } from 'vue'
import LogoPartnerComponent from './LogoPartnerComponent.vue'

interface Props {
  partners: Partner[]
  title?: string
  limit?: number
  backgroundGrey?: boolean
}

const { partners, limit = 200, backgroundGrey = false } = defineProps<Props>()

const list = computed(() => partners.slice(0, limit))
</script>
