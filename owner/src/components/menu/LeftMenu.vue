<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ColoredTag from 'df-shared-next/src/components/ColoredTag.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import useOwnerStore from '../../store/owner-store';

const { t } = useI18n();
const store = useOwnerStore();
const route = useRoute();

function getName() {
  return `${store.getUser?.lastName} ${store.getUser?.firstName}`;
}

const propertyName = computed(() => store.getPropertyToEdit?.name);

const typeStatus = computed(() => (store.getPropertyToEdit?.type ? 'FILLED' : 'TO_PROCESS'));
const addressStatus = computed(() => (store.getPropertyToEdit?.address ? 'FILLED' : 'TO_PROCESS'));
const rentStatus = computed(() => (store.getPropertyToEdit?.rentCost > 0 ? 'FILLED' : 'TO_PROCESS'));
const furnitureStatus = computed(() => (store.getPropertyToEdit?.furniture ? 'FILLED' : 'TO_PROCESS'));
const livingSpaceStatus = computed(() => (store.getPropertyToEdit?.livingSpace ? 'FILLED' : 'TO_PROCESS'));

const id = Number(route.params.id);
const getParams = id ? { id } : {};
</script>

<template>
  <nav class="left-edit-menu">
    <div class="inner-left-edit fr-pt-7w fr-pt-7w fr-pb-12w">
      <div class="active step">
        <div class="step-number">1</div>
        <div class="step-title">
          <router-link :to="{ name: 'AccountName' }" class="fr-link">
            {{ t('personal-information') }}</router-link
          >
        </div>
      </div>
      <div class="vline">
        <div class="ml-5">
          <router-link :to="{ name: 'AccountName' }" class="fr-link">
            <ColoredTag :text="getName()" status="NAME"></ColoredTag
          ></router-link>
        </div>
      </div>
      <div class="active step">
        <div class="step-number">2</div>
        <div class="step-title">
          <router-link :to="{ name: 'PropertyName', params: getParams }" class="fr-link">
            {{ t('add-property') }}</router-link
          >
        </div>
      </div>
      <div class="vline">
        <div class="ml-5">
          <router-link :to="{ name: 'PropertyName', params: getParams }" class="fr-link">
            <ColoredTag
              :text="propertyName ? propertyName : t('property-name')"
              :status="propertyName ? 'FILLED' : 'EMPTY'"
            ></ColoredTag>
          </router-link>
        </div>
        <div class="ml-5">
          <router-link :to="{ name: 'PropertyType', params: getParams }" class="fr-link">
            <ColoredTag :text="t('property-type')" :status="typeStatus"></ColoredTag>
          </router-link>
        </div>
        <div class="ml-5">
          <router-link :to="{ name: 'PropertyAddress', params: getParams }" class="fr-link">
            <ColoredTag :text="t('property-address')" :status="addressStatus"></ColoredTag>
          </router-link>
        </div>
        <div class="ml-5">
          <router-link :to="{ name: 'PropertyFurniture', params: getParams }" class="fr-link">
            <ColoredTag :text="t('property-furniture')" :status="furnitureStatus"></ColoredTag>
          </router-link>
        </div>
        <div class="ml-5">
          <router-link :to="{ name: 'PropertyLivingSpace', params: getParams }" class="fr-link">
            <ColoredTag :text="t('property-living-space')" :status="livingSpaceStatus"></ColoredTag>
          </router-link>
        </div>
        <div class="ml-5">
          <router-link :to="{ name: 'PropertyRent', params: getParams }" class="fr-link">
            <ColoredTag :text="t('monthly-rent-and-charges')" :status="rentStatus"></ColoredTag>
          </router-link>
        </div>
      </div>
      <div class="active step">
        <div class="step-number">3</div>
        <div class="step-title">
          <router-link :to="{ name: 'ValidateProperty', params: getParams }" class="fr-link">
            {{ t('validate-property') }}</router-link
          >
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.left-edit-menu {
  background-color: var(--background-default-grey);
  @media all and (max-width: 768px) {
    display: none;
  }
}

.inner-left-edit {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-left: 10px;
}

.vline {
  margin-left: 23px;
  border-left: 1px solid var(--g400-t);
  z-index: 0;
  min-height: 25px;
  &.active {
    border-left: 1px solid var(--primary);
  }
}

.step {
  display: flex;
  align-items: center;
  height: 3rem;
}

.step-number {
  background-color: white;
  border: 1px solid var(--g400-t);
  margin: 0 5px;
  border-radius: 50%;
  height: 2.25rem;
  width: 2.25rem;
  min-width: 2.25rem;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.active .step-number {
  background-color: var(--primary);
  color: white;
}

.step-title {
  padding: 5px 5px 0;
}

.ml-5 {
  margin-left: -1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

[href] {
  box-shadow: none;
  background-image: none;
}

.fr-link {
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  color: var(--g800-plain);
  font-size: 14px;
}
</style>

<i18n>
{
  "en": {
    "personal-information": "My personal data",
    "add-property": "I add my property",
    "validate-property": "I validate my property",
    "monthly-rent-and-charges": "Monthly rent and charges",
    "property-name": "Property name",
    "property-type": "Type of rent",
    "property-furniture": "Furniture",
    "property-address": "Property address",
    "property-living-space": "Living space"
  },
  "fr": {
    "personal-information": "Mes informations personnelles",
    "add-property": "J'ajoute un bien",
    "validate-property": "Je valide ma propriété",
    "monthly-rent-and-charges": "Loyer et charges mensuels",
    "property-name": "Nom de la propriété",
    "property-type": "Type de logement",
    "property-furniture": "Ameublement",
    "property-address": "Adresse du logement",
    "property-living-space": "Surface"
  }
}
</i18n>
