<template>
  <PropertyContainer>
    <div class="fr-grid-row fr-mt-3w fr-grid-row--gutters stretch">
      <div class="fr-col-12 fr-col-md-7">
        <NakedCard class="bg-purple-var fr-p-5w h-100">
          <Form @submit="onSubmit" class="h-100 fr-grid-col">
            <h2 class="fr-h4">{{ t('apply-existing-account') }}</h2>
            <div>{{ t('apply-existing-text') }}</div>

            <div class="bg-purple fr-checkbox-group">
              <Field
                name="authorize"
                id="authorize"
                type="checkbox"
                v-model="authorize"
                rules="isTrue"
                :value="true"
              />
              <label for="authorize"
                ><div>{{ t('authorize', [p.ownerName, p.address]) }}</div></label
              >
              <ErrorMessage class="fr-error-text" name="authorize" v-slot="{ message }">
                <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
              </ErrorMessage>
            </div>
            <div class="mt-auto align-end">
              <DfButton type="submit" :title="t('create-account')" :primary="true">
                {{ t('connect') }}
              </DfButton>
            </div>
          </Form>
        </NakedCard>
      </div>
      <div class="fr-col-12 fr-col-md-5">
        <NakedCard class="fr-p-5w h-100 fr-grid-col">
          <h2 class="fr-h4">{{ t('apply-new-account') }}</h2>
          <p>
            {{ t('apply-new-text-1') }}
          </p>
          <p>
            {{ t('apply-new-text-2') }}
          </p>
          <div class="align-end mt-auto">
            <a :href="`${TENANT_URL}/signup`" class="fr-btn fr-mt-3w">{{ t('create-account') }}</a>
          </div>
        </NakedCard>
      </div>
    </div>
  </PropertyContainer>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import NakedCard from 'df-shared-next/src/components/NakedCard.vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import DfButton from 'df-shared-next/src/Button/Button.vue';
import useOwnerStore from '../../store/owner-store';
import PropertyContainer from './PropertyContainer.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useOwnerStore();

const token = ref('');
const authorize = ref(false);

if (route.params.token) {
  token.value = route.params.token.toString();
  store.setPropertyToConsult(token.value).then(() => {
    if (Object.keys(store.getPropertyToConsult).length <= 0) {
      router.push({ name: 'Dashboard' });
    }
  });
} else {
  router.push({ name: 'Dashboard' });
}

const TENANT_URL = `${import.meta.env.VITE_FULL_TENANT_URL}`;
const p = computed(() => store.getPropertyToConsult);

function onSubmit() {
  window.location.replace(`/validConnexion/${token.value}`);
}
</script>

<style scoped lang="scss">
.h-100 {
  height: 100%;
}

.stretch {
  justify-content: stretch;
}

.align-end {
  text-align: end;
}

.mt-auto {
  margin-top: auto;
}
</style>

<i18n>
{
  "en": {
    "title": "consult",
    "back": "Back",
    "modify-property": "Modify my property",
    "delete-property": "Delete my property",
    "will-delete-property": "Are you sure you want to delete this property ?",
    "will-delete-applicants": "Are you sure you want to delete these applicants?",
    "share-modal-description": "If you want to give access to your property to a candidate, you can copy your file link and paste it into the message you send him.",
    "copy-link": "Copy",
    "share-modal-detail": "The copy button will copy this link to your clipboard",
    "link-copied": "Link copied",
    "verified-applicants": "My verified applicants ({count})",
    "date": "Date",
    "tenant-name": "Tenant name",
    "tenant-type": "Tenant type",
    "tenant-salary": "Monthly income",
    "guarantor-salary": "Guarantor monthly income",
    "rate": "Rate effort",
    "status": "Status",
    "ALONE": "Alone",
    "COUPLE": "Couple",
    "GROUP": "Roommate",
    "TO_PROCESS": "to process",
    "VALIDATED": "validated",
    "DECLINED": "declined",
    "INCOMPLETE": "incomplete",
    "apply-existing-account": "Apply using my DossierFacile account.",
    "apply-new-account": "Apply by creating a new DossierFacile account.",
    "create-account": "Create a DossierFacile",
    "authorize": "J'accepte que {0}, propriétaire situé au {1} ait accès aux informations de mon dossier et de ceux de mon(ma) conjoint·e ou de mon(mes) colocataire(s) le cas échéant. Conformément au RGPD, je peux révoquer cette autorisation à tout moment.",
    "connect": "Connect"
  },
  "fr": {
    "title": "Consultation",
    "back": "Retour",
    "modify-property": "Modifier ma propriété",
    "delete-property": "Supprimer ma propriété",
    "will-delete-property": "Êtes-vous sûr de vouloir supprimer cette propriété ?",
    "will-delete-applicants": "Êtes-vous sûr de vouloir supprimer ce(s) locataire(s) ?",
    "share-modal-description": "Si vous voulez donner accès à votre propriété à un candidat, vous pouvez copier votre lien dossier et le coller dans le message que vous lui enverrez.",
    "copy-link": "Copier",
    "share-modal-detail": "Le bouton copier copiera ce lien dans votre presse papier",
    "link-copied": "Lien copié",
    "verified-applicants": "Mes candidatures vérifiées ({count})",
    "date": "Date de dernière modification",
    "tenant-name": "Nom du locataire",
    "tenant-type": "Type de dossier",
    "tenant-salary": "Revenus nets mensuels",
    "guarantor-salary": "Revenus Garants nets mensuels",
    "rate": "Taux d'effort",
    "status": "Statut",
    "ALONE": "Seul·e",
    "COUPLE": "Couple",
    "GROUP": "Colocation",
    "TO_PROCESS": "En cours de traitement",
    "VALIDATED": "Vérifié",
    "DECLINED": "Modification demandée",
    "INCOMPLETE": "Non terminé",
    "apply-existing-account": "Candidater en utilisant mon compte DossierFacile.",
    "apply-new-account": "Candidater en créant un compte DossierFacile.",
    "apply-existing-text": "DossierFacile est une startup d'État qui vous permet de créer votre dossier de location intelligent et de le partager avec des propriétaires",
    "apply-new-text-1": "Si vous n'avez pas de compte, vous pouvez en créer un et revenir ultérieurement sur cette page.",
    "apply-new-text-2": "Notre dossier est facile à remplir (en moins de 3 minutes c'est promis) et en plus il est conforme à la loi et réutilisable pour toutes vos autres visites !",
    "create-account": "Créer un DossierFacile",
    "authorize": "J'accepte que {0}, propriétaire situé au {1} ait accès aux informations de mon dossier et de ceux de mon(ma) conjoint·e ou de mon(mes) colocataire(s) le cas échéant. Conformément au RGPD, je peux révoquer cette autorisation à tout moment.",
    "connect": "Se connecter"
  }
}
</i18n>
