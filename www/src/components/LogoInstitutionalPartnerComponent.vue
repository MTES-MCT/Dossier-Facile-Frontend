<template>
  <div class="fr-col-md-3 fr-col-6">
    <div class="logo-container">
      <a
        :href="href"
        :title="getTitle()"
        class="logo-link"
        rel="nofollow"
        :target="href === '#' ? '' : '_blank'"
      >
        <img
          :alt="name"
          :height="height"
          :src="getImage()"
          :width="width"
          loading="lazy"
          class="partner-logo"
        />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    name: string
    image: string
    href: string
    width?: string
    height?: string
    title?: string
  }>(),
  {
    width: '60',
    height: '60',
    title: ''
  }
)

function getTitle() {
  if (props.title) {
    return props.title
  }
  return 'aller sur le site « ' + props.name + ' » (nouvelle fenêtre)'
}

function getImage() {
  if (props.image) {
    return props.image
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
a[target='_blank'].logo-link::after {
  content: none;
}

.logo-link {
  box-shadow: none;
  background-image: none;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 180px;
  background-color: white;
}
</style>
