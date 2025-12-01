<template>
  <NakedCard class="fr-p-3w">
    <div class="display--flex align-items--center">
      <h2 class="fr-h3 fr-mb-0">{{ t('title') }}</h2>
      <RouterLink to="/mon-dossier" class="fr-btn fr-btn--secondary fr-ml-auto">
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
      <form @submit.prevent="handleFormSubmit">
        <h3 class="fr-text--lg fr-mb-0">{{ t('share-link') }}</h3>
        <p class="fr-text--sm fr-mb-2w">{{ t('generate-link') }}</p>
        <p class="fr-text--sm fr-mb-1w">{{ t('required-inputs') }}</p>
        <div class="share-form-row">
          <Field
            v-slot="{ field, meta }"
            v-model="linkTitle"
            name="name"
            :rules="{ required: true }"
            as="div"
            class="field-wrapper"
          >
            <div
              class="fr-input-group share-group-contents"
              :class="{
                'fr-input-group--error': !meta.valid && meta.touched
              }"
            >
              <label class="fr-label grid-label-1" for="link-title">
                {{ t('custom-link-title') }}
                <span class="fr-hint-text">{{ t('name-link') }}</span>
              </label>
              <input
                id="link-title"
                v-bind="field"
                class="fr-input grid-input-1"
                :class="{
                  'fr-input--error': !meta.valid && meta.touched
                }"
                type="text"
                name="name"
              />
              <ErrorMessage v-slot="{ message }" name="name">
                <span
                  v-if="message"
                  role="alert"
                  class="fr-error-text grid-error-1"
                >{{ t(message) }}</span>
              </ErrorMessage>
            </div>
          </Field>
          <div class="fr-input-group share-group-contents">
            <label class="fr-label grid-label-2" for="link-validity">
              {{ t('link-validity') }}
              <span class="fr-hint-text">{{ t('link-validity-desc') }}</span>
            </label>
            <select id="link-validity" class="fr-select grid-select-2" name="validity">
              <option value="7">{{ t('x-days', [7]) }}</option>
              <option value="15">{{ t('x-days', [15]) }}</option>
              <option value="30" selected>{{ t('x-days', [30]) }}</option>
              <option value="90">{{ t('x-days', [90]) }}</option>
            </select>
          </div>
        </div>
        <div class="fr-input-group fr-mt-3w">
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
            <div v-if="fileLink.length > 0" class="generated-link fr-mt-2w">
              <p class="fr-background-default--grey fr-p-1v fr-mb-0">{{ fileLink }}</p>
              <button ref="copy-link" type="button" class="fr-btn" @click="copyLink">
                {{ t('copy-link') }}
                <RiClipboardLine aria-hidden="true" size="1em" class="fr-ml-1v" />
              </button>
              <LinkWarning />
            </div>
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
import { ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { RiClipboardLine, RiEyeLine, RiLinksLine, RiMailLine } from '@remixicon/vue'
import { toast } from '@/components/toast/toastUtils'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { DsfrTabContent, DsfrTabs } from '@gouvminint/vue-dsfr'
import LinkWarning from './LinkWarning.vue'
import { Field, ErrorMessage, useForm } from 'vee-validate'

const emit = defineEmits<{ refresh: [] }>()

const { t } = useI18n()

const activeTab = ref(0)
const fileLink = ref('')
const linkTitle = ref('')

const { validate } = useForm()

const copyLinkBtn = useTemplateRef('copy-link')

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

const toString = (value: FormDataEntryValue | null) =>
  value && typeof value === 'string' ? value : ''

async function handleFormSubmit(event: Event) {
  const validationResult = await validate()
  if (!validationResult.valid) {
    return
  }
  
  await submit(event)
}

async function submit(event: Event) {
  const linkForm = event.target
  if (
    !(
      linkForm instanceof HTMLFormElement &&
      event instanceof SubmitEvent &&
      event.submitter instanceof HTMLButtonElement
    )
  ) {
    return
  }
  const data = new FormData(linkForm)
  const title = toString(data.get('name'))
  const fullData = data.get('shareType') === 'full'
  const daysValid = Number(data.get('validity'))

  if (event.submitter.value === 'email') {
    const email = toString(data.get('email'))
    const message = toString(data.get('message'))
    AnalyticsService.shareByMail(fullData ? 'full' : 'resume')
    try {
      await ShareService.sendFileByMail({ email, fullData, daysValid, title, message })
      toast.success(t('share-mail-success'), null)
      linkForm.reset()
      emit('refresh')
    } catch (error) {
      console.error(error)
      toast.error(t('sharefile.sent-failed'), null)
    }
  } else if (event.submitter.value === 'link') {
    try {
      const response = await ShareService.createLink({ title, fullData, daysValid })
      fileLink.value = `${window.location.origin}${response.data}`
      linkForm.reset()
      emit('refresh')
    } catch (error) {
      console.error(error)
      toast.error(t('errors.submit-failed'), null)
    }
  }
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(fileLink.value)
    toast.success(t('account.copied'), copyLinkBtn.value)
  } catch (err) {
    toast.error(t('unable-to-copy'), copyLinkBtn.value)
    throw new Error('Unable to copy', { cause: err })
  }
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
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 1.5rem;
    row-gap: 0.5rem;
    align-items: start;

    .field-wrapper,
    .share-group-contents {
      display: contents;
    }

    .fr-label {
      margin-bottom: 0 !important;
      .fr-hint-text {
        margin-bottom: 0 !important;
      }
    }

    .fr-input,
    .fr-select {
      margin-top: 0 !important;
    }

    .grid-label-1 {
      grid-column: 1;
      grid-row: 1;
    }
    .grid-input-1 {
      grid-column: 1;
      grid-row: 2;
    }
    .grid-error-1 {
      grid-column: 1;
      grid-row: 3;
    }

    .grid-label-2 {
      grid-column: 2;
      grid-row: 1;
    }
    .grid-select-2 {
      grid-column: 2;
      grid-row: 2;
    }
  }
}
.generated-link {
  background-color: #ececfe;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>

<i18n>
{
  "en": {
    "title": "Sharing your file",
    "share-link": "Share with a link",
    "generate-link": "Generate a link to share via email, message, or on a property platform.",
    "required-inputs": "Fields with * are required.",
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
    "share-mail-success": "Your file has been sent by mail",
    "copy-link": "Copy link",
    "field-required": "This field is required",
  },
  "fr": {
    "title": "Partage de votre dossier",
    "share-link": "Partager avec un lien",
    "generate-link": "Générez un lien à partager par email, message ou sur une plateforme immobilière.",
    "required-inputs": "Les champs avec * sont requis.",
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
    "share-mail-success": "Votre dossier a bien été partagé par email",
    "copy-link": "Copier le lien",
    "field-required": "Ce champ est requis",
  }
}
</i18n>
