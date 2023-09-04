<template>
  <div class="fr-toggle">
    <input
      :id="inputId"
      type="checkbox"
      :checked="value"
      class="fr-toggle__input"
      :aria-describedby="hintId"
      @input="updateValue($event)"
    />
    <label
      class="fr-toggle__label"
      :for="inputId"
      :data-fr-checked-label="checkedLabel"
      :data-fr-unchecked-label="uncheckedLabel"
    >
      {{ label }}
    </label>
    <p v-if="hint" :id="hintId" class="fr-hint-text">
      {{ hint }}
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class Toggle extends Vue {
  @Prop() id!: number;
  @Prop() value!: boolean;
  @Prop({ default: "" }) label!: string;
  @Prop({ default: "" }) hint!: string;
  @Prop({ default: "" }) checkedLabel!: string;
  @Prop({ default: "" }) uncheckedLabel!: string;

  get inputId() {
    return `toggle-${this.id}`;
  }

  get hintId() {
    return `${this.inputId}-hint-text`;
  }

  updateValue(event: Event) {
    this.$emit("update", (event.target as HTMLInputElement).checked);
  }
}
</script>

<style scoped lang="scss"></style>