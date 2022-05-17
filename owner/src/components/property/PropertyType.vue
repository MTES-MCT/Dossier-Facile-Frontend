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

const type = computed({
  get() {
    return store.getPropertyToEdit?.type || '';
  },
  set(val: string) {
    store.setType(val);
  },
});

function onSubmit() {
  store.saveProperty().then((data) => {
    router.push({ name: 'PropertyAddress', params: { id: data.id } });
  });
}

function onBack() {
  router.push({
    name: 'PropertyName',
    params: { id: store.getPropertyToEdit.id },
  });
}
</script>

<template>
  <PropertyPage @on-back="onBack" @submit="onSubmit">
    <h1 class="fr-h4">{{ t("type-title") }}</h1>
    <p class="fr-mb-md-7w">{{ t("type-subtitle") }}</p>
    <div>
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
      >
        <div class="fr-grid-col">
          <div class="icon-container desktop">
            <div class="material-icons md-36 icon-color">apartment</div>
          </div>
          <div class="fr-mb-md-5w fr-m-2w">{{ t("apartment") }}</div>
        </div>
      </label>
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
      >
        <div class="fr-grid-col">
          <div class="icon-container desktop">
            <div class="material-icons md-36 icon-color">home</div>
          </div>
          <div class="fr-mb-md-5w fr-m-2w">{{ t("house") }}</div>
        </div>
      </label>
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
      >
        <div class="fr-grid-col">
          <div class="icon-container desktop">
            <div class="material-icons md-36 icon-color">domain</div>
          </div>
          <div class="fr-mb-md-5w fr-m-2w">{{ t("other") }}</div>
        </div>
      </label>
      <ErrorMessage class="fr-error-text" name="type" />
    </div>
  </PropertyPage>
</template>

<style scoped lang="scss">
.label {
  font-size: 14px;
  line-height: 24px;
  cursor: pointer;
  border: solid 1px #e5e5e5;
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
    color: #4c4ce2;
    box-shadow: 0 0 0.666em rgba(0, 0, 0, 0.25);
    @media all and (min-width: 767px) {
      background-color: var(--bf200-bf300);
      color: #4c4ce2;
    }
    border: solid 1px var(--primary);
  }

  &.selected {
    background-color: var(--primary);
    color: white;
    @media all and (min-width: 767px) {
      background-color: var(--bf200-bf300);
      color: #4c4ce2;
    }
    border: solid 1px #0063cb;
    --background-color: #4c4ce2;
    --icon-color: white;
  }

  --icon-color: #4c4ce2;
  --background-color: white;
  color: #4c4ce2;
  background-color: white;
  &:hover {
    --icon-color: white;
    --background-color: #4c4ce2;
  }
}

input[type="radio"] {
  visibility: hidden;
}

.icon-container {
  margin-top: 2rem;
  margin-left: 2rem;
  margin-right: 2rem;
  width: 6rem;
  height: 5rem;
  border-radius: 0.5rem;
  border: solid 1px #6a6af4;
  background-color: var(--background-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-color {
  color: var(--icon-color);
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
    "house": "Une maison",
    "apartment": "Un appartement",
    "other": "Autres"
  }
}
</i18n>
