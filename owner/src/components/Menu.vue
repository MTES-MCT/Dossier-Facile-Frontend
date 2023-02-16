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
  emit('menu.on-change-lang');
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
        {{ t('menu.information') }}
      </a>
    </li>
    <li class="fr-nav__item">
      <a :href="`${MAIN_URL}/blog`" class="fr-nav__link">
        {{ t('menu.blog') }}
      </a>
    </li>
    <li class="fr-nav__item">
      <a
        :href="`${DOCS_URL}`"
        class="fr-nav__link fr-external-link"
        target="_blank"
        rel="noreferrer"
      >
        {{ t('menu.help') }}
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
        {{ t('menu.account') }}
      </button>
      <div class="fr-collapse fr-menu" id="menu-774">
        <ul class="fr-menu__list">
          <li>
            <a
              class="fr-nav__link"
              href="/proprietaire"
              target="_self"
              v-bind:aria-current="currentPage() === 'AccountName' ? 'page' : undefined"
              >{{ t('menu.personal-data') }}</a
            >
          </li>
          <li>
            <a
              class="fr-nav__link"
              href="/"
              target="_self"
              v-bind:aria-current="currentPage() === 'Dashboard' ? 'page' : undefined"
              >{{ t('menu.dashboard') }}</a
            >
          </li>
          <li class="warn">
            <DfButton class="fr-nav__link" @on-click="isDeleteModalVisible = true">
              {{ t('menu.deleteAccount') }}
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
      <a
        href="/contact"
        v-bind:aria-current="currentPage() === 'Contact' ? 'page' : undefined"
        class="fr-nav__link"
      >
        <div class="fr-tag">
          <span class="material-icons" aria-hidden="true">mail_outline</span>
          {{ t('menu.contact-us') }}
        </div>
      </a>
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
    content: '';
  }

  .fr-nav__link[aria-current] {
    .fr-tag {
      color: var(--text-action-high-blue-france) !important;
    }
  }
  .tag-container {
    @media all and (min-width: 768px) {
      padding-top: 0.75rem;
      padding-bottom: 0.4rem;
    }
    .fr-tag {
      @media all and (max-width: 768px) {
        min-height: inherit;
        padding: 0;
        background-color: transparent;
        color: inherit;
        font-size: inherit;
      }
    }
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

