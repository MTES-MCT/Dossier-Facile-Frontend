<template>
  <div class="fr-container fr-container--fluid fluid-full-width position--relative">
    <div class="bg-pic position--absolute"></div>
    <div class="fr-container position--relative mt-100">
      <div class="fr-grid-row space-between fr-mb-3w">
        <div class="fr-grid-row">
          <router-link class="fr-btn btn--white fr-btn--secondary" to="/">{{
            t("back")
          }}</router-link>
          <div class="title">{{ name }}</div>
        </div>
        <div class="fr-grid-row">
          <button class="fr-btn btn--white fr-btn--secondary">
            <span class="material-icons md-24"> share_variant </span>
          </button>
          <button
            @click="editProperty()"
            class="fr-btn btn--white fr-btn--secondary fr-ml-1w"
          >
            {{ t("modify-property") }}
          </button>
          <button class="fr-btn btn--white fr-btn--secondary fr-ml-1w">
            {{ t("delete-property") }}
          </button>
        </div>
      </div>
      <NakedCard class="h-100">
        <div>type X et prix Y</div>
      </NakedCard>
      <NakedCard class="fr-mt-3w">
        {{ p }}
        <table>
          <tr>
            <th>{{ t("date") }}</th>
            <th>{{ t("tenant-name") }}</th>
            <th>{{ t("tenant-type") }}</th>
            <th>{{ t("tenant-salary") }}</th>
            <th>{{ t("guarantor-salary") }}</th>
            <th>{{ t("rate") }}</th>
            <th>{{ t("status") }}</th>
          </tr>
          <tr v-for="t in getTenants()" :key="t.id">
            <td>{{ p.type }}</td>
            <td class="text--light-blue">{{ t.firstName }}{{ t.lastName }}</td>
            <td>{{ t }}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </table>
      </NakedCard>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import NakedCard from 'df-shared/src/components/NakedCard.vue';

const { t } = useI18n();

defineProps<{}>();

const route = useRoute();
const router = useRouter();
const store = useStore();

const id = ref(0);
if (route.params.id) {
  id.value = Number(route.params.id);
  store.dispatch('updatePropertyToConsult', id.value);
}

const token = computed(() => store.getters.getPropertyToConsult?.token);
const name = computed(() => store.getters.getPropertyToConsult?.name);
const p = store.getters.getPropertyToConsult;

function editProperty() {
  router.push({ name: 'PropertyName', params: { id: id.value } });
}

function getTenants() {
  return p.propertiesApartmentSharing
    .map((pas: any) => pas.apartmentSharing.tenants)
    .reduce((r: [], c: []) => r.concat(c));
}
</script>

<style scoped lang="scss">
.bg-pic {
  width: 100%;
  height: 320px;
  top: 0;
  left: 0;
  background-size: cover !important;
  background-position: 50% 40% !important;
  background-image: linear-gradient(0deg, rgba(22, 22, 22, 0.7), rgba(22, 22, 22, 0.7)),
    url("../../assets/salon.webp");
  background-color: #314467;
  z-index: 0;
}

.mt-100 {
  margin-top: 200px;
}

.btn--white {
  color: white;
  box-shadow: inset 0 0 0 1px white;
}

.h-100 {
  height: 100px;
  display: flex;
  align-items: center;
}

.title {
  color: white;
  margin-left: 2rem;
  font-size: 2rem;
  line-height: 2rem;
}

.md-24 {
  width: 2rem;
}

table {
  width: 100%;
  border-spacing:0 0.25rem;
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
    "title": "consult",
    "back": "Back",
    "modify-property": "Modify my property",
    "delete-property": "Delete my property"
  },
  "fr": {
    "title": "Consultation",
    "back": "Retour",
    "modify-property": "Modifier ma propriété",
    "delete-property": "Supprimer ma propriété"
  }
}
</i18n>
