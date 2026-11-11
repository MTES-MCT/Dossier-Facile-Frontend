<template>
  <div class="bg-blue">
    <div class="fr-container fr-my-5w">
      <h1 class="fr-mb-0">{{ t('page-titles.Settings') }}</h1>
      <section>
        <NakedCard class="flow">
          <h2 class="fr-h5">{{ t('account-title') }}</h2>
          <dl>
            <dt>{{ t('email-address') }}</dt>
            <dd>
              <span class="fr-icon-mail-fill" aria-hidden="true" />
              <strong class="">{{ store.user.email }}</strong>
            </dd>
          </dl>
          <p v-safe-html="t('email-info')" class="fr-text--sm" />
        </NakedCard>
      </section>
      <section>
        <NakedCard class="flow">
          <h2 class="fr-h5">{{ t('delete-title') }}</h2>
          <p v-safe-html="t('delete-info')" />
          <DsfrButton
            :label="t('delete-button')"
            icon="fr-icon-delete-line"
            secondary
            @click="openModal"
          />
        </NakedCard>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { useI18n } from 'vue-i18n'
import { useTenantStore } from '@/stores/tenant-store'
import { DsfrButton } from '@gouvminint/vue-dsfr'
import { useModalStore } from 'df-shared-next/src/stores/useModalStore'

const { t } = useI18n()
const store = useTenantStore()
const { openModal } = useModalStore('deleteAccount')
</script>

<style scoped>
.fr-container {
  --card-padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-wrap: pretty;
}

.flow {
  --title-spacing: 0 0 1rem;
}
.flow > * + * {
  margin-block-start: 1rem;
  margin-block-end: 0;
}
.flow p {
  max-inline-size: 80ch;
}

dl {
  --ul-start: 0;
}
dt {
  --li-bottom: 0.5rem;
  font-size: 0.875rem;
}
dd > span[class*='fr-icon'] {
  padding-inline-end: 0.25rem;
  color: var(--primary);
}
</style>

<i18n lang="json">
{
  "en": {
    "account-title": "Account ID",
    "email-address": "Login email address",
    "email-info": "You cannot change your email address.<br>To use a different email address, create a new Dossier<b>Facile</b> account with that address.",
    "delete-title": "Account deletion",
    "delete-info": "You can delete your Dossier<b>Facile</b> account anytime.<br>The deletion will automatically and permanently erase your files and share links.",
    "delete-button": "Delete my account"
  },
  "fr": {
    "account-title": "Identifiant du compte",
    "email-address": "Adresse e-mail de connexion",
    "email-info": "Vous ne pouvez pas modifier votre adresse e-mail.<br>Pour utiliser une autre adresse e-mail, créez un nouveau compte Dossier<b>Facile</b> avec cette adresse.",
    "delete-title": "Suppression de mon compte",
    "delete-info": "Vous pouvez supprimer votre compte Dossier<b>Facile</b> à tout moment.<br>La suppression de votre compte entrainera automatiquement l’effacement définitif de vos pièces justificatives et la désactivation de vos liens de partage.",
    "delete-button": "Supprimer mon compte"
  }
}
</i18n>
