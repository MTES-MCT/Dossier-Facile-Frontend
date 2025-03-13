<template>
  <div class="bg-blue">
    <div class="fr-container">
      <h1 class="fr-mt-3w fr-mb-2w fr-ml-2w fr-ml-md-0">{{ t('menu.messaging') }}</h1>
      <section v-if="user.applicationType === 'COUPLE'" class="fr-mt-5w fr-mb-3w">
        <div class="fr-tabs">
          <ul class="fr-tabs__list" role="tablist" aria-label="tab-list">
            <li v-for="(tenant, k) in tenants" :key="`li${k}`" role="presentation">
              <button
                :id="`tabpanel-${k}`"
                class="fr-tabs__tab fr-tabs__tab--icon-right"
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
            v-for="(tenant, k) in tenants"
            :id="`tabpanel-${k}-panel`"
            :key="`t${k}`"
            class="fr-tabs__panel"
            aria-selected="false"
            role="tabpanel"
            :tabindex="k"
          >
            <MessagesPanel :tenant="tenant" :is-cotenant="tenant.id != user.id" />
          </div>
        </div>
      </section>
      <div v-else class="bg-white">
        <MessagesPanel :tenant="user" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MessagesPanel from '@/components/messaging/MessagesPanel.vue'
import { useTenantStore } from '@/stores/tenant-store'
import { computed, onMounted, ref } from 'vue'
import { UtilsService } from '@/services/UtilsService'
import { useI18n } from 'vue-i18n'

const store = useTenantStore()
const { t } = useI18n()
const user = computed(() => store.user)

const tabIndex = ref(0)

onMounted(() => {
  markMessagesAsRead(user.value.id)
})

function markMessagesAsRead(tenantId: number) {
  store.readMessages(tenantId)
}

const tenants = computed(() => [
  user.value,
  ...user.value.apartmentSharing.tenants.filter((t) => t.id !== user.value.id)
])
</script>

<style scoped>
.fr-tabs::before {
  background: var(--grey-1000-50);
}
.bg-white {
  background: var(--grey-1000-50);
  border: 1px solid #ddd;
  padding: 1rem;
}
.fr-container {
  padding: 0;
}
@media (min-width: 48rem) {
  .fr-container {
    padding: 0 1rem;
  }
  .bg-white {
    padding: 2rem;
  }
}
</style>
