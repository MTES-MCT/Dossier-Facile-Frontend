<template>
  <NakedCard class="fr-p-md-5w">
    <h2 class="fr-h4">{{ t('partners-page.accesses.title') }}</h2>
    <div
      class="fr-table fr-table--bordered fr-table--no-caption fr-m-0 fr-table--layout-fixed desktop"
    >
      <table>
        <caption>
          {{
            t('partners-page.accesses.title')
          }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ t('partners-page.accesses.date') }}</th>
            <th scope="col" colspan="4">{{ t('partners-page.accesses.partner') }}</th>
            <th scope="col">{{ t('partners-page.accesses.action') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="access in accesses" :key="access.id">
            <td>{{ formatDate(access.accessGrantedDate) }}</td>
            <td colspan="4" class="wrap">{{ access.name }}</td>
            <td>
              <Button @click="revokingAccess = access">
                {{ t('partners-page.accesses.revoke') }}
              </Button>
            </td>
          </tr>
          <tr v-if="accesses.length === 0">
            <td colspan="6" style="text-align: center">
              {{ t('partners-page.accesses.no-access') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mobile">
      <ul v-for="access in accesses" :key="access.id" class="fr-p-0">
        <li class="fr-grid-row file-list-item fr-p-3w">
          <div class="fr-col-5">
            {{ formatDate(access.accessGrantedDate) }}
          </div>
          <div class="fr-col-9 bold mail-container">{{ access.name }}</div>
          <div class="fr-col-12">
            <ul class="fr-btns-group">
              <li>
                <Button class="fr-btn--tertiary" @click="revokingAccess = access">
                  {{ t('partners-page.accesses.revoke') }}
                </Button>
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <div v-if="accesses.length === 0" style="text-align: center">
        {{ t('partners-page.accesses.no-access') }}
      </div>
    </div>
  </NakedCard>
  <ConfirmModal
    v-if="revokingAccess !== undefined"
    :title="t('partners-page.revoke-modal.title')"
    :validate-btn-text="t('partners-page.revoke-modal.validate')"
    :cancel-btn-text="t('partners-page.revoke-modal.cancel')"
    @valid="revoke(revokingAccess)"
    @cancel="revokingAccess = undefined"
  >
    <p>
      {{ t('partners-page.revoke-modal.p1', { partner: revokingAccess?.name }) }}
    </p>
    <p>
      {{ t('partners-page.revoke-modal.p2', { partner: revokingAccess?.name }) }}
    </p>
  </ConfirmModal>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import Button from 'df-shared-next/src/Button/DfButton.vue'
import dayjs from 'dayjs'
import { useTenantStore } from '@/stores/tenant-store'
import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PartnerAccess } from 'df-shared-next/src/models/PartnerAccess'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'

const store = useTenantStore()
const accesses = computed(() => store.partnerAccesses)
const { t } = useI18n()
const revokingAccess: Ref<PartnerAccess | undefined> = ref(undefined)

/*
TODO
- Utiliser modales design system
- Afficher les logos (passer en cartes ? cc Michael)
- Filtrer dfconnect-proprietaire de la liste ?
- Vérifier que la ligne disparait après révocation (même pb sur /applications)

- Recup historique dates via keycloak si besoin
 */
function revoke(access: PartnerAccess) {
  store.revokePartnerAccess(access)
  revokingAccess.value = undefined
}

function formatDate(date: string | undefined) {
  if (date === undefined || date === '') {
    return t('partners-page.accesses.default-date')
  }
  return t('partners-page.accesses.since-date') + dayjs(date).format('D MMM YYYY')
}
</script>

<style scoped lang="scss">
.wrap {
  word-wrap: break-word;
}

.file-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-style: solid;
  border-width: thin;
  border-radius: 0.25rem;
  border-color: var(--grey-900-175);
  min-height: 4rem;

  &.disabled {
    background-color: var(--background-alt-grey);
    border-style: none;
  }
}

.mail-container {
  padding-right: 1rem;
  word-wrap: break-word;
}

.right {
  display: flex;
  flex-direction: row-reverse;
}
</style>
