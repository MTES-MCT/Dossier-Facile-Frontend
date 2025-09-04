<script setup lang="ts">
import Button from 'df-shared-next/src/Button/DfButton.vue'
import DpeCo2Diagram from 'df-shared-next/src/components/dpe/DpeCo2Diagram.vue'
import DpeDiagram from 'df-shared-next/src/components/dpe/DpeDiagram.vue'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { defineRule, ErrorMessage, Field, Form } from 'vee-validate'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import AnalyticsService from '../../services/AnalyticsService'
import DpeService from '../../services/DpeService'
import useOwnerStore from '../../store/owner-store'
import { useToast } from 'vue-toastification'

const { t } = useI18n()
const toast = useToast()

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

const property = computed(() => store.getPropertyToEdit)
const dpeNotRequired = computed(() => store.getPropertyToEdit?.dpeNotRequired)

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
  localCo2Emission.value = co2Emission.value ?? 0
  localEnergyConsumption.value = energyConsumption.value ?? 0
  energyLetter.value = DpeService.getEnergyConsumptionLetter(
    energyConsumption.value,
    property.value.livingSpace
  )
  co2Letter.value = DpeService.getCO2EmissionLetter(
    co2Emission.value,
    property.value.livingSpace,
    property.value.ademeApiResult?.etiquetteEmission
  )
  globalLetter.value = DpeService.getGlobalLetter(
    energyLetter.value,
    co2Letter.value,
    property.value
  )
}

defineRule('pastDate', (value: string | null | undefined) => {
  if (!value) {
    return true
  }
  const inputDate = new Date(value)
  const today = new Date()
  // Comparer uniquement les dates sans les heures
  inputDate.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  if (inputDate > today) {
    return 'field-past-date'
  }
  return true
})

function updateDpeNotRequired() {
  store.setDpeNotRequired(!dpeNotRequired.value)
}

onMounted(() => {
  updateDPE()
})

function register() {
  AnalyticsService.dpeEvent('dpe_manual_information')
  store.setAdemeNumber('')
  store
    .saveProperty()
    .then(() => {
      updateDPE()
      toast.success(t('save-success'))
    })
    .catch((error) => {
      console.error(error)
      toast.error(t('save-failure'))
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
          <span class="color--required">*</span> :</label
        >
        <Field
          id="energy"
          v-slot="{ field, meta }"
          v-model="energyConsumption"
          name="energy"
          :rules="{
            required: !dpeNotRequired,
            positive: !dpeNotRequired
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
        <ErrorMessage v-slot="{ message }" name="energy">
          <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
        </ErrorMessage>
      </p>
      <p>
        <label class="fr-label" for="charges"
          >{{ t('propertydiagnostic.co2-emission') }}
          <span class="color--required">*</span> :</label
        >
        <Field
          id="co2"
          v-slot="{ field, meta }"
          v-model="co2Emission"
          name="co2"
          :rules="{
            required: !dpeNotRequired,
            positiveOrNull: !dpeNotRequired
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
        <ErrorMessage v-slot="{ message }" name="co2">
          <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
        </ErrorMessage>
      </p>
      <p>
        <label class="fr-label" for="charges"
          >{{ t('propertydiagnostic.date-dpe') }} <span class="color--required">*</span> :</label
        >
        <Field
          id="dpeDate"
          v-slot="{ field, meta }"
          v-model="dpeDate"
          name="dpeDate"
          :rules="{
            required: !dpeNotRequired,
            positiveOrNull: !dpeNotRequired,
            pastDate: !dpeNotRequired
          }"
        >
          <input
            v-bind="field"
            class="validate-required form-control fr-input"
            :class="{
              'fr-input--valid': meta.valid,
              'fr-input--error': !meta.valid
            }"
            :max="new Date().toISOString().split('T')[0]"
            placeholder="13/12/2023"
            type="date"
          />
        </Field>
        <ErrorMessage v-slot="{ message }" name="dpeDate">
          <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
        </ErrorMessage>
      </p>

      <div class="fr-col-12 fr-mb-3w fr-mt-3w bg-bf200">
        <div class="fr-checkbox-group bg-purple">
          <Field
            v-slot="{ field, meta }"
            name="dpeNotRequired"
            :model-value="dpeNotRequired"
            :value="true"
            type="checkbox"
            :rules="{
              isTrue: !dpeDate || !energyConsumption || !co2Emission
            }"
            @change="updateDpeNotRequired"
          >
            <input
              id="dpeNotRequired"
              type="checkbox"
              v-bind="field"
              :class="{
                'fr-input--valid': meta.valid,
                'fr-input--error': !meta.valid
              }"
            />
            <label for="dpeNotRequired" v-html="t('propertydiagnostic.no-dpe')"></label>
          </Field>
          <ErrorMessage v-slot="{ message }" name="authorize">
            <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
          </ErrorMessage>
        </div>
      </div>

      <div class="flex-end">
        <Button :title="t('register-btn')" :primary="false" type="submit">{{
          t('register-btn')
        }}</Button>
      </div>
      <div v-if="localCo2Emission > 0 && localEnergyConsumption > 0" class="fr-p-md-5w fr-mt-3w">
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

<i18n>
{
  "en": {
    "save-success": "Your EPC information has been correctly recorded",
    "save-failure": "Unable to save your EPC information"
  },
  "fr": {
    "save-success": "Vos informations DPE ont bien été enregistrées",
    "save-failure": "Impossible de sauvegarder vos informations DPE"
  }
}
</i18n>
