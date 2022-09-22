<template>
  <ul class="fr-nav__list">
    <li class="fr-nav__item" v-if="isLoggedIn">
      <a
        href="/messaging"
        class="fr-nav__link"
        :aria-current="currentPage() === 'Messages' ? 'page' : false"
      >
        {{ $t("messaging") }}
        <span v-if="newMessage > 0" class="badge">{{ newMessage }}</span>
      </a>
    </li>
    <li class="fr-nav__item" v-else>
      <a
        :href="`${MAIN_URL}/information`"
        class="fr-nav__link"
        :aria-current="currentPage() === 'Information' ? 'page' : false"
      >
        {{ $t("information") }}
      </a>
    </li>
    <li class="fr-nav__item">
      <a :href="`${MAIN_URL}/blog`" class="fr-nav__link">
        {{ $t("blog") }}
      </a>
    </li>
    <li class="fr-nav__item">
      <a
        :href="`${DOCS_URL}`"
        class="fr-nav__link fr-external-link"
        target="_blank"
        rel="noreferrer"
      >
        {{ $t("help") }}
      </a>
    </li>
    <li class="fr-nav__item break" v-show="isLoggedIn">
      <button
        class="fr-nav__btn"
        aria-expanded="false"
        aria-controls="menu-774"
        :aria-current="currentPage() === 'Account' ? true : false"
      >
        {{ $t("account") }}
      </button>
      <div class="fr-collapse fr-menu" id="menu-774">
        <ul class="fr-menu__list">
          <li>
            <a
              class="fr-nav__link"
              href="/account"
              target="_self"
              :aria-current="currentPage() === 'Account' ? 'page' : false"
              >{{ $t("file") }}</a
            >
          </li>
          <li class="warn">
            <DfButton
              class="fr-nav__link"
              @on-click="isDeleteModalVisible = true"
            >
              {{ $t("deleteAccount") }}
            </DfButton>
            <DeleteAccount
              v-model="isDeleteModalVisible"
              v-show="isDeleteModalVisible"
            ></DeleteAccount>
          </li>
        </ul>
      </div>
    </li>
    <li class="fr-nav__item" :class="{ break: !isLoggedIn }">
      <a
        href="/contact"
        :aria-current="currentPage() === 'Contact' ? 'page' : false"
        class="fr-nav__link tag-container"
      >
        <div class="fr-tag">
          <span class="material-icons" aria-hidden="true">mail_outline</span>
          {{ $t("contact-us") }}
        </div>
      </a>
    </li>
    <li class="fr-nav__item">
      <button
        class="fr-nav__link fr-btn fr-ml-3 fr-btn--secondary fr-btn--sm lang"
        @click="changeLang"
      >
        {{ getLanguageSwitchLabel() }}
      </button>
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import DeleteAccount from "./DeleteAccount.vue";
import i18n from "../i18n";
import DfButton from "df-shared/src/Button/Button.vue";

@Component({
  components: {
    DeleteAccount,
    DfButton
  },
  computed: {
    ...mapGetters({
      newMessage: "newMessage",
      isLoggedIn: "isLoggedIn"
    })
  }
})
export default class Menu extends Vue {
  isLoggedIn?: boolean;
  newMessage!: number;
  isDeleteModalVisible = false;

  MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;
  DOCS_URL = `//${process.env.VUE_APP_DOCS_URL}`;

  currentPage() {
    return this.$route.name;
  }
  changeLang() {
    const lang = i18n.locale === "fr" ? "en" : "fr";
    this.$store.dispatch("setLang", lang);
  }
  getLanguageSwitchLabel() {
    return i18n.locale === "fr" ? "English version" : "Version française";
  }
}
</script>

<style scoped lang="scss">
.badge {
  position: absolute;
  top: -2px;
  right: 0px;
  padding: 5px 10px;
  border-radius: 50%;
  background: red;
  color: white;
  z-index: 1;
}

.lang {
  box-shadow: none;
}

.fr-nav__item {
  position: relative;
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

  a.fr-external-link::after {
    content: "";
  }
}

.fr-nav__list > li.break {
  @media all and (min-width: 992px) {
    margin-left: auto;
  }
}

.warn {
  background-color: #fdf2f3;
  button {
    color: var(--error);
  }
}
span.material-icons,
span.material-icons-outlined {
  @media all and (max-width: 768px) {
    display: none;
  }
  padding-right: 0.25rem;
}
fr-breadcrumb {
  margin: 0;
}
</style>

<i18n>
{
"en": {
"help": "Help",
"account": "Account",
"file": "File",
"messaging": "Messaging",
"faq": "Help",
"blog": "Blog",
"information": "Information",
"contact-us": "contact us",
"deleteAccount": "Delete my account"
},
"fr": {
"help": "Aide",
"file": "Mon dossier",
"account": "Mon compte",
"messaging": "Messagerie",
"blog": "Blog",
"information": "Qui sommes-nous?",
"contact-us": "Nous contacter",
"deleteAccount": "Supprimer mon compte"
}
}
</i18n>
