<template>
  <div class="rf-container">
    <nav class="rf-nav" role="navigation" aria-label="Menu principal">
      <ul class="rf-nav__list">
        <li class="rf-nav__item" v-if="user">
          <a href="/account" class="rf-link">
            {{ $t("profile") }}
          </a>
        </li>
        <li class="rf-nav__item" v-if="user">
          <a href="/messaging" class="rf-link">
            {{ $t("messaging") }}
            <span v-if="newMessage > 0" class="badge">{{ newMessage }}</span>
          </a>
        </li>
        <li class="rf-nav__item">
          <a :href="`${MAIN_URL}/faq?lang=${$i18n.locale}`" class="rf-link">
            {{ $t("faq") }}
          </a>
        </li>
        <li class="rf-nav__item">
          <a
            :href="`${MAIN_URL}/information?lang=${$i18n.locale}`"
            class="rf-link"
          >
            {{ $t("information") }}
          </a>
        </li>
        <li class="rf-nav__item">
          <a :href="`${MAIN_URL}/blog?lang=${$i18n.locale}`" class="rf-link">
            {{ $t("blog") }}
          </a>
        </li>
      </ul>
    </nav>
  </div>
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

.rf-nav__item {
  position: relative;
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
