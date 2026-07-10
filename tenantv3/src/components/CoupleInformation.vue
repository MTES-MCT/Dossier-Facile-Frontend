<template>
  <div>
    <NakedCard class="fr-p-md-5w fr-mb-2w">
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12">
          <h1 class="fr-h4">
            {{ t('partner-email-title') }}
          </h1>
          <DsfrButton
            tertiary
            size="sm"
            type="button"
            :label="t('more-information')"
            @click="isModalOpened = true"
          />
          <DsfrModalPatch
            v-model:is-opened="isModalOpened"
            :title="t('more-information')"
            icon="ri:arrow-right-line"
            :is-alert="isAlert"
          >
            <template #default>
              <CoupleInformationHelp />
            </template>
          </DsfrModalPatch>
        </div>
        <div class="fr-col-12 fr-mt-3w">
          <TextField
            v-model.trim="coTenant.lastName"
            :field-label="t('spouseLastName')"
            name="coTenantLastName"
            validation-rules="required|onlyAlpha"
            :disabled="disableNameFields"
            @input="handleInput"
          />
        </div>
        <div class="fr-col-12 fr-mt-3w">
          <TextField
            v-model.trim="coTenant.firstName"
            :field-label="t('spouseFirstName')"
            name="coTenantFirstName"
            validation-rules="required|onlyAlpha"
            :disabled="disableNameFields"
            @input="handleInput"
          />
        </div>
        <div class="fr-col-12 fr-mt-3w">
          <TextField
            v-model.trim="coTenant.email"
            :field-label="t('spouseEmail')"
            name="email"
            type="email"
            :validation-rules="emailRules"
            :disabled="disableEmailField"
            @input="handleInput"
          />
        </div>
      </div>
      <!-- The consent was already given when the co-tenant account was created -->
      <div v-if="!disableEmailField" class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12 fr-mt-3w">
          <div class="bg-purple fr-p-2w">
            <Field
              v-slot="{ errors }"
              v-model="authorize"
              name="authorize"
              type="checkbox"
              :rules="{ isTrue: true }"
              :value="true"
            >
              <DsfrCheckbox
                id="authorize"
                v-model="authorize"
                name="authorize"
                :value="true"
                :label="t('acceptAuthor')"
                :error-message="errors[0] ? t(errors[0]) : ''"
                @change="updateAuthorize"
              />
            </Field>
            <ul class="fr-mb-0">
              <li>{{ t('acceptAuthorAccess') }}</li>
              <li>{{ t('acceptAuthorShare') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </NakedCard>
  </div>
</template>

<script setup lang="ts">
import { User } from 'df-shared-next/src/models/User'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import CoupleInformationHelp from './helps/CoupleInformationHelp.vue'
import { computed, onMounted, ref } from 'vue'
import { useTenantStore } from '@/stores/tenant-store'
import { Field } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'
import DsfrModalPatch from 'df-shared-next/src/components/patches/DsfrModalPatch.vue'
import { DsfrButton, DsfrCheckbox } from '@gouvminint/vue-dsfr'
import TextField from './form/TextField.vue'

const { t } = useI18n()
const store = useTenantStore()

const user = computed(() => store.user)

const coTenant = ref<CoTenant>(new User())
const coTenants = defineModel<CoTenant[]>({
  default: () => []
})
const authorize = ref(false)
const disableNameFields = ref(false)
const disableEmailField = ref(false)

// modal logic
const isModalOpened = ref(false)
const isAlert = ref(false)

// The email cannot be changed once the co-tenant account is created
const emailRules = computed(() =>
  disableEmailField.value ? 'email' : `required|email|differentFrom:${user.value.email}`
)

onMounted(() => {
  if ((user.value.apartmentSharing?.tenants.length || 0) > 1) {
    const partner = user.value.apartmentSharing?.tenants.find((t) => {
      return t.email != user.value.email
    })
    coTenant.value = partner || coTenant.value
    if (coTenant.value.firstName || coTenant.value.lastName) {
      disableNameFields.value = true
    }
    if (coTenant.value.email?.length > 0) {
      disableEmailField.value = true
    }
  }
})

function handleInput() {
  if (coTenant.value.firstName && coTenant.value.lastName) {
    coTenants.value = [coTenant.value]
  }
}

function updateAuthorize() {
  store.spouseAuthorize = authorize.value
}
</script>

<style scoped lang="scss">
.overflow--hidden {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.icon-btn {
  display: block;
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 50%;
  overflow: hidden;
}

.center-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.round-icon {
  border-radius: 50%;
  background-color: var(--primary);
  padding: 0.25rem;
}

.nowrap {
  flex-wrap: nowrap;
  overflow: auto;
}

.max-content {
  max-width: max-content;
  @media all and (max-width: 420px) {
    max-width: 200px;
  }
}
</style>

<i18n lang="json">
{
  "en": {
    "spouseFirstName": "First Name",
    "spouseLastName": "Last Name",
    "spouseEmail": "Email",
    "acceptAuthor": "I agree that my co-tenant:",
    "acceptAuthorAccess": "will have access to my documents and those of my guarantor, if applicable, once both of our applications have been validated.",
    "acceptAuthorShare": "may share the documents in our application with landlords, lessors or property services that are partners of DossierFacile.",
    "partner-email-title": "Your co-tenant's contact details",
    "more-information": "How does it work?"
  },
  "fr": {
    "spouseFirstName": "Prénom",
    "spouseLastName": "Nom",
    "spouseEmail": "Email",
    "acceptAuthor": "J’accepte que mon conjoint :",
    "acceptAuthorAccess": "ait accès à mes documents ainsi qu’à ceux de mon garant le cas échéant une fois que nos deux dossiers auront été validés.",
    "acceptAuthorShare": "puisse partager les pièces de notre dossier à des propriétaires, des bailleurs ou des services immobiliers partenaires de DossierFacile.",
    "partner-email-title": "Les coordonnées de votre conjoint(e)",
    "more-information": "Comment ça marche ?"
  }
}
</i18n>
