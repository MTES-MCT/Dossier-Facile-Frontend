<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { computed } from 'vue';
import NakedCard from 'df-shared/src/components/NakedCard.vue';
import Button from 'df-shared/src/Button/Button.vue';
import { useRouter } from 'vue-router';

defineProps<{}>();

const store = useStore();
const { t } = useI18n();
const router = useRouter();

const username = computed(() => store.getters.getUser?.firstName);
const properties = computed(() => store.getters.getProperties);

function addProperty() {
  store.dispatch('newProperty').then(() => {
    router.push({ name: 'PropertyName' });
  });
}

function consultProperty(id: number) {
  router.push({ name: 'ConsultProperty', params: { id } });
}

function editProperty(id: number) {
  router.push({ name: 'PropertyName', params: { id } });
}
</script>

<template>
  <div class="fr-container">
    <h2 class="fr-h3 fr-mt-3w blue-text">{{ t("title", { name: username }) }}</h2>
    <NakedCard>
      <div class="fr-grid-row space-between">
        <h1 class="fr-h4">{{ t("my-properties") }}</h1>
        <div>
          <Button @onClick="addProperty" :primary="true">{{ t("add-property") }}</Button>
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
        <tr v-for="p in properties" :key="p.name">
          <td>{{ p.type }}</td>
          <td class="text--light-blue">{{ p.name }}</td>
          <td class="text--light-blue">{{ p.address }}</td>
          <td>{{ p.applicant }}</td>
          <td class="text--light-blue">{{ p.rentCost }}</td>
          <td>
            <button @click="consultProperty(p.id)">Consult</button>
            <button @click="editProperty(p.id)">EDIT</button>
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
  padding: 0.5rem;
  &:first-child {
    background-color: transparent;
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
}
</style>

<i18n>
{
  "en": {
    "title": "Welcome back, {name}",
    "my-properties": "My properties",
    "add-property": "Add a property"
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
  }
}
</i18n>
