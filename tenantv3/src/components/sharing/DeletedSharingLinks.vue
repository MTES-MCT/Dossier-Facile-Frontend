<template>
  <NakedCard class="fr-p-3w">
    <h2 class="fr-h3">{{ t('title') }}</h2>
    <DsfrAccordionsGroup>
      <DsfrAccordion
        v-for="(deletedLinks, i) of allLinks"
        :key="i"
        :title="t('links-' + i, [deletedLinks.length])"
      >
        <ul v-if="deletedLinks.length > 0" class="link-list">
          <li v-for="link of deletedLinks" :key="link.id">
            <div class="fr-highlight fr-background-contrast--grey fr-ml-2w fr-py-1w">
              <p class="bold fr-text--sm fr-mb-1v fr-text-mention--grey">
                {{ t('deleted-on') }}
                {{ dayjs(link.expirationDate).format('D MMMM YYYY - HH:mm') }}
              </p>
              <p class="fr-text--lg fr-mb-0">{{ link.title }}</p>
            </div>
          </li>
        </ul>
      </DsfrAccordion>
    </DsfrAccordionsGroup>
  </NakedCard>
</template>

<script setup lang="ts">
import { DsfrAccordion, DsfrAccordionsGroup } from '@gouvminint/vue-dsfr'
import dayjs from 'dayjs'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import type { ApartmentSharingLink } from 'df-shared-next/src/models/ApartmentSharingLink'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { links } = defineProps<{ links: ApartmentSharingLink[] }>()

const { t } = useI18n()

const sharingLinks = computed(() => links.filter((l) => l.type === 'LINK'))
const emailLinks = computed(() => links.filter((l) => l.type === 'MAIL'))
const ownerLinks = computed(() => links.filter((l) => l.type === 'OWNER'))
const partnerLinks = computed(() => links.filter((l) => l.type === 'PARTNER'))
const allLinks = computed(() => [
  sharingLinks.value,
  emailLinks.value,
  ownerLinks.value,
  partnerLinks.value
])
</script>

<style scoped>
.link-list {
  list-style: none;
  padding: 0;
}
</style>

<i18n>
{
  "en": {
    "title": "Your deleted shares",
    "links-0": "Shares by link ({0})",
    "links-1": "Shares by email ({0})",
    "links-2": "DossierFacile owners ({0})",
    "links-3": "Partners ({0})",
    "deleted-on": "Deleted on : "
  },
  "fr": {
    "title": "Vos partages supprimés",
    "links-0": "Partages par lien ({0})",
    "links-1": "Partages par email ({0})",
    "links-2": "Propriétaires DossierFacile ({0})",
    "links-3": "Partenaires ({0})",
    "deleted-on": "Supprimé le : "
  }
}
</i18n>
