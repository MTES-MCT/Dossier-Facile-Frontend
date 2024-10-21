<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ColoredTag from 'df-shared-next/src/components/ColoredTag.vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import useOwnerStore from '../../store/owner-store'

const { t } = useI18n()
const store = useOwnerStore()
const route = useRoute()

const td0 = ref(null)
const td1 = ref(null)
const td2 = ref(null)
const td3 = ref(null)
const td4 = ref(null)
const td5 = ref(null)
const td6 = ref(null)
const tds = [td0, td1, td2, td3, td4, td5, td6]
const tcontainer = ref(null)

onMounted(() => {
  let left = 0
  if (route.meta.position === undefined) {
    return
  }
  const tdx = tds[route.meta.position as number]
  const tcontainerval = tcontainer.value as any
  const tdxval = tdx.value as any
  if (
    tdx === undefined ||
    tdx.value === null ||
    tdxval.offsetLeft === null ||
    tcontainer.value === null ||
    tcontainerval.offsetWidth === null
  ) {
    return
  }
  left = tdxval.offsetLeft - (tcontainerval.offsetWidth - tdxval.offsetWidth) / 2
  tcontainerval.scrollTo(left, 0)
})

const propertyName = computed(() => store.getPropertyToEdit?.name)

const typeStatus = computed(() => (store.getPropertyToEdit?.type ? 'FILLED' : 'TO_PROCESS'))
const addressStatus = computed(() => (store.getPropertyToEdit?.address ? 'FILLED' : 'TO_PROCESS'))
const rentStatus = computed(() => (store.getPropertyToEdit?.rentCost > 0 ? 'FILLED' : 'TO_PROCESS'))
const diagnosticStatus = computed(() =>
  store.getPropertyToEdit?.co2Emission && store.getPropertyToEdit?.energyConsumption > 0
    ? 'FILLED'
    : 'TO_PROCESS'
)
const furnitureStatus = computed(() =>
  store.getPropertyToEdit?.furniture ? 'FILLED' : 'TO_PROCESS'
)
const livingSpaceStatus = computed(() =>
  store.getPropertyToEdit?.livingSpace ? 'FILLED' : 'TO_PROCESS'
)

const id = Number(route.params.id)
const getParams = id ? { id } : {}

const step = computed(() => {
  if (route.name === 'AccountName') {
    return 0
  }
  if (route.name === 'ValidateProperty') {
    return 2
  }
  return 1
})

const substep = computed(() => route.meta.position)

function getStepTitle() {
  if (step.value === 0) {
    return t('topmenu.personal-information')
  }
  if (step.value === 2) {
    return t('topmenu.validate-property')
  }
  return t('topmenu.edit-property')
}

function getClass(s: number) {
  let res = ''
  if (step.value !== s) {
    res = 'small'
  }
  if (step.value === 1 && s === 1) {
    res = `${res} rad${substep.value}`
  }
  if (step.value === s) {
    return `${res} active`
  }
  return res
}
</script>

<template>
  <nav class="top-edit-menu">
    <h1 class="blue-text text-center fr-mt-1w fr-mb-1v">
      {{ getStepTitle() }}
    </h1>
    <div class="inner-top-edit fr-mb-1w">
      <div class="hline" :class="getClass(0)"></div>
      <div class="hline" :class="getClass(1)"></div>
      <div class="hline" :class="getClass(2)"></div>
    </div>
    <hr v-if="step === 1" />
    <div class="menu-grid-row" v-if="step === 1" ref="tcontainer">
      <div class="ml-5" ref="td0">
        <router-link :to="{ name: 'PropertyName', params: getParams }" class="fr-link">
          <ColoredTag
            :text="propertyName ? propertyName : t('topmenu.property-name')"
            :status="propertyName ? 'FILLED' : 'EMPTY'"
          ></ColoredTag>
        </router-link>
      </div>
      <div class="ml-5" ref="td1">
        <router-link :to="{ name: 'PropertyType', params: getParams }" class="fr-link">
          <ColoredTag :text="t('topmenu.property-type')" :status="typeStatus"></ColoredTag>
        </router-link>
      </div>
      <div class="ml-5" ref="td2">
        <router-link :to="{ name: 'PropertyAddress', params: getParams }" class="fr-link">
          <ColoredTag :text="t('topmenu.property-address')" :status="addressStatus"></ColoredTag>
        </router-link>
      </div>
      <div class="ml-5" ref="td3">
        <router-link :to="{ name: 'PropertyFurniture', params: getParams }" class="fr-link">
          <ColoredTag
            :text="t('topmenu.property-furniture')"
            :status="furnitureStatus"
          ></ColoredTag>
        </router-link>
      </div>
      <div class="ml-5" ref="td4">
        <router-link :to="{ name: 'PropertyLivingSpace', params: getParams }" class="fr-link">
          <ColoredTag :text="t('property-living-space')" :status="livingSpaceStatus"></ColoredTag>
        </router-link>
      </div>
      <div class="ml-5" ref="td5">
        <router-link :to="{ name: 'PropertyRent', params: getParams }" class="fr-link">
          <ColoredTag
            :text="t('topmenu.monthly-rent-and-charges')"
            :status="rentStatus"
          ></ColoredTag>
        </router-link>
      </div>
      <div class="ml-5" ref="td5">
        <router-link :to="{ name: 'PropertyDiagnostic', params: getParams }" class="fr-link">
          <ColoredTag :text="t('topmenu.diagnostic')" :status="diagnosticStatus"></ColoredTag>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
h1 {
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1rem;
  padding-top: 0.5rem;
}

hr {
  height: 1px;
  opacity: 0.25;
}

.top-edit-menu {
  max-width: 100%;
  white-space: nowrap;
  background-color: var(--background-default-grey);
  @media all and (min-width: 769px) {
    display: none;
  }
}

.ml-5 {
  margin-left: 1rem;
  margin-top: 0.25rem;
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

hr {
  height: 1px;
  opacity: 0.25;
}

.hline {
  height: 0.3rem;
  border-radius: 0.15rem;
  background-color: var(--g200);
  z-index: 0;
  margin: 2%;
  width: 60%;
  &.active {
    background-color: var(--primary);
  }
}

.small {
  width: 8% !important;
}

.rad0 {
  background: linear-gradient(90deg, var(--primary) 20%, var(--g200) 20%);
}

.rad1 {
  background: linear-gradient(90deg, var(--primary) 40%, var(--g200) 20%);
}

.rad2 {
  background: linear-gradient(90deg, var(--primary) 60%, var(--g200) 40%);
}

.rad3 {
  background: linear-gradient(90deg, var(--primary) 80%, var(--g200) 60%);
}

.rad4 {
  background: linear-gradient(90deg, var(--primary) 98%, var(--g200) 80%);
}

.menu-grid-row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow: scroll;
}

.inner-top-edit {
  width: 100%;
  display: flex;
  flex-direction: row;
  overflow: scroll;
  justify-content: space-around;
}

.menu-grid-row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow: scroll;
}
</style>
