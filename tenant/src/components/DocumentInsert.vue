<template>
  <div class="rf-grid-row">
    <div class="rf-col-6 title">Les pièces acceptées</div>
    <div class="rf-col-6 title">Les pièces refusées</div>
    <div class="content left rf-col-6">
      <ul>
        <li v-for="(v, k) in allowList" :key="k">
          <unicon class="list-item" name="check" fill="limegreen"></unicon>
          <div class="list-item">
            {{ v }}
          </div>
        </li>
      </ul>
    </div>
    <div class="content rf-col-6">
      <ul>
        <li v-for="(v, k) in blockList" :key="k">
          <unicon class="list-item" name="times" fill="red"></unicon>
          <div class="list-item">
            {{ v }}
          </div>
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
  private allowList!: string[];
  @Prop({
    default() {
      return [];
    }
  })
  private blockList!: string[];
}
</script>

<style scoped lang="scss">
@import "df-shared/src/scss/_variables.scss";

.rf-grid-row {
  width: 100%;
  background-color: $secondary;
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
</style>

<i18n>
{
"en": {
},
"fr": {
}
}
</i18n>
