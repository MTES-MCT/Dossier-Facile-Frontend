<template>
  <validation-provider :rules="getValidationRules()" v-slot="{ errors, valid }">
    <div
      class="fr-input-group"
      :class="errors[0] ? 'fr-input-group--error' : ''"
    >
      <FieldLabel :required="required" :for-input="name">
        {{ fieldLabel }}
      </FieldLabel>
      <div class="field-with-button fr-input-wrap">
        <input
          v-if="!textarea"
          :id="name"
          type="text"
          v-bind:value="value"
          v-on:input="$emit('input', $event.target?.value)"
          :name="name"
          class="validate-required form-control fr-input"
          :class="{
            'fr-input--valid': valid,
            'fr-input--error': errors[0],
          }"
          :disabled="disabled"
        />
        <textarea
          v-else
          :id="name"
          type="text"
          v-bind:value="value"
          v-on:input="$emit('input', $event.target?.value)"
          :name="name"
          class="validate-required form-control fr-input"
          :class="{
            'fr-input--valid': valid,
            'fr-input--error': errors[0],
          }"
          :disabled="disabled"
          maxlength="2000"
          rows="4"
        />
        <div class="fr-ml-1w" v-if="$slots.right">
          <slot name="right"></slot>
        </div>
      </div>
      <span class="fr-error-text" v-if="errors[0]">
        {{ $t(errors[0]) }}
      </span>
    </div>
  </validation-provider>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import FieldLabel from "./FieldLabel.vue";
import { ValidationProvider } from "vee-validate";

@Component({
  components: {
    FieldLabel,
    ValidationProvider,
  },
})
export default class TextField extends Vue {
  @Prop() value!: string;
  @Prop() fieldLabel!: string;
  @Prop() name!: string;
  @Prop({ default: "" }) validationRules!: string;
  @Prop({ default: false }) required!: boolean;
  @Prop({ default: false }) disabled!: boolean;
  @Prop({ default: false }) textarea!: boolean;

  getValidationRules(): string {
    const requiredRule = "required";
    if (this.required && !this.validationRules.includes(requiredRule)) {
      return [this.validationRules, requiredRule]
        .filter((rule) => rule !== "")
        .join("|");
    }
    return this.validationRules;
  }
}
</script>

<style scoped lang="scss">
.field-with-button {
  display: flex;
  justify-content: space-between;
}
</style>
