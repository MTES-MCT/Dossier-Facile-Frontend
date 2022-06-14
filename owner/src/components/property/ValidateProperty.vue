<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { Field, ErrorMessage } from 'vee-validate';
import PropertyPage from './PropertyPage.vue';
import useOwnerStore from '../../store/owner-store';

const { t } = useI18n();

const route = useRoute();
const router = useRouter();
const store = useOwnerStore();
const authorize = ref(false);

const id = ref(0);
if (route.params.id) {
  id.value = Number(route.params.id);
  store.updatePropertyToEdit(Number(id.value));
  authorize.value = store.getPropertyToEdit.validated;
}

async function onSubmit() {
  await store.setPropertyValidated(true);
  store.saveProperty().then(() => {
    router.push({ name: 'Dashboard' });
  });
}

function onBack() {
  router.push({
    name: 'PropertyRent',
    params: { id: store.getPropertyToEdit.id },
  });
}
</script>

<template>
  <PropertyPage @on-back="onBack" @submit="onSubmit">
    <h1 class="fr-h4">{{ t("validate-title") }}</h1>
    <p>{{ t("validate-subtitle") }}</p>
    <div class="bg-purple fr-checkbox-group">
      <Field
        name="authorize"
        id="authorize"
        type="checkbox"
        v-model="authorize"
        rules="isTrue"
        :value="true"
      />
      <label for="authorize"><div v-html="t('authorize')"></div></label>
      <ErrorMessage class="fr-error-text" name="authorize" v-slot="{ message }">
        <span role="alert" class="fr-error-text">{{ t(message || "") }}</span>
      </ErrorMessage>
    </div>
  </PropertyPage>
</template>

<i18n>
{
  "en": {
    "validate-title": "I confirm the accuracy of the information",
    "validate-subtitle": "I read and tick the following box to validate my file.",
    "required": "This field is required",
    "authorize": "Je certifie sur l'honneur l'exactitude des informations de mon bien"
  },
  "fr": {
    "validate-title": "Je confirme l'exactitude des informations",
    "validate-subtitle": "Je lis et je coche la case suivante afin de valider mon dossier.",
    "required": "La case doit être cochée",
    "authorize": "Je certifie sur l'honneur l'exactitude des informations de mon bien"
  }
}
</i18n>
