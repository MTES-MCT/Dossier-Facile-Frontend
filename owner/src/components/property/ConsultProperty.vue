<template>
  <div class="fr-container fr-container--fluid fluid-full-width position--relative">
    <div class="bg-pic position--absolute"></div>
    <div class="fr-container position--relative mt-100 fr-mb-5w">
      <div class="fr-grid-row space-between fr-mb-3w">
        <div ref="headContainer" class="head-container">
          <div>
            <router-link
              :title="t('consultproperty.back-label')"
              class="fr-btn btn--white fr-btn--secondary"
              to="/"
              >{{ t('consultproperty.back') }}</router-link
            >
          </div>
          <div class="title">{{ name }}</div>
          <div class="spacer"></div>
          <VGouvFrModal
            class="fr-btn btn--white fr-btn--secondary"
            test-id="share-property-modal"
            @click="shareBtnClicked"
          >
            <template #button>
              {{ t('consultproperty.share-btn') }}
            </template>
            <template #title>
              {{ t('consultproperty.share-modal-title') }}
            </template>
            <template #content>
              <p>
                {{ t('consultproperty.share-modal-description') }}
              </p>
              <div class="fr-grid-row fr-mb-3w">
                <div class="align-self--center long-link">
                  {{ token }}
                </div>
                <div>
                  <button class="fr-btn fr-ml-5w" @click="copyToken">
                    {{ t('consultproperty.copy-link') }}
                  </button>
                </div>
              </div>
              <p>
                {{ t('consultproperty.share-modal-detail') }}
              </p>
            </template>
          </VGouvFrModal>
          <button
            :title="t('consultproperty.update-btn')"
            class="fr-btn btn--white fr-btn--secondary"
            @click="editProperty()"
          >
            {{ t('consultproperty.modify-property') }}
          </button>
          <button
            :title="t('consultproperty.delete-btn')"
            class="fr-btn btn--white fr-btn--secondary"
            @click="showDeletePropertyModal()"
          >
            {{ t('consultproperty.delete-property') }}
          </button>
          <ConfirmModal
            v-if="confirmDeleteProperty"
            @valid="validDeleteFile()"
            @cancel="undoDeleteFile()"
          >
            {{ t('consultproperty.will-delete-property') }}
          </ConfirmModal>
        </div>
      </div>
      <NakedCard class="h-100">
        <div class="fr-grid-row align-items--center w100">
          <div class="fr-col-md-1 fr-col-2 text-center">
            <PropertyIcon :type="propertyType || ''"></PropertyIcon>
          </div>
          <div class="fr-col">
            <div
              v-html="
                `${t(titleKey)} ${t('consultproperty.rent', {
                  rentCost: p.rentCost,
                  chargesCost: p.chargesCost
                })}`
              "
            ></div>
          </div>
        </div>
      </NakedCard>
      <NakedCard class="fr-mt-3w">
        <h1 class="fr-h4">
          {{
            t('consultproperty.verified-applicants', {
              count: verifiedApplicantsCount
            })
          }}
        </h1>
        <div class="delete-btn-container">
          <button
            class="fr-btn fr-btn--secondary"
            :disabled="selectedApplicants.length <= 0"
            @click="confirmDeleteApplicants = true"
          >
            {{ t('consultproperty.delete-applicants') }}
          </button>
          <ConfirmModal
            v-if="confirmDeleteApplicants"
            @valid="validDeleteApplicants()"
            @cancel="undoDeleteApplicants()"
          >
            {{ t('consultproperty.will-delete-applicants') }}
          </ConfirmModal>
        </div>
        <table>
          <thead>
            <tr>
              <th></th>
              <th class="desktop" @click="sortTable('lastUpdateDate')">
                {{ t('consultproperty.date') }}
                <div
                  v-if="'lastUpdateDate' == sortColumn"
                  class="arrow"
                  :class="ascending ? 'arrow_up' : 'arrow_down'"
                ></div>
              </th>
              <th @click="sortTable('tenantName')">
                {{ t('consultproperty.tenant-name') }}
                <div
                  v-if="'tenantName' == sortColumn"
                  class="arrow"
                  :class="ascending ? 'arrow_up' : 'arrow_down'"
                ></div>
              </th>
              <th class="desktop" @click="sortTable('tenantType')">
                {{ t('consultproperty.tenant-type') }}
                <div
                  v-if="'tenantType' == sortColumn"
                  class="arrow"
                  :class="ascending ? 'arrow_up' : 'arrow_down'"
                ></div>
              </th>
              <th @click="sortTable('tenantSalary')">
                {{ t('consultproperty.tenant-salary') }}
                <div
                  v-if="'tenantSalary' == sortColumn"
                  class="arrow"
                  :class="ascending ? 'arrow_up' : 'arrow_down'"
                ></div>
              </th>
              <th class="desktop" @click="sortTable('guarantorSalary')">
                {{ t('consultproperty.guarantor-salary') }}
                <div
                  v-if="'guarantorSalary' == sortColumn"
                  class="arrow"
                  :class="ascending ? 'arrow_up' : 'arrow_down'"
                ></div>
              </th>
              <th @click="sortTable('rate')">
                {{ t('consultproperty.rate') }}
                <div
                  v-if="'rate' == sortColumn"
                  class="arrow"
                  :class="ascending ? 'arrow_up' : 'arrow_down'"
                ></div>
              </th>
              <th @click="sortTable('status')">
                {{ t('consultproperty.status') }}
                <div
                  v-if="'status' == sortColumn"
                  class="arrow"
                  :class="ascending ? 'arrow_up' : 'arrow_down'"
                ></div>
              </th>
            </tr>
          </thead>
          <tbody v-for="(tenant, k) in tenants" :key="k">
            <tr :class="getTenantClass(tenant)">
              <td class="w30">
                <input
                  :id="tenant.id.toString()"
                  v-model="selectedApplicants"
                  :value="tenant.id.toString()"
                  type="checkbox"
                />
              </td>
              <td class="desktop" @click="setShowTenant(tenant, k)">
                <time>{{ formatDate(tenant.lastUpdateDate || new Date()) }}</time>
              </td>
              <td @click="setShowTenant(tenant, k)">
                <span class="tenant-name">{{ tenant.tenantName }}</span>
              </td>
              <td class="desktop" @click="setShowTenant(tenant, k)">
                <div class="tenant-type" :class="getTenantClass(tenant)">
                  {{ t(tenant.applicationType || '') }}
                </div>
              </td>
              <td @click="setShowTenant(tenant, k)">
                <span>{{ tenant.tenantSalary }}</span>
              </td>
              <td class="desktop" @click="setShowTenant(tenant, k)">
                <span>{{ tenant.guarantorSalary }}</span>
              </td>
              <td @click="setShowTenant(tenant, k)">
                <div v-if="tenant.rate === -1">
                  {{ t('consultproperty.no-income') }}
                </div>
                <div v-else>
                  <span class="rate" :class="getRateClass(tenant)">{{ tenant.rate }} %</span>
                  {{ t('consultproperty.income') }}
                </div>
              </td>
              <td @click="setShowTenant(tenant, k)">
                <div class="tag" :class="getTenantClass(tenant)">
                  <RiCloseCircleFill v-if="tenant.status === 'DECLINED'" size="18px" />
                  <RiCheckboxCircleLine v-else-if="tenant.status === 'VALIDATED'" size="18px" />
                  <RiTimeLine v-else size="18px" />
                  <span class="fr-ml-1v">
                    {{ t(tenant.status || '') }}
                  </span>
                </div>
              </td>
            </tr>
            <tr v-if="tenantIdToShow === k">
              <td colspan="8" class="additional-td">
                <div class="tenant-token-link fr-mb-3w fr-mt-1w">
                  <a class="fr-btn" :href="`${TENANT_URL}/file/${tenant?.token}`" target="_blank">{{
                    t('consultproperty.download-full-file')
                  }}</a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </NakedCard>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import VGouvFrModal from 'df-shared-next/src/GouvFr/VGouvFrModal.vue'
import { useToast } from 'vue-toastification'
import { format } from 'date-fns'
import { enUS, fr } from 'date-fns/locale'
import PropertyIcon from './PropertyIcon.vue'
import type { Applicant } from './Applicant'
import UtilsService from '../../services/UtilsService'
import useOwnerStore from '../../store/owner-store'
import AnalyticsService from '../../services/AnalyticsService'
import { RiCheckboxCircleLine, RiCloseCircleFill, RiTimeLine } from '@remixicon/vue'

const { t, locale } = useI18n()
const confirmDeleteProperty = ref(false)
const confirmDeleteApplicants = ref(false)

const route = useRoute()
const router = useRouter()
const store = useOwnerStore()
const toast = useToast()

const sortColumn = ref<keyof Applicant | ''>('')
const ascending = ref(false)
const tenantIdToShow = ref(-1)
const selectedApplicants = ref([])

const TENANT_URL = `https://${import.meta.env.VITE_TENANT_URL}`
const OWNER_URL = `${import.meta.env.VITE_OWNER_URL}`
const token = computed(() => {
  if (import.meta.env.VITE_NEW_SHARE_LINK === 'true') {
    return `${OWNER_URL}/candidater/${store.getPropertyToConsult?.token}`
  }
  return `${TENANT_URL}/inscription-locataire/${store.getPropertyToConsult?.token}`
})
const name = computed(() => store.getPropertyToConsult?.name)
const p = computed(() => store.getPropertyToConsult)
const propertyType = computed(() => store.getPropertyToConsult?.type)
const propertyFurnished = computed(() => store.getPropertyToConsult?.furniture)

const tenants = ref<Array<Applicant>>([])

const id = ref(0)

function getTenants(): Applicant[] {
  return UtilsService.getTenants(p.value).sort((a, b) => {
    if (sortColumn.value === '') return 0
    const left = a[sortColumn.value]
    const right = b[sortColumn.value]
    if (!left || !right) return 0
    if (left < right) {
      return ascending.value ? 1 : -1
    }
    if (right > left) {
      return ascending.value ? -1 : 1
    }
    return 0
  })
}

function shareBtnClicked() {
  AnalyticsService.propertyData('partager')
}

onMounted(async () => {
  if (route.params.id) {
    id.value = Number(route.params.id)
    await store.updatePropertyToConsult(id.value)
    if (Object.keys(store.getPropertyToConsult).length <= 0) {
      router.push({ name: 'Dashboard' })
    } else {
      tenants.value = getTenants()
    }
  } else {
    router.push({ name: 'Dashboard' })
  }
})

const titleKey = computed(() => {
  if (propertyType.value === 'HOUSE') {
    if (propertyFurnished.value === 'FURNISHED') {
      return 'house-furnished'
    }
    return 'house-unfurnished'
  }
  if (propertyType.value === 'APARTMENT') {
    if (propertyFurnished.value === 'FURNISHED') {
      return 'apartment-furnished'
    }
    return 'apartment-unfurnished'
  }
  if (propertyFurnished.value === 'FURNISHED') {
    return 'other-furnished'
  }
  return 'other-unfurnished'
})

function editProperty() {
  AnalyticsService.propertyData('modifier')
  router.push({ name: 'PropertyName', params: { id: id.value } })
}

function sortTable(col: keyof Applicant) {
  if (sortColumn.value === col) {
    ascending.value = !ascending.value
  } else {
    sortColumn.value = col
    ascending.value = true
  }
}

function showDeletePropertyModal() {
  confirmDeleteProperty.value = true
  AnalyticsService.propertyData('supprimer')
}

function validDeleteFile() {
  AnalyticsService.propertyData('supprimer_valider')
  store.deleteProperty(id.value).then(() => {
    router.push({ name: 'Dashboard' })
  })
  confirmDeleteProperty.value = false
}
function undoDeleteFile() {
  AnalyticsService.propertyData('supprimer_annuler')
  confirmDeleteProperty.value = false
}
function validDeleteApplicants() {
  store.deleteApplicants(selectedApplicants.value).then(() => {
    selectedApplicants.value = []
    store.updatePropertyToConsult(id.value)
    tenants.value = getTenants()
  })
  confirmDeleteApplicants.value = false
}
function undoDeleteApplicants() {
  confirmDeleteApplicants.value = false
}

function copyToken() {
  AnalyticsService.propertyData('partager_copylink')
  navigator.clipboard.writeText(token.value)
  toast.success(t('consultproperty.link-copied').toString(), {
    timeout: 7000
  })
}

const verifiedApplicantsCount = computed(
  () => tenants.value.filter((u: Applicant) => u.status === 'VALIDATED').length
)
function formatDate(date: Date) {
  return format(date, 'dd MMMM yyyy', {
    locale: locale.value === 'fr' ? fr : enUS
  })
}

function setShowTenant(applicant: Applicant, tenantId: number) {
  if (applicant.status !== 'VALIDATED') {
    return
  }
  if (tenantIdToShow.value === tenantId) {
    tenantIdToShow.value = -1
  } else {
    tenantIdToShow.value = tenantId
  }
}

function getTenantClass(applicant: Applicant) {
  switch (applicant.status) {
    case 'VALIDATED':
      return 'validated'
    case 'DECLINED':
      return 'declined'
    case 'TO_PROCESS':
      return 'to-process'
    default:
      return ''
  }
}

function getRateClass(applicant: Applicant) {
  if ((applicant?.rate || 100) < 30 && applicant?.rate !== -1) {
    return 'good'
  }
  return ''
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
    url('../../assets/salon.webp');
  background-color: #314467;
  z-index: 0;
  @media (max-width: 768px) {
    height: 550px;
  }
}

.mt-100 {
  margin-top: 200px;
}

:deep(.btn--white) {
  color: white;
  box-shadow: inset 0 0 0 1px white;
  &:hover {
    color: inherit;
  }
}

.h-100 {
  height: 100px;
  display: flex;
  align-items: center;
}

.title {
  color: white;
  font-size: 2rem;
  line-height: 2rem;
}

.left-auto {
  margin-left: auto;
}

.md-24 {
  width: 2rem;
}

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

tbody {
  background-color: #f5f5fe;
  color: #666666;
  padding: 0.5rem;
  &:first-child {
    background-color: transparent;
  }
}

td {
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  height: 2.5rem;
  .validated:hover & {
    border-top: 1px solid #447049;
    border-bottom: 1px solid #447049;
    > .tenant-name {
      color: #447049;
    }
  }
  .declined:hover & {
    border-top: 1px solid #9c0400;
    border-bottom: 1px solid #9c0400;
  }

  &:first-child {
    border-left: 1px solid transparent;
    border-top-left-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
    .validated:hover & {
      border-left: 1px solid #447049;
    }
    .declined:hover & {
      border-left: 1px solid #9c0400;
    }
  }

  &:last-child {
    border-right: 1px solid transparent;
    border-top-right-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
    .validated:hover & {
      border-right: 1px solid #447049;
    }
    .declined:hover & {
      border-right: 1px solid #9c0400;
    }
  }
}

.tag {
  display: flex;
  align-items: center;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  border-radius: 1rem;
  &.to-process {
    color: #82467e;
    background-color: #fef3fd;
  }

  &.validated {
    color: #37635f;
  }

  &.declined {
    color: #9c0400;
  }
}

.arrow_down {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAaCAYAAABPY4eKAAAAAXNSR0IArs4c6QAAAvlJREFUSA29Vk1PGlEUHQaiiewslpUJiyYs2yb9AyRuJGm7c0VJoFXSX9A0sSZN04ULF12YEBQDhMCuSZOm1FhTiLY2Rky0QPlQBLRUsICoIN/0PCsGyox26NC3eTNn3r3n3TvnvvsE1PkwGo3yUqkkEQqFgw2Mz7lWqwng7ztN06mxsTEv8U0Aam5u7r5EInkplUol/f391wAJCc7nEAgE9Uwmkzo4OPiJMa1Wq6cFs7Ozt0H6RqlUDmJXfPIx+qrX69Ti4mIyHA5r6Wq1egND+j+IyW6QAUoul18XiUTDNHaSyGazKcZtdgk8wqhUKh9o/OMvsVgsfHJy0iWqVrcQNRUMBnd6enqc9MjISAmRP3e73T9al3XnbWNjIw2+KY1Gc3imsNHR0YV4PP5+d3e32h3K316TySQFoX2WyWR2glzIO5fLTSD6IElLNwbqnFpbWyO/96lCoai0cZjN5kfYQAYi5H34fL6cxWIZbya9iJyAhULBHAqFVlMpfsV/fHxMeb3er+Vy+VUzeduzwWC45XA4dlD/vEXvdDrj8DvURsYEWK3WF4FA4JQP9mg0WrHZbEYmnpa0NxYgPVObm5teiLABdTQT8a6vrwdRWhOcHMzMzCiXlpb2/yV6qDttMpkeshEzRk4Wo/bfoe4X9vb2amzGl+HoXNT29vZqsVi0sK1jJScG+Xx+HGkL4Tew2TPi5zUdQQt9otPpuBk3e0TaHmMDh1zS7/f780S0zX6Yni+NnBj09fUZUfvudDrNZN+GkQbl8Xi8RLRtHzsB9Hr9nfn5+SjSeWUCXC7XPq5kw53wsNogjZNohYXL2EljstvtrAL70/mVaW8Y4OidRO1/gwgbUMvcqGmcDc9aPvD1gnTeQ+0nmaInokRj0nHh+uvIiVOtVvt2a2vLv7Ky0tL3cRTXIcpPAwMDpq6R4/JXE4vFQ5FI5CN+QTaRSFCYc8vLy1l0rge4ARe5kJ/d27kYkLXoy2Jo4C7K8CZOsEBvb+9rlUp1xNXPL7v3IDwxvPD6AAAAAElFTkSuQmCC');
}
.arrow_up {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAaCAYAAACgoey0AAAAAXNSR0IArs4c6QAAAwpJREFUSA21Vt1PUmEYP4dvkQ8JFMwtBRocWAkDbiqXrUWXzU1rrTt0bdVqXbb1tbW16C9IBUSmm27cODdneoXjputa6069qwuW6IIBIdLvdaF4OAcOiGeDc87zPs/vd57P96WpFq7p6enbGo1mjKZpeTabjU1MTCRagGnOZHFxcXxtbe1XKpUq7+zslJeXl//Mz8+Hy+Uy3RxSE9qTk5M3otFooVQqgef4Wl9f343FYoEmoISrxuNxFX5f9vb2jhn/PxUKhfLS0tIPfFifUESRUMV8Pv/M6XReRm5rTGQyGeXxeGxYe1ezeBpBOBx2rKysbO7v79d4Wy3Y2Nj4GQqFbgnhaugxwiuGJx99Pp9FLBbXxYTXvTqd7v3MzIy6riIWGxJnMpl7AwMD14xGYyMsSq1WUyQdUqn0eSPlusQIsbGrq+vl4OCgvhFQZd1utyv1en0gEolcqsi47nWJlUrlG5fLZVcoFFy2nDKSDpIWlUoVTCQSEk4lCHmJMZ2GTCbTiMVikfIZ88l7enoos9l8dXt7+z6fDicxSJUokqDX6xXcl2wCROoc0vQCWL3sNfLOSdzR0fHY4XC4tVotl40gmVwup9xuN4OQv+UyqCFGH9rg7SOGYVRcBs3IEG4J0nVnamrqOtvuBDGGgQg9+wHFcVEi4a0LNkbdd6TrPKo8ODc311mteIIYjT/a398/jK+s1jnVM0kXoufCFvq0GuiIGEVgQIhfoygM1QrteEa9dAL7ITiYCt4RMabOK5AyKKzKWtvupLcRciu8D5J0EuDDPyT/Snd39yh6VtY2NhYQSR9G79Ds7OxdskRjEyAufvb7/cPoO5Z6e1+xtVKrq6vfcFzyi/A3ZrPZ3GdNSlwgo5ekE4X2RIQGf2C1WlufFE0GBeGWYQ8YERWLxQtnUVB830MKLZfL9RHir8lkssCn2G751tZWEWe03zTKm15YWPiEiXXTYDB0Ig/t7yd8PRws4EicwWHxO4jHD8/C5HiTTqd1BwcHFozKU89origB+y/kmzgYpgOBQP4fGmUiZmJ+WNgAAAAASUVORK5CYII=');
}
.arrow {
  float: right;
  width: 12px;
  height: 15px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position-y: bottom;
}

.tenant-token-link {
  display: flex;
  justify-content: right;
}

.additional-td {
  border: none !important;
  background: var(--background-default-grey);
}

tr {
  cursor: pointer;
  &.validated {
    background-color: #dffdf7;
  }

  &.declined {
    background-color: #ffe9e9;
  }
}

.good {
  background-color: #447049;
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 2.5rem;
}

.tenant-type {
  display: inline-block;
  border: solid 0.5px #6a6af4;
  border-radius: 1.125rem;
  &.validated {
    border: solid 0.5px #18753c;
  }
  &.declined {
    border: solid 0.5px #cecece;
  }
  margin: 0.5rem 0.5px 0.4rem 0;
  padding: 0.4rem 0.5rem;
}

.desktop {
  display: none !important;
  @media all and (min-width: 768px) {
    display: table-cell !important;
  }
}
.w30 {
  min-width: 30px;
  text-align: center;
}

.delete-btn-container {
  margin-left: auto;
  margin-right: 0;
  text-align: right;
}

.spacer {
  flex-grow: 1;
}

.head-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 1rem;
  @media all and (max-width: 768px) {
    flex-direction: column;
  }
}
</style>

<style lang="scss">
.v-gouv-fr-modal {
  > a {
    background-image: none;
  }
}

.long-link {
  word-wrap: break-word;
  max-width: 50%;
}
</style>
