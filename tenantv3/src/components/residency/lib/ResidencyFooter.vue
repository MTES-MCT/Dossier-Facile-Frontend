<template>
  <FooterContainer>
    <form @submit.prevent="submit" class="display--flex">
      <DfButton :disabled="disabled" class="fr-ml-auto" primary>{{
        t('validate-residency')
      }}</DfButton>
    </form>
  </FooterContainer>
</template>

<script setup lang="ts">
import FooterContainer from '@/components/footer/FooterContainer.vue'
import { DocumentService } from '@/services/DocumentService'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const props = defineProps<{ onSubmit?: () => void }>()

const { t } = useI18n()
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

<i18n>
{
  "en": {
    "validate-residency": "Validate your housing situation",
  },
  "fr": {
    "validate-residency": "Valider votre situation d'hébergement"
  }
}
</i18n>
