<template>
  <div>
    <div v-if="!isOwner()">
      <NakedCard class="fr-p-md-5w">
        <div
          class="fr-grid-row fr-grid-row--center"
          v-if="applicationType === 'COUPLE'"
        >
          <div class="fr-col-12">
            <validation-provider
              rules="is"
              v-slot="{ errors }"
              class="fr-col-10"
            >
              <div
                class="fr-checkbox-group bg-purple"
                :class="errors[0] ? 'fr-input-group--error' : ''"
              >
                <input
                  type="checkbox"
                  id="authorize"
                  value="false"
                  v-model="localSpouseAuthorize"
                />
                <label
                  for="authorize"
                  v-html="$t('tenantinformationform.acceptAuthorSpouse')"
                >
                </label>
                <span class="fr-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
              </div>
            </validation-provider>
          </div>
        </div>
        <div
          class="fr-grid-row fr-grid-row--center"
          v-if="applicationType === 'GROUP'"
        >
          <div class="fr-col-12">
            <validation-provider
              rules="is"
              v-slot="{ errors }"
              class="fr-col-10"
            >
              <div
                class="fr-checkbox-group bg-purple"
                :class="errors[0] ? 'fr-input-group--error' : ''"
              >
                <input
                  type="checkbox"
                  id="authorize"
                  value="false"
                  v-model="localCoTenantAuthorize"
                />
                <label
                  for="authorize"
                  v-html="$t('tenantinformationform.acceptAuthorCoTenant')"
                >
                </label>
                <span class="fr-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
              </div>
            </validation-provider>
          </div>
        </div>
      </NakedCard>
      <ProfileFooter @on-back="goBack" @on-next="authorize()"></ProfileFooter>
    </div>

    <div v-if="isOwner()">
      <NakedCard class="fr-p-md-5w">
        <h1 class="fr-h6">
          {{ $t("tenantinformationform.title") }}
        </h1>
        <ApplicationTypeSelector
          @selected="updateApplicationType"
        ></ApplicationTypeSelector>
      </NakedCard>
      <ValidationObserver ref="observer" v-slot="{ validate }">
        <form
          name="form"
          @submit.prevent="validate().then(handleOthersInformation)"
        >
          <CoupleInformation
            v-model="coTenants"
            class="fr-mt-2w"
            v-if="applicationType === 'COUPLE'"
          >
          </CoupleInformation>
          <RoommatesInformation
            v-model="coTenants"
            class="fr-mt-2w"
            v-if="applicationType === 'GROUP'"
          >
          </RoommatesInformation>
          <ProfileFooter @on-back="goBack"></ProfileFooter>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { User } from "df-shared/src/models/User";
import RoommatesInformation from "./RoommatesInformation.vue";
import CoupleInformation from "./CoupleInformation.vue";
import { mapGetters, mapState } from "vuex";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import SubmitButton from "df-shared/src/Button/SubmitButton.vue";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import DfButton from "df-shared/src/Button/Button.vue";
import { AnalyticsService } from "../services/AnalyticsService";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import ProfileFooter from "./footer/ProfileFooter.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import ApplicationTypeSelector from "../components/ApplicationTypeSelector.vue";

@Component({
  computed: {
    ...mapState({
      user: "user",
    }),
    ...mapGetters({
      roommates: "getRoommates",
      coTenantAuthorize: "coTenantAuthorize",
      spouseAuthorize: "spouseAuthorize",
    }),
  },
  components: {
    CoupleInformation,
    RoommatesInformation,
    ValidationObserver,
    ValidationProvider,
    SubmitButton,
    WarningMessage,
    DfButton,
    ConfirmModal,
    ProfileFooter,
    NakedCard,
    ApplicationTypeSelector,
  },
})
export default class TenantInformationForm extends Vue {
  user!: User;
  roommates!: User[];
  coTenants: User[] = [];
  coTenantAuthorize!: boolean;
  spouseAuthorize!: boolean;
  applicationType = "";

  localCoTenantAuthorize!: boolean;
  localSpouseAuthorize!: boolean;

  beforeMount() {
    if (this.user.applicationType) {
      this.applicationType = this.user.applicationType;
    }
    this.localCoTenantAuthorize = this.coTenantAuthorize;
    this.localSpouseAuthorize = this.spouseAuthorize;

    if (this.applicationType === "GROUP" || this.applicationType === "COUPLE") {
      this.coTenants = this.roommates;
    }
  }

  async handleOthersInformation() {
    const isValid = await (
      this.$refs.observer as Vue & {
        validate: () => boolean;
      }
    ).validate();

    if (!isValid) return;

    if (this.hasNothingToSave()) {
      this.$router.push({
        name: "TenantDocuments",
        params: { substep: "1" },
      });
      return;
    }

    const dispatchMethod =
      this.applicationType === "GROUP"
        ? () => {
            const data = {
              applicationType: this.applicationType,
              coTenantEmail: this.coTenants.flatMap((t) => t.email),
              acceptAccess: true,
            };
            return this.$store.dispatch("setRoommates", data);
          }
        : () => {
            const data = {
              applicationType: this.applicationType,
              coTenants: this.coTenants,
              acceptAccess: true,
            };
            return this.$store.dispatch("setCoTenants", data);
          };
    const loader = this.$loading.show();

    dispatchMethod()
      .then(
        () => {
          AnalyticsService.confirmType();
          this.$router.push({
            name: "TenantDocuments",
            params: { substep: "1" },
          });
          if (this.applicationType === "COUPLE") {
            Vue.toasted.global.info_toast({
              message: "tenantinformationform.couple-saved",
            });
            return;
          }
          if (this.applicationType === "GROUP") {
            Vue.toasted.global.info_toast({
              message: "tenantinformationform.roommates-saved",
            });
            return;
          }
        },
        (error) => {
          if (error.response.data.message.includes("are already being used")) {
            Vue.toasted.global.error_toast({
              message: "tenantinformationform.email-exists",
            });
            return;
          } else {
            Vue.toasted.global.error_toast({
              message: "tenantinformationform.error",
            });
            return;
          }
        }
      )
      .finally(() => {
        loader.hide();
      });
  }

  updateApplicationType(value: string) {
    this.applicationType = value;
    this.deleteCoTenants();
  }

  hasNothingToSave() {
    if (
      this.applicationType === this.user.applicationType &&
      this.applicationType === "ALONE"
    ) {
      return true;
    }
    if (
      this.applicationType === this.user.applicationType &&
      this.applicationType === "GROUP"
    ) {
      const unregisteredRoommate = this.coTenants.find((r: any) => {
        return r.id === undefined;
      });
      if (unregisteredRoommate === undefined) {
        return true;
      }
    }
    return false;
  }

  deleteCoTenants() {
    this.user.apartmentSharing?.tenants.forEach((t) => {
      if (t.tenantType !== "CREATE") {
        this.$store
          .dispatch("deleteCoTenant", t)
          .then()
          .catch(() => {
            this.$toasted.global.error();
            return;
          });
      }
    });
    this.coTenants = [];
  }

  isOwner() {
    return (
      this.user.tenantType === undefined || this.user.tenantType === "CREATE"
    );
  }

  authorize() {
    if (this.applicationType === "COUPLE" && !this.localSpouseAuthorize) {
      return;
    }
    if (this.applicationType === "GROUP" && !this.localCoTenantAuthorize) {
      return;
    }
    this.$router.push({ name: "TenantDocuments", params: { substep: "1" } });
  }

  goBack() {
    this.$router.push({ name: "TenantName" });
  }
}
</script>

<style scoped lang="scss">
.warning {
  padding: 0.5rem;
}

.spa {
  justify-content: space-around;
  align-content: space-around;
  height: 100%;
  align-items: center;
}

.selected {
  .icon-container {
    background-color: var(--primary);
    color: white;
  }
}

.icon-container {
  border-radius: 0.5rem;
  height: 5rem;
  width: 6rem;
  color: var(--primary);
  background-color: var(--white);
  border: 1px solid var(--primary);

  display: flex;
  justify-content: center;
  align-items: center;

  @media all and (max-width: 991px) {
    display: none;
  }
}
</style>
