<template>
  <span class="fr-tag" :class="getClasses()">
    <StatusIcon v-if="status && !hideIcon" :status="status" :warn="warn" />
    <span v-if="label" class="fr-text--xs">{{ label }}&nbsp;:&nbsp;</span>
    {{ text }}
  </span>
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
    case 'COMPLETED':
      return c + 'completed-menu-link'
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

<style scoped>
.fr-tag {
  --_color: var(--color, var(--primary));
  --_bgColor: var(--bgColor, var(--bf200-bf300));
  --_outlineColor: var(--outlineColor);

  width: fit-content;
  min-width: fit-content;
  font-size: 0.875rem;

  color: var(--_color);
  background-color: var(--_bgColor);
  outline: 1px solid var(--_bgColor);
  outline-offset: -2px;

  &.active {
    --bgColor: var(--background-default-grey);
    outline-color: var(--_outlineColor, var(--_color));
  }
}

.fr-tag.valid-menu-link {
  --bgColor: var(--green-emeraude-975-75);
  --color: var(--green-emeraude-sun-425-moon-753);
}

.fr-tag.to-process-menu-link {
  --color: var(--text-label-purple-glycine);
  --bgColor: var(--background-contrast-purple-glycine);
}

.fr-tag.declined-menu-link {
  --bgColor: var(--background-contrast-error);
  --color: var(--text-default-error);
}

.fr-tag.filled-menu-link {
  --bgColor: var(--bf200-bf300);
  --color: var(--primary);
}

.fr-tag.completed-menu-link {
  --bgColor: var(--background-contrast-info);
  --color: var(--text-default-info);
  --outlineColor: var(--text-default-info);
}

.fr-tag.grey {
  --bgColor: #eeeeee;
  --color: #929292;
  &.active {
    --color: #161616;
  }
}
</style>
