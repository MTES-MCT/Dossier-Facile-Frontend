<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Composer, useI18n } from 'vue-i18n';
import DfButton from 'df-shared-next/src/Button/Button.vue';
import DeleteAccount from './DeleteAccount.vue';
import useOwnerStore from '../store/owner-store';
import i18n from '../i18n';

const store = useOwnerStore();
const isLoggedIn = computed(() => store.isLoggedIn);
const route = useRoute();
const { t } = useI18n();
const emit = defineEmits(['on-change-lang']);

const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`;
const DOCS_URL = `//${import.meta.env.VITE_DOCS_URL}`;

const isDeleteModalVisible = ref(false);

function currentPage() {
  return route.name;
}

function changeLang() {
  emit('on-change-lang');
}

function getLanguageSwitchLabel() {
  const lang = ((i18n.global as unknown) as Composer).locale.value;
  return lang === 'fr' ? 'English version' : 'Version française';
}
</script>

<template>
  <ul class="fr-nav__list">
    <li class="fr-nav__item">
      <a :href="`${MAIN_URL}/information`" class="fr-nav__link">
        {{ t("information") }}
      </a>
    </li>
    <li class="fr-nav__item">
      <a :href="`${MAIN_URL}/blog`" class="fr-nav__link">
        {{ t("blog") }}
      </a>
    </li>
    <li class="fr-nav__item">
      <a
        :href="`${DOCS_URL}`"
        class="fr-nav__link fr-external-link"
        target="_blank"
        rel="noreferrer"
      >
        {{ t("help") }}
      </a>
    </li>
    <li class="fr-nav__item break" v-show="isLoggedIn">
      <button
        class="fr-nav__btn"
        aria-expanded="false"
        aria-controls="menu-774"
        v-bind:aria-current="
          currentPage() === 'AccountName' || currentPage() === 'Dashboard' ? true : undefined
        "
      >
        {{ t("account") }}
      </button>
      <div class="fr-collapse fr-menu" id="menu-774">
        <ul class="fr-menu__list">
          <li>
            <a
              class="fr-nav__link"
              href="/proprietaire"
              target="_self"
              v-bind:aria-current="currentPage() === 'AccountName' ? 'page' : undefined"
              >{{ t("personal-data") }}</a
            >
          </li>
          <li>
            <a
              class="fr-nav__link"
              href="/"
              target="_self"
              v-bind:aria-current="currentPage() === 'Dashboard' ? 'page' : undefined"
              >{{ t("dashboard") }}</a
            >
          </li>
          <li class="warn">
            <DfButton
              class="fr-nav__link"
              @on-click="isDeleteModalVisible = true"
            >
              {{ t("deleteAccount") }}
            </DfButton>
            <DeleteAccount
              @close="isDeleteModalVisible = false"
              v-show="isDeleteModalVisible"
            ></DeleteAccount>
          </li>
        </ul>
      </div>
    </li>
    <li class="fr-nav__item" :class="{ break: !isLoggedIn }">
      <button
        class="fr-nav__link fr-btn fr-ml-3 fr-btn--secondary fr-btn--sm lang"
        @click="changeLang"
      >
        {{ getLanguageSwitchLabel() }}
      </button>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.fr-nav__item {
  position: relative;

  a.fr-external-link::after {
    content: "";
  }
}

.warn {
  background-color: #fdf2f3;
  button {
    color: var(--error);
  }
}

.lang {
  box-shadow: none;
}

.fr-nav__list > li.break {
  @media all and (min-width: 992px) {
    margin-left: auto;
  }
}
</style>

<i18n>
{
"en": {
"account": "Account",
"dashboard": "File",
"messaging": "Messaging",
"help": "Help",
"blog": "Blog",
"information": "Information",
"deleteAccount": "Delete my account",
"contact-us": "contact us",
"personal-data": "My personal data"
},
"fr": {
"dashboard": "Mes propriétés",
"account": "Mon compte",
"messaging": "Messagerie",
"help": "Aide",
"blog": "Blog",
"deleteAccount": "Supprimer mon compte",
"information": "Qui sommes-nous?",
"contact-us": "Nous contacter",
"personal-data": "Mes informations personnelles"
}
}
</i18n>
