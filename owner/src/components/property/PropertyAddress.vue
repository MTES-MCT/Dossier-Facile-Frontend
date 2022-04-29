<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import PropertyPage from './PropertyPage.vue';

const { t } = useI18n();

const route = useRoute();
const router = useRouter();
const store = useStore();

const id = ref(0);
if (route.params.id) {
  id.value = Number(route.params.id);
  store.dispatch('updatePropertyToEdit', Number(id.value));
}

const rent = computed({
  get() {
    return store.getters.getPropertyToEdit?.address;
  },
  set(val: number) {
    store.dispatch('setAddress', val);
  },
});

function onSubmit() {
  store.dispatch('saveProperty').then(() => {
    router.push({ name: 'PropertyFurniture', params: { id: store.getters.getPropertyToEdit.id } });
  });
}

function onBack() {
  router.push({ name: 'PropertyType', params: { id: store.getters.getPropertyToEdit.id } });
}
</script>

<template>
  <PropertyPage @on-back="onBack" @submit="onSubmit">
    <h1 class="fr-h4">{{ t("address-title") }}</h1>
    <p>{{ t("address-subtitle") }}</p>
    <p>
      <label class="fr-label" for="address">{{ t("address-label") }} :</label>
      <input
        v-model="rent"
        class="form-control fr-input validate-required"
        id="address"
        name="address"
        :placeholder="'42 rue de la paix'"
        type="text"
        required
      />
    </p>
  </PropertyPage>
</template>

<i18n>
{
  "en": {
    "address-title": "Location",
    "address-subtitle": "Where is the property?",
    "address-label": "Address"
  },
  "fr": {
    "address-title": "Localisation",
    "address-subtitle": "Où se trouve votre propriété ?",
    "address-label": "Addresse"
  }
}
</i18n>
