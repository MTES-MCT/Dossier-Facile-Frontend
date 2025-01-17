<template>
  <BackLinkRow label="En situation précaire" to="/documents-locataire/2" />
  <p>
    Cochez la case suivante si vous êtes dans une situation précaire (sans-abri, victime de
    violences conjugales par exemple). La phrase suivante sera ajouté à votre dossier :
    <em
      >Le candidat indique qu'il n'est pas en mesure de fournir de quittance de logement pour ces 3
      derniers mois</em
    >.
  </p>
  <div class="fr-checkbox-group fr-mb-2w displa">
    <input id="precarious-checkbox" type="checkbox" v-model="isPrecarious" />
    <label class="fr-label" for="precarious-checkbox">Vous êtes dans une situation précaire</label>
  </div>
  <div class="fr-highlight">
    <p>
      Vous êtes sans-abri ? Le <a href="tel:115">115</a> est un numéro national d'assistance et
      d'orientation pour les personnes sans-abri. Il est ouvert 7j/7 et 24h/24.
    </p>
  </div>
  <div class="fr-highlight">
    <p>
      Vous êtes victime de violences conjugales ? Le <a href="tel:3919">3919</a> est un numéro
      d’assistance et d’information destiné aux femmes victimes de violences. Le service est anonyme
      et gratuit. Des associations et organismes publics peuvent également vous venir en aide.
      Consultez la page
      <a href="https://www.service-public.fr/particuliers/vosdroits/F12544" target="_blank">
        violences conjugales du site service-public.fr</a
      >.
    </p>
  </div>
  <FooterContainer>
    <form @submit.prevent="submit" class="display--flex">
      <DfButton :disabled="!isPrecarious" class="fr-ml-auto"
        >Valider votre situation d'hébergement</DfButton
      >
    </form>
  </FooterContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BackLinkRow from './lib/BackLinkRow.vue'
import { useRouter } from 'vue-router'
import FooterContainer from '../footer/FooterContainer.vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import useTenantStore from '@/stores/tenant-store'
import { ToastService } from '@/services/ToastService'
import { DocumentService } from '@/services/DocumentService'

const CUSTOM_TEXT =
  "Le candidat indique qu'il n'est pas en mesure de fournir de quittance de logement pour ces 3 derniers mois"

const router = useRouter()
const store = useTenantStore()

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
