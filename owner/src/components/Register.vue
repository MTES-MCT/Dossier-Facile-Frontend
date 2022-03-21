<script setup lang="ts">
import { useI18n } from "vue-i18n";
import Modal from "df-shared/src/components/Modal.vue";
import { ref } from "vue";
import { User } from "df-shared/src/models/User";
import { useStore } from "vuex";
import { useToast } from "vue-toastification";
import Register from "df-shared/src/Authentification/Register.vue";

defineProps<{}>();
const { t } = useI18n();
const store = useStore();
const toast = useToast();

const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`;

const isValidModalVisible = ref(false);

function closeModal() {
  isValidModalVisible.value = false;
  window.location.replace(MAIN_URL);
}

function onRegister(user: User) {
  if (user.email && user.password) {
    store.dispatch("register", user).then(
      () => {
        isValidModalVisible.value = true;
      },
      (error) => {
        if (
          (error.response?.data?.errors?.indexOf(
            "email: the emails are already being used"
          ) || -1) >= 0
        ) {
          toast.error(t("duplicate-email").toString(), {
            timeout: 7000,
          });
        } else {
          toast.error(t("register-error").toString(), {
            timeout: 7000,
          });
        }
      }
    );
  }
}
</script>

<template>
  <div class="fr-container fr-container--fluid fluid-full-width">
    <div class="fr-grid-row">
      <div class="fr-col-lg-6 fr-col-12">
        <div class="bg-pic">
          <div class="bg-white max-450 left-row fr-pt-3w fr-mt-7w fr-mb-7w">
            <h2 class="fr-h5 blue-text text-center fr-mt-3w">DossierFacile Bailleur</h2>
            <div class="fr-pl-2w fr-pr-2w">
              <p>
                Ajouter vos biens immobiliers dans votre espace propriétaire et recevez,
                dans votre espaces, les candidatures déposées par les candidats avec leur
                DossierFacile.
              </p>
              <p>Avec DossierFacile Bailleur, il est facile de :</p>
              <ul class="no-bullet">
                <li class="fr-mt-3w">👉 Partager son bien avec les candidats locataire</li>
                <li class="fr-mt-3w">
                  🤩 Recevoir des candidatures DossierFacile, complétées, organisées et
                  vérifiées.
                </li>
                <li class="fr-mt-3w">😇 Choississez votre futur locataire en toute séreinité !</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="fr-col-lg-6 fr-col-12 bg-white">
        <div class="fr-mt-2w align-end">
          <router-link to="/" class="fr-tag">
            {{ t("connect") }}
          </router-link>
        </div>
        <div class="margin-auto max-400">
          <Register @on-register="onRegister" />
        </div>
      </div>
    </div>
    <Modal v-show="isValidModalVisible.value" @close="closeModal">
      <template v-slot:body>
        <div class="fr-container">
          <div class="fr-grid-row justify-content-center">
            <div class="fr-col-12">
              <p>
                {{ t("mail-sent") }}
              </p>
              <p>
                {{ t("clic-to-confirm") }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<style>
body {
  background-color: var(--g100);
}
</style>

<style scoped lang="scss">
.bg-white {
  background-color: white;
  padding: 16px;
}

.bg-purple {
  margin: 8px;
  border-radius: 4px;
  background-color: #e5e5f4;
}

.inline-block {
  display: inline-block;
}

.text-center {
  text-align: center;
}

.margin-auto {
  margin: auto;
}

.max-450 {
  max-width: 450px;
}

.max-400 {
  max-width: 400px;
}

.left-row {
  margin-left: auto;
  margin-right: 32px;
}

.bg-pic {
  &:before {
    content: " ";
    background-color: black;
    height: 100%;
    width: 100%;
  }
}
.bg-pic {
  background: linear-gradient(rgba(0, 0, 0, 0.527), rgba(0, 0, 0, 0.5)),
    url("../assets/salon.webp") no-repeat;
  background-size: cover;
  height: 100%;
  overflow: hidden;
}

li {
  padding: 0 !important;
}

.align-end {
  display: flex;
  flex-direction: row-reverse;
  margin-right: 20px;
}

.no-bullet {
  list-style: none;
}
</style>

<i18n>
{
  "en": {
    "connect": "Already signed up ? Connect"
  },
  "fr": {
    "connect": "Déjà inscrit ? S'identifier"
  }
}
</i18n>
