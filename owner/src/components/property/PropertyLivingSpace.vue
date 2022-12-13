<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import useOwnerStore from '../../store/owner-store';
import PropertyPage from './PropertyPage.vue';

const { t } = useI18n();

const route = useRoute();
const router = useRouter();
const store = useOwnerStore();

const id = ref(0);
if (route.params.id) {
  id.value = Number(route.params.id);
  store.updatePropertyToEdit(Number(id.value));
}

const livingSpace = computed({
  get() {
    return store.getPropertyToEdit?.livingSpace;
  },
  set(val: number) {
    store.setLivingSpace(val);
  },
});

function onSubmit() {
  store.saveProperty().then(() => {
    router.push({ name: 'PropertyRent', params: { id: store.getPropertyToEdit.id } });
  });
}

function onBack() {
  router.push({ name: 'PropertyFurniture', params: { id: store.getPropertyToEdit.id } });
}
</script>

<template>
  <PropertyPage @on-back="onBack" @submit="onSubmit">
    <h1 class="fr-h4">{{ t('living-space-title') }}</h1>
    <p>{{ t('living-space-subtitle') }}</p>
    <p>
      <label class="fr-label" for="living-space">{{ t('living-space-label') }} :</label>
      <Field
        id="living-space"
        name="living-space"
        v-model="livingSpace"
        v-slot="{ field, meta }"
        :rules="{
          required: true,
          positive: true,
        }"
      >
        <input
          v-bind="field"
          class="validate-required form-control fr-input"
          :class="{
            'fr-input--valid': meta.valid,
            'fr-input--error': !meta.valid,
          }"
          :placeholder="t('living-space-placeholder')"
          type="number"
        />
      </Field>
      <ErrorMessage name="living-space" v-slot="{ message }">
        <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
      </ErrorMessage>
    </p>
  </PropertyPage>
</template>

<i18n>
{
  "en": {
    "living-space-title": "Living space",
    "living-space-subtitle": "Indicate the living space",
    "living-space-label": "Living space of my property",
    "living-space-placeholder": "size m²",
    "number-not-positive": "Living space must be more than zero"
  },
  "fr": {
    "living-space-title": "Surface",
    "living-space-subtitle": "Quelle est la surface habitable de votre bien ?",
    "living-space-label": "Surface de ma propriété",
    "living-space-placeholder": "taille en m²",
    "number-not-positive": "La surface doit être supérieur à zéro"
  }
}
</i18n>
