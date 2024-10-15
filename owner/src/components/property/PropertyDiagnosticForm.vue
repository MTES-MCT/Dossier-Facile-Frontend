<template>
  <NakedCard class="fr-p-md-5w">
    <h1 class="fr-h4">{{ t('propertydiagnostic.title') }}</h1>
    <div class="fr-background-alt--blue-france fr-label--info fr-p-3w" style="position: relative">
      <h2 class="fr-h6 fr-label--info">
        <span class="fr-icon-info-fill fr-label--info" aria-hidden="true"></span>
        {{ t('propertydiagnostic.title-where') }}
      </h2>
      <p>{{ t('propertydiagnostic.text-where') }}</p>
      <div class="text-align--right">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.ecologie.gouv.fr/sites/default/files/comprendre_mon_dpe.pdf"
          >{{ t('propertydiagnostic.understand-dpe') }}</a
        >
      </div>
    </div>
    <div class="fr-input-group fr-mt-3w">
      <Form ref="dpeform" @submit="search">
        <label class="fr-label" for="dpe">{{ t('propertydiagnostic.dpe-label') }}</label>
        <Field id="dpe" name="dpe" v-model="dpe" v-slot="{ field, meta }">
          <div class="input-btn-container">
            <input
              v-bind="field"
              class="form-control validate-required fr-input collapse-input"
              :class="{
                'fr-input--valid': meta.valid,
                'fr-input--error': !meta.valid
              }"
              placeholder="Exemple : 1312V1020002U"
              type="text"
            />
            <button type="submit" class="fr-btn fr-btn--icon-left fr-icon-search-line">
              {{ t('search') }}
            </button>
          </div>
        </Field>
        <ErrorMessage name="dpe" v-slot="{ message }">
          <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
        </ErrorMessage>
      </Form>
    </div>
    <div class="fr-accordions-group">
      <section class="fr-accordion">
        <h3 class="fr-accordion__title">
          <button
            class="fr-accordion__btn"
            :aria-expanded="expandNoDPE ? 'true' : 'false'"
            aria-controls="noDPE"
            @click="AnalyticsService.dpeEvent('dpe_no_number')"
          >
            <i class="circle ri-arrow-right-line fs-22"></i>{{ t('propertydiagnostic.no-dpe-btn') }}
          </button>
        </h3>
        <div class="fr-collapse" id="noDPE">
          <p :v-html="t('propertydiagnostic.no-dpe-text')"></p>
          <div class="fr-highlight">
            <ul>
              <li>
                <span v-html="t('propertydiagnostic.no-dpe-list-1')"></span>
              </li>
              <li>
                <span v-html="t('propertydiagnostic.no-dpe-list-2')"></span>
              </li>
              <li>
                <span v-html="t('propertydiagnostic.no-dpe-list-3')"></span>
              </li>
            </ul>
          </div>
          <PropertyDiagnosticDetailForm></PropertyDiagnosticDetailForm>
        </div>
      </section>
    </div>
    <Form @submit="onSubmit">
      <FooterContainer>
        <BackNext @on-back="onBack" :show-back="true"></BackNext>
      </FooterContainer>
    </Form>
  </NakedCard>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import PropertyDiagnosticDetailForm from './PropertyDiagnosticDetailForm.vue'
import useOwnerStore from '../../store/owner-store'
import { useToast } from 'vue-toastification'
import BackNext from '../footer/BackNext.vue'
import FooterContainer from '../footer/FooterContainer.vue'
import AnalyticsService from '../../services/AnalyticsService'

const { t } = useI18n()
const dpe = ref('')
const store = useOwnerStore()
const toast = useToast()
const dpeform = ref<typeof Form | null>(null)

const emit = defineEmits(['submit', 'on-back'])

const expandNoDPE = computed(
  () =>
    (store.propertyToEdit?.co2Emission > 0 || store.propertyToEdit?.energyConsumption > 0) &&
    !store.propertyToEdit?.ademeNumber
)

function search() {
  AnalyticsService.dpeEvent('dpe_search_number')
  if (!dpe.value || !dpe.value.length) {
    toast.error(t('propertydiagnosticform.dpe-required').toString(), {
      timeout: 7000
    })
    return
  }
  store.searchDpe(dpe.value).catch((err) => {
    if (err.response.status === 404) {
      toast.error(t('propertydiagnosticform.not-found').toString(), {
        timeout: 7000
      })
    } else {
      toast.error(t('try-again').toString(), {
        timeout: 7000
      })
    }
  })
}

function onBack() {
  emit('on-back')
}

function onSubmit() {
  if (
    (store.propertyToEdit?.co2Emission > 0 && store.propertyToEdit?.energyConsumption > 0) ||
    store.propertyToEdit?.ademeNumber
  ) {
    emit('submit')
  } else if (dpeform.value) {
    dpeform.value.$el.requestSubmit()
  }
}
</script>

<style scoped>
.collapse-input {
  flex-grow: 1;
}

.input-btn-container {
  display: flex;
}

.fr-accordion::before {
  box-shadow: none;
}

.blue-card {
  background-color: #e8edff;
  box-shadow: none;
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

.fr-accordion__btn {
  font-size: 1.5rem;
  font-weight: 400;
}
</style>
