<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import useOwnerStore from '../../store/owner-store'
import PropertyPage from './PropertyPage.vue'
import AnalyticsService from '../../services/AnalyticsService'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const store = useOwnerStore()

const id = ref(0)
if (route.params.id) {
  id.value = Number(route.params.id)
  store.updatePropertyToEdit(Number(id.value))
}

const livingSpace = computed({
  get() {
    return store.getPropertyToEdit?.livingSpace
  },
  set(val: number) {
    store.setLivingSpace(val)
  }
})

function onSubmit() {
  AnalyticsService.propertyData('surface_register')
  store.saveProperty().then(() => {
    router.push({
      name: 'PropertyRent',
      params: { id: store.getPropertyToEdit.id }
    })
  })
}

function onBack() {
  router.push({
    name: 'PropertyFurniture',
    params: { id: store.getPropertyToEdit.id }
  })
}
</script>

<template>
  <PropertyPage @on-back="onBack" @submit="onSubmit">
    <NakedCard class="fr-p-md-5w">
      <h1 class="fr-h4">{{ t('propertylivingspace.living-space-title') }}</h1>
      <p>{{ t('propertylivingspace.living-space-subtitle') }}</p>
      <p>
        <label class="fr-label" for="living-space"
          >{{ t('propertylivingspace.living-space-label') }} :</label
        >
        <Field
          id="living-space"
          name="living-space"
          v-model="livingSpace"
          v-slot="{ field, meta }"
          :rules="{
            required: true,
            positive: true
          }"
        >
          <input
            v-bind="field"
            class="validate-required form-control fr-input"
            :class="{
              'fr-input--valid': meta.valid,
              'fr-input--error': !meta.valid
            }"
            :placeholder="t('propertylivingspace.living-space-placeholder')"
            type="number"
          />
        </Field>
        <ErrorMessage name="living-space" v-slot="{ message }">
          <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
        </ErrorMessage>
      </p>
    </NakedCard>
  </PropertyPage>
</template>
