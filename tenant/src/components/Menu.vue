<template>
  <ul class="fr-nav__list">
    <li class="fr-nav__item" v-if="user">
      <a href="/account" class="fr-nav__link">
        {{ $t("profile") }}
      </a>
    </li>
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
      <a :href="`${MAIN_URL}/information`" class="fr-nav__link">
        {{ $t("information") }}
      </a>
    </li>
    <li class="fr-nav__item">
      <a :href="`${MAIN_URL}/blog`" class="fr-nav__link">
        {{ $t("blog") }}
      </a>
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { User } from "df-shared/src/models/User";
import { mapGetters } from "vuex";

@Component({
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

  MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;
  DOCS_URL = `//${process.env.VUE_APP_DOCS_URL}`;
}
</script>

<style scoped lang="scss">
@media all and (min-width: 992px) {
  .fr-nav__list {
    flex-direction: row-reverse;
  }
}
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
</style>

<i18n>
{
"en": {
"profile": "Account",
"messaging": "Messaging",
"faq": "Help",
"blog": "Blog",
"information": "Information"
},
"fr": {
"profile": "Mon compte",
"messaging": "Messagerie",
"faq": "Aide",
"blog": "Blog",
"information": "En savoir plus"
}
}
</i18n>
