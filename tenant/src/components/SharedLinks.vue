<template>
  <NakedCard class="fr-p-md-5w">
    <h2 class="fr-h4">{{ t("title") }}</h2>

    <div
      class="fr-table fr-table--bordered fr-table--no-caption fr-m-0"
      :class="{ 'fr-table--layout-fixed': !isMobile() }"
    >
      <table>
        <caption>
          {{
            t("title")
          }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ t("date") }}</th>
            <th scope="col" colspan="2">{{ t("contact") }}</th>
            <th scope="col">{{ t("application-type") }}</th>
            <th scope="col">{{ t("last-visit") }}</th>
            <th scope="col">{{ t("link-status") }}</th>
            <th scope="col">{{ t("action") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="link in links"
            v-bind:key="link.id"
            :class="link.enabled ? '' : 'fr-label--disabled'"
          >
            <td>{{ formatDate(link.creationDate) }}</td>
            <td colspan="2" class="wrap">{{ link.ownerEmail }}</td>
            <td>
              <span v-if="link.fullData">
                {{ $t("sharefile.full") }}
              </span>
              <span v-else class="fr-label--disabled">
                {{ $t("sharefile.resume") }}
              </span>
            </td>
            <td class="wrap">
              {{ formatDateRelativeToNow(link.lastVisit) }}
            </td>
            <td class="fr-p-0" style="display: flex; justify-content: center">
              <Toggle
                :id="link.id"
                :value="link.enabled"
                :checkedLabel="t('enabled')"
                :uncheckedLabel="t('disabled')"
                @update="updateSharedLinkStatus(link, $event)"
              />
            </td>
            <td>
              <Button @on-click="deleteSharedLink(link)">
                {{ t("delete") }}
              </Button>
            </td>
          </tr>
          <tr v-if="links.length === 0">
            <td colspan="7" style="text-align: center">
              {{ t("no-shared-file") }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </NakedCard>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import Toggle from "df-shared/src/components/Toggle.vue";
import { ApartmentSharingLink } from "df-shared/src/models/ApartmentSharingLink";
import Button from "df-shared-next/src/Button/Button.vue";
import moment from "moment";
import { mapState } from "vuex";
import store from "@/store";
import {UtilsService} from "@/services/UtilsService";

@Component({
  components: { NakedCard, Button, Toggle },
  computed: {
    ...mapState({
      links: "apartmentSharingLinks",
    }),
  },
})
export default class SharedLinks extends Vue {
  links!: ApartmentSharingLink[];

  deleteSharedLink(link: ApartmentSharingLink) {
    store.dispatch("deleteApartmentSharingLink", link);
  }

  updateSharedLinkStatus(link: ApartmentSharingLink, enabled: boolean) {
    store
      .dispatch("updateApartmentSharingLinkStatus", { link, enabled })
      .then(() => {
        Vue.toasted.global.save_success();
      })
      .catch(() => {
        Vue.toasted.global.save_failed();
      });
  }

  formatDate(date: string | undefined) {
    if (date === undefined) {
      return "";
    }
    return moment(date).format("D MMM YYYY");
  }

  formatDateRelativeToNow(date: string | undefined) {
    if (date === undefined) {
      return this.t("never");
    }
    const relativeDate = moment(date).fromNow();
    return this.capitalizeFirstLetter(relativeDate);
  }

  capitalizeFirstLetter(str: string) {
    const firstLetter = str.at(0)?.toUpperCase();
    return firstLetter + str.substring(1);
  }

  t(key: string) {
    return this.$t(`sharing-page.shared-links.${key}`);
  }

  isMobile() {
    return UtilsService.isMobile();
  }
}
</script>

<style scoped lang="scss">
.wrap {
  word-wrap: break-word;
}
</style>
