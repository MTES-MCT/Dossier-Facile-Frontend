<template>
  <div>
    <!-- <ValidationObserver v-slot="{ handleSubmit }"> -->
      <!-- <form name="guarantorNameForm" @submit.prevent="handleSubmit(save)"> -->
      <form name="guarantorNameForm" @submit.prevent="save">
        <NakedCard class="fr-p-md-5w">
          <h1 class="fr-h6">{{ t("guarantorname.title") }}</h1>
          <div class="fr-alert fr-alert--info">
            <p v-html="t('guarantorchoice.two-guarantors-warning')"></p>
          </div>
          <div class="fr-grid-row fr-grid-row--center fr-mt-4w">
            <div class="fr-col-12 fr-mb-3w">
              <!-- <validation-provider
                rules="required|onlyAlpha"
                v-slot="{ errors, valid }"
              > -->
                  <!-- :class="errors[0] ? 'fr-input-group--error' : ''" -->
                <div
                  class="fr-input-group"
                >
                  <label class="fr-label" for="lastname"
                    >{{ t("guarantorname.lastname") }} :</label
                  >
                  <!-- TODO -->
                    <!-- :class="{
                      'fr-input--valid': valid,
                      'fr-input--error': errors[0],
                    }" -->
                  <input
                    v-model="lastName"
                    class="form-control fr-input validate-required"
                    id="lastname"
                    name="lastname"
                    :placeholder="t('guarantorname.lastname-placeholder')"
                    type="text"
                    required
                  />
                  <!-- <span class="fr-error-text" v-if="errors[0]">{{
                    t(errors[0])
                  }}</span> -->
                </div>
              <!-- </validation-provider> -->
            </div>
            <div class="fr-col-12 fr-mb-3w">
              <!-- <validation-provider
                rules="required|onlyAlpha"
                v-slot="{ errors, valid }"
              > -->
                  <!-- :class="errors[0] ? 'fr-input-group--error' : ''" -->
                <div
                  class="fr-input-group"
                >
                  <label for="firstname" class="fr-label"
                    >{{ t("guarantorname.firstname") }} :</label
                  >
                    <!-- :class="{
                      'fr-input--valid': valid,
                      'fr-input--error': errors[0],
                    }" -->
                  <input
                    id="firstname"
                    :placeholder="t('guarantorname.firstname-placeholder')"
                    type="text"
                    v-model="firstName"
                    name="firstname"
                    class="validate-required form-control fr-input"
                    required
                  />
                  <!-- <span class="fr-error-text" v-if="errors[0]">{{
                    t(errors[0])
                  }}</span> -->
                </div>
              <!-- </validation-provider> -->
            </div>
          </div>
        </NakedCard>
        <GuarantorFooter @on-back="goBack"></GuarantorFooter>
      </form>
    <!-- </ValidationObserver> -->
  </div>
</template>

<script setup lang="ts">
import { UploadStatus } from "df-shared-next/src/models/UploadStatus";
// import { ValidationObserver, ValidationProvider } from "vee-validate";
import NakedCard from "df-shared-next/src/components/NakedCard.vue";
import { UtilsService } from "../../../services/UtilsService";
import GuarantorFooter from "../../footer/GuarantorFooter.vue";
import { computed, onBeforeMount, ref } from "vue";
import useTenantStore from "@/stores/tenant-store";
import { useI18n } from "vue-i18n";
import { ToastService } from "@/services/ToastService";
import { useLoading } from 'vue-loading-overlay';

const store = useTenantStore();
const selectedGuarantor = computed(() => store.selectedGuarantor);

const { t } = useI18n();

  const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL);
  const firstName = ref("");
  const lastName = ref("");

  const emit = defineEmits(["on-next", "on-back"]);

  onBeforeMount(() => {
    firstName.value = selectedGuarantor.value?.firstName || "";
    lastName.value = selectedGuarantor.value?.lastName || "";
  })

  function save() {
    if (
      firstName.value === selectedGuarantor.value?.firstName &&
      lastName.value === selectedGuarantor.value?.lastName
    ) {
      emit("on-next");
      return;
    }
    const formData = new FormData();
    if (firstName.value) {
      formData.append("firstName", UtilsService.capitalize(firstName.value));
    }
    if (lastName.value) {
      formData.append("lastName", UtilsService.capitalize(lastName.value));
    }
    formData.append("guarantorId", store.guarantor?.id?.toString() || "");
    const $loading = useLoading({});
    const loader = $loading.show();
    store
      .saveGuarantorName(formData)
      .then(() => {
        ToastService.saveSuccess();
        emit("on-next");
      })
      .catch(() => {
        fileUploadStatus.value = UploadStatus.STATUS_FAILED;
        ToastService.saveFailed();
      })
      .finally(() => {
        loader.hide();
      });
  }

  function goBack() {
    emit("on-back");
  }
</script>

<style scoped lang="scss"></style>
