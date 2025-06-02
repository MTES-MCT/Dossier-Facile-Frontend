<template>
  <div class="fr-grid-row">
    <div class="fr-col-6 title">Les pièces acceptées</div>
    <div class="fr-col-6 title">Les pièces refusées</div>
    <div class="content left fr-col-6">
      <ul>
        <li v-for="(v, k) in allowList" :key="k" class="check">
          <span v-html="v"></span>
        </li>
      </ul>
    </div>
    <div class="content fr-col-6">
      <ul>
        <li v-for="(v, k) in blockList" :key="k" class="times">
          <span v-html="v"></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    allowList?: string[]
    blockList?: string[]
  }>(),
  {
    allowList: () => [],
    blockList: () => []
  }
)
</script>

<style scoped lang="scss">
.fr-grid-row {
  width: 100%;
  background-color: var(--g200);
  border: 1px solid var(--primary);
  border-radius: 10px;
  > div {
    padding: 1rem;
    .title {
      padding-left: 2rem;
    }
  }
}

.left {
  display: inline-block;
  position: relative;
  &:after {
    position: absolute;
    content: '';
    border-left: 1px solid var(--primary);
    height: 70%;
    transform: translateY(-50%);
    right: 0;
    top: 50%;
  }
}

.content {
  padding: 10px;
}

ul li::before {
  content: none;
}

ul li {
  display: flex;
}

.title {
  font-weight: bold;
}

.check:before {
  content: '\2713';
  display: inline-block;
  color: limegreen;
  padding: 0 6px 0 0;
}

.times:before {
  content: '\d7';
  display: inline-block;
  color: red;
  padding: 0 6px 0 0;
}

ul {
  padding-inline-start: 0;
}

a {
  word-break: break-all;
}
</style>
