<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate'
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { Address } from 'df-shared-next/src/models/Address'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import UtilsService from '../../services/UtilsService'
import PropertyPage from './PropertyPage.vue'
import useOwnerStore from '../../store/owner-store'
import AnalyticsService from '../../services/AnalyticsService'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const store = useOwnerStore()
const debounce = 300

const id = ref(0)

const autocompleteRef = ref()
let timeout: number
const inputWidth = ref(0)
const showResults = ref(true)
const addresses = ref<Array<Address>>([])

if (route.params.id) {
  id.value = Number(route.params.id)
  store.updatePropertyToEdit(Number(id.value))
}

onMounted(() => {
  inputWidth.value = autocompleteRef.value.offsetWidth - 2
})

const address = computed({
  get() {
    return store.getPropertyToEdit?.address || ''
  },
  set(val: string) {
    store.setAddress(val)
  }
})

function onSubmit() {
  AnalyticsService.propertyData('adresse_register')
  store.saveProperty().then(() => {
    router.push({
      name: 'PropertyFurniture',
      params: { id: store.getPropertyToEdit.id }
    })
  })
}

function onBack() {
  router.push({
    name: 'PropertyType',
    params: { id: store.getPropertyToEdit.id }
  })
}

function displayResults() {
  showResults.value = true
}
function hideResults() {
  showResults.value = false
}
const shouldShowResults = computed(() => showResults.value && addresses.value.length > 0)

function updateAddresses(value: string) {
  UtilsService.getAddresses(value).then((res) => {
    if (res.data.type === 'FeatureCollection') {
      addresses.value = res.data.features
      displayResults()
    }
    return res.data
  })
}

function handleInput(e: Event) {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    const input = e.target instanceof HTMLInputElement ? e.target.value : ''
    updateAddresses(input)
  }, debounce)
}

function clickItem(data: Address) {
  store.setAddress(data.properties.label)
  showResults.value = false
}
</script>

<template>
  <PropertyPage @on-back="onBack" @submit="onSubmit">
    <NakedCard class="fr-p-md-5w">
      <h1 class="fr-h4">{{ t('propertyaddress.address-title') }}</h1>
      <p>{{ t('propertyaddress.address-subtitle') }}</p>
      <div>
        <label class="fr-label" for="address">{{ t('propertyaddress.address-label') }} :</label>
        <Field
          id="address"
          name="address"
          v-model="address"
          v-slot="{ field, meta }"
          :rules="{
            required: true
          }"
        >
          <input
            v-bind="field"
            ref="autocompleteRef"
            class="validate-required form-control fr-input"
            :class="{
              'fr-input--valid': meta.valid,
              'fr-input--error': !meta.valid
            }"
            :placeholder="'42 rue de la paix'"
            @input="handleInput"
            @focus="displayResults"
            @blur="hideResults"
            autocomplete="off"
            type="text"
          />
        </Field>
        <div
          :style="{ width: inputWidth + 'px' }"
          class="results-container"
          v-if="shouldShowResults"
        >
          <div
            v-for="(item, k) in addresses"
            :key="k"
            class="results-item"
            @click="clickItem(item)"
            @mousedown.prevent
          >
            {{ item.properties.label }}
          </div>
        </div>
        <ErrorMessage name="address" v-slot="{ message }">
          <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
        </ErrorMessage>
      </div>
    </NakedCard>
  </PropertyPage>
</template>

<style lang="scss" scoped>
.results-container {
  position: absolute;
  border: 1px solid black;
  z-index: 99;
  background: white;
}

.results-item {
  list-style-type: none;
  padding: 5px;
  border-bottom: 1px solid black;
  &:hover {
    cursor: pointer;
  }
  &:nth-last-child(1) {
    border-bottom: none;
  }
}
</style>
