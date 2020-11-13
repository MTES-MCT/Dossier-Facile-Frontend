<template>
  <div class="left-edit-menu">
    <div class="spacer hidden"></div>
    <div class="active step">
      <div class="step-number">1</div>
      <div class="step-title">je renseigne mes informations</div>
    </div>
    <div class="spacer active"></div>
    <div class="spacer" :class="getClass(1)"></div>
    <div class="step" :class="getClass(1)">
      <div class="step-number">2</div>
      <div class="step-title">
        je joins mes documents
      </div>
    </div>
    <div class="spacer" :class="getClass(1)"></div>
    <div class="spacer" :class="getClass(2)"></div>
    <div class="step" :class="getClass(2)">
      <div class="step-number">3</div>
      <div class="step-title">
        je renseigne mon garant
      </div>
    </div>
    <div class="spacer hidden"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class LeftEditMenu extends Vue {
  @Prop({ default: 0 }) private step!: number;

  getClass(s: number) {
    if (s <= this.step) {
      return "active";
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "df-shared/src/scss/_variables.scss";

.left-edit-menu {
  min-height: 300px;
  background-color: $brick;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-left: 10px;
  @media all and (max-width: 768px) {
    display: none;
  }
}

.spacer {
  flex: auto;
  margin-left: 17px;
  margin-top: -17px;
  margin-bottom: -17px;
  border-left: 1px solid white;
  z-index: 0;
  &.active {
    border-left: 1px solid $primary;
  }
}

.step {
  display: flex;
  align-items: center;
}

.step-number {
  padding: 5px;
  background-color: white;
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
  background-color: $primary;
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
