<template>
  <NakedCard class="fr-p-md-5w">
    <h2 class="fr-h4">{{ t('sharing-page.shared-links.title') }}</h2>

    <div class="fr-table fr-table--bordered fr-table--no-caption fr-m-0 desktop">
      <table>
        <caption>
          {{
            t('sharing-page.shared-links.title')
          }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ t('sharing-page.shared-links.date') }}</th>
            <th scope="col" colspan="2">{{ t('sharing-page.shared-links.contact') }}</th>
            <th scope="col">{{ t('sharing-page.shared-links.application-type') }}</th>
            <th scope="col">{{ t('sharing-page.shared-links.last-visit') }}</th>
            <th scope="col">{{ t('sharing-page.shared-links.link-status') }}</th>
            <th scope="col">{{ t('sharing-page.shared-links.action') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="link in links"
            :key="link.id"
            :class="link.enabled ? '' : 'fr-label--disabled'"
          >
            <td>{{ formatDate(link.creationDate) }}</td>
            <td colspan="2" class="wrap">{{ link.ownerEmail }}</td>
            <td>
              <span v-if="link.fullData">
                {{ t('sharefile.full') }}
              </span>
              <span v-else class="fr-label--disabled">
                {{ t('sharefile.resume') }}
              </span>
            </td>
            <td class="wrap">
              {{ formatDateRelativeToNow(link.lastVisit) }}
            </td>
            <td class="fr-p-0" style="display: flex; justify-content: center">
              <Toggle
                :id="link.id || 0"
                :value="link.enabled || false"
                :checked-label="t('sharing-page.shared-links.enabled')"
                :unchecked-label="t('sharing-page.shared-links.disabled')"
                @update="updateSharedLinkStatus(link, $event)"
              />
            </td>
            <td>
              <div>
                <Button class="fr-mr-2w" @click="deleteSharedLink(link)">
                  {{ t('sharing-page.shared-links.delete') }}
                </Button>
                <Button :disabled="!link.enabled" @click="resendLink(link, $event.currentTarget)">
                  {{ t('sharing-page.shared-links.resend') }}
                </Button>
              </div>
            </td>
          </tr>
          <tr v-if="links.length === 0">
            <td colspan="7" style="text-align: center">
              {{ t('sharing-page.shared-links.no-shared-file') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mobile">
      <ul
        v-for="link in links"
        :key="link.id"
        class="fr-p-0"
        :class="link.enabled ? '' : 'fr-label--disabled'"
      >
        <li class="fr-grid-row file-list-item fr-p-3w">
          <div class="fr-col-5">
            {{ formatDate(link.creationDate) }}
          </div>
          <div class="fr-col-7 align--right">
            <ColoredTag
              :hide-icon="true"
              :text="link.fullData ? t('sharefile.full') : t('sharefile.resume')"
              :status="'grey'"
              :active="link.enabled"
            ></ColoredTag>
          </div>
          <div class="fr-col-9 bold mail-container">{{ link.ownerEmail }}</div>
          <div class="fr-col-3 right">
            <Toggle
              :id="'m' + (link.id || 0)"
              class="fr-toggle--label-left"
              :value="link.enabled || false"
              :checked-label="t('sharing-page.shared-links.enabled')"
              :unchecked-label="t('sharing-page.shared-links.disabled')"
              @update="updateSharedLinkStatus(link, $event)"
            />
          </div>
          <div class="fr-col-12 small-text">
            {{ t('sharefile.lastvisit') }}
            {{ formatDateRelativeToNow(link.lastVisit) }}
          </div>
          <div class="fr-col-12">
            <ul class="fr-btns-group">
              <li>
                <Button class="fr-btn--tertiary" @click="deleteSharedLink(link)">
                  {{ t('sharing-page.shared-links.delete') }}
                </Button>
              </li>
              <li>
                <Button
                  :disabled="!link.enabled"
                  class="fr-btn--tertiary"
                  @click="resendLink(link, $event.currentTarget)"
                >
                  {{ t('sharing-page.shared-links.resend') }}
                </Button>
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <div v-if="links.length === 0" style="text-align: center">
        {{ t('sharing-page.shared-links.no-shared-file') }}
      </div>
    </div>
  </NakedCard>
</template>

<script setup lang="ts">
import { isAxiosError } from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Button from 'df-shared-next/src/Button/DfButton.vue'
import ColoredTag from 'df-shared-next/src/components/ColoredTag.vue'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import Toggle from 'df-shared-next/src/components/ToggleComponent.vue'
import type { ApartmentSharingLink } from 'df-shared-next/src/models/ApartmentSharingLink'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTenantStore } from '../stores/tenant-store'
import { toast } from '@/components/toast/toastUtils'

const store = useTenantStore()
const links = computed(() => store.apartmentSharingLinks)
const { t } = useI18n()
dayjs.extend(relativeTime)

function deleteSharedLink(link: ApartmentSharingLink) {
  store.deleteApartmentSharingLink(link)
}
function resendLink(link: ApartmentSharingLink, button: HTMLElement) {
  store
    .resendApartmentSharingLink(link)
    .then(() => {
      toast.success(t('sharing-page.shared-links.resend-success'), button)
    })
    .catch((e) => {
      if (isAxiosError(e) && e.status === 429) {
        toast.error(t('sharing-page.shared-links.resend-too-many'), button)
        return
      }
      toast.error(t('sharing-page.shared-links.resend-failed'), button)
    })
}

function updateSharedLinkStatus(link: ApartmentSharingLink, toggleElt: HTMLInputElement) {
  const enabled = toggleElt.checked
  store
    .updateApartmentSharingLinkStatus(link, enabled)
    .then(() => {
      const messageKey = enabled ? 'sharing-page.shared' : 'sharing-page.disabled'
      toast.success(t(messageKey), toggleElt)
    })
    .catch(() => {
      const messageKey = enabled ? 'enable-failed' : 'disable-failed'
      toast.error(t(`sharing-page.shared-links.${messageKey}`), toggleElt)
    })
}

function formatDate(date: string | undefined) {
  if (date === undefined) {
    return ''
  }
  return dayjs(date).format('D MMM YYYY')
}

function formatDateRelativeToNow(date: string | undefined) {
  if (date === undefined) {
    return t('sharing-page.shared-links.never')
  }
  const relativeDate = dayjs(date).fromNow()
  return capitalizeFirstLetter(relativeDate)
}

function capitalizeFirstLetter(str: string) {
  const firstLetter = str.at(0)?.toUpperCase()
  return firstLetter + str.substring(1)
}
</script>

<style scoped lang="scss">
.wrap {
  word-wrap: break-word;
}
.desktop table {
  display: table;
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
