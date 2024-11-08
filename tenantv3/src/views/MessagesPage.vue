<template>
  <div class="fr-container">
    <section v-if="user.applicationType === 'COUPLE'" class="fr-mt-5w fr-mb-3w">
      <div class="fr-tabs">
        <ul class="fr-tabs__list" role="tablist" aria-label="tab-list">
          <li v-for="(tenant, k) in getTenants()" v-bind:key="`li${k}`" role="presentation">
            <button
              class="fr-tabs__tab fr-tabs__tab--icon-right"
              :id="`tabpanel-${k}`"
              :tabindex="tabIndex === k ? 0 : -1"
              role="tab"
              aria-selected="false"
              :aria-controls="`tabpanel-${k}-panel`"
              @click="markMessagesAsRead(tenant.id)"
            >
              {{ UtilsService.tenantFullName(tenant) }}
            </button>
          </li>
        </ul>
        <div
          v-for="(tenant, k) in getTenants()"
          v-bind:key="`t${k}`"
          :id="`tabpanel-${k}-panel`"
          class="fr-tabs__panel"
          aria-selected="false"
          role="tabpanel"
          :tabindex="k"
        >
          <MessagesPanel :tenant="tenant" :isCotenant="tenant.id != user.id" />
        </div>
      </div>
    </section>
    <MessagesPanel v-else :tenant="user" />
  </div>
</template>

<script setup lang="ts">
import { User } from 'df-shared-next/src/models/User'

import MessagesPanel from '../components/MessagesPanel.vue'
import useTenantStore from '@/stores/tenant-store'
import { computed, onMounted, ref } from 'vue'
import { UtilsService } from '@/services/UtilsService'

const store = useTenantStore()
const user = computed(() => store.user)

const tabIndex = ref(0)

onMounted(() => {
  markMessagesAsRead(user.value.id)
})

function markMessagesAsRead(tenantId: number) {
  store.readMessages(tenantId)
}

function getTenants() {
  const tenants: User[] = []
  tenants.push(user.value)

  user.value?.apartmentSharing?.tenants?.forEach((t) => {
    if (t.id != user.value.id) {
      tenants.push(t)
    }
  })

  return tenants
}
</script>
