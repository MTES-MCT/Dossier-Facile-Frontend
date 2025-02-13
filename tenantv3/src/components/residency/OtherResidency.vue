<template>
  <BackLinkRow
    :label="t('other-residency')"
    to="/documents-locataire/2"
    @edit="AnalyticsService.editSituation('residency', 'other-residency')"
  />
  <i18n-t keypath="tick-box" tag="p">
    <em>{{ t('cant-provide-receipts') }}</em>
  </i18n-t>
  <div class="fr-checkbox-group fr-py-2w fr-mb-3w">
    <input
      id="precarious-checkbox"
      type="checkbox"
      v-model="isPrecarious"
      @edit="AnalyticsService.selectPrecariousness"
    />
    <label class="fr-label" for="precarious-checkbox">{{ t('you-precarious') }}</label>
  </div>
  <div class="fr-highlight">
    <i18n-t keypath="info-115" tag="p">
      <a href="tel:115" class="phone-link"
        >115
        <RiPhoneFill size="1rem" />
      </a>
    </i18n-t>
  </div>
  <div class="fr-highlight">
    <i18n-t keypath="info-3919" tag="p">
      <template #tel>
        <a href="tel:3919" class="phone-link">
          3919
          <RiPhoneFill size="1rem" />
        </a>
      </template>
      <template #page>
        <a href="https://www.service-public.fr/particuliers/vosdroits/F12544" target="_blank">{{
          t('domestic-violence-page')
        }}</a>
      </template>
    </i18n-t>
  </div>
  <ResidencyFooter
    previous-page="/documents-locataire/2"
    :on-submit="submit"
    :enabled="isPrecarious"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BackLinkRow from './lib/BackLinkRow.vue'
import { useRouter } from 'vue-router'
import useTenantStore from '@/stores/tenant-store'
import { ToastService } from '@/services/ToastService'
import { DocumentService } from '@/services/DocumentService'
import { RiPhoneFill } from '@remixicon/vue'
import { useI18n } from 'vue-i18n'
import { AnalyticsService } from '@/services/AnalyticsService'
import ResidencyFooter from './lib/ResidencyFooter.vue'

const CUSTOM_TEXT =
  "Le candidat indique qu'il n'est pas en mesure de fournir de quittance de logement pour ces 3 derniers mois"

const router = useRouter()
const store = useTenantStore()
const { t } = useI18n()

const residencyDoc = DocumentService.getUserDocs('RESIDENCY')[0]
const isPrecarious = ref(
  residencyDoc?.documentSubCategory === 'OTHER_RESIDENCY' && residencyDoc.customText === CUSTOM_TEXT
)

const goNext = () => {
  router.push({ name: 'TenantProfessional' })
}

const submit = () => {
  const formData = new FormData()
  formData.append('customText', CUSTOM_TEXT)
  formData.append('typeDocumentResidency', 'OTHER_RESIDENCY')
  store
    .saveTenantResidency(formData)
    .then(goNext)
    .catch((err) => {
      console.error(err)
      ToastService.error()
    })
}
</script>

<style scoped>
.phone-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  .remixicon {
    margin-top: -2px;
  }
}
</style>

<i18n>
{
  "en": {
    "other-residency": "In a precarious situation",
    "tick-box": "Tick the following box if you are in a precarious situation (homeless, victim of domestic violence, for example). The following sentence will be added to your file: {0}.",
    "cant-provide-receipts": "The applicant indicates that he/she is unable to provide a housing receipt for the last 3 months",
    "you-precarious": "You are in a precarious situation",
    "info-115": "Are you homeless? {0} is a national assistance and referral number for homeless people. It is open 24/7.",
    "info-3919": "Are you a victim of domestic violence? {tel} is an assistance and information number for women victims of violence. The service is anonymous and free of charge. Associations and public bodies can also help you. Visit the {page}.",
    "domestic-violence-page": "domestic violence page on the service-public.fr website",
    "validate-residency": "Validate your housing situation"
  },
  "fr": {
    "other-residency": "En situation précaire",
    "tick-box": "Cochez la case suivante si vous êtes dans une situation précaire (sans-abri, victime de violences conjugales par exemple). La phrase suivante sera ajouté à votre dossier : {0}.",
    "cant-provide-receipts": "Le candidat indique qu'il n'est pas en mesure de fournir de quittance de logement pour ces 3 derniers mois",
    "you-precarious": "Vous êtes dans une situation précaire",
    "info-115": "Vous êtes sans-abri ? Le {0} est un numéro national d'assistance et d'orientation pour les personnes sans-abri. Il est ouvert 7j/7 et 24h/24.",
    "info-3919": "Vous êtes victime de violences conjugales ? Le {tel} est un numéro d’assistance et d’information destiné aux femmes victimes de violences. Le service est anonyme et gratuit. Des associations et organismes publics peuvent également vous venir en aide. Consultez la page {page}. ",
    "domestic-violence-page": "violences conjugales du site service-public.fr",
    "validate-residency": "Valider votre situation d'hébergement"
  }
}
</i18n>
