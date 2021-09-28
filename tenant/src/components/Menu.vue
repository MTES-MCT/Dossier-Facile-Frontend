<template>
  <ul class="fr-nav__list">
    <li class="fr-nav__item" v-if="user">
      <a href="/messaging" class="fr-nav__link">
        {{ $t("messaging") }}
        <span v-if="newMessage > 0" class="badge">{{ newMessage }}</span>
      </a>
    </li>
    <li class="fr-nav__item">
      <a
        :href="`${DOCS_URL}`"
        class="fr-nav__link"
        target="_blank"
        rel="noreferrer"
      >
        {{ $t("faq") }}
      </a>
    </li>
    <li class="fr-nav__item">
      <a :href="`${MAIN_URL}/blog`" class="fr-nav__link">
        {{ $t("blog") }}
      </a>
    </li>
    <li class="fr-nav__item">
      <a :href="`${MAIN_URL}/information`" class="fr-nav__link">
        {{ $t("information") }}
      </a>
    </li>
    <li class="fr-nav__item" v-if="user">
      <button
        class="fr-nav__btn"
        aria-expanded="false"
        aria-controls="menu-774"
      >
        {{ $t("account") }}
      </button>
      <div class="fr-collapse fr-menu" id="menu-774">
        <ul class="fr-menu__list">
          <li>
            <a class="fr-nav__link" href="/account" target="_self">{{
              $t("file")
            }}</a>
          </li>
          <li class="warn">
            <a
              class="fr-nav__link"
              href="#"
              @click="isDeleteModalVisible = true"
              target="_self"
            >
              {{ $t("deleteAccount") }}
            </a>
            <DeleteAccount v-model="isDeleteModalVisible"></DeleteAccount>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { User } from "df-shared/src/models/User";
import { mapGetters } from "vuex";
import DeleteAccount from "./DeleteAccount.vue";

@Component({
  components: {
    DeleteAccount
  },
  computed: {
    ...mapGetters({
      user: "userToEdit",
      newMessage: "newMessage"
    })
  }
})
export default class Menu extends Vue {
  user?: User;
  newMessage!: number;
  isDeleteModalVisible = false;

  MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;
  DOCS_URL = `//${process.env.VUE_APP_DOCS_URL}`;
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

.fr-nav__item {
  position: relative;
}

.fr-nav__list > li:last-child {
  @media all and (min-width: 992px) {
    margin-left: auto;
  }
}

.warn {
  background-color: #fdf2f3;
  a {
    color: var(--error);
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
