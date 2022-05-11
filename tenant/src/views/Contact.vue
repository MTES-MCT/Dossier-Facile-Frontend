<template>
  <ContactForm :user="user" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { User } from "df-shared/src/models/User";
import ContactForm from "df-shared/src/components/ContactForm.vue";

@Component({
  components: {
    ContactForm
  },
  computed: {
    ...mapState({
      user: "user"
    })
  }
})
export default class Contact extends Vue {
  user!: User;
}
</script>

<style scoped lang="scss">
</style>
