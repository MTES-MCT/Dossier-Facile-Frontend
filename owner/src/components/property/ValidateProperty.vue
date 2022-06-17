<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { Field, ErrorMessage } from 'vee-validate';
import { useToast } from 'vue-toastification';
import PropertyPage from './PropertyPage.vue';
import useOwnerStore from '../../store/owner-store';
import UpdateRowBtn from './UpdateRowBtn.vue';

const { t } = useI18n();

const route = useRoute();
const router = useRouter();
const store = useOwnerStore();
const authorize = ref(false);
const toast = useToast();

const id = ref(0);
if (route.params.id) {
  id.value = Number(route.params.id);
  store.updatePropertyToEdit(Number(id.value));
  authorize.value = store.getPropertyToEdit.validated;
}

const getParams = id.value > 0 ? { id: id.value } : {};

const property = store.getPropertyToEdit;

const hasErrors = computed(
  () => !(
    property.name
      && property.address
      && property.furniture
      && property.livingSpace
      && property.livingSpace > 0
      && property.rentCost
      && property.rentCost > 0
      && property.chargesCost
      && property.chargesCost > 0
  ),
);

async function onSubmit() {
  if (hasErrors.value) {
    toast.error(t('try-again').toString(), {
      timeout: 7000,
    });
    return;
  }
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
    <div v-if="!hasErrors">
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
    </div>
    <div v-else>
      <h6 class="color--red">{{ t("error-title") }}</h6>
      <p>
        {{ t("property-not-valid") }}
      </p>
      <div v-if="!property.name">
        <UpdateRowBtn
          :title="t('property-name')"
          :to="{ name: 'PropertyName', params: getParams }"
        ></UpdateRowBtn>
      </div>
      <div v-if="!property.type">
        <UpdateRowBtn
          :title="t('property-type')"
          :to="{ name: 'PropertyType', params: getParams }"
        ></UpdateRowBtn>
      </div>
      <div v-if="!property.furniture">
        <UpdateRowBtn
          :title="t('property-furniture')"
          :to="{ name: 'PropertyFurniture', params: getParams }"
        ></UpdateRowBtn>
      </div>
      <div v-if="!property.address">
        <UpdateRowBtn
          :title="t('property-address')"
          :to="{ name: 'PropertyAddress', params: getParams }"
        ></UpdateRowBtn>
      </div>
      <div v-if="!property.livingSpace || property.livingSpace <= 0">
        <UpdateRowBtn
          :title="t('property-living-space')"
          :to="{ name: 'PropertyLivingSpace', params: getParams }"
        ></UpdateRowBtn>
      </div>
      <div
        v-if="
          !property.rentCost ||
          property.rentCost <= 0 ||
          !property.chargesCost ||
          property.chargesCost <= 0
        "
      >
        <UpdateRowBtn
          :title="t('property-rent')"
          :to="{ name: 'PropertyRent', params: getParams }"
        ></UpdateRowBtn>
      </div>
    </div>
  </PropertyPage>
</template>

<i18n>
{
  "en": {
    "validate-title": "I confirm the accuracy of the information",
    "validate-subtitle": "I read and tick the following box to validate my file.",
    "required": "This field is required",
    "authorize": "Je certifie sur l'honneur l'exactitude des informations de mon bien",
    "error-title": "Property not complete",
    "property-not-valid": "Your property is not valid, please complete the missing fields to submit your property",
    "property-name": "Property name",
    "property-type": "Type of rent",
    "property-furniture": "Furniture",
    "property-address": "Property address",
    "property-living-space": "Living space",
    "property-rent": "Property rent",
    "try-again": "Please fix errors to submit the property"
  },
  "fr": {
    "validate-title": "Je confirme l'exactitude des informations",
    "validate-subtitle": "Je lis et je coche la case suivante afin de valider mon dossier.",
    "required": "La case doit être cochée",
    "authorize": "Je certifie sur l'honneur l'exactitude des informations de mon bien",
    "error-title": "Bien invalide",
    "property-not-valid": "Votre propriété n'est pas valide, veuillez compléter les champs manquants pour soumettre votre bien",
    "property-name": "Nom de la propriété",
    "property-type": "Type de logement",
    "property-furniture": "Ameublement",
    "property-address": "Adresse du logement",
    "property-living-space": "Surface",
    "property-rent": "Loyer et charges mensuels",
    "try-again": "Veuillez fixer les erreurs pour soumettre la propriété"
  }
}
</i18n>
