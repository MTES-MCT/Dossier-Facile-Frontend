<template>
  <div class="bg-blue">
    <div class="fr-container">
      <section class="fr-mt-3w">
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12">
            <h1>
              {{
                $t("account.title." + getApplicationType(), [
                  getFirstName(),
                  $t(getGlobalStatus()).toLowerCase()
                ])
              }}
            </h1>
            <div class="fr-callout warning fr-callout-white" v-if="isDenied()">
              <h2 class="fr-text-title--grey fr-h4">
                {{ $t("account.amendment-required-title") }}
              </h2>
              <p
                class="fr-callout__text"
                v-html="$t('account.amendment-required-text')"
              ></p>
              <DfButton @on-click="goToMessaging" primary="true">{{
                $t("account.messaging")
              }}</DfButton>
            </div>
            <div class="fr-callout fr-callout-white" v-if="canCopyLink()">
              <h2 class="fr-text-title--grey fr-h4">
                {{ $t("account.congratulations-title") }}
              </h2>
              <p
                class="fr-mb-3w"
                v-html="$t('account.congratulations-text-1')"
              ></p>
              <p v-html="$t('account.congratulations-text-2')"></p>
            </div>
            <div class="main fr-mt-5w fr-p-4w bg-white">
              <div class="main-bar fr-grid-row">
                <div class="header-title mobile-margin">
                  <h2
                    class="fr-text-title--grey fr-h4 fr-mr-2w fr-mb-0 fr-mt-0"
                  >
                    {{ $t("account.my-file") }}
                  </h2>
                </div>
                <span class="spacer"></span>
                <div class="fr-grid-row btn-container">
                  <DfButton
                    class="main-copy-btn"
                    @on-click="copyFullLink()"
                    primary="true"
                    size="small"
                    :disabled="!canCopyLink()"
                    >{{ $t("account.copy-link") }}</DfButton
                  >
                  <div class="grp">
                    <button
                      class="fr-btn grp-btn"
                      title="Copy"
                      @click="radioVisible = !radioVisible"
                      :disabled="!canCopyLink()"
                    >
                      <span
                        v-if="radioVisible"
                        class="material-icons"
                        aria-hidden="true"
                        >expand_more</span
                      >
                      <span v-else class="material-icons" aria-hidden="true"
                        >expand_less</span
                      >
                    </button>
                    <div class="grp-modal bg-white" v-show="radioVisible">
                      <h3 class="fr-h4">{{ $t("account.share-file") }}</h3>
                      <p class="share-file-description">
                        {{ $t("account.share-file-description") }}
                      </p>
                      <div>
                        <div class="flex copy-btn">
                          <button
                            primary="true"
                            @click="copyPublicLink"
                            :class="{ copied: publicLinkCopied }"
                            v-html="
                              publicLinkCopied
                                ? $t('account.public-link-copied')
                                : $t('account.file-resume')
                            "
                          ></button>
                        </div>
                        <div class="flex copy-btn fr-mt-3w">
                          <button
                            primary="true"
                            @click="copyFullLink"
                            :class="{ copied: fullLinkCopied }"
                            v-html="
                              fullLinkCopied
                                ? $t('account.full-link-copied')
                                : $t('account.file-full')
                            "
                          ></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="fr-mt-1v alert-container">
                <div class="red-alert" v-if="notVisibleCotenantNotValidated()">
                  {{
                    $t("account." + getApplicationType() + ".cannot-copy-link")
                  }}
                </div>
              </div>
              <div class="main-description fr-mt-2w">
                <p
                  class="description"
                  v-html="
                    $t('account.status-description', [
                      getFirstName(),
                      getPersonnalStatus(),
                      getProfession(),
                      getIncome()
                    ])
                  "
                ></p>
              </div>
              <div
                class="fr-callout fr-mb-3w"
                v-if="user.status === 'TO_PROCESS'"
              >
                <h3 class="fr-h4 dflex">
                  <span class="material-icons-outlined md-28">timer</span
                  >&nbsp;<span>{{
                    $t("account.instructional-time-title")
                  }}</span>
                </h3>
                <p v-html="$t('account.instructional-time-text')"></p>
              </div>
            </div>
            <div class="fr-mt-2w fr-p-0w">
              <section
                v-if="user.applicationType === 'COUPLE'"
                class="fr-m-0 fr-p-0 bg-white"
              >
                <div class="fr-tabs account-tabs ">
                  <ul
                    class="fr-tabs__list fr-p-0"
                    role="tablist"
                    aria-label="tab-list"
                  >
                    <li
                      v-for="(tenant, k) in getTenants()"
                      v-bind:key="`li${k}`"
                      role="presentation"
                    >
                      <button
                        class="fr-tabs__tab fr-container--fluid"
                        :id="`tabpanel-${k}`"
                        :tabindex="tabIndex === k ? 0 : -1"
                        role="tab"
                        :aria-selected="tabIndex === k"
                        :aria-controls="`tabpanel-${k}-panel`"
                        @click="tabIndex = k"
                      >
                        <div class="fr-grid-row">
                          <div class="name fr-col-xs-12 fr-col fr-mr-1w">
                            {{ tenant | fullName }}
                            <span
                              :class="{
                                'fr-fi-icon-fc': tenant.franceConnect
                              }"
                            ></span>
                          </div>
                          <ColoredTag
                            class="fr-col-xs-12 fr-col"
                            :status="tenant.status"
                            :text="$t(`dossier.${tenant.status}`)"
                          ></ColoredTag>
                        </div>
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
                    <TenantPanel
                      class="panel"
                      :tenant="tenant"
                      :isCotenant="tenant.id != user.id"
                    />
                  </div>
                </div>
              </section>
              <TenantPanel v-else :tenant="user" class="fr-p-4w bg-white" />
            </div>
            <PartnersSection />

            <div class="delete">
              <h2 class="fr-pt-4w fr-pb-2w">{{ $t("account.delete") }}</h2>
              <div class="bg-white fr-p-4w">
                <p>
                  Vous pouvez supprimer votre compte DossierFacile à tout
                  moment. La suppression de votre compte entrainera
                  automatiquement l’effacement définitif de vos pièces
                  justificatives.
                </p>
                <div class="align--center">
                  <DfButton
                    class="delete-btn"
                    primary="true"
                    @on-click="isDeleteModalVisible = true"
                    >{{ $t("account.delete-account") }}</DfButton
                  >
                </div>
                <DeleteAccount
                  v-model="isDeleteModalVisible"
                  v-show="isDeleteModalVisible"
                ></DeleteAccount>
              </div>
            </div>
            <div class="opinion fr-mb-5w">
              <h2 class="fr-pt-4w fr-pb-2w">{{ $t("account.opinion") }}</h2>
              <div class="bg-white fr-p-4w">
                <p>
                  Nous cherchons constamment à améliorer la qualité de notre
                  service. Dans le cadre de cette démarche d’amélioration, nous
                  cherchons à obtenir votre retour d’expérience. En cliquant sur
                  le bouton ci-dessous, vous pourrez évaluer DossierFacile.fr.
                  Vos commentaires nous sont précieux ! Merci.
                </p>
                <div class="align--center">
                  <a
                    class="cleana"
                    href="https://voxusagers.numerique.gouv.fr/Demarches/2871?&view-mode=formulaire-avis&nd_mode=en-ligne-enti%C3%A8rement&nd_source=button&key=f2f9b35326f6b085c219faef71d0a3f2"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      :src="require('../assets/button-je-donne-mon-avis.svg')"
                      alt="Je donne mon avis"
                      title="Je donne mon avis sur cette démarche"
                      class="align--center"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { mapState } from "vuex";
import { User } from "df-shared/src/models/User";
import { DfDocument } from "df-shared/src/models/DfDocument";
import DfButton from "df-shared/src/Button/Button.vue";
import ColoredTag from "df-shared/src/components/ColoredTag.vue";
import { Guarantor } from "df-shared/src/models/Guarantor";
import { AnalyticsService } from "../services/AnalyticsService";
import { extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";
import DeleteAccount from "../components/DeleteAccount.vue";
import GuarantorsSection from "@/components/account/GuarantorsSection.vue";
import PartnersSection from "@/components/account/PartnersSection.vue";
import { UtilsService } from "@/services/UtilsService";
import InfoCard from "@/components/account/InfoCard.vue";
import TenantPanel from "@/components/account/TenantPanel.vue";

extend("required", {
  ...required,
  message: "Ce champ est requis"
});

@Component({
  components: {
    InfoCard,
    PartnersSection,
    GuarantorsSection,
    ValidationProvider,
    ValidationObserver,
    DfButton,
    ColoredTag,
    DeleteAccount,
    TenantPanel
  },
  computed: {
    ...mapState({
      user: "user"
    })
  }
})
export default class Account extends Vue {
  TENANT_URL = `https://${process.env.VUE_APP_TENANT_URL}`;
  MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;

  user!: User;
  radioVisible = false;
  pub = "false";
  isDeleteModalVisible = false;
  publicLinkCopied = false;
  fullLinkCopied = false;

  tabIndex = 0;

  mounted() {
    window.Beacon("init", "d949ac15-a9eb-4316-b0c5-f92cecc7118f");
  }

  beforeDestroy() {
    window.Beacon("destroy");
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

  getToken() {
    if (this.pub === "true") {
      return `${this.TENANT_URL}/public-file/${this.user.apartmentSharing?.tokenPublic}`;
    }
    return `${this.TENANT_URL}/file/${this.user.apartmentSharing?.token}`;
  }

  getStatus(docType: string) {
    if (docType === "FINANCIAL") {
      const docs = this.user.documents?.filter(d => {
        return d.documentCategory === "FINANCIAL";
      });
      return this.isFinancialValid(docs || []);
    }
    const doc = this.user.documents?.find((d: DfDocument) => {
      return d.documentCategory === docType;
    });
    return doc?.documentStatus || "EMPTY";
  }

  isFinancialValid(docs: DfDocument[]) {
    if (!docs || docs.length === 0) {
      return "INCOMPLETE";
    }

    for (const doc of docs) {
      if (!doc.noDocument && (doc.files?.length || 0) <= 0) {
        return "INCOMPLETE";
      }
    }

    for (const doc of docs) {
      if (doc.documentStatus === "DECLINED") {
        return "DECLINED";
      }
    }

    for (const doc of docs) {
      if (doc.documentStatus === "TO_PROCESS") {
        return "TO_PROCESS";
      }
    }

    return "VALIDATED";
  }

  goToMessaging() {
    this.$router.push("/messaging");
  }

  removeAnimation() {
    this.publicLinkCopied = false;
    this.fullLinkCopied = false;
  }

  copyPublicLink() {
    this.copyLink(
      `${this.TENANT_URL}/public-file/${this.user.apartmentSharing?.tokenPublic}`
    ).then(() => {
      this.fullLinkCopied = false;
      this.publicLinkCopied = true;
      setTimeout(this.removeAnimation, 4000);
    });
  }

  copyFullLink() {
    this.copyLink(
      `${this.TENANT_URL}/file/${this.user.apartmentSharing?.token}`
    ).then(() => {
      this.publicLinkCopied = false;
      this.fullLinkCopied = true;
      setTimeout(this.removeAnimation, 4000);
    });
  }

  copyLink(url: string) {
    try {
      navigator.clipboard.writeText(url);
      this.$toasted.show(this.$i18n.t("account.copied").toString(), {
        type: "success",
        duration: 3000
      });
      AnalyticsService.copyLink(this.pub ? "resume" : "full");
    } catch (err) {
      alert("Oops, unable to copy");
      return Promise.reject("error");
    }
    return Promise.resolve(true);
  }

  openDeleteModal() {
    this.isDeleteModalVisible = true;
  }

  undoSelect() {
    this.isDeleteModalVisible = false;
    return false;
  }

  getPersonnalStatus() {
    if (
      this.user?.apartmentSharing?.tenants !== undefined &&
      this.user.applicationType === "ALONE"
    ) {
      return this.$i18n.t("account.ALONE");
    }
    if (this.user.applicationType === "COUPLE") {
      const spouse = this.user?.apartmentSharing?.tenants?.find((t: User) => {
        return t.id !== this.user?.id;
      });
      if (spouse?.lastName !== undefined && spouse?.lastName !== "") {
        return this.$i18n
          .t("account.couple-with", [
            `${spouse?.firstName} ${spouse?.lastName}`
          ])
          .toString();
      }
      return this.$i18n
        .t("account.couple-with", [this.$i18n.t("account.someone")])
        .toString();
    }

    const roommates = this.user?.apartmentSharing?.tenants
      .filter((t: User) => {
        return t.id !== this.user?.id;
      })
      .map((u: User) => {
        return `${u.firstName} ${u.lastName}`;
      });

    const listNames = roommates?.join(", ");
    if (!listNames || listNames.includes("undefined")) {
      return this.$i18n.t("account.group-with-someone").toString();
    }
    return this.$i18n.t("account.group-with", [listNames]).toString();
  }

  getProfession() {
    const doc = this.user.documents?.find((d: DfDocument) => {
      return d.documentCategory === "PROFESSIONAL";
    });
    if (doc?.documentSubCategory === "OTHER") {
      return "";
    }
    return this.$i18n.t(`account.${doc?.documentSubCategory || "none"}`);
  }

  getIncome() {
    const sum = this.user.documents
      ?.filter((d: DfDocument) => {
        return d.documentCategory === "FINANCIAL";
      })
      .reduce((sum, current) => sum + (current.monthlySum || 0), 0);
    if (sum === 0) {
      return this.$i18n.t("account.no-income");
    }
    return this.$i18n.t("account.income", [sum]);
  }

  getFirstName() {
    return UtilsService.capitalize(this.user.firstName || "");
  }

  canCopyLink() {
    return (
      this.user.status === "VALIDATED" &&
      this.user.apartmentSharing?.tokenPublic !== undefined &&
      this.user.apartmentSharing?.tokenPublic !== ""
    );
  }

  notVisibleCotenantNotValidated() {
    return (
      this.user.applicationType === "GROUP" &&
      this.user.apartmentSharing?.tenants.find(t => {
        return t.status !== "VALIDATED";
      }) !== undefined
    );
  }

  isDenied() {
    return (
      this.user.documents?.find(d => {
        return d.documentStatus === "DECLINED";
      }) !== undefined ||
      this.user.guarantors?.find((g: Guarantor) => {
        return (
          g.documents?.find(d => {
            return d.documentStatus === "DECLINED";
          }) !== undefined
        );
      })
    );
  }

  gotoTenantName() {
    this.$router.push({ name: "TenantName" });
  }

  setTenantStep(n: number) {
    AnalyticsService.editFromAccount(n);
    this.$router.push({
      name: "TenantDocuments",
      params: { substep: n.toString() }
    });
  }

  getGlobalStatus(): string {
    return this.user.apartmentSharing?.status as string | "INCOMPLETE";
  }

  getApplicationType() {
    switch (this.user.applicationType) {
      case "COUPLE":
        return "couple";
      case "GROUP":
        return "group";
    }
    return "alone";
  }
}
</script>

<style scoped lang="scss">
.main-bar {
  display: flex;
}

.main {
  background-color: var(--background-default-grey);
}

.bg-blue {
  width: 100%;
  background-color: var(--bf100-g750);
}

.fr-callout-white {
  background-color: var(--background-default-grey);
  &.warning {
    box-shadow: inset 0.25rem 0 0 0 var(--error) !important;
  }
}

h1 {
  color: var(--bf500);
  font-size: 2rem;
}

h2 {
  color: var(--bf500);
  font-size: 2rem;
}

.align--center {
  text-align: center;
  margin: auto;
}

.bg-white {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 10px;
  background: var(--background-default-grey);
}
.account-tabs {
  > ul {
    background-color: var(--blue-france-200);
    overflow-y: hidden;
    > li > button.fr-tabs__tab {
      &:not([aria-selected="true"]) {
        background-color: #f2f2f9;
      }
      .name {
        text-align: left;
        padding-left: 0.5rem;
      }
      .fr-tag {
        font-weight: normal;
      }
    }
  }
}
.panel {
  @media (max-width: 706px) {
    padding-top: 1rem;
  }
}

.fr-btn.delete-btn {
  background-color: var(--error);
  --color-hover: rgba(246, 0, 0, 0.5);
  --color-active: rgba(255, 91, 91, 0.5);
}

.grp {
  display: block;
  position: relative;
}

.grp-btn {
  border-left: 1px solid var(--background-default-grey);
  position: relative;
}

.grp-modal {
  position: absolute;
  border-radius: 5px;
  right: 0;
  left: auto;
  width: max-content;
  z-index: 2;
  padding: 1rem;
  width: 330px;

  @media all and (max-width: 768px) {
    max-width: 300px;
  }

  &:before {
    top: -16px;
    right: 9px;
    left: auto;
    border: 8px solid transparent;
    border-bottom: 8px solid var(--color-border-overlay);
    position: absolute;
    display: inline-block;
    content: "";
  }
}

.copy-btn {
  max-width: 100%;
  > button {
    width: 100%;
    text-align: justify;
    border-radius: 0.25rem;
    padding: 1rem;
    font-size: 1rem;
    box-shadow: 0 0.5px 4px 0 #cecece;
    border: 1px solid transparent;

    -webkit-transition: all 0.5s linear;
    -moz-transition: all 0.5s linear;
    -o-transition: all 0.5s linear;
    transition: all 0.5s linear;

    &:hover {
      box-shadow: none;
      border: 1px solid var(--primary);
      box-shadow: 0 0.5px 4px 0 transparent;
      background-image: none;
    }

    &.copied {
      color: var(--primary);
      background-color: var(--background-action-low-blue-france);
      border: 1px solid var(--primary);
      box-shadow: 0 0.5px 4px 0 transparent;
      -webkit-transition: all 0.5s linear;
      -moz-transition: all 0.5s linear;
      -o-transition: all 0.5s linear;
      transition: all 0.5s linear;
    }
  }
}

p {
  word-break: break-word;
}

.edit-btn {
  position: absolute;
  right: 0;
  top: 0;

  box-shadow: none;
}

.description:first-letter {
  text-transform: uppercase;
}

.material-icons.md-adapt {
  font-size: 48px;
}

.header-title {
  display: flex;
  justify-content: center;
  align-items: center;
}

hr {
  border: 0;
  margin-left: 20%;
  margin-right: 20%;
  border-top: 1px solid var(--g400);
}

.fr-tile__body {
  overflow: auto;
}

.cleana {
  &:after {
    content: none;
  }
  &:focus {
    outline-style: auto;
    outline-width: 2px;
    outline-offset: 4px;
    outline-color: #0a76f6;
  }
}

.alert-container {
  display: flex;
  flex-direction: row-reverse;
}

.red-alert {
  background-color: var(--error);
  color: white;
  border-radius: 2px;
  margin-right: 0;
  margin-left: auto;
  padding: 0.5rem;
}

.name-email-tile {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dflex {
  display: flex;
  align-items: center;
}

.mobile-margin {
  @media all and (max-width: 768px) {
    margin-bottom: 1rem;
  }
}

.btn-container {
  margin-left: auto;

  @media all and (max-width: 600px) {
    width: 100%;
  }
}

.main-copy-btn {
  height: 2.5rem;
  @media all and (max-width: 600px) {
    flex: 1;
  }
}

.share-file-description {
  max-width: fit-content;
}

.fr-fi-icon-fc {
  &:before {
    content: "";
    background-color: transparent;
    background-image: url("../assets/images/icons/franceconnect-icon.png");
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    height: 21px;
    width: 24px;
    margin-left: 0.5rem;
  }
}
</style>
