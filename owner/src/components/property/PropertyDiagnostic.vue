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
import AnalyticsService from '../../services/AnalyticsService';
import UtilsService from '../../services/UtilsService';

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
  energyLetter.value = UtilsService.getEnergyConsumptionLetter(energyConsumption.value);
  co2Letter.value = UtilsService.getCO2EmissionLetter(co2Emission.value);
  globalLetter.value = UtilsService.getGlobalLetter(energyLetter.value, co2Letter.value);
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
  AnalyticsService.redirectFranceRenov();
  window.open(
    'https://france-renov.gouv.fr/espaces-conseil-fr?utm_source=dossierfacile&utm_medium=display&utm_campaign=dossierfacile ',
    '_blank',
    'noopener',
  );
}
</script>

<template>
  <PropertyPage @on-back="onBack" @submit="onSubmit">
    <NakedCard class="fr-p-md-5w">
      <h1 class="fr-h4">{{ t('propertydiagnostic.title') }}</h1>
      <div class="bg-purple fr-mb-2w text--light-blue">
        <h2 class="fr-h6 text--light-blue fr-mb-1w where-container">
          <i class="ri-information-fill fs-24 fr-mr-1w"></i>
          {{ t('propertydiagnostic.subtitle') }}
        </h2>
        <p class="fr-mb-1v">{{ t('propertydiagnostic.info-text') }}</p>
      </div>
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
          alt="France Renov"
          src="../../assets/FranceRenov.svg"
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
        <i18n-t keypath="propertydiagnostic.adetail">
          <template v-slot:letter>
            {{ globalLetter }}
          </template>
          <template v-slot:bold>
            <strong>{{ t('propertydiagnostic.adetail-bold') }}</strong>
          </template>
        </i18n-t>
      </div>
      <div v-if="globalLetter === 'E'">
        <i18n-t keypath="propertydiagnostic.edetail">
          <template v-slot:letter>
            {{ globalLetter }}
          </template>
          <template v-slot:bold>
            <strong>{{ t('propertydiagnostic.edetail-bold') }}</strong>
          </template>
        </i18n-t>

        <div style="display: flex; justify-content: flex-end; margin-top: 1rem">
          <Button type="button" :primary="false" @on-click="redirectFranceRenov()">{{
            t('propertydiagnostic.contact-adviser')
          }}</Button>
        </div>
      </div>
      <div v-if="globalLetter === 'F'">
        <i18n-t keypath="propertydiagnostic.fdetail">
          <template v-slot:bold>
            <strong>{{ t('propertydiagnostic.fdetail-bold') }}</strong>
          </template>
        </i18n-t>

        <div style="display: flex; justify-content: flex-end; margin-top: 1rem">
          <Button type="button" :primary="false" @on-click="redirectFranceRenov()">{{
            t('propertydiagnostic.contact-adviser')
          }}</Button>
        </div>
      </div>
      <div v-if="globalLetter === 'G' && localEnergyConsumption < 450">
        <i18n-t keypath="propertydiagnostic.gdetail">
          <template v-slot:bold>
            <strong>{{ t('propertydiagnostic.gdetail-bold') }}</strong>
          </template>
        </i18n-t>

        <div style="display: flex; justify-content: flex-end; margin-top: 1rem">
          <Button type="button" :primary="false" @on-click="redirectFranceRenov()">{{
            t('propertydiagnostic.contact-adviser')
          }}</Button>
        </div>
      </div>
      <div v-if="globalLetter === 'G' && localEnergyConsumption >= 450">
        <i18n-t keypath="propertydiagnostic.gpdetail">
          <template v-slot:bold>
            <strong>{{ t('propertydiagnostic.gpdetail-bold') }}</strong>
          </template>
        </i18n-t>
        <div style="display: flex; justify-content: flex-end; margin-top: 1rem">
          <Button type="button" :primary="false" @on-click="redirectFranceRenov()">{{
            t('propertydiagnostic.contact-adviser')
          }}</Button>
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

  width: 140px;
  height: 80px;
}

.where-container {
  display: flex;
  align-items: center;
}
</style>
