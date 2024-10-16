<template>
  <section class="background fr-pb-5w fr-mb-5w">
    <div class="fr-container">
      <div class="fr-col-md-8">
        <div class="fr-grid-col">
          <p class="fr-badge fr-badge--sm fr-mt-3w">
            {{ t('last-update', [getLastUpdateDate()]) }}
          </p>
          <h1 class="fr-h1 color--white fr-mt-3w" v-if="user">
            {{ t('file.title', [getName()]) }}
          </h1>
          <p class="text-bold color--white">
            {{ t('file.description', [getStatus(), getIncomeSum()]) }}
          </p>
          <slot></slot>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { FileUser } from 'df-shared-next/src/models/FileUser'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import { UtilsService } from '@/services/UtilsService'

const props = defineProps<{
  user: FileUser | null
}>()
const { t } = useI18n()

function getName() {
  if (props.user?.tenants === undefined) {
    return ''
  }
  if (props.user?.tenants.length === 2) {
    const userNames = props.user.tenants
      .map((o) => UtilsService.tenantFullName(o))
      .join(t('file.and').toString())
    return userNames
  }
  const userNames = props.user.tenants.map((o) => UtilsService.tenantFullName(o)).join(', ')
  return userNames
}

function getStatus() {
  if (props.user?.applicationType) {
    return t(props.user.applicationType)
  }
  return ''
}

function getIncomeSum() {
  if (props.user?.tenants) {
    let sum = 0
    for (const t of props.user.tenants) {
      const localsum = t.documents
        ?.filter((d: DfDocument) => {
          return d.documentCategory === 'FINANCIAL'
        })
        .reduce((sum, current) => sum + (current.monthlySum || 0), 0)
      sum += localsum || 0
    }
    if (sum === 0) {
      return t('file.no-income')
    }
    return t('file.income', [sum])
  }
}

function getLastUpdateDate() {
  return dayjs(props.user?.lastUpdateDate).format('D MMMM YYYY')
}
</script>

<style scoped lang="scss">
.background {
  width: 100%;
  top: 0;
  left: 0;
  background-size: cover !important;
  background-position: 50% 50% !important;
  background-image: url('../assets/cover-features.webp');
  z-index: 0;

  @media (max-width: 768px) {
    background-image: url('../assets/cover-features-mobile.webp');
  }
}
.root {
  width: 100%;
  background-color: var(--bf100-g750);
}
.without-padding {
  padding: 0;
}

.fr-tabs {
  background-color: var(--background-default-grey);
}

.fr-fi-icon-fc-right {
  flex-direction: row-reverse;

  &:before {
    content: '';
    background-color: transparent;
    background-image: url('../assets/images/icons/franceconnect-icon.png');
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    height: 21px;
    width: 24px;
    margin-left: 0.5rem;
  }
}

.icon-dgfip {
  height: 46px;
  margin-left: 2rem;
}
.not-found-container {
  width: 100vw;
  display: flex;
  justify-content: center;
}

.fr-badge {
  --text-default-grey: #fff;
  --background-contrast-grey: #1d2437;
}
</style>
