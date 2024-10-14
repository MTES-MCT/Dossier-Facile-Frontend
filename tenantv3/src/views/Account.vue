<template>
  <div class="bg-blue">
    <div class="fr-container">
      <section class="fr-mt-3w">
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12">
            <div class="fr-mb-3w" v-if="isAnnouncementVisible">
              <FakeAnnouncement></FakeAnnouncement>
            </div>
            <h1
              v-html="
                t(`account.title.${getApplicationType()}`, [
                  getFirstName(),
                  t(`account.${getGlobalStatus()}`)
                ])
              "
            ></h1>
            <div v-if="isDenied() || user.status === 'TO_PROCESS'">
              <div class="fr-grid-row fr-grid-row--gutters">
                <div class="fr-col" v-if="isDenied()">
                  <div class="fr-callout warning fr-callout-white">
                    <h2 class="fr-m-1w fr-text-title--grey fr-h4">
                      {{ t('account.amendment-required-title') }}
                    </h2>
                    <p
                      class="fr-m-1w fr-callout__text"
                      v-html="t('account.amendment-required-text')"
                    ></p>
                    <DfButton class="fr-m-1w" @on-click="goToMessaging" :primary="true">{{
                      t('account.messaging')
                    }}</DfButton>
                  </div>
                </div>
                <div class="fr-col" v-if="user.status === 'TO_PROCESS'">
                  <div class="fr-callout to-process fr-callout-white fr-mb-3w">
                    <div class="fr-mb-1w fr-grid-row fr-grid-row--gutters fr-grid-row--center">
                      <div class="fr-col-12 fr-col-md-6">
                        <h2 class="fr-h4 fr-mb-0">
                          <i
                            aria-hidden="true"
                            class="text-to-process ri-time-line fs-28"
                            style="font-size: 18px"
                          ></i>
                          &nbsp;<span>{{ t('account.processing-bloc.title') }}</span>
                        </h2>
                      </div>
                      <div class="fr-col-12 fr-col-md-6 badge-container">
                        <p class="fr-badge fr-badge--purple-glycine">{{ processBadgeText }}</p>
                      </div>
                    </div>
                    <div>
                      <p>{{ t('account.processing-bloc.text') }}</p>
                    </div>
                    <div class="fr-text--bold fr-my-2w">
                      {{ processBlocDelayText }}
                    </div>
                    <div>
                      <p
                        class="small-text"
                        v-html="t('account.processing-bloc.last-update', [lastModifiedDate()])"
                      ></p>
                    </div>
                  </div>
                </div>
                <div class="fr-col-12 fr-col-lg-4">
                  <div class="fr-callout warning fr-callout-white">
                    <ColoredTag
                      class="fr-m-1w"
                      :status="'DECLINED'"
                      :text="t('account.denied')"
                    ></ColoredTag>
                    <h2 class="fr-m-1w fr-text-title--grey fr-h4">
                      {{ t('account.download-not-validated-title') }}
                    </h2>
                    <p
                      class="fr-m-1w fr-callout__text"
                      v-html="t('account.download-not-validated-text')"
                    ></p>
                    <a
                      href="#"
                      :title="t('account.download-not-validated-title')"
                      class="float--right"
                      @click="downloadZip"
                      >{{ t('account.download-zip') }}
                      <i class="ri-download-line" style="font-size: 18px"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="fr-callout fr-callout-white" v-if="canCopyLink()">
              <h2 class="fr-text-title--grey fr-h4">
                {{ t('account.congratulations-title') }}
              </h2>
              <p>
                {{ t('account.congratulations-text-1') }}
                <br />
                <strong>
                  {{ t('account.congratulations-text-2') }}
                </strong>
              </p>
              <router-link to="/applications">
                <DfButton :primary="true">
                  {{ t('account.application-page-redirection') }}
                </DfButton>
              </router-link>
            </div>

            <div class="fr-mt-3w fr-p-0w">
              <section v-if="user.applicationType !== 'ALONE'" class="fr-m-0 fr-p-0 bg-white">
                <div class="fr-tabs account-tabs">
                  <ul class="fr-tabs__list fr-p-0" role="tablist" aria-label="tab-list">
                    <li
                      v-for="(tenant, k) in getTenants()"
                      v-bind:key="`li${k}`"
                      role="presentation"
                    >
                      <button
                        class="fr-tabs__tab fr-container--fluid"
                        :id="`tabpanel-${k}`"
                        :tabindex="tabIndex === k ? 0 : -1"
                        role="tab"
                        aria-selected="false"
                        :aria-controls="`tabpanel-${k}-panel`"
                      >
                        <div class="fr-grid-row">
                          <div class="name fr-col-xs-12 fr-col fr-mr-1w">
                            {{ UtilsService.tenantFullName(tenant) }}
                            <span
                              :class="{
                                'fr-fi-icon-fc': tenant.franceConnect
                              }"
                            ></span>
                          </div>
                          <ColoredBadge
                            class="fr-col-xs-12 fr-col"
                            :status="tenant.status"
                            :warn="true"
                            :text="t(`dossier.warn-${tenant.status}`)"
                          >
                          </ColoredBadge>
                        </div>
                      </button>
                    </li>
                  </ul>
                  <div
                    v-for="(tenant, k) in getTenants()"
                    v-bind:key="`t${k}`"
                    :id="`tabpanel-${k}-panel`"
                    class="fr-tabs__panel"
                    role="tabpanel"
                    :tabindex="k"
                  >
                    <TenantPanel
                      class="panel"
                      :tenant="tenant"
                      :isCotenant="tenant.id != user.id"
                      :isCouple="user.applicationType === 'COUPLE'"
                    />
                  </div>
                </div>
              </section>
              <TenantPanel v-else :tenant="user" class="fr-p-4w bg-white" :isCotenant="false" />
            </div>
            <PartnersSection />

            <div class="delete">
              <div class="bg-white fr-p-4w fr-mt-3w">
                <h3>{{ t('account.delete-bloc.title') }}</h3>
                <p>{{ t('account.delete-bloc.content') }}</p>
                <div class="align--center">
                  <DfButton
                    data-fr-opened="false"
                    aria-controls="modal-delete-account"
                    style="visibility: none"
                    >{{ t('account.delete-bloc.button') }}</DfButton
                  >
                </div>
              </div>
            </div>
            <div class="opinion fr-mb-5w fr-mt-3w">
              <div class="bg-white fr-p-4w fr-pt-4w">
                <h3>{{ t('account.opinion-bloc.title') }}</h3>
                <p>{{ t('account.opinion-bloc.content') }}</p>
                <div class="align--center">
                  <a
                    class="cleana"
                    href="https://voxusagers.numerique.gouv.fr/Demarches/2871?&view-mode=formulaire-avis&nd_mode=en-ligne-enti%C3%A8rement&nd_source=button&key=f2f9b35326f6b085c219faef71d0a3f2"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src="../assets/button-je-donne-mon-avis.svg"
                      alt="Je donne mon avis"
                      title="Je donne mon avis sur cette démarche"
                      class="align--center"
                    />
                  </a>
                </div>
                <p class="fr-mt-3w" v-html="t('account.opinion-bloc.warning')"></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User } from 'df-shared-next/src/models/User'
import DfButton from 'df-shared-next/src/Button/Button.vue'
import ColoredTag from 'df-shared-next/src/components/ColoredTag.vue'
import ColoredBadge from 'df-shared-next/src/components/ColoredBadge.vue'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import FakeAnnouncement from '../components/FakeAnnouncement.vue'
import PartnersSection from '../components/account/PartnersSection.vue'
import { UtilsService } from '../services/UtilsService'
import TenantPanel from '../components/account/TenantPanel.vue'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import useTenantStore from '../stores/tenant-store'
import { useRouter } from 'vue-router'
import { ProfileService } from '../services/ProfileService'
import { ToastService } from '../services/ToastService'
import dayjs, { Dayjs } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const FORCE_FAKE_ANNOUNCEMENT_VISIBILITY =
  import.meta.env.VITE_FORCE_ANNOUNCEMENT_VISIBILITY || false
const PROCESSING_TIME_DELTA = import.meta.env.VITE_PROCESSING_TIME_DELTA || 3
const isAnnouncementVisible = ref(false)
const store = useTenantStore()
const user = computed(() => store.user)
const tabIndex = ref(0)
const router = useRouter()
dayjs.extend(relativeTime)
const expectedDate = ref<Dayjs | null>(null)

onMounted(() => {
  window.Beacon('init', 'd949ac15-a9eb-4316-b0c5-f92cecc7118f')
  const today = new Date()
  if (
    (today.getMonth() >= 5 && today.getMonth() <= 8) ||
    FORCE_FAKE_ANNOUNCEMENT_VISIBILITY === 'true'
  ) {
    isAnnouncementVisible.value = true
  }
})

onBeforeUnmount(() => {
  window.Beacon('destroy')
})

watch(
  () => user.value,
  (tenant) => {
    if (tenant && tenant.id) {
      loadExpectedProcessingTime(tenant.id)
    }
  },
  { immediate: true }
)

function loadExpectedProcessingTime(tenantId: number) {
  ProfileService.getExpectedProcessingTime(tenantId).then((response) => {
    if (response && response.data) {
      expectedDate.value = dayjs(response.data)
    }
  })
}

const processBadgeText = computed(() => {
  if (expectedDate.value && expectedDate.value != null) {
    const currentDate = dayjs()
    const delayFrom = expectedDate.value.diff(currentDate, 'hour')
    const delayTo = delayFrom + PROCESSING_TIME_DELTA

    return t('account.processing-bloc.badge', [delayFrom, delayTo])
  }
  return t('account.processing-bloc.badge-undefined')
})

const processBlocDelayText = computed(() => {
  if (expectedDate.value && expectedDate.value != null) {
    const processFromDate = dayjs(expectedDate.value)
    const processToDate = dayjs(expectedDate.value).add(PROCESSING_TIME_DELTA, 'hour')

    if (dayjs(processFromDate).isSame(dayjs(processToDate), 'day')) {
      return t('account.processing-bloc.delay', [
        processFromDate.format('D MMMM'),
        processFromDate.format('HH[h]mm'),
        processToDate.format('HH[h]mm')
      ])
    }
    return t('account.processing-bloc.delay-on-2days', [
      processFromDate.format('DD/MM à HH[h]mm'),
      processToDate.format('DD/MM à HH[h]mm')
    ])
  }
  return t('account.processing-bloc.delay-undefined')
})

function lastModifiedDate(): string {
  return dayjs(user.value.lastUpdateDate).format('D MMMM YYYY à HH[h]mm')
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

function downloadZip() {
  ProfileService.downloadZip()
    .then((response) => {
      const blob = new Blob([response.data], { type: 'application/zip' })
      const link = window.document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = 'dossierFacile.zip'
      link.click()
    })
    .catch((error) => {
      console.error(error)
      ToastService.error()
    })
}

function goToMessaging() {
  router.push('/messaging')
}

function getFirstName() {
  return UtilsService.capitalize(user.value.firstName || '')
}

function canCopyLink() {
  return UtilsService.canShareFile(user.value)
}

function isDenied() {
  return (
    user.value.documents?.find((d) => {
      return d.documentStatus === 'DECLINED'
    }) !== undefined ||
    user.value.guarantors?.find((g: Guarantor) => {
      return (
        g.documents?.find((d) => {
          return d.documentStatus === 'DECLINED'
        }) !== undefined
      )
    })
  )
}

function getGlobalStatus(): string {
  return user.value.apartmentSharing?.status as string | 'INCOMPLETE'
}

function getApplicationType() {
  switch (user.value.applicationType) {
    case 'COUPLE':
      return 'couple'
    case 'GROUP':
      return 'group'
  }
  return 'alone'
}
</script>

<style scoped lang="scss">
.fr-callout-white {
  background-color: var(--background-default-grey);
  &.warning {
    box-shadow: inset 0.25rem 0 0 0 var(--error) !important;
  }
  &.to-process {
    box-shadow: inset 0.25rem 0 0 0 var(--purple-glycine-main-494) !important;
  }
}

h1 {
  font-size: 2rem;
}

.align--center {
  text-align: center;
  margin: auto;
}

.bg-white {
  box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);
  background: var(--grey-1000-50);
}
.account-tabs {
  > ul {
    background-color: var(--blue-france-200);
    > li > button.fr-tabs__tab {
      &:not([aria-selected='true']) {
        background-color: #f2f2f9;
      }
      .name {
        text-align: left;
        padding-left: 0.5rem;
      }
      .fr-tag {
        font-weight: normal;
      }
    }
  }
}
.panel {
  @media (max-width: 706px) {
    padding-top: 1rem;
  }
}

.grp {
  display: block;
  position: relative;
}

.grp-btn {
  border-left: 1px solid var(--background-default-grey);
  position: relative;
}

.grp-modal {
  position: absolute;
  border-radius: 5px;
  right: 0;
  left: auto;
  z-index: 2;
  padding: 1rem;
  width: 330px;

  @media all and (max-width: 768px) {
    max-width: 300px;
  }

  &:before {
    top: -16px;
    right: 9px;
    left: auto;
    border: 8px solid transparent;
    border-bottom: 8px solid var(--color-border-overlay);
    position: absolute;
    display: inline-block;
    content: '';
  }
}

.copy-btn {
  max-width: 100%;
  > button {
    width: 100%;
    text-align: justify;
    border-radius: 0.25rem;
    padding: 1rem;
    font-size: 1rem;
    box-shadow: 0 0.5px 4px 0 #cecece;
    border: 1px solid transparent;

    -webkit-transition: all 0.5s linear;
    -moz-transition: all 0.5s linear;
    -o-transition: all 0.5s linear;
    transition: all 0.5s linear;

    &:hover {
      border: 1px solid var(--primary);
      box-shadow: 0 0.5px 4px 0 transparent;
      background-image: none;
    }

    &.copied {
      color: var(--primary);
      background-color: var(--background-action-low-blue-france);
      border: 1px solid var(--primary);
      box-shadow: 0 0.5px 4px 0 transparent;
      -webkit-transition: all 0.5s linear;
      -moz-transition: all 0.5s linear;
      -o-transition: all 0.5s linear;
      transition: all 0.5s linear;
    }
  }
}

p {
  word-break: break-word;
}

.edit-btn {
  position: absolute;
  right: 0;
  top: 0;

  box-shadow: none;
}

.description:first-letter {
  text-transform: uppercase;
}

hr {
  border: 0;
  margin-left: 20%;
  margin-right: 20%;
  border-top: 1px solid var(--g400);
}

.fr-tile__body {
  overflow: auto;
}

.cleana {
  &:after {
    content: none;
  }
  &:focus {
    outline-style: auto;
    outline-width: 2px;
    outline-offset: 4px;
    outline-color: #0a76f6;
  }
}

.alert-container {
  display: flex;
  flex-direction: row-reverse;
}

.name-email-tile {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dflex {
  display: flex;
  align-items: center;
}

.mobile-margin {
  @media all and (max-width: 768px) {
    margin-bottom: 1rem;
  }
}

.btn-container {
  margin-left: auto;

  @media all and (max-width: 600px) {
    width: 100%;
  }
}

.share-file-description {
  max-width: fit-content;
}

.fr-fi-icon-fc {
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

.badge-container {
  @media (min-width: 768px) {
    text-align: right;
  }
}
</style>
