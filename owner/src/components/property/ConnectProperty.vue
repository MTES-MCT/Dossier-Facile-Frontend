<template>
  <div class="fr-container fr-container--fluid fluid-full-width position--relative">
    <div class="bg-pic position--absolute"></div>
    <div class="fr-container position--relative mt-100 fr-mb-5w">
      <div class="fr-grid-row space-between fr-mb-3w">
        <div class="fr-grid-row">
          <h1 class="title">{{ t('apply-to', [p.address]) }}</h1>
        </div>
      </div>
      <NakedCard class="subtitle">
        <div class="fr-grid-row align-items--center w100">
          <div class="fr-col-md-1 fr-col-2 text-center">
            <PropertyIcon :type="propertyType || ''"></PropertyIcon>
          </div>
          <div class="fr-col">
            <div
              v-html="
                `${t(titleKey)} ${t('rent', {
                  rentCost: p.rentCost,
                  chargesCost: p.chargesCost,
                })}`
              "
            ></div>
          </div>
        </div>
      </NakedCard>
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
                  ><div v-html="t('authorize', [p.ownerName, p.address])"></div
                ></label>
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
              <a :href="TENANT_URL" class="fr-btn fr-mt-3w">{{ t('create-account') }}</a>
            </div>
          </NakedCard>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import NakedCard from 'df-shared-next/src/components/NakedCard.vue';
import { useToast } from 'vue-toastification';
import { Form, Field, ErrorMessage } from 'vee-validate';
import DfButton from 'df-shared-next/src/Button/Button.vue';
import PropertyIcon from './PropertyIcon.vue';
import useOwnerStore from '../../store/owner-store';
import keycloakTenant from '../../plugin/KeycloakTenant';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useOwnerStore();
const toast = useToast();

const token = ref(0);
const authorize = ref(false);

if (route.params.token) {
  token.value = route.params.token;
  store.setPropertyToConsult(token.value).then(() => {
    if (Object.keys(store.getPropertyToConsult).length <= 0) {
      router.push({ name: 'Dashboard' });
    }
  });
} else {
  router.push({ name: 'Dashboard' });
}

const TENANT_URL = `${import.meta.env.VITE_FULL_TENANT_URL}`;
const OWNER_URL = `${import.meta.env.VITE_OWNER_URL}`;
const p = computed(() => store.getPropertyToConsult);
const propertyType = computed(() => store.getPropertyToConsult?.type);
const propertyFurnished = computed(() => store.getPropertyToConsult?.furniture);

const titleKey = computed(() => {
  if (propertyType.value === 'HOUSE') {
    if (propertyFurnished.value === 'FURNISHED') {
      return 'house-furnished';
    }
    return 'house-unfurnished';
  }
  if (propertyType.value === 'APARTMENT') {
    if (propertyFurnished.value === 'FURNISHED') {
      return 'apartment-furnished';
    }
    return 'apartment-unfurnished';
  }
  if (propertyFurnished.value === 'FURNISHED') {
    return 'other-furnished';
  }
  return 'other-unfurnished';
});

function onSubmit() {
  window.open(`/validConnexion/${token.value}`);
}
</script>

<style scoped lang="scss">
.bg-pic {
  width: 100%;
  height: 320px;
  top: 0;
  left: 0;
  background-size: cover !important;
  background-position: 50% 40% !important;
  background-image: linear-gradient(0deg, rgba(22, 22, 22, 0.7), rgba(22, 22, 22, 0.7)),
    url('../../assets/salon.webp');
  background-color: #314467;
  z-index: 0;
}

.mt-100 {
  margin-top: 200px;
}

.btn--white {
  color: white;
  box-shadow: inset 0 0 0 1px white;
  &:hover {
    color: inherit;
  }
}

.h-100 {
  height: 100%;
}

.subtitle {
  height: 100px;
  display: flex;
  align-items: center;
}

.title {
  color: white;
  margin-left: 2rem;
  font-size: 2rem;
  line-height: 2rem;
}

.md-24 {
  width: 2rem;
}

.tag {
  display: flex;
  align-items: center;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  border-radius: 1rem;
  &.to-process {
    color: #82467e;
    background-color: #fef3fd;
  }

  &.validated {
    color: #37635f;
  }

  &.declined {
    color: #9c0400;
  }
}

.arrow_down {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAaCAYAAABPY4eKAAAAAXNSR0IArs4c6QAAAvlJREFUSA29Vk1PGlEUHQaiiewslpUJiyYs2yb9AyRuJGm7c0VJoFXSX9A0sSZN04ULF12YEBQDhMCuSZOm1FhTiLY2Rky0QPlQBLRUsICoIN/0PCsGyox26NC3eTNn3r3n3TvnvvsE1PkwGo3yUqkkEQqFgw2Mz7lWqwng7ztN06mxsTEv8U0Aam5u7r5EInkplUol/f391wAJCc7nEAgE9Uwmkzo4OPiJMa1Wq6cFs7Ozt0H6RqlUDmJXfPIx+qrX69Ti4mIyHA5r6Wq1egND+j+IyW6QAUoul18XiUTDNHaSyGazKcZtdgk8wqhUKh9o/OMvsVgsfHJy0iWqVrcQNRUMBnd6enqc9MjISAmRP3e73T9al3XnbWNjIw2+KY1Gc3imsNHR0YV4PP5+d3e32h3K316TySQFoX2WyWR2glzIO5fLTSD6IElLNwbqnFpbWyO/96lCoai0cZjN5kfYQAYi5H34fL6cxWIZbya9iJyAhULBHAqFVlMpfsV/fHxMeb3er+Vy+VUzeduzwWC45XA4dlD/vEXvdDrj8DvURsYEWK3WF4FA4JQP9mg0WrHZbEYmnpa0NxYgPVObm5teiLABdTQT8a6vrwdRWhOcHMzMzCiXlpb2/yV6qDttMpkeshEzRk4Wo/bfoe4X9vb2amzGl+HoXNT29vZqsVi0sK1jJScG+Xx+HGkL4Tew2TPi5zUdQQt9otPpuBk3e0TaHmMDh1zS7/f780S0zX6Yni+NnBj09fUZUfvudDrNZN+GkQbl8Xi8RLRtHzsB9Hr9nfn5+SjSeWUCXC7XPq5kw53wsNogjZNohYXL2EljstvtrAL70/mVaW8Y4OidRO1/gwgbUMvcqGmcDc9aPvD1gnTeQ+0nmaInokRj0nHh+uvIiVOtVvt2a2vLv7Ky0tL3cRTXIcpPAwMDpq6R4/JXE4vFQ5FI5CN+QTaRSFCYc8vLy1l0rge4ARe5kJ/d27kYkLXoy2Jo4C7K8CZOsEBvb+9rlUp1xNXPL7v3IDwxvPD6AAAAAElFTkSuQmCC');
}
.arrow_up {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAaCAYAAACgoey0AAAAAXNSR0IArs4c6QAAAwpJREFUSA21Vt1PUmEYP4dvkQ8JFMwtBRocWAkDbiqXrUWXzU1rrTt0bdVqXbb1tbW16C9IBUSmm27cODdneoXjputa6069qwuW6IIBIdLvdaF4OAcOiGeDc87zPs/vd57P96WpFq7p6enbGo1mjKZpeTabjU1MTCRagGnOZHFxcXxtbe1XKpUq7+zslJeXl//Mz8+Hy+Uy3RxSE9qTk5M3otFooVQqgef4Wl9f343FYoEmoISrxuNxFX5f9vb2jhn/PxUKhfLS0tIPfFifUESRUMV8Pv/M6XReRm5rTGQyGeXxeGxYe1ezeBpBOBx2rKysbO7v79d4Wy3Y2Nj4GQqFbgnhaugxwiuGJx99Pp9FLBbXxYTXvTqd7v3MzIy6riIWGxJnMpl7AwMD14xGYyMsSq1WUyQdUqn0eSPlusQIsbGrq+vl4OCgvhFQZd1utyv1en0gEolcqsi47nWJlUrlG5fLZVcoFFy2nDKSDpIWlUoVTCQSEk4lCHmJMZ2GTCbTiMVikfIZ88l7enoos9l8dXt7+z6fDicxSJUokqDX6xXcl2wCROoc0vQCWL3sNfLOSdzR0fHY4XC4tVotl40gmVwup9xuN4OQv+UyqCFGH9rg7SOGYVRcBs3IEG4J0nVnamrqOtvuBDGGgQg9+wHFcVEi4a0LNkbdd6TrPKo8ODc311mteIIYjT/a398/jK+s1jnVM0kXoufCFvq0GuiIGEVgQIhfoygM1QrteEa9dAL7ITiYCt4RMabOK5AyKKzKWtvupLcRciu8D5J0EuDDPyT/Snd39yh6VtY2NhYQSR9G79Ds7OxdskRjEyAufvb7/cPoO5Z6e1+xtVKrq6vfcFzyi/A3ZrPZ3GdNSlwgo5ekE4X2RIQGf2C1WlufFE0GBeGWYQ8YERWLxQtnUVB830MKLZfL9RHir8lkssCn2G751tZWEWe03zTKm15YWPiEiXXTYDB0Ig/t7yd8PRws4EicwWHxO4jHD8/C5HiTTqd1BwcHFozKU89origB+y/kmzgYpgOBQP4fGmUiZmJ+WNgAAAAASUVORK5CYII=');
}
.arrow {
  float: right;
  width: 12px;
  height: 15px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position-y: bottom;
}

.tenant-token-link {
  display: flex;
  justify-content: right;
}

.additional-td {
  border: none !important;
  background: var(--background-default-grey);
}

tr {
  cursor: pointer;
  &.validated {
    background-color: #dffdf7;
  }

  &.declined {
    background-color: #ffe9e9;
  }
}

.good {
  background-color: #447049;
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 2.5rem;
}

.tenant-type {
  display: inline-block;
  border: solid 0.5px #6a6af4;
  border-radius: 1.125rem;
  &.validated {
    border: solid 0.5px #18753c;
  }
  &.declined {
    border: solid 0.5px #cecece;
  }
  margin: 0.5rem 0.5px 0.4rem 0;
  padding: 0.4rem 0.5rem;
}

.desktop {
  display: none !important;
  @media all and (min-width: 768px) {
    display: table-cell !important;
  }
}
.w30 {
  min-width: 30px;
  text-align: center;
}

.delete-btn-container {
  margin-left: auto;
  margin-right: 0;
  text-align: right;
}

.bg-purple-var {
  --background-default-grey: #e5e5f4;
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
    "share-modal-title": "The link of my property",
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
    "house-furnished": "A furnished house",
    "house-unfurnished": "An unfurnished house",
    "apartment-furnished": "A furnished apartment",
    "apartment-unfurnished": "A unfurnished apartment",
    "other-furnished": "A furnished property",
    "other-unfurnished": "A unfurnished property",
    "rent": "with a rent of <span class='blue-text'>{rentCost}€</span> and charges of <span class='blue-text'>{chargesCost}€</span>",
    "apply-to": "Apply to {0}",
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
    "share-modal-title": "Le lien de ma propriété",
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
    "house-furnished": "Une maison meublée",
    "house-unfurnished": "Une maison non meublée",
    "apartment-furnished": "Un appartement meublé",
    "apartment-unfurnished": "Un appartement non meublé",
    "other-furnished": "Un bien meublé",
    "other-unfurnished": "Un bien non meublé",
    "rent": "dont le loyer mensuel est de <span class='blue-text'>{rentCost}€</span> et les charges de <span class='blue-text'>{chargesCost}€</span>",
    "apply-to": "Candidater au {0}",
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
