<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { Field, ErrorMessage } from 'vee-validate'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import PropertyPage from './PropertyPage.vue'
import useOwnerStore from '../../store/owner-store'
import AnalyticsService from '../../services/AnalyticsService'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const store = useOwnerStore()

const id = ref(0)
if (route.params.id) {
  id.value = Number(route.params.id)
  store.updatePropertyToEdit(id.value)
}

const furniture = computed({
  get() {
    return store.getPropertyToEdit?.furniture || ''
  },
  set(val: string) {
    store.setFurniture(val)
  }
})

function onSubmit() {
  AnalyticsService.propertyData('ameublement_register')
  store.saveProperty().then((data) => {
    router.push({ name: 'PropertyLivingSpace', params: { id: data.id } })
  })
}

function onBack() {
  router.push({
    name: 'PropertyAddress',
    params: { id: store.getPropertyToEdit.id }
  })
}
</script>

<template>
  <PropertyPage @on-back="onBack" @submit="onSubmit">
    <NakedCard class="fr-p-md-5w">
      <h1 class="fr-h4">{{ t('propertyfurniture.furniture-title') }}</h1>
      <p>{{ t('propertyfurniture.furniture-subtitle') }}</p>
      <div class="buttons-wrapper">
        <Field
          v-slot="{ field }"
          v-model="furniture"
          name="furniture"
          type="radio"
          rules="hasValue"
          :value="'UNFURNISHED'"
        >
          <label
            :class="{ selected: furniture === 'UNFURNISHED' }"
            class="fr-label inline-block label"
            for="furniture-house"
          >
            <input
              id="furniture-house"
              v-bind="field"
              type="radio"
              name="furniture"
              :value="'UNFURNISHED'"
            />
            <div class="fr-grid-col">
              <div class="icon-container desktop">
                <img alt="" svg-inline src="../../assets/ico_vide.svg" aria-label="icone meublé" />
              </div>
              <div class="fr-mb-md-4w fr-m-2w">
                {{ t('propertyfurniture.unfurnished') }}
              </div>
            </div>
          </label>
        </Field>
        <Field
          id="furniture-apartment"
          v-slot="{ field }"
          v-model="furniture"
          name="furniture"
          type="radio"
          rules="hasValue"
          :value="'FURNISHED'"
        >
          <label
            :class="{ selected: furniture === 'FURNISHED' }"
            class="fr-label inline-block label"
            for="furniture-apartment"
          >
            <input
              id="furniture-apartment"
              v-bind="field"
              type="radio"
              name="furniture"
              :value="'FURNISHED'"
            />
            <div class="fr-grid-col">
              <div class="icon-container desktop">
                <img
                  alt=""
                  svg-inline
                  src="../../assets/ico_meuble.svg"
                  aria-label="icone non meublé"
                />
              </div>
              <div class="fr-mb-md-4w fr-m-2w">
                {{ t('propertyfurniture.furnished') }}
              </div>
            </div>
          </label>
        </Field>
        <ErrorMessage v-slot="{ message }" name="furniture">
          <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
        </ErrorMessage>
      </div>
    </NakedCard>
  </PropertyPage>
</template>

<style scoped lang="scss">
.active {
  border: 1px solid;
}

.label {
  font-size: 14px;
  line-height: 24px;
  cursor: pointer;
  border: solid 1px #e5e5e5;
  border-radius: 0.5rem;
  text-align: center;
  background-color: var(--background-default-grey);
  --icon-color: #4c4ce2;
  --background-color: white;
  color: #4c4ce2;
  background-color: white;

  &:hover {
    --icon-color: white;
    --background-color: #4c4ce2;
    background-color: var(--primary);
    color: #4c4ce2;
    box-shadow: 0 0 0.666em rgba(0, 0, 0, 0.25);
    border: solid 1px var(--primary);
    @media all and (min-width: 767px) {
      background-color: var(--bf200-bf300);
      color: #4c4ce2;
    }
  }

  &:focus-within {
    outline: 2px solid var(--primary);
  }

  &.selected {
    background-color: var(--primary);
    color: white;
    border: solid 1px #0063cb;
    --background-color: #4c4ce2;
    --icon-color: white;
    @media all and (min-width: 767px) {
      background-color: var(--bf200-bf300);
      color: #4c4ce2;
    }
  }

  @media all and (min-width: 992px) {
    max-width: 15rem;
  }
  @media all and (max-width: 767px) {
    margin-right: 0;
    width: 100%;
  }
}

input[type='radio'] {
  clip-path: polygon(0 0);
}

.icon-container {
  margin-top: 1rem;
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

.buttons-wrapper {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
</style>
