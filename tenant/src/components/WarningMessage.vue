<template>
  <div v-if="isVisible()" class="message-box fr-pt-2w fr-pb-2w">
    <div class="fr-container message">
      {{ warningMessage }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters({
      warningMessage: "warningMessage"
    })
  }
})
export default class WarningMessage extends Vue {
  warningMessage?: string;

  isVisible() {
    return this.warningMessage;
  }
}
</script>

<style scoped lang="scss">
.message-box {
  background-color: #ffc107;
  color: #000;
}
.message {
  display: flex;
  align-items: center;
  font-weight: bold;
}
</style>
