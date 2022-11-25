<template>
  <div class="fr-container">
    <section v-if="user.applicationType === 'COUPLE'" class="fr-mt-5w fr-mb-3w">
      <div class="fr-tabs">
        <ul class="fr-tabs__list" role="tablist" aria-label="tab-list">
          <li
            v-for="(tenant, k) in getTenants()"
            v-bind:key="`li${k}`"
            role="presentation"
          >
            <button
              class="fr-tabs__tab fr-tabs__tab--icon-right"
              :id="`tabpanel-${k}`"
              :tabindex="tabIndex === k ? 0 : -1"
              role="tab"
              :aria-selected="tabIndex === k"
              :aria-controls="`tabpanel-${k}-panel`"
              @click="tabIndex = k"
            >
              {{ tenant | fullName }}
            </button>
          </li>
        </ul>
        <div
          v-for="(tenant, k) in getTenants()"
          v-bind:key="`t${k}`"
          :id="`tabpanel-${k}-panel`"
          class="fr-tabs__panel"
          :class="{ 'fr-tabs__panel--selected': tabIndex === k }"
          role="tabpanel"
          tabindex="0"
        >
          <MessagesPanel :tenant="tenant" :isCotenant="tenant.id != user.id" />
        </div>
      </div>
    </section>
    <MessagesPanel v-else :tenant="user" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { mapState } from "vuex";
import { User } from "df-shared/src/models/User";

import MessagesPanel from "../components/MessagesPanel.vue";

@Component({
  components: {
    MessagesPanel
  },
  computed: {
    ...mapState({
      user: "user"
    })
  }
})
export default class Messages extends Vue {
  user!: User;

  tabIndex = 0;

  mounted() {
    this.$store.commit("readMessage");
  }

  getTenants() {
    const tenants: User[] = [];
    tenants.push(this.user);

    this.user?.apartmentSharing?.tenants?.forEach(t => {
      if (t.id != this.user.id) {
        tenants.push(t);
      }
    });

    return tenants;
  }
}
</script>
