<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Modal from 'df-shared/src/components/Modal.vue';
import { ref } from 'vue';
import { User } from 'df-shared/src/models/User';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';
import Register from 'df-shared/src/Authentification/Register.vue';

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
    store.dispatch('register', user).then(
      () => {
        isValidModalVisible.value = true;
      },
      (error) => {
        if (
          (error.response?.data?.errors?.indexOf(
            'email: the emails are already being used',
          ) || -1) >= 0
        ) {
          toast.error(t('duplicate-email').toString(), {
            timeout: 7000,
          });
        } else {
          toast.error(t('register-error').toString(), {
            timeout: 7000,
          });
        }
      },
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
            <h2 class="fr-h5 blue-text text-center fr-mt-3w">
              En route pour rejoindre DossierFacile !
            </h2>
            <div class="fr-pl-2w fr-pr-2w">
              Afin de faciliter la constitution de votre dossier, préparez les
              pièces suivantes :
            </div>
            <div
              class="bg-purple blue-text fr-pr-2w fr-pl-2w fr-pt-3w fr-pb-3w"
            >
              <ul>
                <li>
                  Une pièce d’identité
                </li>
                <li>
                  Un justificatif de domicile
                </li>
                <li>
                  Un justificatif de situation professionnelle
                </li>
                <li>
                  Des justificatifs de ressources
                </li>
                <li>
                  Votre dernier avis d’imposition
                </li>
              </ul>
              Pour vos garants ces mêmes pièces vous seront demandées.
            </div>
            <div class="fr-pl-2w fr-pr-2w">
              <p class="fr-mt-3w">
                Vous avez tout ?! Super !<br />
                Commençons par sécuriser votre compte !
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="fr-col-lg-6 fr-col-12 bg-white">
        <div class="fr-mt-2w align-end">
          <router-link to="/account" class="fr-tag">
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
    url("../assets/Immeuble.webp") no-repeat;
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
</style>
