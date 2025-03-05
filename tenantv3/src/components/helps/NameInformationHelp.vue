<template>
  <div class="fr-alert fr-alert--info fr-mb-1w">
    <p v-if="isFranceConnected">
      {{ t('nameinformationhelp.info-fc') }}
      <a href="#" @click="updateInformation"> {{ t('nameinformationhelp.unlink-fc') }}</a
      >.
    </p>
    <p v-else>
      {{ t('nameinformationhelp.info') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant-store'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const store = useTenantStore()
const isFranceConnected = computed(() => store.isFranceConnected)
const emit = defineEmits<{ updateInformation: [] }>()

const { t } = useI18n()

function updateInformation() {
  emit('updateInformation')
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
