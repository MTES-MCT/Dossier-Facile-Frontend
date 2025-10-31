<template>
  <div>
    <div class="display--flex align-items--center fr-px-2w fr-py-1w wrap">
      <slot :id="`cbl-${link.id}`"></slot>
      <div class="fr-ml-2w">
        <label :for="`cbl-${link.id}`" class="fr-mb-1v display--flex align-items--center">
          <RiLinksLine
            v-if="link.type === 'LINK'"
            size="1rem"
            class="blue-text"
            title="Partage par lien"
          />
          <RiMailLine
            v-else-if="link.type === 'MAIL'"
            size="1rem"
            class="blue-text"
            title="Partage par email"
          />
          <RiHome4Line
            v-else-if="link.type === 'OWNER'"
            size="1rem"
            class="blue-text"
            title="Propriétaire DossierFacile"
          />
          <RiShakeHandsLine
            v-else-if="link.type === 'PARTNER'"
            size="1rem"
            class="blue-text"
            title="Partenaire"
          />
          <span v-if="link.type === 'PARTNER'" class="fr-ml-1v">Partage avec</span>
          <span class="fr-ml-1v bold">
            {{ link.title }}
          </span>
          <span v-if="link.type === 'MAIL'" class="fr-ml-1v">- {{ link.ownerEmail }}</span>
        </label>
        <p class="fr-mb-0 fr-text--xs text-grey">
          <span class="bold">{{ t('created') }}</span>
          <span>{{ formatDate(link.creationDate) }}</span>
          <span class="bold border-left">{{ t('expires') }}</span>
          <span>{{ formatDate(link.expirationDate) }}</span>
          <span class="bold border-left">{{ t('consultations') }}</span>
          <span>{{ t('times', [link.nbVisits]) }}</span>
        </p>
      </div>
      <DsfrBadge
        v-if="link.enabled"
        :label="t('active-sharing')"
        type="success"
        small
        class="fr-mx-auto"
      />
      <p v-else class="fr-badge fr-badge--sm fr-badge--new fr-badge--no-icon fr-mx-auto">
        <RiPauseCircleFill aria-hidden="true" size="1em" class="fr-mr-1v" />
        <span>{{ t('disabled-sharing') }}</span>
      </p>
      <button type="button" class="link-button blue-text" @click="expanded = !expanded">
        {{ expanded ? t('show-less') : t('show-all') }}
        <RiSubtractLine v-if="expanded" aria-hidden="true" size="1em" />
        <RiAddLine v-else aria-hidden="true" size="1em" />
      </button>
    </div>
    <SharingLinkDetails v-if="expanded" :link @refresh="emit('refresh')" />
  </div>
</template>

<script setup lang="ts">
import { DsfrBadge } from '@gouvminint/vue-dsfr'
import {
  RiAddLine,
  RiHome4Line,
  RiLinksLine,
  RiMailLine,
  RiPauseCircleFill,
  RiShakeHandsLine,
  RiSubtractLine
} from '@remixicon/vue'
import dayjs from 'dayjs'
import type { ApartmentSharingLink } from 'df-shared-next/src/models/ApartmentSharingLink'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SharingLinkDetails from './SharingLinkDetails.vue'

defineProps<{ link: ApartmentSharingLink }>()
const emit = defineEmits<{ refresh: [] }>()

const { t } = useI18n()

const expanded = ref(false)

const formatDate = (date: string) => dayjs(date).format('D MMM YYYY')
</script>

<style scoped>
.border-left {
  margin-left: 0.5rem;
}
.border-left::before {
  content: '|';
  margin-right: 6px;
}
.link-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid;
}
.wrap {
  flex-wrap: wrap;
}
</style>

<i18n>
{
  "en": {
    "created": "Created on: ",
    "expires": "Expires on:",
    "consultations": "Consultations: ",
    "times": "{0} times",
    "active-sharing": "Active sharing",
    "disabled-sharing": "Disabled sharing",
    "show-all": "Show all",
    "show-less": "Show less"
  },
  "fr": {
    "created": "Créé le : ",
    "expires": "Expire le : ",
    "consultations": "Consultations : ",
    "times": "{0} fois",
    "active-sharing": "Partage actif",
    "disabled-sharing": "Partage en pause",
    "show-all": "Afficher tout",
    "show-less": "Afficher moins"
  }
}
</i18n>
