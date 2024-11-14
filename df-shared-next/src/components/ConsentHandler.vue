<template>
  <ConsentBanner :show="consentRequired" @choice-made="consentRequired = false" />
  <ConsentModal @choice-made="consentRequired = false" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ConsentBanner from 'df-shared-next/src/components/ConsentBanner.vue'
import ConsentModal from 'df-shared-next/src/components/ConsentModal.vue'
import { isConsentRequired } from 'df-shared-next/src/services/ConsentService'

const consentRequired = ref(isConsentRequired())
</script>
