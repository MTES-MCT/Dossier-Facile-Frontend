<template>
  <div class="rf-container">
    <nav class="rf-nav" role="navigation" aria-label="Menu principal">
      <ul class="rf-nav__list">
        <li class="rf-nav__item">
          <router-link to="/blog" class="rf-link">
            {{ $t("blog") }}
          </router-link>
        </li>
        <li class="rf-nav__item">
          <router-link to="/information" class="rf-link">
            {{ $t("information") }}
          </router-link>
        </li>
        <li class="rf-nav__item">
          <router-link to="/faq" class="rf-link">
            {{ $t("faq") }}
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Menu extends Vue {}
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
"faq": "FAQ",
"information": "En savoir plus",
"blog": "Blog"
},
"fr": {
"faq": "FAQ",
"information": "En savoir plus",
"blog": "Blog"
}
}
</i18n>
