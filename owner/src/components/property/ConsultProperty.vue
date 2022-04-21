<template>
  <div class="fr-container fr-container--fluid fluid-full-width position--relative">
    <div class="bg-pic position--absolute"></div>
    <div class="fr-container position--relative mt-100">
      <div class="fr-grid-row space-between fr-mb-3w">
        <div class="fr-grid-row">
          <router-link class="fr-btn btn--white fr-btn--secondary" to="/">{{
            t("back")
          }}</router-link>
          <div class="title">{{ name }}</div>
        </div>
        <div class="fr-grid-row">
          <VGouvFrModal>
            <template v-slot:button>
              <button class="fr-btn btn--white fr-btn--secondary">
                <span class="material-icons md-24"> share_variant </span>
              </button>
            </template>
            <template v-slot:title>
              {{ t("share-modal-title") }}
            </template>
            <template v-slot:content>
              <p>
                {{ t("share-modal-description") }}
              </p>
              <div class="fr-grid-row fr-mb-3w">
                <div class="align-self--center">
                  {{ token }}
                </div>
                <div>
                  <button class="fr-btn fr-ml-5w" @click="copyToken">
                    {{ t("copy-link") }}
                  </button>
                </div>
              </div>
              <p>
                {{ t("share-modal-detail") }}
              </p>
            </template>
          </VGouvFrModal>
          <button
            @click="editProperty()"
            class="fr-btn btn--white fr-btn--secondary fr-ml-1w"
          >
            {{ t("modify-property") }}
          </button>
          <button
            class="fr-btn btn--white fr-btn--secondary fr-ml-1w"
            @click="confirmDelete = true"
          >
            {{ t("delete-property") }}
          </button>
          <ConfirmModal
            v-if="confirmDelete"
            @valid="validDeleteFile()"
            @cancel="undoDeleteFile()"
          >
            {{ t("will-delete-property") }}
          </ConfirmModal>
        </div>
      </div>
      <NakedCard class="h-100">
        <div class="fr-grid-row align-items--center">
          <PropertyIcon :type="propertyType"></PropertyIcon>
          {{ buildTitle }}
        </div>
      </NakedCard>
      <NakedCard class="fr-mt-3w">
        <h1 class="fr-h4">
          {{ t("verified-applicants", { count: verifiedApplicantsCount }) }}
        </h1>
        <table>
          <thead>
            <tr>
              <th @click="sortTable('date')">
                {{ t("date") }}
                <div
                  class="arrow"
                  v-if="'date' == sortColumn"
                  v-bind:class="ascending ? 'arrow_up' : 'arrow_down'"
                ></div>
              </th>
              <th @click="sortTable('tenantName')">
                {{ t("tenant-name") }}
                <div
                  class="arrow"
                  v-if="'tenantName' == sortColumn"
                  v-bind:class="ascending ? 'arrow_up' : 'arrow_down'"
                ></div>
              </th>
              <th @click="sortTable('tenantType')">
                {{ t("tenant-type") }}
                <div
                  class="arrow"
                  v-if="'tenantType' == sortColumn"
                  v-bind:class="ascending ? 'arrow_up' : 'arrow_down'"
                ></div>
              </th>
              <th @click="sortTable('tenantSalary')">
                {{ t("tenant-salary") }}
                <div
                  class="arrow"
                  v-if="'tenantSalary' == sortColumn"
                  v-bind:class="ascending ? 'arrow_up' : 'arrow_down'"
                ></div>
              </th>
              <th @click="sortTable('guarantorSalary')">
                {{ t("guarantor-salary") }}
                <div
                  class="arrow"
                  v-if="'guarantorSalary' == sortColumn"
                  v-bind:class="ascending ? 'arrow_up' : 'arrow_down'"
                ></div>
              </th>
              <th @click="sortTable('rate')">
                {{ t("rate") }}
                <div
                  class="arrow"
                  v-if="'rate' == sortColumn"
                  v-bind:class="ascending ? 'arrow_up' : 'arrow_down'"
                ></div>
              </th>
              <th @click="sortTable('status')">
                {{ t("status") }}
                <div
                  class="arrow"
                  v-if="'status' == sortColumn"
                  v-bind:class="ascending ? 'arrow_up' : 'arrow_down'"
                ></div>
              </th>
            </tr>
          </thead>
          <tbody v-for="(tenant, k) in getTenants()" :key="k">
            <tr @click="setShowTenant(k)">
              <td>
                <span>{{ formatDate(tenant.date || new Date()) }}</span>
              </td>
              <td>
                <span>{{ tenant.tenantName }}</span>
              </td>
              <td>
                <span>{{ t(tenant.tenantType || "") }}</span>
              </td>
              <td>
                <span>{{ tenant.tenantSalary }}</span>
              </td>
              <td>
                <span>{{ tenant.guarantorSalary }}</span>
              </td>
              <td>
                <span>{{ tenant.rate }}</span>
              </td>
              <td>
                <span>{{ t(tenant.status || "") }}</span>
              </td>
            </tr>
            <tr v-if="tenantIdToShow === k">
              <td colspan="7" class="additional-td">
                <div class="tenant-token-link fr-mb-3w fr-mt-1w">
                  <a class="fr-btn" :href="`${TENANT_URL}/public-file/${tenant?.tokenPublic}`">{{
                    t("download-full-file")
                  }}</a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </NakedCard>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { Composer, useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import NakedCard from 'df-shared/src/components/NakedCard.vue';
import ConfirmModal from 'df-shared/src/components/ConfirmModal.vue';
import VGouvFrModal from 'df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue';
import { useToast } from 'vue-toastification';
import { format } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import PropertyIcon from './PropertyIcon.vue';
import i18n from '../../i18n';
import Applicant from './Applicant';

const { t } = useI18n();
const confirmDelete = ref(false);

const route = useRoute();
const router = useRouter();
const store = useStore();
const toast = useToast();

const sortColumn = ref('');
const ascending = ref(false);
const tenantIdToShow = ref(-1);

const id = ref(0);
if (route.params.id) {
  id.value = Number(route.params.id);
  store.dispatch('updatePropertyToConsult', id.value);
}

const TENANT_URL = `https://${import.meta.env.VITE_TENANT_URL}`;
const token = computed(
  () => `${TENANT_URL}/inscription-locataire/${store.getters.getPropertyToConsult?.token}`,
);
const name = computed(() => store.getters.getPropertyToConsult?.name);
const p = store.getters.getPropertyToConsult;
const propertyType = computed(() => store.getters.getPropertyToConsult?.type);
const propertyFurnished = computed(() => store.getters.getPropertyToConsult?.furnished);

const buildTitle = computed(() => {
  if (propertyType.value === 'HOUSE') {
    if (propertyFurnished.value) {
      return t('house-furnished', { rentCost: p.rentCost });
    }
    return t('house-unfurnished', { rentCost: p.rentCost });
  }
  if (propertyType.value === 'APARTMENT') {
    if (propertyFurnished.value) {
      return t('apartment-furnished', { rentCost: p.rentCost });
    }
    return t('apartment-unfurnished', { rentCost: p.rentCost });
  }
  if (propertyFurnished.value) {
    return t('other-furnished', { rentCost: p.rentCost });
  }
  return t('other-unfurnished', { rentCost: p.rentCost });
});

function editProperty() {
  router.push({ name: 'PropertyName', params: { id: id.value } });
}

function getTenants(): Applicant[] {
  if (!p.propertiesApartmentSharing) {
    return [];
  }

  return p.propertiesApartmentSharing
    .map((pas: any) => {
      const a = pas.apartmentSharing;
      if (a !== undefined && a.tenants.length > 0) {
        const rate = a.totalSalary >= 0 ? Math.round((p.rentCost / a.totalSalary) * 100) : '-';
        return {
          date: new Date(),
          tenantName: `${a.tenants[0].lastName} ${a.tenants[0].firstName}`,
          tenantType: a.applicationType,
          tenantSalary: `${a.totalSalary} €`,
          guarantorSalary: a.totalGuarantorSalary ? `${a.totalGuarantorSalary} €` : '-',
          rate: `${rate} %`,
          status: a.tenants[0].status,
          tokenPublic: a.tokenPublic,
        };
      }
      return {};
    })
    .sort((a: any, b: any) => {
      if (a[sortColumn.value] < b[sortColumn.value]) {
        return ascending.value ? 1 : -1;
      }
      if (a[sortColumn.value] > b[sortColumn.value]) {
        return ascending.value ? -1 : 1;
      }
      return 0;
    });
}

function sortTable(col: string) {
  if (sortColumn.value === col) {
    ascending.value = !ascending.value;
  } else {
    sortColumn.value = col;
    ascending.value = true;
  }
}

function validDeleteFile() {
  store.dispatch('deleteProperty', id.value).then(() => {
    router.push({ name: 'Dashboard' });
  });
  confirmDelete.value = false;
}
function undoDeleteFile() {
  confirmDelete.value = false;
}

function copyToken() {
  navigator.clipboard.writeText(token.value);
  toast.success(t('link-copied').toString(), {
    timeout: 7000,
  });
}

const verifiedApplicantsCount = computed(
  () => getTenants().filter((u: Applicant) => u.status === 'VALIDATED').length,
);

function formatDate(date: Date) {
  return format(date, 'dd MMMM yyyy', {
    locale: ((i18n.global as unknown) as Composer).locale.value === 'fr' ? fr : enUS,
  });
}

function setShowTenant(tenantId: number) {
  if (tenantIdToShow === tenantId) {
    tenantIdToShow.value = -1;
  } else {
    tenantIdToShow.value = tenantId;
  }
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
    url("../../assets/salon.webp");
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

table {
  width: 100%;
  border-spacing: 0 0.25rem;
  text-align: start;
}
th {
  text-align: start;
  color: #666666;
  font-size: 12px;
}

tbody {
  background-color: #f6f6f6;
  color: #666666;
  padding: 0.5rem;
  &:first-child {
    background-color: transparent;
  }
}

td {
  border: solid 1px #f6f6f6;
  height: 2.5rem;
}

td:first-child {
  border-top-left-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
}
td:last-child {
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
}

.arrow_down {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAaCAYAAABPY4eKAAAAAXNSR0IArs4c6QAAAvlJREFUSA29Vk1PGlEUHQaiiewslpUJiyYs2yb9AyRuJGm7c0VJoFXSX9A0sSZN04ULF12YEBQDhMCuSZOm1FhTiLY2Rky0QPlQBLRUsICoIN/0PCsGyox26NC3eTNn3r3n3TvnvvsE1PkwGo3yUqkkEQqFgw2Mz7lWqwng7ztN06mxsTEv8U0Aam5u7r5EInkplUol/f391wAJCc7nEAgE9Uwmkzo4OPiJMa1Wq6cFs7Ozt0H6RqlUDmJXfPIx+qrX69Ti4mIyHA5r6Wq1egND+j+IyW6QAUoul18XiUTDNHaSyGazKcZtdgk8wqhUKh9o/OMvsVgsfHJy0iWqVrcQNRUMBnd6enqc9MjISAmRP3e73T9al3XnbWNjIw2+KY1Gc3imsNHR0YV4PP5+d3e32h3K316TySQFoX2WyWR2glzIO5fLTSD6IElLNwbqnFpbWyO/96lCoai0cZjN5kfYQAYi5H34fL6cxWIZbya9iJyAhULBHAqFVlMpfsV/fHxMeb3er+Vy+VUzeduzwWC45XA4dlD/vEXvdDrj8DvURsYEWK3WF4FA4JQP9mg0WrHZbEYmnpa0NxYgPVObm5teiLABdTQT8a6vrwdRWhOcHMzMzCiXlpb2/yV6qDttMpkeshEzRk4Wo/bfoe4X9vb2amzGl+HoXNT29vZqsVi0sK1jJScG+Xx+HGkL4Tew2TPi5zUdQQt9otPpuBk3e0TaHmMDh1zS7/f780S0zX6Yni+NnBj09fUZUfvudDrNZN+GkQbl8Xi8RLRtHzsB9Hr9nfn5+SjSeWUCXC7XPq5kw53wsNogjZNohYXL2EljstvtrAL70/mVaW8Y4OidRO1/gwgbUMvcqGmcDc9aPvD1gnTeQ+0nmaInokRj0nHh+uvIiVOtVvt2a2vLv7Ky0tL3cRTXIcpPAwMDpq6R4/JXE4vFQ5FI5CN+QTaRSFCYc8vLy1l0rge4ARe5kJ/d27kYkLXoy2Jo4C7K8CZOsEBvb+9rlUp1xNXPL7v3IDwxvPD6AAAAAElFTkSuQmCC");
}
.arrow_up {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAaCAYAAACgoey0AAAAAXNSR0IArs4c6QAAAwpJREFUSA21Vt1PUmEYP4dvkQ8JFMwtBRocWAkDbiqXrUWXzU1rrTt0bdVqXbb1tbW16C9IBUSmm27cODdneoXjputa6069qwuW6IIBIdLvdaF4OAcOiGeDc87zPs/vd57P96WpFq7p6enbGo1mjKZpeTabjU1MTCRagGnOZHFxcXxtbe1XKpUq7+zslJeXl//Mz8+Hy+Uy3RxSE9qTk5M3otFooVQqgef4Wl9f343FYoEmoISrxuNxFX5f9vb2jhn/PxUKhfLS0tIPfFifUESRUMV8Pv/M6XReRm5rTGQyGeXxeGxYe1ezeBpBOBx2rKysbO7v79d4Wy3Y2Nj4GQqFbgnhaugxwiuGJx99Pp9FLBbXxYTXvTqd7v3MzIy6riIWGxJnMpl7AwMD14xGYyMsSq1WUyQdUqn0eSPlusQIsbGrq+vl4OCgvhFQZd1utyv1en0gEolcqsi47nWJlUrlG5fLZVcoFFy2nDKSDpIWlUoVTCQSEk4lCHmJMZ2GTCbTiMVikfIZ88l7enoos9l8dXt7+z6fDicxSJUokqDX6xXcl2wCROoc0vQCWL3sNfLOSdzR0fHY4XC4tVotl40gmVwup9xuN4OQv+UyqCFGH9rg7SOGYVRcBs3IEG4J0nVnamrqOtvuBDGGgQg9+wHFcVEi4a0LNkbdd6TrPKo8ODc311mteIIYjT/a398/jK+s1jnVM0kXoufCFvq0GuiIGEVgQIhfoygM1QrteEa9dAL7ITiYCt4RMabOK5AyKKzKWtvupLcRciu8D5J0EuDDPyT/Snd39yh6VtY2NhYQSR9G79Ds7OxdskRjEyAufvb7/cPoO5Z6e1+xtVKrq6vfcFzyi/A3ZrPZ3GdNSlwgo5ekE4X2RIQGf2C1WlufFE0GBeGWYQ8YERWLxQtnUVB830MKLZfL9RHir8lkssCn2G751tZWEWe03zTKm15YWPiEiXXTYDB0Ig/t7yd8PRws4EicwWHxO4jHD8/C5HiTTqd1BwcHFozKU89origB+y/kmzgYpgOBQP4fGmUiZmJ+WNgAAAAASUVORK5CYII=");
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
  border: none;
  background: var(--background-default-grey);
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
    "share-modal-title": "The link of my property",
    "share-modal-description": "If you want to give access to your property to a candidate through a channel other than our automatic email, you can copy your file link and paste it into the message you send him.",
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
    "house-furnished": "A furnished house with a rent of {rentCost}€",
    "house-unfurnished": "An unfurnished house with a rent of {rentCost}€",
    "apartment-furnished": "A furnished apartment with a rent of {rentCost}€",
    "apartment-unfurnished": "A unfurnished apartment with a rent of {rentCost}€",
    "other-furnished": "A furnished property with a rent of {rentCost}€",
    "other-unfurnished": "A unfurnished property with a rent of {rentCost}€",
    "download-full-file": "Download the full file",
  },
  "fr": {
    "title": "Consultation",
    "back": "Retour",
    "modify-property": "Modifier ma propriété",
    "delete-property": "Supprimer ma propriété",
    "will-delete-property": "Êtes-vous sûr de vouloir supprimer cette propriété ?",
    "share-modal-title": "Le lien de ma propriété",
    "share-modal-description": "Si vous voulez donner accès à votre propriété à un candidat par un autre canal que notre mail automatique, vous pouvez copier votre lien dossier et le coller dans le message que vous lui enverrez.",
    "copy-link": "Copier",
    "share-modal-detail": "Le bouton copier copiera ce lien dans votre presse papier",
    "link-copied": "Lien copié",
    "verified-applicants": "Mes candidatures vérifiées ({count})",
    "date": "Date",
    "tenant-name": "Nom du locataire",
    "tenant-type": "Type de dossier",
    "tenant-salary": "Revenus net mensuel",
    "guarantor-salary": "Revenus Garants net mensuel",
    "rate": "Taux d'effort",
    "status": "Statut",
    "ALONE": "Seul·e",
    "COUPLE": "Couple",
    "GROUP": "Colocation",
    "TO_PROCESS": "En cours de traitement",
    "VALIDATED": "Vérifié",
    "DECLINED": "Modification demandée",
    "INCOMPLETE": "Non terminé",
    "house-furnished": "Une maison meublée dont le loyer mensuel est de {rentCost}€",
    "house-unfurnished": "Une maison non meublée dont le loyer mensuel est de {rentCost}€",
    "apartment-furnished": "Un appartement meublé dont le loyer mensuel est de {rentCost}€",
    "apartment-unfurnished": "Un appartement non meublé dont le loyer mensuel est de {rentCost}€",
    "other-furnished": "Un bien meublé dont le loyer mensuel est de {rentCost}€",
    "other-unfurnished": "Un bien non meublé dont le loyer mensuel est de {rentCost}€",
    "download-full-file": "Télécharger le dossier complet"
  }
}
</i18n>
