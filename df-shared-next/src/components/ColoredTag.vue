<template>
  <div class="fr-tag" :class="getClasses()">
    <StatusIcon v-if="status && !hideIcon" :status="status" :warn="warn"></StatusIcon>
    <span class="fr-text--xs" v-if="label">{{ label }}&nbsp;:&nbsp;</span>
    {{ text }}
  </div>
</template>

<script setup lang="ts">
import StatusIcon from './StatusIcon.vue'

const props = withDefaults(
  defineProps<{
    status?: string
    label?: string
    text: string
    active?: boolean
    hideIcon?: boolean
    warn?: boolean
  }>(),
  {
    status: '',
    label: undefined,
    active: false,
    hideIcon: false,
    warn: false
  }
)

function getClasses() {
  const c = props.active ? 'active ' : ''
  switch (props.status) {
    case 'VALIDATED':
      return c + 'valid-menu-link'
    case 'TO_PROCESS':
      return c + 'to-process-menu-link'
    case 'DECLINED':
      return c + 'declined-menu-link'
    case 'FILLED':
      return c + 'filled-menu-link'
    case 'INCOMPLETE':
      if (props.warn) {
        return c + 'declined-menu-link'
      }
      return c + 'empty-menu-link'
    case 'grey':
      return c + 'grey'
  }
  return c + 'empty-menu-link'
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

.fr-tag.grey {
  background-color: #eeeeee;
  color: #929292;
  &.active {
    background-color: #eeeeee;
    color: #161616;
  }
}

.fr-tag {
  width: fit-content;
  min-width: fit-content;
  color: var(--g800-plain);
  font-size: 14px;
}
</style>
