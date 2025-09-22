<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ColoredTag from 'df-shared-next/src/components/ColoredTag.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import useOwnerStore from '../../store/owner-store'
import { SharedPropertyService } from 'df-shared-next/src/services/SharedPropertyService'

const { t } = useI18n()
const store = useOwnerStore()
const route = useRoute()

const userName = computed(() => `${store.getUser?.lastName} ${store.getUser?.firstName}`)
const propertyName = computed(() => store.getPropertyToEdit?.name)

const typeStatus = computed(() => (store.getPropertyToEdit?.type ? 'FILLED' : 'TO_PROCESS'))
const addressStatus = computed(() => (store.getPropertyToEdit?.address ? 'FILLED' : 'TO_PROCESS'))
const rentStatus = computed(() => (store.getPropertyToEdit?.rentCost > 0 ? 'FILLED' : 'TO_PROCESS'))
const diagnosticStatus = computed(() =>
  store.getPropertyToEdit && SharedPropertyService.hasDpe(store.getPropertyToEdit)
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
const params = id ? { id } : {}
</script>

<template>
  <nav class="left-edit-menu">
    <ol class="inner-left-edit fr-pt-7w fr-pb-12w">
      <li class="step">
        <router-link :to="{ name: 'AccountName' }" class="step-title fr-link">
          {{ t('leftmenu.personal-information') }}</router-link
        >
        <ul class="vline">
          <li>
            <router-link :to="{ name: 'AccountName' }" class="fr-link">
              <ColoredTag :text="userName" status="NAME"></ColoredTag
            ></router-link>
          </li>
        </ul>
      </li>
      <li class="step">
        <router-link :to="{ name: 'PropertyName', params }" class="step-title fr-link">
          {{ t('leftmenu.add-property') }}</router-link
        >
        <ul class="vline">
          <li>
            <router-link :to="{ name: 'PropertyName', params }" class="fr-link">
              <ColoredTag
                :text="propertyName ? propertyName : t('leftmenu.property-name')"
                :status="propertyName ? 'FILLED' : 'EMPTY'"
              ></ColoredTag>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'PropertyType', params }" class="fr-link">
              <ColoredTag :text="t('leftmenu.property-type')" :status="typeStatus"></ColoredTag>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'PropertyAddress', params }" class="fr-link">
              <ColoredTag
                :text="t('leftmenu.property-address')"
                :status="addressStatus"
              ></ColoredTag>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'PropertyFurniture', params }" class="fr-link">
              <ColoredTag
                :text="t('leftmenu.property-furniture')"
                :status="furnitureStatus"
              ></ColoredTag>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'PropertyLivingSpace', params }" class="fr-link">
              <ColoredTag
                :text="t('property-living-space')"
                :status="livingSpaceStatus"
              ></ColoredTag>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'PropertyRent', params }" class="fr-link">
              <ColoredTag
                :text="t('leftmenu.monthly-rent-and-charges')"
                :status="rentStatus"
              ></ColoredTag>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'PropertyDiagnostic', params }" class="fr-link">
              <ColoredTag :text="t('leftmenu.diagnostic')" :status="diagnosticStatus"></ColoredTag>
            </router-link>
          </li>
        </ul>
      </li>
      <li class="step">
        <router-link :to="{ name: 'ValidateProperty', params }" class="step-title fr-link">
          {{ t('leftmenu.validate-property') }}</router-link
        >
      </li>
    </ol>
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
  list-style: none;
  padding-left: 0;
  padding-block: 1rem;
  margin-block: 0;
  margin-left: 18px;
  border-left: 1px solid var(--g400-t);
  min-height: 25px;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  & li {
    margin-left: -1rem;
    padding-bottom: 0;
  }
}

.step {
  display: flex;
  flex-direction: column;
  counter-increment: step;
  position: relative;
  padding-bottom: 0;
}
.step::before {
  content: counter(step);
  position: absolute;
  left: 0;
  top: 5px;
  background-color: var(--primary);
  color: white;
  border: 1px solid var(--g400-t);
  border-radius: 50%;
  height: 2.25rem;
  width: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-title {
  margin-left: 2.75rem;
  margin-block: 0.8rem;
  color: var(--g800-plain);
  font-size: 14px;
  display: flex;
  width: fit-content;
  align-items: center;
}

[href] {
  box-shadow: none;
  background-image: none;
}

.fr-link {
  width: fit-content;
  color: var(--g800-plain);
  font-size: 14px;
}
</style>
