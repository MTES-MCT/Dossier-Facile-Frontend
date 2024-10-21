<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { Field, ErrorMessage } from 'vee-validate'
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

const rent = computed({
  get() {
    return store.getPropertyToEdit?.rentCost
  },
  set(val: number) {
    store.setRent(val)
  }
})

const charges = computed({
  get() {
    return store.getPropertyToEdit?.chargesCost
  },
  set(val: number) {
    store.setCharges(val)
  }
})

function onSubmit() {
  AnalyticsService.propertyData('honor_declaration_validate')
  store.saveProperty().then(() => {
    router.push({
      name: 'PropertyDiagnostic',
      params: { id: store.getPropertyToEdit.id }
    })
  })
}

function onBack() {
  router.push({
    name: 'PropertyLivingSpace',
    params: { id: store.getPropertyToEdit.id }
  })
}
</script>

<template>
  <PropertyPage @on-back="onBack" @submit="onSubmit">
    <NakedCard class="fr-p-md-5w">
      <h1 class="fr-h4">{{ t('propertyrent.rent-title') }}</h1>
      <p>{{ t('propertyrent.rent-subtitle') }}</p>
      <p>
        <label class="fr-label" for="rent">{{ t('propertyrent.monthly-rent') }} :</label>
        <Field
          id="rent"
          name="rent"
          v-model="rent"
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
            :placeholder="t('propertyrent.rent-amount')"
            type="number"
          />
        </Field>
        <ErrorMessage name="rent" v-slot="{ message }">
          <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
        </ErrorMessage>
      </p>
      <p>
        <label class="fr-label" for="charges">{{ t('propertyrent.monthly-charges') }} :</label>
        <Field
          id="charges"
          name="charges"
          v-model="charges"
          v-slot="{ field, meta }"
          :rules="{
            required: true,
            positiveOrNull: true
          }"
        >
          <input
            v-bind="field"
            class="validate-required form-control fr-input"
            :class="{
              'fr-input--valid': meta.valid,
              'fr-input--error': !meta.valid
            }"
            :placeholder="t('propertyrent.charges-amount')"
            type="number"
          />
        </Field>
        <ErrorMessage name="charges" v-slot="{ message }">
          <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
        </ErrorMessage>
      </p>
    </NakedCard>
  </PropertyPage>
</template>
