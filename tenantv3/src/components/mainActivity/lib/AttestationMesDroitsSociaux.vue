<template>
  <div v-if="user.ownerType === 'SELF'">
    <div class="card-border fr-mb-3w">
      <div class="header-row">
        <DsfrBadge type="info" :label="t('badge-recommended')" small />
        <strong class="header-title">{{ t('title') }}</strong>
      </div>
      <div class="fr-mt-2w">
        <p class="fr-mb-1w">
          <span
            aria-hidden="true"
            class="fr-mr-1w fr-icon-links-line fr-icon--sm color--primary"
          ></span>
          <strong>{{ t('desc') }}</strong>
        </p>
        <p class="fr-mb-2w">{{ t('desc2') }}</p>
        <div class="fr-grid-row fr-grid-row--center fr-my-2w">
          <a
            class="fr-btn fr-btn--secondary"
            :href="PNDS_URL"
            :title="`${t('button')} - ${t('new-window')}`"
            target="_blank"
            rel="noopener noreferrer"
            @click="trackAttestationClick"
            >{{ t('button') }}</a
          >
        </div>
      </div>
      <DsfrAccordionsGroup>
        <DsfrAccordion class="fr-mt-2w" :title="t('accordion-title')">
          <ol class="fr-p-0 fr-m-0">
            <li class="fr-mt-1w">{{ t('accordion-item-1') }}</li>
            <li class="fr-mt-1w">{{ t('accordion-item-2') }}</li>
            <li class="fr-mt-1w">{{ t('accordion-item-3') }}</li>
          </ol>
        </DsfrAccordion>
      </DsfrAccordionsGroup>
    </div>
    <div class="hr-container fr-my-3w">
      <hr />
      <span class="hr-text"
        ><strong>{{ t('or-label') }}</strong></span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { DsfrBadge, DsfrAccordion, DsfrAccordionsGroup } from '@gouvminint/vue-dsfr'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useTenantStore } from '@/stores/tenant-store'
import { computed } from 'vue'

const { t } = useI18n()
const PNDS_URL = `${import.meta.env.VITE_PNDS_BASE_URL}/api/public/redirect/activite_professionnelle`
const store = useTenantStore()
const user = computed(() => store.user)

const trackAttestationClick = (): void => {
  AnalyticsService.openAttestationMesDroitsSociaux()
}
</script>

<style scoped>
.card-border {
  border: 1px solid var(--primary);
  border-radius: 0.5rem;
  padding: 1.25rem;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-weight: 700;
}

.hr-container {
  position: relative;
}

.hr-text {
  position: absolute;
  top: 0%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 0 1rem;
}

ol {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

ol li {
  counter-increment: item;
  position: relative;
  padding-left: 2rem;
  line-height: 1.5;
}

ol li::marker {
  content: none;
}

ol li::before {
  content: counter(item);
  position: absolute;
  left: 0;
  top: 0.125rem;
  width: 20px;
  height: 20px;
  background-color: var(--primary);
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
}
</style>

<i18n>
  {
    "fr": {
      "or-label": "OU",
      "badge-recommended": "RECOMMANDÉ",
      "title": "Mes Droits Sociaux",
      "desc": "Récupérer votre attestation d'activité professionnelle",
      "desc2": "Ce document, disponible sur mesdroitssociaux.gouv.fr, remplace votre justificatif de situation professionnelle.",
      "button": "Récupérer mon attestation",
      "new-window": "Ouvre une nouvelle fenêtre",
      "accordion-title": "Comment ça marche ?",
      "accordion-item-1": "Connexion sécurisée via FranceConnect sur mesdroitssociaux.gouv.fr",
      "accordion-item-2": "Télécharger votre attestation",
      "accordion-item-3": "Déposer ci-dessous votre attestation"
    },
    "en": {
      "or-label": "OR",
      "badge-recommended": "RECOMMENDED",
      "title": "Mes Droits Sociaux",
      "desc": "Retrieve your professional activity certificate",
      "desc2": "This document, available on mesdroitssociaux.gouv.fr, replaces your certificate of professional situation.",
      "button": "Retrieve my certificate",
      "new-window": "Opens a new window",
      "accordion-title": "How does it work?",
      "accordion-item-1": "Secure connection via FranceConnect on mesdroitssociaux.gouv.fr",
      "accordion-item-2": "Download your certificate",
      "accordion-item-3": "Upload your certificate below"
    }
  }
</i18n>
