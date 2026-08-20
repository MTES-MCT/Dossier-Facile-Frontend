<template>
  <div
    class="fr-callout fr-callout-white"
    :class="isValidationRequested ? 'accent-purple' : 'accent-primary'"
  >
    <template v-if="isValidationRequested">
      <p class="fr-badge fr-badge--purple-glycine fr-badge--sm">
        <VIcon icon="ri:time-line" class="badge-icon" aria-hidden="true" />
        {{ t('requested.badge') }}
      </p>
      <div class="callout-text">
        <h2 ref="callout-title" class="fr-h4" tabindex="-1">{{ t('requested.title') }}</h2>
        <p>
          {{ t('requested.text') }} <strong>{{ t('requested.text-bold') }}</strong>
        </p>
        <p>{{ t('requested.still-shareable') }}</p>
      </div>
      <button
        ref="action-button"
        type="button"
        class="fr-btn fr-btn--secondary fr-btn--sm"
        :disabled="isSubmitting"
        @click="onCancel"
      >
        {{ t('requested.cancel') }}
      </button>
    </template>
    <template v-else>
      <div class="callout-text">
        <h2 ref="callout-title" class="fr-h4" tabindex="-1">{{ t('available.title') }}</h2>
        <p>{{ t('available.text') }}</p>
      </div>
      <p class="fr-text--bold">{{ t('available.why-title') }}</p>
      <ul class="benefits-list" role="list">
        <li class="benefits-list__item">
          <VIcon
            icon="ri:file-line"
            class="benefits-list__icon"
            color="var(--text-action-high-blue-france)"
            aria-hidden="true"
          />
          <span>{{ t('available.benefit-documents') }}</span>
        </li>
        <li class="benefits-list__item">
          <VIcon
            icon="ri:shield-line"
            class="benefits-list__icon"
            color="var(--text-action-high-blue-france)"
            aria-hidden="true"
          />
          <span>{{ t('available.benefit-certification') }}</span>
        </li>
      </ul>
      <button
        ref="action-button"
        type="button"
        class="fr-btn fr-btn--secondary fr-btn--sm"
        :disabled="isSubmitting"
        @click="onRequest"
      >
        {{ t('available.request') }}
      </button>
      <p class="time-note">
        <VIcon icon="ri:time-line" class="time-note__icon" aria-hidden="true" />
        <span>
          {{ t('available.time') }} <strong>{{ t('available.time-bold') }}</strong>
          {{ t('available.time-after') }}
        </span>
      </p>
    </template>
    <hr class="callout-separator" />
    <p>
      {{ t('help-before') }}
      <a
        :href="HELP_URL"
        class="fr-link"
        target="_blank"
        rel="noopener noreferrer"
        :title="`${t('help-link')} - ${t('new-window')}`"
        >{{ t('help-link') }}</a
      >{{ t('help-after') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { VIcon } from '@gouvminint/vue-dsfr'
import { useCompletedOptIn } from '@/composables/useCompletedOptIn'
import { AnalyticsService } from '@/services/AnalyticsService'
import { toast } from '@/components/toast/toastUtils'

const HELP_URL = 'https://aide.dossierfacile.logement.gouv.fr/fr/'

const { t } = useI18n()
const { isValidationRequested, isSubmitting, submitValidationRequest } = useCompletedOptIn()
const calloutTitle = useTemplateRef<HTMLElement>('callout-title')
const actionButton = useTemplateRef<HTMLButtonElement>('action-button')

onMounted(() => AnalyticsService.optInSectionDisplayed())

function onRequest() {
  AnalyticsService.optInRequestValidation()
  return submit(true)
}

function onCancel() {
  AnalyticsService.optInCancelValidation()
  return submit(false)
}

async function submit(validationRequested: boolean) {
  const trigger = actionButton.value
  const result = await submitValidationRequest(validationRequested)
  if (result === 'success') {
    // The whole callout content changed: move the focus to the new heading so that it is announced
    await nextTick()
    calloutTitle.value?.focus()
  } else if (result === 'conflict') {
    toast.info(t('conflict'), null)
  } else {
    toast.error(t('error'), trigger)
  }
}
</script>

<style scoped lang="scss">
/* Figma 10705:10163 — padding 32px/48px, 16px between blocks, drop shadow like the other dashboard cards */
.fr-callout {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  padding: 2rem 3rem !important;
  background-color: var(--background-default-grey);

  > * {
    margin: 0;
  }

  &.accent-primary {
    box-shadow:
      inset 0.25rem 0 0 0 var(--primary),
      0 2px 6px 0 rgba(0, 0, 18, 0.16) !important;
  }

  &.accent-purple {
    box-shadow:
      inset 0.25rem 0 0 0 var(--purple-glycine-main-494),
      0 2px 6px 0 rgba(0, 0, 18, 0.16) !important;
  }
}

.callout-text {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-self: stretch;

  > * {
    margin: 0;
  }
}

.callout-separator {
  align-self: stretch;
  height: 0;
  padding: 0;
  border: 0;
  border-top: 1px solid var(--border-default-grey);
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
}

.benefits-list__item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

/* The color goes through the VIcon `color` prop: the component sets an inline
   `color: inherit` on the svg, which would override any color set from CSS */
.benefits-list__icon {
  flex-shrink: 0;
}

.time-note {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  color: var(--text-mention-grey);
}

.time-note__icon {
  flex-shrink: 0;
}

.fr-badge .badge-icon {
  margin-right: 0.25rem;
}
</style>

<i18n>
{
  "en": {
    "available": {
      "title": "Have your file checked",
      "text": "You can ask a member of our team to check your documents.",
      "why-title": "Why request a verification?",
      "benefit-documents": "Make sure all the submitted documents are consistent.",
      "benefit-certification": "Get a state certification for your rental file.",
      "request": "Request a verification",
      "time": "The verification takes",
      "time-bold": "24 hours on average.",
      "time-after": "Your file remains downloadable in the meantime."
    },
    "requested": {
      "badge": "Request being processed",
      "title": "Your verification request is being processed",
      "text": "You will receive an email once our team has processed your file. The average processing time",
      "text-bold": "is 24 hours.",
      "still-shareable": "Your file remains downloadable and shareable during the verification.",
      "cancel": "Cancel my verification request"
    },
    "help-before": "For an immediate answer, see our",
    "help-link": "online help",
    "help-after": ".",
    "new-window": "Opens a new window",
    "conflict": "Your file has changed, verification is no longer available.",
    "error": "An error occurred, please try again."
  },
  "fr": {
    "available": {
      "title": "Faites vérifier votre dossier",
      "text": "Vous pouvez demander à une personne de notre équipe de vérifier vos documents.",
      "why-title": "Pourquoi demander une vérification ?",
      "benefit-documents": "Vous assurer que tous les documents déposés sont cohérents.",
      "benefit-certification": "Obtenir une certification de l'État sur votre dossier de location.",
      "request": "Demander une vérification",
      "time": "La vérification prend",
      "time-bold": "en moyenne 24 heures.",
      "time-after": "Votre dossier reste téléchargeable pendant ce temps."
    },
    "requested": {
      "badge": "Demande en cours de traitement",
      "title": "Votre demande de vérification est en cours de traitement",
      "text": "Vous recevrez un e-mail lorsque notre équipe aura traité votre dossier. Le délai de traitement",
      "text-bold": "moyen est de 24 h.",
      "still-shareable": "Votre dossier reste téléchargeable et partageable pendant la vérification.",
      "cancel": "Annuler ma demande de vérification"
    },
    "help-before": "Pour une réponse immédiate, consultez notre",
    "help-link": "aide en ligne",
    "help-after": ".",
    "new-window": "Ouvre une nouvelle fenêtre",
    "conflict": "Votre dossier a changé, la vérification n'est plus proposée.",
    "error": "Une erreur est survenue, veuillez réessayer."
  }
}
</i18n>
