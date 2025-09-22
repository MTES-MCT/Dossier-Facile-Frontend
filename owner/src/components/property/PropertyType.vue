<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { type PropertyType } from 'df-shared-next/src/models/Property'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { Field, ErrorMessage } from 'vee-validate'
import PropertyPage from './PropertyPage.vue'
import useOwnerStore from '../../store/owner-store'
import AnalyticsService from '../../services/AnalyticsService'
import { RiBuilding4Line, RiCommunityFill, RiHome4Fill } from '@remixicon/vue'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const store = useOwnerStore()

const id = ref(0)
if (route.params.id) {
  id.value = Number(route.params.id)
  store.updatePropertyToEdit(id.value)
}

const type = computed({
  get() {
    return store.getPropertyToEdit?.type || ''
  },
  set(val: PropertyType) {
    store.setType(val)
  }
})

function onSubmit() {
  AnalyticsService.propertyData('type_register')
  store.saveProperty().then((data) => {
    router.push({ name: 'PropertyAddress', params: { id: data.id } })
  })
}

function onBack() {
  router.push({
    name: 'PropertyName',
    params: { id: store.getPropertyToEdit.id }
  })
}
</script>

<template>
  <PropertyPage @on-back="onBack" @submit="onSubmit">
    <NakedCard class="fr-p-md-5w">
      <h1 class="fr-h4">{{ t('propertytype.type-title') }}</h1>
      <p class="fr-mb-md-7w">{{ t('propertytype.type-subtitle') }}</p>
      <div class="buttons-wrapper">
        <Field
          v-slot="{ field }"
          v-model="type"
          name="type"
          type="radio"
          rules="hasValue"
          :value="'APARTMENT'"
        >
          <label
            :class="{ selected: type === 'APARTMENT' }"
            class="fr-label inline-block label"
            for="type-apartment"
          >
            <input
              id="type-apartment"
              v-bind="field"
              type="radio"
              name="type"
              :value="'APARTMENT'"
            />
            <div class="fr-grid-col">
              <div class="icon-container desktop">
                <RiBuilding4Line size="36px" class="icon-color" aria-hidden="true" />
              </div>
              <div class="fr-mb-md-3w fr-m-2w">
                {{ t('propertytype.apartment') }}
              </div>
            </div>
          </label>
        </Field>
        <Field
          v-slot="{ field }"
          v-model="type"
          name="type"
          type="radio"
          rules="hasValue"
          :value="'HOUSE'"
        >
          <label
            :class="{ selected: type === 'HOUSE' }"
            class="fr-label inline-block label"
            for="type-house"
          >
            <input id="type-house" v-bind="field" type="radio" name="type" :value="'HOUSE'" />
            <div class="fr-grid-col">
              <div class="icon-container desktop">
                <RiHome4Fill size="36px" class="icon-color" aria-hidden="true" />
              </div>
              <div class="fr-mb-md-3w fr-m-2w">{{ t('propertytype.house') }}</div>
            </div>
          </label>
        </Field>

        <Field
          v-slot="{ field }"
          v-model="type"
          name="type"
          type="radio"
          rules="hasValue"
          :value="'OTHER'"
        >
          <label
            :class="{ selected: type === 'OTHER' }"
            class="fr-label inline-block label"
            for="type-other"
          >
            <input id="type-other" v-bind="field" type="radio" name="type" :value="'OTHER'" />
            <div class="fr-grid-col">
              <div class="icon-container desktop">
                <RiCommunityFill size="36px" class="icon-color" aria-hidden="true" />
              </div>
              <div class="fr-mb-md-3w fr-m-2w">{{ t('propertytype.other') }}</div>
            </div>
          </label>
        </Field>
        <ErrorMessage v-slot="{ message }" name="type">
          <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
        </ErrorMessage>
      </div>
    </NakedCard>
  </PropertyPage>
</template>

<style scoped lang="scss">
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
