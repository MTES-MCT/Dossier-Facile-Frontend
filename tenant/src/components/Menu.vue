<template>
  <ul class="fr-nav__list">
    <li class="fr-nav__item" v-if="showMessaging()">
      <a
        href="/messaging"
        class="fr-nav__link"
        :aria-current="currentPage() === 'Messages' ? 'page' : false"
      >
        {{ $t("menu.messaging") }}
        <span v-if="newMessage > 0" class="badge">{{ newMessage }}</span>
      </a>
    </li>
    <li class="fr-nav__item" v-else>
      <a
        :href="`${MAIN_URL}/information`"
        class="fr-nav__link"
        :aria-current="currentPage() === 'Information' ? 'page' : false"
      >
        {{ $t("menu.information") }}
      </a>
    </li>
    <li class="fr-nav__item">
      <a :href="`${MAIN_URL}/blog`" class="fr-nav__link">
        {{ $t("menu.blog") }}
      </a>
    </li>
    <li class="fr-nav__item">
      <a
        :href="`${DOCS_URL}`"
        class="fr-nav__link fr-external-link"
        target="_blank"
        rel="noreferrer"
      >
        {{ $t("menu.help") }}
      </a>
    </li>
    <li class="fr-nav__item break" v-show="isLoggedIn">
      <button
        class="fr-nav__btn"
        aria-expanded="false"
        aria-controls="menu-774"
        :aria-current="currentPage() === 'Account' ? true : false"
      >
        {{ $t("menu.account") }}
      </button>
      <div class="fr-collapse fr-menu" id="menu-774">
        <ul class="fr-menu__list">
          <li>
            <a
              class="fr-nav__link"
              href="/account"
              target="_self"
              :aria-current="currentPage() === 'Account' ? 'page' : false"
            >
              {{ $t("menu.file") }}
              <br />
              <span class="fr-label--disabled fr-text--xs">
                {{ user.email }}
              </span>
            </a>
          </li>
          <li>
            <DfButton
              class="fr-nav__link"
              data-fr-opened="false"
              aria-controls="modal-delete-account"
              style="visibility: none"
            >
              {{ $t("menu.deleteAccount") }}
            </DfButton>
          </li>
        </ul>
      </div>
    </li>
    <li class="fr-nav__item" :class="{ break: !isLoggedIn }">
      <a
        href="/contact"
        :aria-current="currentPage() === 'Contact'"
        class="fr-nav__link"
      >
        <span class="fr-icon-mail-line fr-icon--sm" aria-hidden="true"></span>
        {{ $t("menu.contact-us") }}
      </a>
    </li>
    <LanguageSelector :initialLanguage="$i18n.locale" />
  </ul>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters, mapState } from "vuex";
import DfButton from "df-shared/src/Button/Button.vue";
import LanguageSelector from "df-shared/src/Header/LanguageSelector.vue";
import { User } from "df-shared/src/models/User";
import { DfMessage } from "df-shared/src/models/DfMessage";

@Component({
  components: {
    DfButton,
    LanguageSelector,
  },
  computed: {
    ...mapState({
      user: "user",
    }),
    ...mapGetters({
      newMessage: "newMessage",
      isLoggedIn: "isLoggedIn",
      messageList: "getMessages",
    }),
  },
})
export default class Menu extends Vue {
  user!: User;
  isLoggedIn?: boolean;
  newMessage!: number;
  messageList!: DfMessage[][];
  isDeleteModalVisible = false;

  MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;
  DOCS_URL = `//${process.env.VUE_APP_DOCS_URL}`;

  currentPage() {
    return this.$route.name;
  }

  showMessaging() {
    return (
      (this.isLoggedIn === true && this.user.status !== "INCOMPLETE") ||
      (this.messageList[this.user.id] !== undefined &&
        this.messageList[this.user.id].length > 0)
    );
  }
}
</script>

<style scoped lang="scss">
.badge {
  position: absolute;
  top: 0.5rem;
  right: 0.25rem;
  border-radius: 50%;
  background: var(--secondary);
  color: var(--primary);
  z-index: 1;
  min-width: 1.6em;
  height: 1.6em;
  border: 0.05em solid white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8em;
}

.fr-nav__item {
  position: relative;

  a.fr-external-link::after {
    content: "";
  }
}

.fr-nav__list > li.break {
  @media all and (min-width: 992px) {
    margin-left: auto;
  }
}

.fr-nav__link {
  &.fr-btn--secondary {
    box-shadow: none;
  }
}
</style>
