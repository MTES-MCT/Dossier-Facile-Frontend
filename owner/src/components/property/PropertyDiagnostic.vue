<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import Button from 'df-shared-next/src/Button/Button.vue';
import NakedCard from 'df-shared-next/src/components/NakedCard.vue';
import useOwnerStore from '../../store/owner-store';
import PropertyPage from './PropertyPage.vue';
import DpeDiagram from './DpeDiagram.vue';
import DpeCo2Diagram from './DpeCo2Diagram.vue';

const { t } = useI18n();

const route = useRoute();
const router = useRouter();
const store = useOwnerStore();
const globalLetter = ref('A');
const co2Letter = ref('A');
const energyLetter = ref('A');
const localEnergyConsumption = ref(0);
const localCo2Emission = ref(0);

const id = ref(0);

if (route.params.id) {
  id.value = Number(route.params.id);
  store.updatePropertyToEdit(Number(id.value));
}

const co2Emission = computed({
  get() {
    return store.getPropertyToEdit?.co2Emission;
  },
  set(val: number) {
    store.setCo2Emission(val);
  },
});

const energyConsumption = computed({
  get() {
    return store.getPropertyToEdit?.energyConsumption;
  },
  set(val: number) {
    store.setEnergyConsumption(val);
  },
});

function updateDPE() {
  localCo2Emission.value = co2Emission.value;
  localEnergyConsumption.value = energyConsumption.value;
  if (energyConsumption.value <= 70) {
    energyLetter.value = 'A';
  } else if (energyConsumption.value <= 110) {
    energyLetter.value = 'B';
  } else if (energyConsumption.value <= 180) {
    energyLetter.value = 'C';
  } else if (energyConsumption.value <= 250) {
    energyLetter.value = 'D';
  } else if (energyConsumption.value <= 330) {
    energyLetter.value = 'E';
  } else if (energyConsumption.value <= 420) {
    energyLetter.value = 'F';
  } else {
    energyLetter.value = 'G';
  }
  globalLetter.value = energyLetter.value;

  if (co2Emission.value <= 6) {
    co2Letter.value = 'A';
  } else if (co2Emission.value <= 11) {
    co2Letter.value = 'B';
  } else if (co2Emission.value <= 30) {
    co2Letter.value = 'C';
  } else if (co2Emission.value <= 50) {
    co2Letter.value = 'D';
  } else if (co2Emission.value <= 70) {
    co2Letter.value = 'E';
  } else if (co2Emission.value <= 100) {
    co2Letter.value = 'F';
  } else {
    co2Letter.value = 'G';
  }
}

onMounted(() => {
  updateDPE();
});

function onSubmit() {
  store.saveProperty().then(() => {
    router.push({ name: 'ValidateProperty', params: { id: store.getPropertyToEdit.id } });
  });
}

function register() {
  store.saveProperty().then(() => {
    updateDPE();
  });
}

function onBack() {
  router.push({ name: 'PropertyRent', params: { id: store.getPropertyToEdit.id } });
}

function getLetterStyle() {
  return {
    '--letter-color': `var(--dpe-energy-${globalLetter.value})`,
  };
}

function redirectFranceRenov() {
  window.open('https://france-renov.gouv.fr/espaces-conseil-fr', '_blank');
}
</script>

<template>
  <PropertyPage @on-back="onBack" @submit="onSubmit">
    <NakedCard class="fr-p-md-5w">
      <h1 class="fr-h4">{{ t('propertydiagnostic.title') }}</h1>
      <p>{{ t('propertydiagnostic.subtitle') }}</p>
      <p>
        <label class="fr-label" for="rent"
          >{{ t('propertydiagnostic.energy-consumption') }} :</label
        >
        <Field
          id="energy"
          name="energy"
          v-model="energyConsumption"
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
            :placeholder="t('propertydiagnostic.energy-consumption-amount')"
            type="number"
          />
        </Field>
        <ErrorMessage name="energy" v-slot="{ message }">
          <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
        </ErrorMessage>
      </p>
      <p>
        <label class="fr-label" for="charges">{{ t('propertydiagnostic.co2-emission') }} :</label>
        <Field
          id="co2"
          name="co2"
          v-model="co2Emission"
          v-slot="{ field, meta }"
          :rules="{
            required: true,
            positiveOrNull: true,
          }"
        >
          <input
            v-bind="field"
            class="validate-required form-control fr-input"
            :class="{
              'fr-input--valid': meta.valid,
              'fr-input--error': !meta.valid,
            }"
            :placeholder="t('propertydiagnostic.co2-amount')"
            type="number"
          />
        </Field>
        <ErrorMessage name="co2" v-slot="{ message }">
          <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
        </ErrorMessage>
      </p>
      <div class="flex-end">
        <Button @onClick="register" :title="t('register-btn')" :primary="false" type="button">{{
          t('register-btn')
        }}</Button>
      </div>
    </NakedCard>
    <NakedCard
      class="fr-p-md-5w fr-mt-3w"
      v-if="localCo2Emission > 0 && localEnergyConsumption > 0"
    >
      <h2 class="fr-h4">
        {{ t('propertydiagnostic.detail-title') }} :
        <span class="letter-color" :style="getLetterStyle()">{{ globalLetter }}</span>
      </h2>

      <div class="dpe-container">
        <DpeDiagram
          class="dpe-diagram"
          :letter="energyLetter"
          :consumption="localEnergyConsumption"
        ></DpeDiagram>
        <DpeCo2Diagram
          class="dpe-diagram"
          :letter="co2Letter"
          :consumption="localCo2Emission"
        ></DpeCo2Diagram>
      </div>
    </NakedCard>

    <NakedCard
      class="blue-card fr-p-md-5w fr-mt-3w fr-mb-7w"
      v-if="localCo2Emission > 0 && localEnergyConsumption > 0"
    >
      <div class="header-container">
        <h2 class="fr-h4">
          {{ t('propertydiagnostic.detail-title') }}
        </h2>
        <img
          v-if="globalLetter === 'E' || globalLetter === 'F' || globalLetter === 'G'"
          src="../../assets/france_renov.png"
          class="france_renov"
        />
      </div>
      <div
        v-if="
          globalLetter === 'A' ||
            globalLetter === 'B' ||
            globalLetter === 'C' ||
            globalLetter === 'D'
        "
      >
        Note A à D : Votre DPE a obtenu la note de {{ globalLetter }}, la consommation énergétique
        finale est inférieure au seuil de 250kWh/m²/an.
        <strong>Votre logement n’est, à ce jour, concerné par aucune restriction.</strong> 🎉
      </div>
      <div v-if="globalLetter === 'E'">
        Note E: Votre DPE a obtenu la note de E, la consommation énergétique finale est inférieure
        au seuil de 330kWh/m²/an.
        <strong
          >Nous vous sensibilisons au fait que le logement sera interdit à la location à partir du
          1er janvier 2034.</strong
        >
        France Rénov’ est votre nouveau service public de la rénovation de l'habitat, porté par
        l'État avec les collectivités locales, et piloté par l’Agence nationale de l’habitat (Anah).
        France Rénov’ réalise pour vous un diagnostic gratuit afin de connaître les possibilités de
        rénovation globale de votre logement en contactant le conseiller France Rénov’ le plus
        proche de chez vous.

        <div style="display:flex;justify-content: flex-end;margin-top:1rem;">
          <Button type="button" :primary="false" @on-click="redirectFranceRenov()"
            >Contacter Un conseiller France Rénov</Button
          >
        </div>
      </div>
      <div v-if="globalLetter === 'F'">
        Note F: Votre DPE a obtenu la note de F, la consommation énergétique finale est inférieure
        au seuil de 420kWh/m²/an.
        <strong
          >Nous vous sensibilisons au fait que toute augmentation du loyer est interdite depuis le
          24 août 2022 et le logement sera interdit à la location à partir du 1er janvier
          2028.</strong
        >
        France Rénov’ est votre nouveau service public de la rénovation de l'habitat, porté par
        l'État avec les collectivités locales, et piloté par l’Agence nationale de l’habitat (Anah).
        France Rénov’ réalise pour vous un diagnostic gratuit afin de connaître les possibilités de
        rénovation globale de votre logement en contactant le conseiller France Rénov’ le plus
        proche de chez vous.

        <div style="display:flex;justify-content: flex-end;margin-top:1rem;">
          <Button type="button" :primary="false" @on-click="redirectFranceRenov()"
            >Contacter Un conseiller France Rénov</Button
          >
        </div>
      </div>
      <div v-if="globalLetter === 'G'">
        Note G: Votre DPE a obtenu la note de G, dont la consommation énergétique finale est
        inférieure au seuil de 450kWh/m²/an.
        <strong
          >Nous vous sensibilisons au fait que toute augmentation du loyer est interdite depuis le
          24 août 2022 et le logement sera interdit à la location à partir du 1er janvier
          2025.</strong
        >
        France Rénov’ est votre nouveau service public de la rénovation de l'habitat, porté par
        l'État avec les collectivités locales, et piloté par l’Agence nationale de l’habitat (Anah).
        France Rénov’ réalise pour vous un diagnostic gratuit afin de connaître les possibilités de
        rénovation globale de votre logement en contactant le conseiller France Rénov’ le plus
        proche de chez vous.

        <div style="display:flex;justify-content: flex-end;margin-top:1rem;">
          <Button type="button" :primary="false" @on-click="redirectFranceRenov()"
            >Contacter Un conseiller France Rénov</Button
          >
        </div>
      </div>
      <div v-if="false">
        Note G+ : Cf. capture Votre DPE a obtenu la note de G, dont la consommation énergétique
        finale est supérieure au seuil de 450kWh/m²/an.
        <strong
          >Nous vous sensibilisons au fait que votre bien est interdit à la location depuis le 1er
          janvier 2023 !</strong
        >
        France Rénov’ est votre nouveau service public de la rénovation de l'habitat, porté par
        l'État avec les collectivités locales, et piloté par l’Agence nationale de l’habitat (Anah).
        France Rénov’ réalise pour vous un diagnostic gratuit afin de connaître les possibilités de
        rénovation globale de votre logement en contactant le conseiller France Rénov’ le plus
        proche de chez vous.
        <div style="display:flex;justify-content: flex-end;margin-top:1rem;">
          <Button type="button" :primary="true" @on-click="redirectFranceRenov()"
            >Contacter Un conseiller France Rénov</Button
          >
        </div>
      </div>
    </NakedCard>
  </PropertyPage>
</template>

<style scoped lang="scss">
.flex-end {
  display: flex;
  justify-content: flex-end;
}

.letter-color {
  color: var(--letter-color);
}

.blue-card {
  background-color: #e8edff;
  box-shadow: none;
}

.dpe-container {
  display: flex;
}

.dpe-diagram {
  flex: 1;
}

.header-container {
  display: flex;
  justify-content: space-between;
}

.france_renov {
  margin-top: -20px;
  @media (max-width: 768px) {
    margin-top: -10px;
  }

  width: 105px;
  height: 60px;
}
</style>
