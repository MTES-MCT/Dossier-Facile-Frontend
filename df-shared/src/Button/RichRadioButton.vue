<template>
  <div class="fr-fieldset__element">
    <div class="fr-radio-group fr-radio-rich">
      <input
        :id="id"
        type="radio"
        :name="name"
        :checked="value === optionValue"
        @click="onClick"
      />
      <label class="fr-label" :for="id">
        {{ label }}
      </label>
      <div class="fr-radio-rich__img">
        <div class="icon-container">
          <span :class="icon + ' fr-icon--lg'" aria-hidden="true"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class RichRadioButton extends Vue {
  @Prop() name!: string;
  @Prop() id!: string;
  @Prop() label!: string;
  @Prop() icon!: string;
  @Prop() optionValue!: string;
  @Prop() value!: string;

  onClick() {
    this.$emit("input", this.optionValue);
  }
}
</script>

<style lang="scss">
.icon-container {
  height: 5rem;
  width: 6rem;
  color: var(--primary);
  background-color: var(--white);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
