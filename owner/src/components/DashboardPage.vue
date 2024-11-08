<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { useRouter } from 'vue-router'
import { Property } from 'df-shared-next/src/models/Property'
import useOwnerStore from '../store/owner-store'
import GmbiAd from './GmbiAd.vue'
import FeedbackRequest from './FeedbackRequest.vue'
import AnalyticsService from '../services/AnalyticsService'
import { RiBuilding4Line, RiCommunityFill, RiHome4Fill } from '@remixicon/vue'

const store = useOwnerStore()
const { t } = useI18n()
const router = useRouter()

const username = computed(() => store.getUser?.firstName)
const properties = computed(() => store.getProperties)

function addProperty() {
  store.newProperty()
  router.push({ name: 'PropertyName' })
}

function consultProperty(id: number) {
  AnalyticsService.propertyData('visit')
  router.push({ name: 'ConsultProperty', params: { id } })
}

function editProperty(id: number) {
  router.push({ name: 'PropertyName', params: { id } })
}

function hasNoError(property: Property) {
  return (
    property.name &&
    property.address &&
    property.furniture &&
    property.livingSpace &&
    property.livingSpace > 0 &&
    property.rentCost &&
    property.rentCost > 0 &&
    property.chargesCost !== undefined &&
    property.chargesCost >= 0
  )
}

function openProperty(p: Property) {
  if (p.validated && hasNoError(p)) {
    router.push({ name: 'ConsultProperty', params: { id: p.id } })
    return
  }
  router.push({ name: 'PropertyName', params: { id: p.id } })
}
</script>

<template>
  <div class="fr-container fr-mb-5w fr-mt-5w">
    <h1 class="fr-h4">{{ t('dashboard.title', { name: username }) }}</h1>
    <NakedCard class="fr-p-md-3w">
      <div class="fr-grid-row space-between">
        <h2 id="my-properties-title" class="fr-h6">
          {{ t('dashboard.my-properties') }}
        </h2>
        <div>
          <DfButton @onClick="addProperty" :title="t('dashboard.add-property')" :primary="true">{{
            t('dashboard.add-property')
          }}</DfButton>
        </div>
      </div>

      <table aria-labelledby="my-properties-title">
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
              <RiHome4Fill v-if="p.type === 'HOUSE'" />
              <RiBuilding4Line v-else-if="p.type === 'APARTMENT'" />
              <RiCommunityFill v-else />
            </div>
          </td>
          <td class="blue-grey">{{ p.name }}</td>
          <td class="desktop blue-grey">{{ p.address }}</td>
          <td class="blue-grey">
            <span class="tag">
              {{
                t('dashboard.applicants', {
                  count: p.propertyApartmentSharingCount
                })
              }}
            </span>
          </td>
          <td class="desktop text--light-blue">
            {{
              t('dashboard.rent-cost', {
                rent: p.rentCost,
                charges: p.chargesCost
              })
            }}
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
    <div class="fr-container--fluid fr-mt-2w">
      <div class="fr-grid-row" style="gap: 1rem">
        <GmbiAd class="fr-col-md" />
        <FeedbackRequest class="fr-col-md" />
      </div>
    </div>
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
  padding: 0.5rem;
  border-radius: 6px;
  width: 40px;
  height: 40px;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
</style>
