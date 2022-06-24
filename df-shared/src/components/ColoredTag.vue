<template>
  <div class="fr-tag" :class="getClasses()">
    <StatusIcon v-if="status" :status="status"></StatusIcon>
    {{ text }}
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import StatusIcon from "./StatusIcon.vue";

@Component({
  components: {
    StatusIcon
  }
})
export default class CardRow extends Vue {
  @Prop({ default: "" }) status?: string;
  @Prop() text!: string;
  @Prop({ default: false }) active!: boolean;

  getClasses() {
    const c = this.active ? "active " : "";
    switch (this.status) {
      case "VALIDATED":
        return c + "valid-menu-link";
      case "TO_PROCESS":
        return c + "to-process-menu-link";
      case "DECLINED":
        return c + "declined-menu-link";
      case "FILLED":
        return c + "filled-menu-link";
    }
    return c + "empty-menu-link";
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.fr-tag.valid-menu-link {
  background-color: #f3faf7;
  color: #466964;
  &.active {
    outline: 1px solid #466964;
    outline-offset: -2px;
  }
}
.fr-tag.to-process-menu-link {
  background-color: var(--purple-background);
  color: var(--purple-text);
  &.active {
    outline: 1px solid var(--purple-text);
    outline-offset: -2px;
  }
}

.fr-tag.declined-menu-link {
  background-color: var(--warning-950-100);
  color: var(--danger);
  &.active {
    outline: 1px solid var(--danger);
    outline-offset: -2px;
  }
}

.fr-tag.empty-menu-link {
  background-color: var(--bf200-bf300);
  color: var(--primary);
  &.active {
    background-color: var(--background-default-grey);
    outline: 1px solid #e5e5f4;
    outline-offset: -2px;
  }
}

.fr-tag.filled-menu-link {
  background-color: var(--bf200-bf300);
  color: var(--primary);
  &.active {
    background-color: var(--background-default-grey);
    outline: 1px solid #e5e5f4;
    outline-offset: -2px;
  }
}

.fr-tag {
  width: fit-content;
  color: var(--g800-plain);
  font-size: 14px;
}
</style>
