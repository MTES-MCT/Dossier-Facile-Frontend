<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import NakedCard from 'df-shared-next/src/components/NakedCard.vue';
import Button from 'df-shared-next/src/Button/Button.vue';
import { useRouter } from 'vue-router';
import { Property } from 'df-shared-next/src/models/Property';
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
    <h2 class="fr-h3 fr-mt-3w blue-text">{{ t('dashboard.title', { name: username }) }}</h2>
    <NakedCard>
      <div class="fr-grid-row space-between">
        <h1 id="my-properties-title" class="fr-h4">{{ t('dashboard.my-properties') }}</h1>
        <div>
          <Button @onClick="addProperty" :title="t('dashboard.add-property')" :primary="true">{{
            t('dashboard.add-property')
          }}</Button>
        </div>
      </div>

      <table aria-labelledby="my-properties-title" :aria-describedby="t('dashboard.my-properties')">
        <tr>
          <th class="desktop">{{ t('dashboard.type') }}</th>
          <th>{{ t('dashboard.name') }}</th>
          <th class="desktop">{{ t('dashboard.address') }}</th>
          <th>{{ t('dashboard.applicant') }}</th>
          <th class="desktop">{{ t('dashboard.rent') }}</th>
          <th></th>
        </tr>
        <tr class="clickable" v-for="p in properties" :key="p.name" @click="openProperty(p)">
          <td class="desktop blue-text inline-block">
            <div class="fr-m-1v icon-container">
              <span v-if="p.type === 'HOUSE'" class="material-icons md-24">home</span>
              <span v-else-if="p.type === 'APARTMENT'" class="material-icons md-24">apartment</span>
              <span v-else class="material-icons md-24">domain</span>
            </div>
          </td>
          <td class="blue-grey">{{ p.name }}</td>
          <td class="desktop blue-grey">{{ p.address }}</td>
          <td class="blue-grey">
            <span class="tag">
              {{ t('dashboard.applicants', { count: getApplicantsCount(p) }) }}
            </span>
          </td>
          <td class="desktop text--light-blue">
            {{ t('dashboard.rent-cost', { rent: p.rentCost, charges: p.chargesCost }) }}
          </td>
          <td class="fr-pr-2w">
            <button
              class="consult-icon"
              :title="t('dashboard.consult')"
              v-if="p.validated"
              @click="consultProperty(p.id)"
            >
              >
            </button>
            <button
              class="fr-btn fr-btn--secondary"
              :title="t('dashboard.edit-title')"
              v-if="!p.validated"
              @click="editProperty(p.id)"
            >
              {{ t('dashboard.edit') }}
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
  .blue-grey {
    color: #666666;
  }
  &:first-child {
    background-color: transparent;
  }

  .tag {
    background-color: #e5e5e5;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    border-radius: 1rem;
  }

  &.clickable {
    &:hover {
      box-shadow: var(--primary) 0 0 2px;
      cursor: pointer;
      --hover-color: var(--primary);
      background-color: #f5f5fe;
      .blue-grey {
        color: #0063cb;
      }
      .tag {
        background-color: #c7c7fa;
        color: var(--primary);
      }
    }
  }
}

td {
  border: solid 1px #f6f6f6;
  height: auto;
  vertical-align: middle;
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

.desktop {
  display: none !important;
  @media all and (min-width: 768px) {
    display: table-cell !important;
  }
}

.icon-container {
  background-color: white;
  width: fit-content;
  padding: 0.5rem;
  border-radius: 6px;
  width: 40px;
  height: 40px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
</style>
