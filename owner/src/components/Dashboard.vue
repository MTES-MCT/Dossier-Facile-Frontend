<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import NakedCard from 'df-shared/src/components/NakedCard.vue';
import Button from 'df-shared/src/Button/Button.vue';
import { useRouter } from 'vue-router';
import { Property } from 'df-shared/src/models/Property';
import PropertyIcon from './property/PropertyIcon.vue';
import UtilsService from '../services/UtilsService';
import useOwnerStore from '../store/owner-store';

const store = useOwnerStore();
const { t } = useI18n();
const router = useRouter();

const username = computed(() => store.getUser?.firstName);
const properties = computed(() => store.getProperties);

function addProperty() {
  store.newProperty();
  router.push({ name: 'PropertyName' });
}

function consultProperty(id: number) {
  router.push({ name: 'ConsultProperty', params: { id } });
}

function editProperty(id: number) {
  router.push({ name: 'PropertyName', params: { id } });
}

function openProperty(p: Property) {
  if (p.validated) {
    router.push({ name: 'ConsultProperty', params: { id: p.id } });
    return;
  }
  router.push({ name: 'PropertyName', params: { id: p.id } });
}

function getApplicantsCount(p: Property) {
  return UtilsService.getTenants(p).length;
}
</script>

<template>
  <div class="fr-container">
    <h2 class="fr-h3 fr-mt-3w blue-text">{{ t("title", { name: username }) }}</h2>
    <NakedCard>
      <div class="fr-grid-row space-between">
        <h1 class="fr-h4">{{ t("my-properties") }}</h1>
        <div>
          <Button @onClick="addProperty" :title="t('add-property')" :primary="true">{{
            t("add-property")
          }}</Button>
        </div>
      </div>

      <table>
        <tr>
          <th>{{ t("type") }}</th>
          <th>{{ t("name") }}</th>
          <th>{{ t("address") }}</th>
          <th>{{ t("applicant") }}</th>
          <th>{{ t("rent") }}</th>
          <th></th>
        </tr>
        <tr
          class="clickable"
          v-for="p in properties"
          :key="p.name"
          @click="openProperty(p)"
        >
          <td><PropertyIcon :type="p.type"></PropertyIcon></td>
          <td class="text--light-blue">{{ p.name }}</td>
          <td class="text--light-blue">{{ p.address }}</td>
          <td>{{ t("applicants", { count: getApplicantsCount(p) }) }}</td>
          <td class="text--light-blue">
            {{ t("rent-cost", { rent: p.rentCost, charges: p.chargesCost }) }}
          </td>
          <td class="fr-pr-2w">
            <button
              class="consult-icon"
              :title="t('consult')"
              v-if="p.validated"
              @click="consultProperty(p.id)"
            >
              >
            </button>
            <button
              class="fr-btn fr-btn--secondary"
              :title="t('edit-title')"
              v-if="!p.validated"
              @click="editProperty(p.id)"
            >
              {{ t("edit") }}
            </button>
          </td>
        </tr>
      </table>
    </NakedCard>
  </div>
</template>

<style scoped lang="scss">
table {
  width: 100%;
  border-spacing: 0 0.25rem;
  text-align: start;
}
th {
  text-align: start;
  color: #666666;
  font-size: 12px;
}

tr {
  background-color: #f6f6f6;
  color: #666666;
  --hover-color: #666666;
  padding: 0.5rem;
  &:first-child {
    background-color: transparent;
  }
  &.clickable {
    &:hover {
      box-shadow: var(--primary) 0 0 2px;
      cursor: pointer;
      --hover-color: var(--primary);
    }
  }
}

td {
  border: solid 1px #f6f6f6;
  height: 2.5rem;
}

td:first-child {
  border-top-left-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
}
td:last-child {
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  text-align-last: end;
}

.consult-icon {
  color: var(--hover-color);
}
</style>

<i18n>
{
  "en": {
    "title": "Welcome back, {name}",
    "my-properties": "My properties",
    "add-property": "Add a property",
    "type": "Type",
    "name": "Name",
    "address": "Address",
    "applicant": "Applicant",
    "rent": "Rent in €",
    "consult": "Consult the property",
    "edit": "To finish",
    "edit-title": "Finish property edition",
    "applicants": "{count} applicant(s)",
    "rent-cost": "{rent}€ + {charges}€"
  },
  "fr": {
    "title": "Bon retour parmi nous, {name}",
    "my-properties": "Mes propriétés",
    "add-property": "Ajouter une propriété",
    "type": "Type",
    "name": "Nom",
    "address": "Adresse",
    "applicant": "Candidatures",
    "rent": "Loyer en €",
    "consult": "Consulter la propriété",
    "edit": "À finaliser",
    "edit-title": "Finaliser l'édition de la propriété",
    "applicants": "{count} condidature(s)",
    "rent-cost": "{rent}€ + {charges}€"
  }
}
</i18n>
