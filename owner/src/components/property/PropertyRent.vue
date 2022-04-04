<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import PropertyPage from './PropertyPage.vue';

const { t } = useI18n();

defineProps<{}>();

const route = useRoute();
const router = useRouter();
const store = useStore();

const id = ref(0);
if (route.params.id) {
  id.value = route.params.id;
  store.dispatch('updatePropertyToEdit', Number(id.value));
}

const rent = computed({
  get() {
    return store.getters.getPropertyToEdit?.rentCost;
  },
  set(val: number) {
    store.dispatch('setRent', val);
  },
});

function onSubmit() {
  store.dispatch('saveProperty').then(() => {
    router.push({ name: 'ValidateProperty', params: { id: store.getters.getPropertyToEdit.id } });
  });
}

function onBack() {
  router.push({ name: 'PropertyType', params: { id: store.getters.getPropertyToEdit.id } });
}
</script>

<template>
  <PropertyPage @on-back="onBack" @submit="onSubmit">
    <h1 class="fr-h4">{{ t("rent-title") }}</h1>
    <p>{{ t("rent-subtitle") }}</p>
    <p>
      <label class="fr-label" for="rent">{{ t("monthly-rent") }} :</label>
      <input
        v-model="rent"
        class="form-control fr-input validate-required"
        id="rent"
        name="rent"
        :placeholder="t('rent-amount')"
        type="number"
        required
      />
    </p>
  </PropertyPage>
</template>

<i18n>
{
  "en": {
    "rent-title": "Rent and charges",
    "rent-subtitle": "Indicate the amount of rent requested as well as the associated charges.",
    "monthly-rent": "Monthly rent",
    "rent-amount": "Rent amount"
  },
  "fr": {
    "rent-title": "Loyer et charges mensuels",
    "rent-subtitle": "Indiquez le montant du loyer demandé ainsi que les charges associées.",
    "monthly-rent": "Montant du loyer mensuel",
    "rent-amount": "Montant du loyer"
  }
}
</i18n>
