<template>
  <DsfrModalPatch
    v-model:is-opened="isOpened"
    modal-id="modal-completed-file"
    :title="t('title')"
    :actions="actions"
    size="lg"
    @close="onClosed"
  >
    <div class="completed-file-modal">
      <p class="completed-file-modal__line fr-text--bold">
        <VIcon icon="ri:check-line" class="completed-file-modal__icon" aria-hidden="true" />
        <span>{{ t('all-documents') }}</span>
      </p>
      <hr class="completed-file-modal__separator" />
      <p class="completed-file-modal__line fr-text--bold">
        <img
          :src="sparklingIcon"
          class="completed-file-modal__icon"
          width="24"
          height="24"
          alt=""
          aria-hidden="true"
        />
        <span>{{ t('auto-checked') }}</span>
      </p>
      <hr class="completed-file-modal__separator" />
      <p class="completed-file-modal__line fr-text--bold">
        <VIcon icon="ri:share-forward-line" class="completed-file-modal__icon" aria-hidden="true" />
        <span>{{ t('shareable') }}</span>
      </p>
      <p>{{ t('landlord-receives') }}</p>
      <hr class="completed-file-modal__separator" />
      <ul class="fr-badges-group completed-file-modal__badges" role="list">
        <li>
          <span class="fr-badge fr-badge--sm fr-badge--info">{{ t('badge-todo') }}</span>
        </li>
        <li>
          <span class="fr-badge fr-badge--sm fr-badge--no-icon">{{ t('badge-optional') }}</span>
        </li>
      </ul>
      <p class="completed-file-modal__line completed-file-modal__line--accent fr-text--bold">
        <VIcon icon="ri:user-search-line" class="completed-file-modal__icon" aria-hidden="true" />
        <span>{{ t('verification-title') }}</span>
      </p>
      <p>{{ t('verification-text') }}</p>
    </div>
  </DsfrModalPatch>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { VIcon, type DsfrButtonProps } from '@gouvminint/vue-dsfr'
import DsfrModalPatch from 'df-shared-next/src/components/patches/DsfrModalPatch.vue'
import sparklingIcon from '@/assets/images/icons/sparkling.svg'
import { AnalyticsService } from '@/services/AnalyticsService'

const { t } = useI18n()

const isOpened = defineModel<boolean>('isOpened', { default: false })

const emit = defineEmits<{
  share: []
  'request-verification': []
}>()

// Set when the modal closes through one of its CTAs, so that a plain close is not counted as one
let chosen = false

// Sharing is the primary action, asking for the verification the secondary one
const actions = computed<DsfrButtonProps[]>(() => [
  {
    label: t('request-verification'),
    secondary: true,
    onClick() {
      chosen = true
      AnalyticsService.optInCompletedModalRequestVerification()
      isOpened.value = false
      emit('request-verification')
    }
  },
  {
    label: t('share'),
    onClick() {
      chosen = true
      AnalyticsService.optInCompletedModalShare()
      isOpened.value = false
      emit('share')
    }
  }
])

function onClosed() {
  if (!chosen) {
    AnalyticsService.optInCompletedModalDismissed()
  }
  chosen = false
}
</script>

<style scoped lang="scss">
/* Figma 11541:31756 — 12px between blocks, 8px between an icon and its text, 1px separators */
.completed-file-modal {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  > * {
    margin: 0;
  }
}

.completed-file-modal__line {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &--accent {
    color: var(--text-action-high-blue-france);
  }
}

.completed-file-modal__icon {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
}

.completed-file-modal__separator {
  height: 0;
  padding: 0;
  border: 0;
  border-top: 1px solid var(--border-default-grey);
}

.completed-file-modal__badges {
  padding: 0;
  gap: 0.75rem;
}
</style>

<i18n>
{
  "en": {
    "title": "Your documents are submitted: what you need to know",
    "all-documents": "You have submitted all the requested documents",
    "auto-checked": "Some documents were checked automatically",
    "shareable": "You can share your file",
    "landlord-receives": "The landlord receives your documents as you submitted them. Nobody has reviewed them yet.",
    "badge-todo": "To do",
    "badge-optional": "Optional",
    "verification-title": "Request the verification of your file",
    "verification-text": "A DossierFacile agent reviews each document and checks that they are consistent with each other. Your file then carries the “Verified by DossierFacile” mention.",
    "request-verification": "Request the verification",
    "share": "Share your file"
  },
  "fr": {
    "title": "Vos pièces sont déposées : ce qu'il faut savoir",
    "all-documents": "Vous avez déposé toutes les pièces demandées",
    "auto-checked": "Certaines pièces ont été contrôlées automatiquement",
    "shareable": "Vous pouvez partager votre dossier",
    "landlord-receives": "Le bailleur reçoit vos pièces telles que vous les avez déposées. Personne ne les a encore relues.",
    "badge-todo": "Reste à faire",
    "badge-optional": "Facultatif",
    "verification-title": "Demander la vérification de votre dossier",
    "verification-text": "Un agent de DossierFacile relit chaque pièce et vérifie qu'elles sont cohérentes entre elles. Votre dossier porte ensuite la mention « Vérifié par DossierFacile ».",
    "request-verification": "Demander la vérification",
    "share": "Partager son dossier"
  }
}
</i18n>
