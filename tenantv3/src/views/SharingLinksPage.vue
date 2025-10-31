<template>
  <div class="bg-blue">
    <div class="fr-container">
      <section class="section fr-my-5w">
        <h1 class="fr-h2 fr-mb-0">{{ t('your-shares') }}</h1>
        <SharingLinksRecap :links="sharingLinks" />
        <ShareFile v-if="store.user.status === 'VALIDATED'" @refresh="refreshData" />
        <SharingLinksHistory :links="activeLinks" @refresh="refreshData" />
        <NakedCard class="fr-p-3w">
          <h2 class="fr-h3">{{ t('report-suspicious-use') }}</h2>
          <p>{{ t('if-you-are-a-victim') }}</p>
          <p class="fr-mb-0">
            <a
              href="https://www.service-public.gouv.fr/particuliers/vosdroits/N31138"
              class="blue-text"
              target="_blank"
              :title="`${t('report-issue')} - ${t('new-window')}`"
              >{{ t('report-issue') }}</a
            >
          </p>
        </NakedCard>
        <DeletedSharingLinks :links="deletedLinks" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ApartmentSharingLink } from 'df-shared-next/src/models/ApartmentSharingLink'
import { ApartmentSharingLinkService } from '@/services/ApartmentSharingLinkService'
import ShareFile from '@/components/sharing/ShareFile.vue'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import SharingLinksRecap from '@/components/sharing/SharingLinksRecap.vue'
import SharingLinksHistory from '@/components/sharing/SharingLinksHistory.vue'
import DeletedSharingLinks from '@/components/sharing/DeletedSharingLinks.vue'
import dayjs from 'dayjs'
import { useTenantStore } from '@/stores/tenant-store'

const { t } = useI18n()
const store = useTenantStore()

const sharingLinks = ref<ApartmentSharingLink[]>([])

async function refreshData() {
  // TODO: handle errors
  sharingLinks.value = (await ApartmentSharingLinkService.getLinks()).data.links || []
}

onBeforeMount(refreshData)

const now = dayjs()
const isActiveLink = (link: ApartmentSharingLink) =>
  !link.deleted && dayjs(link.expirationDate).isAfter(now)

const activeLinks = computed(() => sharingLinks.value.filter(isActiveLink))
const deletedLinks = computed(() => sharingLinks.value.filter((l) => !isActiveLink(l)))
</script>

<style scoped>
.section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>

<i18n>
{
  "en": {
    "your-shares": "Your shares",
    "report-suspicious-use": "Report suspicious use of your documents",
    "if-you-are-a-victim": "If you believe your documents have been used fraudulently, you can report it on service-public.fr or get help on official websites.",
    "report-issue": "Report an issue on service-public.fr"
  },
  "fr": {
    "your-shares": "Vos partages",
    "report-suspicious-use": "Signaler un usage suspect de vos documents",
    "if-you-are-a-victim": "Si vous pensez être victime d’un usage frauduleux de vos documents, vous pouvez faire un signalement sur service-public.fr ou obtenir de l’aide sur des sites officiels.",
    "report-issue": "Faire un signalement sur service-public.fr"
  }
}
</i18n>
