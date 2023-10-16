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
              aria-selected="false"
              :aria-controls="`tabpanel-${k}-panel`"
              @click="markMessagesAsRead(tenant.id)"
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
          aria-selected="false"
          role="tabpanel"
          :tabindex="k"
        >
          <MessagesPanel :tenant="tenant" :isCotenant="tenant.id != user.id" />
        </div>
      </div>
    </section>
    <MessagesPanel v-else :tenant="user" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters, mapState } from "vuex";
import { User } from "df-shared/src/models/User";

import MessagesPanel from "../components/MessagesPanel.vue";

@Component({
  components: {
    MessagesPanel,
  },
  computed: {
    ...mapState({
      user: "user",
    }),
  },
})
export default class Messages extends Vue {
  user!: User;

  tabIndex = 0;

  mounted() {
    this.markMessagesAsRead(this.user.id);
  }

  markMessagesAsRead(tenantId: number) {
    this.$store.dispatch("readMessages", tenantId);
  }

  getTenants() {
    const tenants: User[] = [];
    tenants.push(this.user);

    this.user?.apartmentSharing?.tenants?.forEach((t) => {
      if (t.id != this.user.id) {
        tenants.push(t);
      }
    });

    return tenants;
  }
}
</script>
