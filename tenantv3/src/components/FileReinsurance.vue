<template>
  <div>
    <span class="fr-h5 fr-mr-3w">{{ t('filereinsurance.title-dossier-' + dossierStatus) }}</span
    ><a
      href="https://www.dossierfacile.fr"
      :title="`${t('fileinsurance.know-more')} - ${t('new-window')}`"
      target="_blank"
      rel="noreferrer"
      >{{ t('filereinsurance.know-more') }}</a
    >
    <div class="fr-grid-row fr-grid-row--gutters fr-mt-3w">
      <div class="fr-col-12 fr-col-md-3">
        <NakedCard class="h-100">
          <RiCheckboxCircleLine
            v-if="dossierStatus === 'VALIDATED'"
            class="text-success"
            aria-hidden="true"
          />
          <RiTimeFill
            v-else-if="dossierStatus === 'TO_PROCESS'"
            class="fr-mb-2w bloc-warning-icon status-toprocess"
          />
          <RiCloseCircleFill
            v-else
            class="fr-mb-2w bloc-warning-icon status-incomplete"
            aria-hidden="true"
          />

          <p>{{ t('filereinsurance.documents-' + dossierStatus) }}</p>
        </NakedCard>
      </div>
      <div class="fr-col-12 fr-col-md-3">
        <NakedCard class="h-100">
          <RiCheckboxCircleLine
            v-if="dossierStatus === 'VALIDATED'"
            class="text-success"
            aria-hidden="true"
          />
          <RiTimeFill
            v-else-if="dossierStatus === 'TO_PROCESS'"
            class="fr-mb-2w bloc-warning-icon status-toprocess"
            aria-hidden="true"
          />
          <RiCloseCircleFill
            v-else
            class="fr-mb-2w bloc-warning-icon status-incomplete"
            aria-hidden="true"
          />
          <p>{{ t('filereinsurance.file-' + dossierStatus) }}</p>
        </NakedCard>
      </div>
      <div v-if="taxChecked" class="fr-col-12 fr-col-md-3">
        <NakedCard class="h-100 fc">
          <div class="card-logo-container">
            <img src="../assets/images/icons/dgfip-icon.png" alt="Logo DGFIP" class="icon-dgfip" />
          </div>
          <p>
            {{ t('filereinsurance.tax-checked') }}
          </p>
        </NakedCard>
      </div>
      <div v-if="franceConnectTenantCount > 0" class="fr-col-12 fr-col-md-3">
        <NakedCard class="h-100 fc">
          <div class="fr-mb-0-5w icon-fc text-fc blue-text">FranceConnect</div>
          <p v-if="tenantCount === 1">
            {{ t('filereinsurance.france-connect-user') }}
          </p>
          <p v-else-if="franceConnectTenantCount === tenantCount">
            {{ t('filereinsurance.france-connect-user-all') }}
          </p>
          <p v-else>
            {{ t('filereinsurance.france-connect-user-partial', [franceConnectTenantCount]) }}
          </p>
        </NakedCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RiCheckboxCircleLine, RiCloseCircleFill, RiTimeFill } from '@remixicon/vue'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

withDefaults(
  defineProps<{
    dossierStatus?: string
    taxDocumentStatus?: string
    franceConnectTenantCount?: number
    tenantCount?: number
    taxChecked?: boolean
  }>(),
  {
    dossierStatus: 'VALIDATED',
    taxDocumentStatus: 'VALIDATED',
    franceConnectTenantCount: 0,
    tenantCount: 0,
    taxChecked: false
  }
)
</script>

<style scoped lang="scss">
.text-green {
  color: green;
}

.h-100 {
  height: 100%;
  &.fc {
    background-color: var(--bf200-bf300);
  }
}
.bloc-warning-icon {
  height: 44px;
  width: 44px;
  padding: 8px;
  border-style: solid;
  border-width: 1px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  &.status-incomplete {
    color: var(--error-425-625);
    background-color: var(--brown-cafe-creme-975-75);
  }
  &.status-toprocess {
    color: var(--purple-text);
    background-color: var(--purple-background);
  }
}

.icon-fc {
  font-size: 20px;
  &:before {
    content: url('../assets/images/icons/franceconnect-icon.png');
    padding: 0 10px 0 0;
    vertical-align: calc(50% - 30px);
  }
}

.icon-dgfip {
  margin: auto;
  height: 50px;
}

.card-logo-container {
  height: 55px;
}
</style>
