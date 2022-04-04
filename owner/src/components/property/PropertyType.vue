<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { Field, ErrorMessage } from 'vee-validate';
import PropertyPage from './PropertyPage.vue';

const { t } = useI18n();

defineProps<{}>();

const route = useRoute();
const router = useRouter();
const store = useStore();

const id = ref(0);
if (route.params.id) {
  id.value = Number(route.params.id);
  store.dispatch('updatePropertyToEdit', id.value);
}

function hasValue(type: string) {
  if (!type) {
    return 'this field is required'; // TODO i18n
  }
  return true;
}

const type = computed({
  get() {
    return store.getters.getPropertyToEdit?.type;
  },
  set(val: string) {
    store.dispatch('setType', val);
  },
});

function onSubmit() {
  store.dispatch('saveProperty').then((data) => {
    router.push({ name: 'PropertyRent', params: { id: data.id } });
  });
}

function onBack() {
  router.push({
    name: 'PropertyName',
    params: { id: store.getters.getPropertyToEdit.id },
  });
}
</script>

<template>
  <PropertyPage @on-back="onBack" @submit="onSubmit">
    <h1 class="fr-h4">{{ t("type-title") }}</h1>
    <p>{{ t("type-subtitle") }}</p>
    <p>
      <Field
        name="type"
        id="type-house"
        type="radio"
        v-model="type"
        :rules="hasValue"
        :value="'HOUSE'"
      />
      <label class="fr-label inline-block" for="type-house">{{ t("house") }}</label>
      <Field
        name="type"
        id="type-apartment"
        type="radio"
        v-model="type"
        :rules="hasValue"
        :value="'APARTMENT'"
      />
      <label class="fr-label inline-block" for="type-apartment">{{
        t("apartment")
      }}</label>
      <Field
        name="type"
        id="type-other"
        type="radio"
        v-model="type"
        :rules="hasValue"
        :value="'OTHER'"
      />
      <label class="fr-label inline-block" for="type-other">{{ t("other") }}</label>
      <ErrorMessage class="fr-error-text" name="type" />
    </p>
  </PropertyPage>
</template>

<style scoped lang="scss">
input {
  appearance: auto;
}
</style>

<i18n>
{
  "en": {
    "type-title": "Property type",
    "type-subtitle": "What type of property do you offer to rent ?",
    "house": "House",
    "apartment": "Apartment",
    "other": "Other"
  },
  "fr": {
    "type-title": "Type de logement",
    "type-subtitle": "Quel logement proposez-vous à la location ?",
    "house": "Maison",
    "apartment": "Appartement",
    "other": "Autres"
  }
}
</i18n>
