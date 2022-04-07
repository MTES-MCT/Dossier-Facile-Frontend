<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { Field, ErrorMessage } from 'vee-validate';
import PropertyPage from './PropertyPage.vue';

const { t } = useI18n();

const route = useRoute();
const router = useRouter();
const store = useStore();

const id = ref(0);
if (route.params.id) {
  id.value = Number(route.params.id);
  store.dispatch('updatePropertyToEdit', id.value);
}

const furniture = computed({
  get() {
    return store.getters.getPropertyToEdit?.furniture;
  },
  set(val: string) {
    store.dispatch('setFurniture', val);
  },
});

function onSubmit() {
  store.dispatch('saveProperty').then((data) => {
    router.push({ name: 'PropertyRent', params: { id: data.id } });
  });
}

function onBack() {
  router.push({
    name: 'PropertyType',
    params: { id: store.getters.getPropertyToEdit.id },
  });
}
</script>

<template>
  <PropertyPage @on-back="onBack" @submit="onSubmit">
    <h1 class="fr-h4">{{ t("furniture-title") }}</h1>
    <p>{{ t("furniture-subtitle") }}</p>
    <p>
      <Field
        name="furniture"
        id="furniture-house"
        type="radio"
        v-model="furniture"
        rules="hasValue"
        :value="'UNFURNISHED'"
      />
      <label class="fr-label inline-block" for="furniture-house">{{ t("unfurnished") }}</label>
      <Field
        name="furniture"
        id="furniture-apartment"
        type="radio"
        v-model="furniture"
        rules="hasValue"
        :value="'FURNISHED'"
      />
      <label class="fr-label inline-block" for="furniture-apartment">{{
        t("furnished")
      }}</label>
      <ErrorMessage class="fr-error-text" name="furniture" />
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
    "furniture-title": "Furniture",
    "furniture-subtitle": "What type of property do you offer to rent ?",
    "furnished": "Furnished",
    "unfurnished": "Unfurnished"
  },
  "fr": {
    "furniture-title": "Aménagement",
    "furniture-subtitle": "Quel logement proposez-vous à la location ?",
    "furnished": "Meublé",
    "unfurnished": "Vide",
  }
}
</i18n>
