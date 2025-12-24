<template>
  <NakedCard class="fr-p-3w">
    <div class="header-section">
      <h2 class="fr-h3 fr-mb-0">{{ t('title') }}</h2>
      <p class="fr-message fr-message--info reminder-msg">
        <span class="reminder-content">
          <strong class="fr-mr-1v">{{ t('reminder') }}</strong>
          {{ t('no-accommodation') }}
        </span>
      </p>
    </div>
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
            :rules="{ required: 'field-required' }"
          >
            <div
              class="fr-input-group"
              :class="{
                'fr-input-group--error': !meta.valid && meta.touched
              }"
            >
              <label class="fr-label" for="link-title">
                {{ t('custom-link-title') }}
                <span class="fr-hint-text">{{ t('name-link') }}</span>
              </label>
              <input
                id="link-title"
                v-bind="field"
                class="fr-input"
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
                  class="fr-error-text"
                >{{ t(message) }}</span>
              </ErrorMessage>
            </div>
          </Field>
          <DsfrSelect
            v-model="linkValidity"
            :label="t('link-validity')"
            :hint="t('link-validity-desc')"
            :options="validityOptions"
            name="validity"
          />
        </div>
        <div class="fr-input-group link-content-group" :class="{ 'fr-input-group--error': hasSubmitted && shareTypeError }">
          <DsfrSelect
            :model-value="selectedShareType"
            :label="t('link-content')"
            :hint="t('link-content-desc')"
            :options="shareTypeOptions"
            name="shareType"
            @update:model-value="(val: string | number) => { selectedShareType = String(val) }"
          />
          <p v-if="hasSubmitted && shareTypeError" class="fr-error-text">
            {{ shareTypeError }}
          </p>
        </div>
        <p v-if="selectedShareType" class="fr-message fr-message--info fr-mt-2w fr-mb-3w">
          {{ selectedShareType === 'restricted' ? t('share-type-without-docs') : t('share-type-with-docs') }}
        </p>
        <DsfrTabs 
          ref="tabsRef"
          v-model="activeTab" 
          :tab-list-name="t('tab-list-name')" 
          :tab-titles
        >
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
              <p v-if="linkCopied" class="link-copied-message fr-mt-1w">
                {{ t('link-copied') }}
              </p>
              <LinkWarning />
            </div>
          </DsfrTabContent>
          <DsfrTabContent tab-id="tab-1" panel-id="panel-1">
            <p class="blue-text bold">{{ t('if-share-by-email') }}</p>
            <Field
              v-slot="{ field, meta }"
              name="email"
              :rules="emailValidation"
            >
              <div
                class="fr-input-group"
                :class="{
                  'fr-input-group--error': !meta.valid && meta.touched
                }"
              >
                <label class="fr-label" for="recipient-email">{{ t('recipient-email') }}</label>
                <input
                  id="recipient-email"
                  v-bind="field"
                  class="fr-input"
                  :class="{
                    'fr-input--error': !meta.valid && meta.touched
                  }"
                  name="email"
                  type="text"
                />
                <ErrorMessage v-slot="{ message }" name="email">
                  <span
                    v-if="message"
                    role="alert"
                    class="fr-error-text"
                  >{{ message }}</span>
                </ErrorMessage>
              </div>
            </Field>
            <Field
              v-slot="{ field, meta }"
              name="message"
              :rules="messageValidation"
            >
              <div
                class="fr-input-group"
                :class="{
                  'fr-input-group--error': !meta.valid && meta.touched
                }"
              >
                <label class="fr-label" for="email-message"> {{ t('custom-message') }} </label>
                <textarea
                  id="email-message"
                  v-bind="field"
                  class="fr-input"
                  :class="{
                    'fr-input--error': !meta.valid && meta.touched
                  }"
                  name="message"
                />
                <ErrorMessage v-slot="{ message }" name="message">
                  <span
                    v-if="message"
                    role="alert"
                    class="fr-error-text"
                  >{{ message }}</span>
                </ErrorMessage>
              </div>
            </Field>
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
import { onMounted, ref, useTemplateRef, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RiClipboardLine, RiLinksLine, RiMailLine } from '@remixicon/vue'
import { toast } from '@/components/toast/toastUtils'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { DsfrTabContent, DsfrTabs, DsfrSelect } from '@gouvminint/vue-dsfr'
import LinkWarning from './LinkWarning.vue'
import { Field, ErrorMessage, useForm, useField } from 'vee-validate'

const emit = defineEmits<{ refresh: [] }>()

const { t } = useI18n()

const activeTab = ref(0)
const fileLink = ref('')
const linkTitle = ref('')
const linkValidity = ref('30')
const linkCopied = ref(false)
const hasSubmitted = ref(false)

const { value: selectedShareType, errorMessage: shareTypeError, validate: validateShareType, resetField: resetShareType } = useField<string>('shareType', (value) => {
  if (!value) {
    return t('choice-required')
  }
  return true
}, { initialValue: '' })

const shareTypeOptions = computed(() => [
  { value: '', text: t('select-option'), disabled: true },
  { value: 'restricted', text: t('file-without-docs') },
  { value: 'full', text: t('file-with-docs') }
])

const validityOptions = computed(() => [
  { value: '7', text: t('x-days', [7]) },
  { value: '15', text: t('x-days', [15]) },
  { value: '30', text: t('x-days', [30]) },
  { value: '90', text: t('x-days', [90]) }
])

const { validate, resetForm } = useForm()

const EMAIL_MAX_LENGTH = 254 // RFC 5321 maximum email length

const isValidEmail = (email: string): boolean => {
  if (email.length > EMAIL_MAX_LENGTH) return false

  const atIndex = email.indexOf('@')
  if (atIndex < 1 || atIndex === email.length - 1) return false

  const local = email.substring(0, atIndex)
  const domain = email.substring(atIndex + 1)

  if (local.includes(' ') || domain.includes(' ')) return false

  if (domain.includes('@')) return false

  const dotIndex = domain.lastIndexOf('.')
  if (dotIndex < 1 || dotIndex === domain.length - 1) return false

  return true
}

const emailValidation = (value: string) => {
  if (!value && activeTab.value === 1) {
    return t('field-required')
  }
  if (value && !isValidEmail(value)) {
    return t('invalid-email')
  }
  return true
}

const messageValidation = (value: string) => {
  if (!value && activeTab.value === 1) {
    return t('message-required')
  }
  return true
}

const copyLinkBtn = useTemplateRef('copy-link')
const tabsRef = useTemplateRef('tabsRef')


// Ensure proper initialization for accessibility
onMounted(() => {
    activeTab.value = 0
    if (tabsRef.value?.$el) {
      const tabButtons = tabsRef.value.$el.querySelectorAll('[role="tab"]')
      
      tabButtons.forEach((button: Element, index: number) => {
        const newButton = button.cloneNode(true) as HTMLElement
        button.parentNode?.replaceChild(newButton, button)
        
        newButton.addEventListener('keydown', (e: Event) => {
          const event = e as KeyboardEvent
          const currentIndex = Array.from(tabButtons).indexOf(button as Element)
          
          if (event.key === 'ArrowRight') {
            event.preventDefault()
            const nextIndex = (currentIndex + 1) % tabButtons.length
            activeTab.value = nextIndex
            ;(tabButtons[nextIndex] as HTMLElement).focus()
          } else if (event.key === 'ArrowLeft') {
            event.preventDefault()
            const prevIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length
            activeTab.value = prevIndex
            ;(tabButtons[prevIndex] as HTMLElement).focus()
          }
        })
        
        newButton.addEventListener('click', () => {
          activeTab.value = index
        })
      })
    }
})

const tabTitles = computed(() => [
  {
    title: t('tab-generate-link'),
    tabId: 'tab-0',
    panelId: 'panel-0'
  },
  {
    title: t('tab-share-by-email'),
    tabId: 'tab-1',
    panelId: 'panel-1'
  }
])

const toString = (value: FormDataEntryValue | null) =>
  value && typeof value === 'string' ? value : ''

async function handleFormSubmit(event: Event) {
  hasSubmitted.value = true
  const [formValidation, shareTypeValidation] = await Promise.all([
    validate(),
    validateShareType()
  ])
  if (!formValidation.valid || !shareTypeValidation.valid) {
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
  const fullData = selectedShareType.value === 'full'
  const daysValid = Number(linkValidity.value)

  if (event.submitter.value === 'email') {
    const email = toString(data.get('email'))
    const message = toString(data.get('message'))
    AnalyticsService.shareByMail(fullData ? 'full' : 'resume')
    try {
      await ShareService.sendFileByMail({ email, fullData, daysValid, title, message })
      toast.success(t('share-mail-success'), null)
      linkForm.reset()
      resetForm()
      resetShareType()
      hasSubmitted.value = false
      linkTitle.value = ''
      linkValidity.value = '30'
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
      resetForm()
      resetShareType()
      hasSubmitted.value = false
      linkTitle.value = ''
      linkValidity.value = '30'
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
    linkCopied.value = true
    setTimeout(() => {
      linkCopied.value = false
    }, 10000)
  } catch (err) {
    toast.error(t('unable-to-copy'), copyLinkBtn.value)
    throw new Error('Unable to copy', { cause: err })
  }
}
</script>

<style scoped>
.header-section {
  display: grid;
  grid-template-areas:
    "title"
    "reminder"
    "button";
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-areas:
      "title button"
      "reminder reminder";
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 0;
  }

  h2 {
    grid-area: title;
  }

  .view-file-btn {
    grid-area: button;
    margin-bottom: 1.5rem;
    
    @media (min-width: 768px) {
      margin-bottom: 0;
    }
  }

  .reminder-msg {
    grid-area: reminder;
    margin-bottom: 0;
    
    @media (min-width: 768px) {
      margin-bottom: 1.5rem;
    }
    
    .reminder-content {
      display: inline;
    }
  }
}
.wrapper {
  border: 1px solid #000091;
  padding: 20px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 0.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
  }

  form {
    width: 100%;
    min-width: 0;
  }

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

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 1.5rem;

    > * {
      flex: 1;
    }
  }
}
.link-content-group {
  margin-top: 1.5rem;

  @media (min-width: 768px) {
    margin-top: 0;
  }
}
.generated-link {
  background-color: #ececfe;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.link-copied-message {
  color: #18753C;
  font-weight: 700;
  line-height: 24px;
  margin: 0;
}
</style>

<i18n>
{
  "en": {
    "tab-list-name": "Tab list",
    "tab-generate-link": "Generate a link",
    "tab-share-by-email": "Share by email",
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
    "select-option": "Select a file type",
    "share-by-email": "Share your file by email",
    "if-share-by-email": "If you wish to share by email:",
    "reminder": "Reminder:",
    "no-accommodation": "DossierFacile does not offer accommodation.",
    "share-mail-success": "Your file has been sent by mail",
    "copy-link": "Copy link",
    "link-copied": "The link has been copied.",
    "field-required": "This field is required",
    "choice-required": "A choice is required.",
    "message-required": "A message is required.",
    "share-type-without-docs": "Information about your situation, without supporting documents.",
    "share-type-with-docs": "Your complete file, with supporting documents",
  },
  "fr": {
    "tab-list-name": "Liste d'onglets",
    "tab-generate-link": "Générer un lien",
    "tab-share-by-email": "Partager par email",
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
    "select-option": "Sélectionnez un type de dossier",
    "generate-a-link": "Générer un lien",
    "recipient-email": "Email du destinataire*",
    "custom-message": "Message personnalisé*",
    "share-by-email": "Partager votre dossier par email",
    "if-share-by-email": "Si vous souhaitez partager par mail :",
    "reminder": "Rappel :",
    "no-accommodation": "DossierFacile ne propose pas de logement.",
    "share-mail-success": "Votre dossier a bien été partagé par email",
    "copy-link": "Copier le lien",
    "link-copied": "Le lien a bien été copié.",
    "field-required": "Ce champ est requis",
    "choice-required": "Un choix est requis.",
    "invalid-email": "Veuillez saisir une adresse email valide.",
    "message-required": "Un message est requis.",
    "share-type-without-docs": "Les informations sur votre situation, sans pièces justificatives.",
    "share-type-with-docs": "Votre dossier complet, avec pièces justificatives",
  }
}
</i18n>
