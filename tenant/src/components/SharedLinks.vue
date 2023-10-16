<template>
  <NakedCard class="fr-p-md-5w">
    <h2 class="fr-h4">{{ t("title") }}</h2>

    <div
      class="fr-table fr-table--bordered fr-table--no-caption fr-m-0 desktop"
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
    <div class="mobile">
      <ul
        class="fr-p-0"
        v-for="link in links"
        v-bind:key="link.id"
        :class="link.enabled ? '' : 'fr-label--disabled'"
      >
        <li class="fr-grid-row file-list-item fr-p-3w">
          <div class="fr-col-5">
            {{ formatDate(link.creationDate) }}
          </div>
          <div class="fr-col-7 align--right">
            <ColoredTag
              :hideIcon="true"
              :text="
                link.fullData ? $t('sharefile.full') : $t('sharefile.resume')
              "
              :status="'grey'"
              :active="link.enabled"
            ></ColoredTag>
          </div>
          <div class="fr-col-9 bold mail-container">{{ link.ownerEmail }}</div>
          <div class="fr-col-3 right">
            <Toggle
              class="fr-toggle--label-left"
              :id="link.id"
              :value="link.enabled"
              :checkedLabel="t('enabled')"
              :uncheckedLabel="t('disabled')"
              @update="updateSharedLinkStatus(link, $event)"
            />
          </div>
          <div class="fr-col-12 small-text">
            {{ $t("sharefile.lastvisit") }}
            {{ formatDateRelativeToNow(link.lastVisit) }}
          </div>
          <div class="fr-col-12">
            <ul class="fr-btns-group">
              <li>
                <Button
                  class="fr-btn--tertiary"
                  @on-click="deleteSharedLink(link)"
                >
                  {{ t("delete") }}
                </Button>
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <div v-if="links.length === 0" style="text-align: center">
        {{ t("no-shared-file") }}
      </div>
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
import ColoredTag from "df-shared/src/components/ColoredTag.vue";

@Component({
  components: { NakedCard, Button, ColoredTag, Toggle },
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
}
</script>

<style scoped lang="scss">
.wrap {
  word-wrap: break-word;
}

.file-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-style: solid;
  border-width: thin;
  border-radius: 0.25rem;
  border-color: var(--grey-900-175);
  min-height: 4rem;

  &.disabled {
    background-color: var(--background-alt-grey);
    border-style: none;
  }
}

.mail-container {
  padding-right: 1rem;
  word-wrap: break-word;
}

.right {
  display: flex;
  flex-direction: row-reverse;
}
</style>
