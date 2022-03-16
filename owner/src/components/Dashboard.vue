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
  router.push({ name: 'PropertyName' });
}

function editProperty(id: number) {
  router.push({ name: 'PropertyName', params: { id } });
}
</script>

<template>
<div class="fr-container">
  <h1>{{ t('title', {name: username}) }}</h1>
  <NakedCard>
  <div class="fr-grid-row space-between">
    <h2>{{ t('my-properties') }}</h2>
    <div>
      <Button @onClick="addProperty" :primary="true">{{ t('add-property') }}</Button>
    </div>
  </div>

  <table>
    <tr>
    <th>{{ t('type') }}</th>
    <th>{{ t('name') }}</th>
    <th>{{ t('address') }}</th>
    <th>{{ t('applicant') }}</th>
    <th>{{ t('rent') }}</th>
    <th></th>
    </tr>
    <tr v-for="p in properties" :key="p.name" @click.prevent="editProperty(p.id)">
    <td>{{ p.type }}</td>
    <td>{{ p.name }}</td>
    <td>{{ p.address }}</td>
    <td>{{ p.applicant }}</td>
    <td>{{ p.rentCost }}</td>
    <td></td>
    </tr>
  </table>

  </NakedCard>
</div>
</template>

<style scoped lang="scss">
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
