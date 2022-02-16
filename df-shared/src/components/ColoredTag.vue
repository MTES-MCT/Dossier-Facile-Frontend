<template>
  <div class="fr-tag" :class="getClasses()">
    <StatusIcon v-if="status" :status="status"></StatusIcon>
    {{ text }}
  </div>
</template>

<script setup lang="ts">
import StatusIcon from "./StatusIcon.vue";

const props = defineProps<{
  status: { type: string; required: false; default: "" };
  text: { type: string; required: true };
  active: { type: boolean; required: false; default: false };
}>();

function getClasses() {
  const c = props.active ? "active " : "";
  switch (props.status) {
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
  background-color: #fffaf5;
  color: #7d4e5b;
  &.active {
    outline: 1px solid #7d4e5b;
    outline-offset: -2px;
  }
}

.fr-tag.declined-menu-link {
  background-color: #fdf9f7;
  color: #e10600;
  &.active {
    outline: 1px solid #e10600;
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
