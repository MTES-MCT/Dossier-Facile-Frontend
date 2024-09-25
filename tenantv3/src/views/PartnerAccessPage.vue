<template>
  <div class="bg-blue">
    <div class="fr-container">
      <section class="fr-my-5w">
        <h1 class="fr-h4">{{ t('partners-page.title') }}</h1>
        <div style="display: flex; flex-direction: column; gap: 1.5rem">
          <PartnerAccesses></PartnerAccesses>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PartnerAccesses from '@/components/PartnerAccesses.vue'

const { t } = useI18n()
</script>

<style scoped lang="scss"></style>
