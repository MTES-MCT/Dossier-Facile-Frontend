<template>
  <ConsentBanner :show="consentRequired" @choice-made="consentRequired = false" />
  <ConsentModal @choice-made="consentRequired = false" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ConsentBanner from './ConsentBanner.vue'
import ConsentModal from './ConsentModal.vue'
import { isConsentRequired } from '../services/ConsentService'

const consentRequired = ref(isConsentRequired())
</script>
