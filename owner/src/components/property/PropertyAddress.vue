<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { Address } from 'df-shared/src/models/Address';
import UtilsService from '../../services/UtilsService';
import PropertyPage from './PropertyPage.vue';
import useOwnerStore from '../../store/owner-store';

const { t } = useI18n();

const route = useRoute();
const router = useRouter();
const store = useOwnerStore();
const debounce = 300;

const id = ref(0);

const autocompleteRef = ref();
let timeout: NodeJS.Timeout;
const inputWidth = ref(0);
const showResults = ref(true);
const addresses = ref<Array<Address>>([]);

if (route.params.id) {
  id.value = Number(route.params.id);
  store.updatePropertyToEdit(Number(id.value));
}

onMounted(() => {
  inputWidth.value = autocompleteRef.value.offsetWidth - 2;
});

const address = computed({
  get() {
    return store.getPropertyToEdit?.address || '';
  },
  set(val: string) {
    store.setAddress(val);
  },
});

function onSubmit() {
  store.saveProperty().then(() => {
    router.push({
      name: 'PropertyFurniture',
      params: { id: store.getPropertyToEdit.id },
    });
  });
}

function onBack() {
  router.push({
    name: 'PropertyType',
    params: { id: store.getPropertyToEdit.id },
  });
}

function displayResults() {
  showResults.value = true;
}
function hideResults() {
  showResults.value = false;
}
const shouldShowResults = computed(() => showResults.value && addresses.value.length > 0);

function updateAddresses(value: string) {
  UtilsService.getAddresses(value).then((res: any) => {
    addresses.value = res.data.features;
    displayResults();
    return res.data;
  });
}

function handleInput(e: any) {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    updateAddresses(e.target.value);
  }, debounce);
}

function clickItem(data: Address) {
  store.setAddress(data.properties.label);
  showResults.value = false;
}
</script>

<template>
  <PropertyPage @on-back="onBack" @submit="onSubmit">
    <h1 class="fr-h4">{{ t("address-title") }}</h1>
    <p>{{ t("address-subtitle") }}</p>
    <div>
      <label class="fr-label" for="address">{{ t("address-label") }} :</label>
      <input
        ref="autocompleteRef"
        v-model="address"
        class="form-control fr-input validate-required"
        id="address"
        name="address"
        :placeholder="'42 rue de la paix'"
        type="text"
        @input="handleInput"
        @focus="displayResults"
        @blur="hideResults"
        required
      />
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
    </div>
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

<i18n>
{
  "en": {
    "address-title": "Location",
    "address-subtitle": "Where is the property?",
    "address-label": "Address of my property"
  },
  "fr": {
    "address-title": "Localisation",
    "address-subtitle": "Où se trouve votre propriété ?",
    "address-label": "L'adresse de ma propriété"
  }
}
</i18n>
