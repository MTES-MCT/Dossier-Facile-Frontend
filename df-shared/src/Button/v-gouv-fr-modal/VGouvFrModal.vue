<template>
  <div class="v-gouv-fr-modal"></div>
</template>
<script>
export default {
  name: "v-gouv-fr-modal",
  props: {},
  computed: {},
  methods: {},
  mounted: function() {
    const localScript = document.createElement("script");
    localScript.setAttribute("src", "/js/dsfr.module.min.js");
    document.head.appendChild(localScript);
  }
};
</script>
