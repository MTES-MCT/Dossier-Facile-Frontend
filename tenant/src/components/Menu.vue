<template>
  <div class="rf-container">
    <nav class="rf-nav" role="navigation" aria-label="Menu principal">
      <ul class="rf-nav__list">
        <li class="rf-nav__item" v-if="user">
          <router-link to="/profile" class="rf-link">
            {{ $t("profile") }}
          </router-link>
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
"profile": "Profil"
},
"fr": {
"profile": "Profil"
}
}
</i18n>
