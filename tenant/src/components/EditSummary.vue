<template>
  <div>
    <Card :expandable="false" :expanded="true">
      <template v-slot:header>
        {{ $t("title") }}
      </template>
      <template v-slot:body>
        <div>
          Prénom et nom
        </div>
        <div @click="setStep(0)">edit</div>
        <div>
          Type de location
        </div>
        <div @click="setStep(1)">edit</div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Card from "@/components/Card.vue";
@Component({
  components: { Card }
})
export default class EditSummary extends Vue {
  setStep(n: number) {
    this.$store.commit("setStep", n);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>

<i18n>
{
"en": {
"title": "Informations du locataire"
},
"fr": {
"title": "Informations du locataire"
}
}
</i18n>
