<template>
  <NakedCard class="fr-p-3w">
    <div class="display--flex align-items--center">
      <h2 class="fr-h3 fr-mb-0">{{ t('title') }}</h2>
      <RouterLink :to="getFullFileUrl()" class="fr-btn fr-btn--secondary fr-ml-auto">
        <span class="text-center full-width">
          {{ t('sharefile.view.button') }}
        </span>
        <RiEyeLine aria-hidden="true" class="fr-ml-1v" />
      </RouterLink>
    </div>
    <p class="fr-message fr-message--info fr-mb-3w">
      <strong class="fr-mr-1v">{{ t('reminder') }}</strong>
      {{ t('no-accommodation') }}
    </p>
    <div class="wrapper">
      <div class="icon">
        <RiLinksLine aria-hidden="true" />
      </div>
      <form @submit.prevent="submit">
        <h3 class="fr-text--lg fr-mb-0">{{ t('share-link') }}</h3>
        <p class="fr-text--sm">{{ t('generate-link') }}</p>
        <div class="share-form-row">
          <div class="fr-input-group">
            <label class="fr-label" for="link-title">
              {{ t('custom-link-title') }}
              <span class="fr-hint-text">{{ t('name-link') }}</span>
            </label>
            <input id="link-title" class="fr-input" type="text" name="name" required />
          </div>
          <div class="fr-input-group">
            <label class="fr-label" for="link-validity">
              {{ t('link-validity') }}
              <span class="fr-hint-text">{{ t('link-validity-desc') }}</span>
            </label>
            <select id="link-validity" class="fr-select align-field" name="validity">
              <option value="7">{{ t('x-days', [7]) }}</option>
              <option value="15">{{ t('x-days', [15]) }}</option>
              <option value="30" selected>{{ t('x-days', [30]) }}</option>
              <option value="90">{{ t('x-days', [90]) }}</option>
            </select>
          </div>
        </div>
        <div class="fr-input-group">
          <label class="fr-label" for="link-content">
            {{ t('link-content') }}
            <span class="fr-hint-text">{{ t('link-content-desc') }}</span>
          </label>
          <select id="link-content" class="fr-select" name="shareType">
            <option value="restricted">{{ t('file-without-docs') }}</option>
            <option value="full">{{ t('file-with-docs') }}</option>
          </select>
        </div>
        <DsfrTabs v-model="activeTab" tab-list-name="liste d'onglets" :tab-titles>
          <DsfrTabContent tab-id="tab-0" panel-id="panel-0">
            <button type="submit" class="fr-btn" name="action" value="link">
              {{ t('generate-a-link') }}
              <RiLinksLine aria-hidden="true" size="1rem" class="fr-ml-1v" />
            </button>
          </DsfrTabContent>
          <DsfrTabContent tab-id="tab-1" panel-id="panel-1">
            <p class="blue-text bold">{{ t('if-share-by-email') }}</p>
            <div class="fr-input-group">
              <label class="fr-label" for="recipient-email">{{ t('recipient-email') }}</label>
              <input
                id="recipient-email"
                class="fr-input"
                name="email"
                type="email"
                :required="activeTab === 1"
              />
            </div>
            <div class="fr-input-group">
              <label class="fr-label" for="email-message"> {{ t('custom-message') }} </label>
              <textarea
                id="email-message"
                class="fr-input"
                name="message"
                :required="activeTab === 1"
              />
            </div>
            <button type="submit" class="fr-btn" name="action" value="email">
              {{ t('share-by-email') }}
              <RiMailLine aria-hidden="true" size="1rem" class="fr-ml-1v" />
            </button>
          </DsfrTabContent>
        </DsfrTabs>
      </form>
    </div>
  </NakedCard>
</template>

<script setup lang="ts">
import { AnalyticsService } from '@/services/AnalyticsService'
import { ShareService } from '@/services/ShareService'
import { useTenantStore } from '@/stores/tenant-store'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RiEyeLine, RiLinksLine, RiMailLine } from '@remixicon/vue'
import { toast } from '@/components/toast/toastUtils'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { DsfrTabContent, DsfrTabs } from '@gouvminint/vue-dsfr'

const emit = defineEmits<{ refresh: [] }>()

const store = useTenantStore()
const { t } = useI18n()

const activeTab = ref(0)

const tabTitles = [
  {
    title: 'Générer un lien',
    tabId: 'tab-0',
    panelId: 'panel-0'
  },
  {
    title: 'Partager par email',
    tabId: 'tab-1',
    panelId: 'panel-1'
  }
]

function submit(event: Event) {
  const linkForm = event.target
  if (!(linkForm instanceof HTMLFormElement)) return
  const data = new FormData(linkForm)
  const email = data.get('email')
  const title = data.get('name')
  const fullData = data.get('shareType') === 'full'
  const daysValid = Number(data.get('validity'))
  if (
    email &&
    title &&
    typeof email === 'string' &&
    typeof title === 'string' &&
    event instanceof SubmitEvent &&
    event.submitter instanceof HTMLButtonElement &&
    event.submitter.value === 'email'
  ) {
    AnalyticsService.shareByMail(fullData ? 'full' : 'resume')
    ShareService.sendFileByMail({ email, fullData, daysValid, title })
      .then(() => {
        toast.success(t('share-mail-success'), null)
        linkForm.reset()
        emit('refresh')
      })
      .catch(() => {
        toast.error(t('sharefile.sent-failed'), null)
      })
  }
}

function getFullFileUrl() {
  return `/file/${store.user.apartmentSharing?.token}`
}
</script>

<style scoped>
.wrapper {
  border: 1px solid #000091;
  padding: 20px;
  border-radius: 4px;
  display: flex;
  align-items: start;
  gap: 0.5rem;

  h3 {
    color: #000091;
  }
}
.icon {
  background-color: #000091;
  color: white;
  padding: 8px;
  border-radius: 4px;
  line-height: 1rem;
}
.share-form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  .fr-input-group {
    display: flex;
    flex-direction: column;
    flex: 1 0 15rem;
  }
  .align-field {
    margin-top: auto;
    margin-bottom: 1.5rem;
  }
}
</style>

<i18n>
{
  "en": {
    "title": "Sharing your file",
    "share-link": "Share with a link",
    "generate-link": "Generate a link to share via email, message, or on a property platform.",
    "custom-link-title": "Custom link title*",
    "name-link": "Give this link a name so you can easily find it in your list of shares (e.g. 'Appartement on  Rue de la République')",
    "link-validity": "Link validity period*",
    "link-validity-desc": "The link remains active for the selected period. It expires automatically at the end of this period.",
    "link-content": "Content of the shared link*",
    "link-content-desc": "Indicate which parts of the file you wish to share: the complete file with supporting documents, or a simplified version that only presents your situation without supporting documents.",
    "x-days": "{0} days",
    "file-with-docs": "File with supporting documents",
    "file-without-docs": "File without supporting documents",
    "generate-a-link": "Generate a link",
    "recipient-email": "Recipient's email address*",
    "custom-message": "Custom message*",
    "share-by-email": "Share your file by email",
    "if-share-by-email": "If you wish to share by email:",
    "reminder": "Reminder:",
    "no-accommodation": "DossierFacile does not offer accommodation.",
    "share-mail-success": "Your file has been sent by mail"
  },
  "fr": {
    "title": "Partage de votre dossier",
    "share-link": "Partager avec un lien",
    "generate-link": "Générez un lien à partager par email, message ou sur une plateforme immobilière.",
    "custom-link-title": "Titre du lien personnalisé*",
    "name-link": "Donnez un nom à ce lien pour le retrouver facilement dans votre liste de partages (ex: 'Appartement Rue de la République')",
    "link-validity": "Durée de validité du lien*",
    "link-validity-desc": "Le lien reste actif pendant la durée choisie. Il expire automatiquement à la fin de ce délai.",
    "link-content": "Contenu du lien partagé*",
    "link-content-desc": "Indiquez les éléments du dossier que vous souhaitez partager : le dossier complet avec justificatifs, ou une version allégée qui présente uniquement votre situation sans justificatif.",
    "x-days": "{0} jours",
    "file-with-docs": "Dossier avec documents justificatifs",
    "file-without-docs": "Dossier sans documents justificatifs",
    "generate-a-link": "Générer un lien",
    "recipient-email": "Email du destinataire*",
    "custom-message": "Message personnalisé*",
    "share-by-email": "Partager votre dossier par email",
    "if-share-by-email": "Si vous souhaitez partager par mail :",
    "reminder": "Rappel :",
    "no-accommodation": "DossierFacile ne propose pas de logement.",
    "share-mail-success": "Votre dossier a bien été partagé par email"
  }
}
</i18n>
