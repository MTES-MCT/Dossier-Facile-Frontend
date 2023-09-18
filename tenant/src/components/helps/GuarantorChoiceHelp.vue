<template>
  <div>
    <p v-html="$t('guarantorchoicehelp.paragraph1')"></p>
    <p v-html="$t('guarantorchoicehelp.paragraph2')"></p>
    <p v-html="$t('guarantorchoicehelp.paragraph3')"></p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Card from "df-shared/src/components/Card.vue";

@Component({
  components: { Card },
})
export default class GuarantorChoiceHelp extends Vue {
  expanded = false;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hidden {
  display: none;
}

p {
  overflow-wrap: break-word;
  word-wrap: break-word;
}
</style>
