<template>
  <ProfileContainer :step="2">
    <div class="fr-mb-15w">
      <router-view v-slot="{ Component }">
        <component :is="Component" @on-back="goBack" @on-next="goNext"> </component>
      </router-view>
    </div>
  </ProfileContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProfileContainer from '../components/ProfileContainer.vue'
import { AnalyticsService } from '../services/AnalyticsService'
import useTenantStore from '../stores/tenant-store'
import { TENANT_COMPONENTS } from '@/components/editmenu/documents/DocumentType'

const store = useTenantStore()
const user = computed(() => store.user)
const router = useRouter()
const route = useRoute()

const routeNames = Object.values(TENANT_COMPONENTS)

function goToGuarantor() {
  AnalyticsService.validateFunnel()
  if (user.value.guarantors.length > 0) {
    router.push({
      name: 'GuarantorList'
    })
    return
  }
  router.push({
    name: 'GuarantorChoice'
  })
}

function goBack() {
  const substep = routeNames.indexOf(route.name?.toString() || '')
  if (substep === -1 || substep === 0) {
    router.push({ name: 'TenantType' })
  } else {
    router.push({ name: routeNames[substep - 1] })
  }
}

function goNext() {
  const substep = routeNames.indexOf(route.name?.toString() || '')
  if (substep === -1 || substep + 1 === routeNames.length) {
    goToGuarantor()
  } else {
    router.push({ name: routeNames[substep + 1] })
  }
}
</script>

<style scoped lang="scss">
@import 'df-shared-next/src/scss/_variables.scss';

h2 {
  font-size: 1rem;
  margin: 0.5rem;
  display: inline-block;
  align-self: center;
  line-height: 1.5rem;
}

.icon {
  align-self: center;
}

.document-title {
  border: 1px solid #ececec;
  border-radius: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  display: flex;
}

.selected {
  background-color: $secondary;
}

.check {
  padding: 0.5rem;
  margin-left: auto;
  color: green;
}

.title-bar {
  display: flex;
  align-items: center;

  span {
    padding: 0.5rem;
    line-height: 1rem;
  }
}
</style>
