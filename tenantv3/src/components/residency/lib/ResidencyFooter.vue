<template>
  <FooterContainer>
    <form @submit.prevent="submit" class="display--flex">
      <DfButton :disabled="disabled" class="fr-ml-auto" primary
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

const props = defineProps<{ onSubmit?: () => void }>()

const router = useRouter()
const disabled = computed(() => DocumentService.getUserDocs('RESIDENCY').length === 0)

const submit = () => {
  if (props.onSubmit) {
    props.onSubmit()
  } else {
    router.push({ name: 'TenantProfessional' })
  }
}
</script>
