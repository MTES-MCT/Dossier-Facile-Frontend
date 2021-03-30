<template>
  <div class="left-edit-menu">
    <div class="inner-left-edit rf-mt-7w">
      <div class="active step">
        <div class="step-number">1</div>
        <div class="step-title">je renseigne mes informations</div>
      </div>
      <div class="vline" :class="getClass(0)"></div>
      <div class="step" :class="getClass(1)">
        <div class="step-number">2</div>
        <div class="step-title">je joins mes documents</div>
      </div>
      <div class="vline" :class="getClass(1)"></div>
      <div class="step" :class="getClass(2)">
        <div class="step-number">3</div>
        <div class="step-title">je renseigne mon garant</div>
      </div>
      <div class="vline" :class="getClass(2)"></div>
      <div class="step" :class="getClass(3)">
        <div class="step-number">4</div>
        <div class="step-title">je valide mon dossier</div>
      </div>
      <div class="spacer"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";

@Component({
  computed: {
    ...mapState({
      tenantStep: "tenantStep"
    })
  }
})
export default class LeftEditMenu extends Vue {
  public tenantStep!: number;

  getClass(s: number) {
    if (this.getStep(s)) {
      return "active";
    }
  }

  getStep(s: number) {
    switch (this.tenantStep) {
      case 0:
      case 1:
        return s <= 0;
      case 2:
        return s <= 1;
      case 3:
        return s <= 2;
      case 4:
        return s <= 3;
      default:
        return s <= 0;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "df-shared/src/scss/_variables.scss";

.left-edit-menu {
  background-color: var(--w);
  @media all and (max-width: 768px) {
    display: none;
  }
}

.inner-left-edit {
  min-height: 300px;
  height: 100%;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-left: 10px;
}

.vline {
  margin-left: 17px;
  border-left: 1px solid var(--g400-t);
  z-index: 0;
  height: 25px;
  &.active {
    border-left: 1px solid var(--primary);
  }
}

.step {
  display: flex;
  align-items: center;
}

.step-number {
  background-color: white;
  border: 1px solid var(--g400-t);
  margin: 0 5px;
  border-radius: 50%;
  display: inline-block;
  height: 25px;
  width: 25px;
  min-width: 25px;
  text-align: center;
  z-index: 1;
}

.active .step-number {
  background-color: var(--primary);
  color: white;
}

.step-title {
  padding: 5px 5px 0;
}

.hidden {
  visibility: hidden;
}
</style>

<i18n>
{
"en": {
},
"fr": {
}
}
</i18n>
