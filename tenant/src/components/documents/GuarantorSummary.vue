<template>
  <div>
    Mon garant
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
@Component({
  computed: {
    ...mapState({
      selectedGuarantor: "selectedGuarantor"
    })
  }
})
export default class GuarantorSummary extends Vue {
}
</script>

<style scoped lang="scss">
</style>

<i18n>
{
"en": {
},
"fr": {
}
}
</i18n>
