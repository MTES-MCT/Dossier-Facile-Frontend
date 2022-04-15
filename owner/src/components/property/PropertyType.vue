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
    router.push({ name: 'PropertyFurniture', params: { id: data.id } });
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
        rules="hasValue"
        :value="'HOUSE'"
      />
      <label
        :class="{ selected: type === 'HOUSE' }"
        class="fr-label inline-block label"
        for="type-house"
        >{{ t("house") }}</label
      >
      <Field
        name="type"
        id="type-apartment"
        type="radio"
        v-model="type"
        rules="hasValue"
        :value="'APARTMENT'"
      />
      <label
        :class="{ selected: type === 'APARTMENT' }"
        class="fr-label inline-block label"
        for="type-apartment"
        >{{ t("apartment") }}</label
      >
      <Field
        name="type"
        id="type-other"
        type="radio"
        v-model="type"
        rules="hasValue"
        :value="'OTHER'"
      />
      <label
        :class="{ selected: type === 'OTHER' }"
        class="fr-label inline-block label"
        for="type-other"
        >{{ t("other") }}</label
      >
      <ErrorMessage class="fr-error-text" name="type" />
    </p>
  </PropertyPage>
</template>

<style scoped lang="scss">
.label {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
  font-size: 14px;
  line-height: 24px;
  cursor: pointer;
  border: solid 1px var(--primary);
  border-radius: 0.5rem;
  text-align: center;
  background-color: var(--background-default-grey);
  @media all and (min-width: 992px) {
    max-width: 15rem;
  }
  @media all and (max-width: 767px) {
    margin-right: 0;
    width: 100%;
  }

  &:hover {
    background-color: var(--primary);
    color: white;
    box-shadow: 0 0 0.666em rgba(0, 0, 0, 0.25);
    @media all and (min-width: 767px) {
      background-color: var(--bf200-bf300);
      color: var(--g800);
    }
    border: solid 1px var(--primary);
  }

  &.selected {
    background-color: var(--primary);
    color: white;
    @media all and (min-width: 767px) {
      background-color: var(--bf200-bf300);
      color: var(--g800);
    }
    border: solid 1px var(--primary);
  }
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
