<template>
  <NakedCard class="card-container">
    <div class="fr-grid-row">
      <div class="tags-container">
        <div class="v-center">
          <slot name="tag"></slot>
        </div>
        <div
          v-if="$slots.text"
          class="text-container"
          :class="{ danger: danger }"
        >
          <slot name="text"></slot>
        </div>
      </div>
      <div class="btn-container">
        <button
          @click="edit()"
          class="fr-p-0 fr-mr-2w icon-btn"
          :class="{ danger: danger, 'color--primary': !danger }"
        >
          <div class="material-icons md-24 fr-m-1w">
            edit
          </div>
        </button>
        <button
          @click="remove()"
          class="fr-p-0 icon-btn"
          :class="{ danger: danger, 'color--primary': !danger }"
        >
          <div class="material-icons md-24 fr-m-1w">
            delete
          </div>
        </button>
      </div>
    </div>
  </NakedCard>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import NakedCard from "./NakedCard.vue";

@Component({
  components: {
    NakedCard
  }
})
export default class CardRow extends Vue {
  @Prop({ default: false }) danger!: boolean;

  edit() {
    this.$emit("edit");
  }

  remove() {
    this.$emit("remove");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.card-container {
  margin: 0.5rem 0rem;
  @media (min-width: 768px) {
    margin: 0.5rem 0;
    padding: 1.75rem 2rem;
  }
}

.tags-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  @media (min-width: 768px) {
    flex-direction: row;
  }
}

.btn-container {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
}

.v-center {
  display: inline-flex;
  align-items: center;
}

.icon-btn {
  border: 1px solid var(--primary);
  background-color: var(--background-default-grey);
  &.danger {
    border: 1px solid var(--danger);
  }
}

.text-container {
  display: inline-flex;
  align-items: center;
  @media (min-width: 768px) {
    flex-grow: 1;
    justify-content: center;
  }
}

.danger {
  color: var(--danger);
}
</style>
