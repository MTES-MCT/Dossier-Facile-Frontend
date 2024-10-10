<script setup lang="ts">
import { Form, Field, ErrorMessage } from 'vee-validate'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import Button from 'df-shared-next/src/Button/Button.vue'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import useOwnerStore from '../../store/owner-store'
import DpeDiagram from 'df-shared-next/src/components/dpe/DpeDiagram.vue'
import DpeCo2Diagram from 'df-shared-next/src/components/dpe/DpeCo2Diagram.vue'
import UtilsService from '../../services/UtilsService'
import AnalyticsService from '../../services/AnalyticsService'

const { t } = useI18n()

const route = useRoute()
const store = useOwnerStore()
const globalLetter = ref('A')
const co2Letter = ref('A')
const energyLetter = ref('A')
const localEnergyConsumption = ref(0)
const localCo2Emission = ref(0)

const id = ref(0)

if (route.params.id) {
  id.value = Number(route.params.id)
  store.updatePropertyToEdit(Number(id.value))
}

const co2Emission = computed({
  get() {
    return store.getPropertyToEdit?.co2Emission
  },
  set(val: number) {
    store.setCo2Emission(val)
  }
})

const energyConsumption = computed({
  get() {
    return store.getPropertyToEdit?.energyConsumption
  },
  set(val: number) {
    store.setEnergyConsumption(val)
  }
})

const dpeDate = computed({
  get() {
    return store.getPropertyToEdit?.dpeDate
  },
  set(val: string) {
    store.setDpeDate(val)
  }
})

function updateDPE() {
  localCo2Emission.value = co2Emission.value
  localEnergyConsumption.value = energyConsumption.value
  energyLetter.value = UtilsService.getEnergyConsumptionLetter(energyConsumption.value)
  co2Letter.value = UtilsService.getCO2EmissionLetter(co2Emission.value)
  globalLetter.value = UtilsService.getGlobalLetter(energyLetter.value, co2Letter.value)
}

onMounted(() => {
  updateDPE()
})

function register() {
  AnalyticsService.dpeEvent('dpe_manual_information')
  store.setAdemeNumber('')
  store.saveProperty().then(() => {
    updateDPE()
  })
}

function getLetterStyle() {
  return {
    '--letter-color': `var(--dpe-energy-${globalLetter.value})`
  }
}
</script>

<template>
  <NakedCard class="fr-mt-3w">
    <Form @submit="register">
      <h3 class="fr-h6 small-text">
        {{ t('propertydiagnostic.detail-form-title') }}
      </h3>
      <p>
        <label class="fr-label" for="rent"
          >{{ t('propertydiagnostic.energy-consumption') }}
          <span style="color: red">*</span> :</label
        >
        <Field
          id="energy"
          name="energy"
          v-model="energyConsumption"
          v-slot="{ field, meta }"
          :rules="{
            required: true,
            positive: true
          }"
        >
          <input
            v-bind="field"
            class="validate-required form-control fr-input"
            :class="{
              'fr-input--valid': meta.valid,
              'fr-input--error': !meta.valid
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
        <label class="fr-label" for="charges"
          >{{ t('propertydiagnostic.co2-emission') }} <span style="color: red">*</span> :</label
        >
        <Field
          id="co2"
          name="co2"
          v-model="co2Emission"
          v-slot="{ field, meta }"
          :rules="{
            required: true,
            positiveOrNull: true
          }"
        >
          <input
            v-bind="field"
            class="validate-required form-control fr-input"
            :class="{
              'fr-input--valid': meta.valid,
              'fr-input--error': !meta.valid
            }"
            :placeholder="t('propertydiagnostic.co2-amount')"
            type="number"
          />
        </Field>
        <ErrorMessage name="co2" v-slot="{ message }">
          <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
        </ErrorMessage>
      </p>
      <p>
        <label class="fr-label" for="charges"
          >{{ t('propertydiagnostic.date-dpe') }} <span style="color: red">*</span> :</label
        >
        <Field
          id="dpeDate"
          name="dpeDate"
          v-model="dpeDate"
          v-slot="{ field, meta }"
          :rules="{
            required: true,
            positiveOrNull: true
          }"
        >
          <input
            v-bind="field"
            class="validate-required form-control fr-input"
            :class="{
              'fr-input--valid': meta.valid,
              'fr-input--error': !meta.valid
            }"
            placeholder="13/12/2023"
            type="date"
          />
        </Field>
        <ErrorMessage name="dpeDate" v-slot="{ message }">
          <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
        </ErrorMessage>
      </p>
      <div class="flex-end">
        <Button @onClick="register" :title="t('register-btn')" :primary="false" type="button">{{
          t('register-btn')
        }}</Button>
      </div>
      <div class="fr-p-md-5w fr-mt-3w" v-if="localCo2Emission > 0 && localEnergyConsumption > 0">
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
      </div>
    </Form>
  </NakedCard>
</template>

<style scoped lang="scss">
.flex-end {
  display: flex;
  justify-content: flex-end;
}

.letter-color {
  color: var(--letter-color);
}

.dpe-container {
  display: flex;
  @media all and (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
}

.dpe-diagram {
  flex: 1;
}
</style>
