<template>
  <div v-if="user.ownerType === 'SELF'">
    <div class="hr-container fr-my-3w">
      <hr />
      <span class="hr-text"
        ><strong>{{ t('or-label') }}</strong></span
      >
    </div>
    <div class="fr-mb-3w card-border">
      <div class="fr-grid-row space-between">
        <DsfrBadge type="new" :label="t('badge-new')" small />
        <strong class="fr-ml-2w">{{ t('title') }}</strong>
      </div>
      <div class="fr-mt-3w">
        <p>
          <span
            aria-hidden="true"
            class="fr-mr-1w fr-icon-links-line fr-icon--sm color--primary"
          ></span>
          <strong>{{ t('desc') }}</strong>
        </p>
        <p>{{ t('desc2') }}</p>
        <div class="fr-grid-row fr-grid-row--center">
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
        <DsfrAccordion class="fr-mt-3w" :title="t('accordion-title')">
          <ol class="fr-p-0 fr-m-0">
            <li class="fr-mt-1w">{{ t('accordion-item-1') }}</li>
            <li class="fr-mt-1w">{{ t('accordion-item-2') }}</li>
            <li class="fr-mt-1w">{{ t('accordion-item-3') }}</li>
          </ol>
        </DsfrAccordion>
      </DsfrAccordionsGroup>
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
  padding: 1rem;
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

ol li {
  counter-increment: item;
  position: relative;
  padding-left: 2rem;
}

ol li::marker {
  content: none;
}

ol li::before {
  content: counter(item);
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  background-color: var(--primary);
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 500;
}
</style>

<i18n>
  {
    "fr": {
      "or-label": "OU",
      "badge-new": "NOUVEAU",
      "title": "Mes Droits Sociaux",
      "desc": "Récupérer votre attestation d'activité professionnelle via mesdroitssociaux.gouv.fr",
      "desc2": "Récupération sécurisée de votre attestation d'activité professionnelle qui peut remplacer votre justificatif de situation.",
      "button": "Récupérer mon attestation",
      "accordion-title": "Comment ça marche ?",
      "accordion-item-1": "Connexion via FranceConnect sur Mes Droits Sociaux",
      "accordion-item-2": "Télécharger votre attestation",
      "accordion-item-3": "Déposer ci-dessous votre attestation"
    },
    "en": {
      "or-label": "OR",
      "badge-new": "NEW",
      "title": "Mes Droits Sociaux",
      "desc": "Retrieve your professional activity certificate via mesdroitssociaux.gouv.fr",
      "desc2": "Secure retrieval of your professional activity certificate which can replace your situation certificate.",
      "button": "Retrieve my certificate",
      "accordion-title": "How does it work?",
      "accordion-item-1": "Connect via FranceConnect on Mes Droits Sociaux",
      "accordion-item-2": "Download your certificate",
      "accordion-item-3": "Upload your certificate below"
    }
  }
</i18n>
