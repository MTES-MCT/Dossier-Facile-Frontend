<template>
  <FooterContainer>
    <form @submit.prevent="goNext" class="display--flex">
      <DfButton :disabled="disabled" class="fr-ml-auto"
        >Valider votre situation d'hébergement</DfButton
      >
    </form>
  </FooterContainer>
</template>

<script setup lang="ts">
import FooterContainer from '@/components/footer/FooterContainer.vue'
import { DocumentService } from '@/services/DocumentService'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const disabled = computed(() => DocumentService.getUserDocs('RESIDENCY').length === 0)

const goNext = () => {
  router.push({ name: 'TenantProfessional' })
}
</script>
