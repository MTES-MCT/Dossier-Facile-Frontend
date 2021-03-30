<template>
  <div class="rf-grid-row">
    <div class="rf-col-6 title">Les pièces acceptées</div>
    <div class="rf-col-6 title">Les pièces refusées</div>
    <div class="content left rf-col-6">
      <ul>
        <li v-for="(v, k) in allowList" :key="k" class="check">
          <span v-html="v"></span>
        </li>
      </ul>
    </div>
    <div class="content rf-col-6">
      <ul>
        <li v-for="(v, k) in blockList" :key="k" class="times">
          <span class="rf-mt-0" v-html="v"></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class DocumentInsert extends Vue {
  @Prop({
    default() {
      return [];
    }
  })
  allowList!: string[];
  @Prop({
    default() {
      return [];
    }
  })
  blockList!: string[];
}
</script>

<style scoped lang="scss">
@import "df-shared/src/scss/_variables.scss";

.rf-grid-row {
  width: 100%;
  background-color: var(--g200);
  border: 1px solid $primary;
  border-radius: 10px;
  > div {
    padding: 1rem;
    .title {
      padding-left: 2rem;
    }
  }
}

.left {
  display: inline-block;
  position: relative;
  &:after {
    position: absolute;
    content: "";
    border-left: 1px solid $primary;
    height: 70%;
    transform: translateY(-50%);
    right: 0;
    top: 50%;
  }
}

.content {
  padding: 10px;
}

ul li::before {
  content: none;
}

ul li {
  display: flex;
}

.title {
  font-weight: bold;
}

.check:before {
  content: "\2713";
  display: inline-block;
  color: limegreen;
  padding: 0 6px 0 0;
}

.times:before {
  content: "\d7";
  display: inline-block;
  color: red;
  padding: 0 6px 0 0;
}

ul {
  padding-inline-start: 0;
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
