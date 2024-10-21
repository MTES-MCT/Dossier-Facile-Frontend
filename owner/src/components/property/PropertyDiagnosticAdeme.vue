<template>
  <PropertyPage :skip-form="true">
    <PropertyDiagnosticForm @on-back="onBack" @submit="onSubmit"></PropertyDiagnosticForm>
    <div v-if="hasDpe">
      <PropertyDiagnosticResult v-if="dpe" :dpe="dpe"></PropertyDiagnosticResult>
      <PropertyDiagnosticEnergySieves
        :letter="dpe?.etiquetteBilan || '-'"
      ></PropertyDiagnosticEnergySieves>
      <PropertyDiagnosticExpiryWarning class="fr-mt-3w" v-if="dpe?.statut === 'EXPIRE'">
      </PropertyDiagnosticExpiryWarning>
    </div>
  </PropertyPage>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useOwnerStore from '../../store/owner-store'
import PropertyDiagnosticForm from './PropertyDiagnosticForm.vue'
import PropertyDiagnosticResult from './PropertyDiagnosticResult.vue'
import PropertyPage from './PropertyPage.vue'
import PropertyDiagnosticExpiryWarning from './PropertyDiagnosticExpiryWarning.vue'
import PropertyDiagnosticEnergySieves from './PropertyDiagnosticEnergySieves.vue'

const store = useOwnerStore()
const route = useRoute()
const router = useRouter()

const dpe = computed(() => store.getPropertyToEdit?.ademeApiResult)
const hasDpe = computed(() => dpe.value?.numero !== null)

onMounted(() => {
  if (route.params.id) {
    const propertyId = Number(route.params.id)
    store.updatePropertyToEdit(propertyId)
  }
})

function onBack() {
  router.push({
    name: 'PropertyRent',
    params: { id: store.getPropertyToEdit.id }
  })
}

function onSubmit() {
  router.push({
    name: 'ValidateProperty',
    params: { id: store.getPropertyToEdit.id }
  })
}
</script>
