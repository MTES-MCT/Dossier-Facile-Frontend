<template>
  <div>
    <h1>{{ $t("title") }}</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ValidationProvider } from "vee-validate";
import { mapState } from "vuex";
import { User } from "df-shared/src/models/User";

@Component({
  components: { ValidationProvider },
  computed: {
    ...mapState({
      user: "user"
    })
  }
})
export default class FileStatus extends Vue {
  user!: User;
}
</script>

<i18n>
{
  "en": {
      "title": "Mon dossier"
  },
  "fr": {
      "title": "Mon dossier"
  }
}
</i18n>
