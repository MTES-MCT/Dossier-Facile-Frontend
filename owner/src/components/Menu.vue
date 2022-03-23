<script setup lang="ts">
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import DeleteAccount from './DeleteAccount.vue';

const store = useStore();
const isLoggedIn = computed(() => store.getters.isLoggedIn);
const route = useRoute();
const { t } = useI18n();

const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`;
const DOCS_URL = `//${import.meta.env.VITE_DOCS_URL}`;

const isDeleteModalVisible = ref(false);

function currentPage() {
  return route.name;
}

</script>

<template>
  <ul class="fr-nav__list">
    <li class="fr-nav__item">
      <a
        :href="`${DOCS_URL}`"
        class="fr-nav__link"
        target="_blank"
        rel="noreferrer"
      >
        {{ t("faq") }}
      </a>
    </li>
    <li class="fr-nav__item">
      <a :href="`${MAIN_URL}/blog`" class="fr-nav__link">
        {{ t("blog") }}
      </a>
    </li>
    <li class="fr-nav__item">
      <a :href="`${MAIN_URL}/information`" class="fr-nav__link">
        {{ t("information") }}
      </a>
    </li>
    <li class="fr-nav__item" v-show="isLoggedIn">
      <button
        class="fr-nav__btn"
        aria-expanded="false"
        aria-controls="menu-774"
        :aria-current="currentPage() === 'Account' ? true : false"
      >
        {{ t("account") }}
      </button>
      <div class="fr-collapse fr-menu" id="menu-774">
        <ul class="fr-menu__list">
          <li>
            <a
              class="fr-nav__link"
              href="/account"
              target="_self"
              :aria-current="currentPage() === 'Account' ? 'page' : false"
              >{{ t("file") }}</a
            >
          </li>
          <li class="warn">
            <a
              class="fr-nav__link"
              href="#"
              @click="isDeleteModalVisible = true"
              target="_self"
            >
              {{ t("deleteAccount") }}
            </a>
            <DeleteAccount
              @close="isDeleteModalVisible = false"
              v-show="isDeleteModalVisible"
            ></DeleteAccount>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.fr-nav__list > li:last-child {
  @media all and (min-width: 992px) {
    margin-left: auto;
  }
}
</style>

<i18n>
{
"en": {
"account": "Account",
"file": "File",
"messaging": "Messaging",
"faq": "Help",
"blog": "Blog",
"information": "Information",
"deleteAccount": "Delete my account"
},
"fr": {
"file": "Mon dossier",
"account": "Mon compte",
"messaging": "Messagerie",
"faq": "Aide",
"blog": "Blog",
"information": "En savoir plus",
"deleteAccount": "Supprimer mon compte"
}
}
</i18n>
