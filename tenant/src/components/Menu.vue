<template>
  <div class="rf-container">
    <nav class="rf-nav" role="navigation" aria-label="Menu principal">
      <ul class="rf-nav__list">
        <li class="rf-nav__item" v-if="user">
          <router-link to="/profile" class="rf-link">
            {{ $t("profile") }}
          </router-link>
        </li>
        <li class="rf-nav__item" v-if="user">
          <router-link to="/messaging" class="rf-link">
            {{ $t("messaging") }}
          </router-link>
        </li>
        <li class="rf-nav__item">
          <a :href="MAIN_URL + '/faq'" class="rf-link">
            {{ $t("faq") }}
          </a>
        </li>
        <li class="rf-nav__item">
          <a :href="MAIN_URL + '/information'" class="rf-link">
            {{ $t("information") }}
          </a>
        </li>
        <li class="rf-nav__item">
          <a :href="MAIN_URL + '/blog'" class="rf-link">
            {{ $t("blog") }}
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { User } from "df-shared/src/models/User";

@Component
export default class Menu extends Vue {
  @Prop() private user?: User;

  MAIN_URL = "//" + process.env.VUE_APP_MAIN_URL;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@media all and (min-width: 768px) {
  .rf-nav__list {
    flex-direction: row-reverse;
  }
}
</style>

<i18n>
{
"en": {
"profile": "Mon compte",
"messaging": "Messagerie",
"faq": "Faq",
"blog": "Blog",
"information": "En savoir plus"
},
"fr": {
"profile": "Mon compte",
"messaging": "Messagerie",
"faq": "Faq",
"blog": "Blog",
"information": "En savoir plus"
}
}
</i18n>
