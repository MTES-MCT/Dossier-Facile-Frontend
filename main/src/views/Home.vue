<template>
  <div class="home">
    <LandingPage />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LandingPage from "@/components/LandingPage.vue";

@Component({
  components: {
    LandingPage
  }
})
export default class Home extends Vue {}
</script>

<i18n>
{
"en": {
"msg": "Hello"
},
"fr": {
"msg": "Hellofr"
}
}
</i18n>
