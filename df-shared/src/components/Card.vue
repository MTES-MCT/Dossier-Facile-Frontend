<template>
  <NakedCard class="fr-mt-3w fr-mb-2w">
    <div>
      <a
        href="#"
        class="fr-btn"
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
        class="fr-card__desc"
      >
        <slot name="body"></slot>
      </div>
    </div>
  </NakedCard>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import NakedCard from "df-shared/src/components/NakedCard.vue";
@Component({
  components: { NakedCard }
})
export default class Card extends Vue {
  @Prop({ default: true }) expanded?: boolean;
  @Prop({ default: true }) expandable?: boolean;
  localExpanded = this.expanded;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
