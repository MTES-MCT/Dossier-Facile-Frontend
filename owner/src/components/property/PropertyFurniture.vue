<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { Field, ErrorMessage } from 'vee-validate';
import PropertyPage from './PropertyPage.vue';
import useOwnerStore from '../../store/owner-store';

const { t } = useI18n();

const route = useRoute();
const router = useRouter();
const store = useOwnerStore();

const id = ref(0);
if (route.params.id) {
  id.value = Number(route.params.id);
  store.updatePropertyToEdit(id.value);
}

const furniture = computed({
  get() {
    return store.getPropertyToEdit?.furniture || '';
  },
  set(val: string) {
    store.setFurniture(val);
  },
});

function onSubmit() {
  store.saveProperty().then((data) => {
    router.push({ name: 'PropertyRent', params: { id: data.id } });
  });
}

function onBack() {
  router.push({
    name: 'PropertyAddress',
    params: { id: store.getPropertyToEdit.id },
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
      <label
        :class="{ selected: furniture === 'UNFURNISHED' }"
        class="fr-label inline-block label"
        for="furniture-house"
        >{{ t("unfurnished") }}</label
      >
      <Field
        name="furniture"
        id="furniture-apartment"
        type="radio"
        v-model="furniture"
        rules="hasValue"
        :value="'FURNISHED'"
      />
      <label
        :class="{ selected: furniture === 'FURNISHED' }"
        class="fr-label inline-block label"
        for="furniture-apartment"
        >{{ t("furnished") }}</label
      >
      <ErrorMessage name="furniture" v-slot="{ message }">
        <span role="alert" class="fr-error-text">{{ t(message || "") }}</span>
      </ErrorMessage>
    </p>
  </PropertyPage>
</template>

<style scoped lang="scss">
.active {
  border: 1px solid;
}

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

input[type="radio"] {
  visibility: hidden;
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
