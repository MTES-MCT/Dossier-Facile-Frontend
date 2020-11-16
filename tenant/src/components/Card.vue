<template>
  <div class="card">
    <div>
      <div>
        <a
          href="#"
          class="rf-link"
          :aria-expanded="localExpanded"
          aria-controls="card-content"
          @click="localExpanded = expandable ? !localExpanded : expanded"
        >
          <slot name="header"></slot>
        </a>
        <hr />
        <div
          id="card-content"
          :class="{ hidden: !localExpanded }"
          class="rf-card__desc"
        >
          <slot name="body"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Card extends Vue {
  @Prop({ default: true }) expanded?: boolean;
  @Prop({ default: true }) expandable?: boolean;
  localExpanded = this.expanded;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hidden {
  display: none;
}
.card {
  padding: 10px;
  margin-top: 30px;
  margin-bottom: 20px;
  max-width: 500px;

  -webkit-box-shadow: 0 7px 15px 0 rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0 7px 15px 0 rgba(0, 0, 0, 0.5);
  box-shadow: 0 7px 15px 0 rgba(0, 0, 0, 0.5);

  a {
    &:before {
      content: none;
    }
  }
}

.rf-link {
  flex-direction: row;
}

hr {
  color: gray;
  border-style: inset;
  border-width: 1px;
  margin: 0.5em auto;
}
</style>
