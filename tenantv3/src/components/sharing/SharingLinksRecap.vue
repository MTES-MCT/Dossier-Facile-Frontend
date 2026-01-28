<template>
  <NakedCard class="fr-p-3w">
    <FileStatusBadge :status="store.user.status" />
    <h2 class="fr-h3 fr-mb-1w">{{ t('title') }}</h2>
    <p>{{ t('follow-sharing-links') }}</p>
    <div class="bloc-wrapper">
      <div class="bloc">
        <p class="fr-h5 fr-text-title--blue-france">{{ totalActiveShares }}</p>
        <p class="fr-text--md bold">{{ t('active-shares') }}</p>
        <p class="fr-text--xs text-grey">{{ t('valid-shares') }}</p>
      </div>
      <div class="bloc">
        <p class="fr-h5 fr-text-title--blue-france">{{ totalVisits }}</p>
        <p class="fr-text--md bold">{{ t('file-consultations') }}</p>
        <p class="fr-text--xs text-grey">
          {{ t('since', [firstVisit.format('DD MMMM YYYY')]) }}
        </p>
      </div>
    </div>
    <p class="fr-mb-0 fr-mt-2w display--flex">
      <a href="#sharing-history" class="blue-text fr-mx-auto" @click="AnalyticsService.sharingGoToDetailsAll()"
        >{{ t('see-more') }}
        <RiArrowDownLine aria-hidden="true" size="1rem" />
      </a>
    </p>
  </NakedCard>
</template>

<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant-store'
import { AnalyticsService } from '@/services/AnalyticsService'
import { RiArrowDownLine } from '@remixicon/vue'
import dayjs from 'dayjs'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import type { ApartmentSharingLink } from 'df-shared-next/src/models/ApartmentSharingLink'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FileStatusBadge from './FileStatusBadge.vue'

const { links } = defineProps<{ links: ApartmentSharingLink[] }>()

const { t } = useI18n()
const store = useTenantStore()

const now = dayjs()

const totalActiveShares = computed(
  () => links.filter((l) => !l.deleted && dayjs(l.expirationDate).isAfter(now)).length
)
const totalVisits = computed(() => links.reduce((s, l) => s + l.nbVisits, 0))
const firstVisit = computed(() => {
  let date = now
  for (const link of links) {
    const linkDate = dayjs(link.creationDate)
    if (linkDate.isBefore(date)) {
      date = linkDate
    }
  }
  return date
})
</script>

<style scoped>
.bloc-wrapper {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
.bloc {
  border-radius: 4px;
  background-color: #ececfe;
  padding: 1rem;
  flex-basis: 20rem;
  text-align: center;
  p {
    margin-bottom: 0;
  }
}
</style>

<i18n>
{
  "en": {
    "file-validated": "File validated",
    "title": "Summary of your shares",
    "follow-sharing-links": "Track all your shares: links created, views, downloads, and activity status.",
    "active-shares": "Total active shares",
    "valid-shares": "Shares currently valid",
    "file-consultations": "Consultations on your file",
    "since": "Since {0}",
    "see-more": "See more details about your shares"
  },
  "fr": {
    "file-validated": "Dossier validé",
    "title": "Récapitulatif de vos partages",
    "follow-sharing-links": "Suivez l’ensemble de vos partages : liens créés, consultations, téléchargements et statut d’activité.",
    "active-shares": "Partages actifs total",
    "valid-shares": "Partages en cours de validité",
    "file-consultations": "Consultations de votre dossier",
    "since": "Depuis le {0}",
    "see-more": "Voir plus de détails sur vos partages"
  }
}
</i18n>
