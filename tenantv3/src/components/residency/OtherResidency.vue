<template>
  <BackLinkRow
    :label="t('other-residency')"
    to="../2"
    @edit="AnalyticsService.editSituation(category, 'other-residency')"
  />
  <i18n-t :keypath="textKey + '.tick-box'" tag="p">
    <em>{{ t('cant-provide-receipts') }}</em>
  </i18n-t>
  <div class="fr-checkbox-group fr-py-2w fr-mb-3w">
    <input
      id="precarious-checkbox"
      v-model="isPrecarious"
      type="checkbox"
      @edit="AnalyticsService.selectPrecariousness"
    />
    <label class="fr-label" for="precarious-checkbox">{{ t(textKey + '.you-precarious') }}</label>
  </div>
  <div class="fr-highlight">
    <i18n-t keypath="info-115" tag="p">
      <a href="tel:115" class="phone-link"
        >115
        <RiPhoneFill size="1rem" aria-hidden="true" />
      </a>
    </i18n-t>
  </div>
  <div class="fr-highlight">
    <i18n-t keypath="info-3919" tag="p">
      <template #tel>
        <a href="tel:3919" class="phone-link">
          3919
          <RiPhoneFill size="1rem" aria-hidden="true" />
        </a>
      </template>
      <template #page>
        <a href="https://www.service-public.fr/particuliers/vosdroits/F12544" target="_blank">{{
          t('domestic-violence-page')
        }}</a>
      </template>
    </i18n-t>
  </div>
  <ResidencyFooter ref="footer" :on-submit="submit" :enabled="isPrecarious" />
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import BackLinkRow from './lib/BackLinkRow.vue'
import { useRouter } from 'vue-router'
import { useTenantStore } from '@/stores/tenant-store'
import { RiPhoneFill } from '@remixicon/vue'
import { useI18n } from 'vue-i18n'
import { AnalyticsService } from '@/services/AnalyticsService'
import ResidencyFooter from './lib/ResidencyFooter.vue'
import { useResidencyState } from './residencyState'
import { toast } from '@/components/toast/toastUtils'

const CUSTOM_TEXT =
  "Le candidat indique qu'il n'est pas en mesure de fournir de quittance de logement pour ces 3 derniers mois"

const router = useRouter()
const store = useTenantStore()
const { t } = useI18n()
const footer = useTemplateRef('footer')
const residencyState = useResidencyState()
const { category, textKey } = residencyState

const residencyDoc = residencyState.document.value
const isPrecarious = ref(
  residencyDoc?.documentSubCategory === 'OTHER_RESIDENCY' && residencyDoc.customText === CUSTOM_TEXT
)

const goNext = () => {
  router.push(residencyState?.nextStep)
}

const submit = () => {
  const formData = new FormData()
  formData.append('noDocument', 'true')
  formData.append('customText', CUSTOM_TEXT)
  formData.append('typeDocumentResidency', 'OTHER_RESIDENCY')
  residencyState?.addData?.(formData)
  store
    .saveTenantResidency(formData)
    .then(goNext)
    .catch((err) => {
      console.error(err)
      toast.error(t('errors.submit-failed'), footer.value?.submit)
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
    "cant-provide-receipts": "The applicant indicates that he/she is unable to provide a housing receipt for the last 3 months",
    "info-115": "Are you homeless? {0} is a national assistance and referral number for homeless people. It is open 24/7.",
    "info-3919": "Are you a victim of domestic violence? {tel} is an assistance and information number for women victims of violence. The service is anonymous and free of charge. Associations and public bodies can also help you. Visit the {page}.",
    "domestic-violence-page": "domestic violence page on the service-public.fr website",
    "validate-residency": "Validate your housing situation",
    "tenant": {
      "tick-box": "Tick the following box if you are in a precarious situation (homeless, victim of domestic violence, for example). The following sentence will be added to your file: {0}.",
      "you-precarious": "You are in a precarious situation",
    },
    "couple": {
      "tick-box": "Tick the following box if your spouse is in a precarious situation (homeless, victim of domestic violence, for example). The following sentence will be added to your file: {0}.",
      "you-precarious": "Your spouse is in a precarious situation",
    }
  },
  "fr": {
    "other-residency": "En situation précaire",
    "cant-provide-receipts": "Le candidat indique qu'il n'est pas en mesure de fournir de quittance de logement pour ces 3 derniers mois",
    "info-115": "Vous êtes sans-abri ? Le {0} est un numéro national d'assistance et d'orientation pour les personnes sans-abri. Il est ouvert 7j/7 et 24h/24.",
    "info-3919": "Vous êtes victime de violences conjugales ? Le {tel} est un numéro d’assistance et d’information destiné aux femmes victimes de violences. Le service est anonyme et gratuit. Des associations et organismes publics peuvent également vous venir en aide. Consultez la page {page}. ",
    "domestic-violence-page": "violences conjugales du site service-public.fr",
    "validate-residency": "Valider votre situation d'hébergement",
    "tenant": {
      "tick-box": "Cochez la case suivante si vous êtes dans une situation précaire (sans-abri, victime de violences conjugales par exemple). La phrase suivante sera ajouté à votre dossier : {0}.",
      "you-precarious": "Vous êtes dans une situation précaire",
    },
    "couple": {
      "tick-box": "Cochez la case suivante si votre conjoint est dans une situation précaire (sans-abri, victime de violences conjugales par exemple). La phrase suivante sera ajouté à votre dossier : {0}.",
      "you-precarious": "Votre conjoint est dans une situation précaire",
    }
  }
}
</i18n>
