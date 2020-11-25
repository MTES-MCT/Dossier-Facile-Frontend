<template>
  <div>
    <NakedCard v-if="user.lastName || hasDocument()">
      <template v-slot:content>
        <div v-if="user.lastName">
          <a href="#" class="rf-link">
            {{ $t("title") }}
          </a>
          <hr />
          <div class="rf-card__desc">
            <section>
              <div class="row" v-if="user.lastName">
                <div>
                  <div class="subtitle">Prénom et Nom</div>
                  {{ user.firstName }} {{ user.lastName }}
                </div>
                <div class="edit-step-btn" @click="setStep(0)">
                  <unicon name="pen" fill="royalBlue"></unicon>
                </div>
              </div>
              <div class="row" v-if="user.tenantType">
                <div>
                  <div class="subtitle">Type de location</div>
                  {{ $t(user.tenantType) }}
                </div>
                <div class="edit-step-btn" @click="setStep(1)">
                  <unicon name="pen" fill="royalBlue"></unicon>
                </div>
              </div>
            </section>
          </div>
        </div>
        <div v-if="hasDocument()">
          <a href="#" class="rf-link">
            {{ $t("second-title") }}
          </a>
          <hr />
          <div class="rf-card__desc">
            <section>
              <div class="row" v-if="user.identification">
                <div class="subtitle">Pièce d'identité</div>
                <div class="row">
                  <div class="edit-step-btn" @click="setStep(2)">
                    <unicon name="eye" fill="royalBlue"></unicon>
                  </div>
                  <div class="edit-step-btn" @click="setStep(2)">
                    <unicon name="pen" fill="royalBlue"></unicon>
                  </div>
                </div>
              </div>
              <div class="row" v-if="user.residency">
                <div class="subtitle">Justificatif de domicile</div>
                <div class="row">
                  <div class="edit-step-btn" @click="setStep(2)">
                    <unicon name="eye" fill="royalBlue"></unicon>
                  </div>
                  <div class="edit-step-btn" @click="setStep(2)">
                    <unicon name="pen" fill="royalBlue"></unicon>
                  </div>
                </div>
              </div>
              <div class="row" v-if="user.professional">
                <div class="subtitle">
                  Justificatif de situation professionelle
                </div>
                <div class="row">
                  <div class="edit-step-btn" @click="setStep(2)">
                    <unicon name="eye" fill="royalBlue"></unicon>
                  </div>
                  <div class="edit-step-btn" @click="setStep(2)">
                    <unicon name="pen" fill="royalBlue"></unicon>
                  </div>
                </div>
              </div>
              <div class="row" v-if="user.financial">
                <div class="subtitle">Justificatif de revenu</div>
                <div class="row">
                  <div class="edit-step-btn" @click="setStep(2)">
                    <unicon name="eye" fill="royalBlue"></unicon>
                  </div>
                  <div class="edit-step-btn" @click="setStep(2)">
                    <unicon name="pen" fill="royalBlue"></unicon>
                  </div>
                </div>
              </div>
              <div class="row" v-if="user.tax">
                <div class="subtitle">Avis d'imposition</div>
                <div class="row">
                  <div class="edit-step-btn" @click="setStep(2)">
                    <unicon name="eye" fill="royalBlue"></unicon>
                  </div>
                  <div class="edit-step-btn" @click="setStep(2)">
                    <unicon name="pen" fill="royalBlue"></unicon>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </template>
    </NakedCard>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import NakedCard from "@/components/NakedCard.vue";
import { User } from "df-shared/src/models/User";

@Component({
  components: { NakedCard },
  computed: {
    ...mapState({
      user: "user",
      currentStep: "currentStep"
    })
  }
})
export default class EditSummary extends Vue {
  user!: User;

  setStep(n: number) {
    this.$store.commit("setStep", n);
  }
  hasDocument() {
    return (
      this.user.identification ||
      this.user.residency ||
      this.user.professional ||
      this.user.financial ||
      this.user.tax
    );
  }
}
</script>

<style scoped lang="scss">
.row {
  display: flex;
  justify-content: space-between;
  padding: 0.2rem;
  div {
    align-self: center;
  }
}
.edit-step-btn {
  align-self: center;
  padding: 0.2rem;
  cursor: pointer;
}
.subtitle {
  font-weight: bold;
}
</style>

<i18n>
{
"en": {
"title": "Information du locataire",
"second-title": "Documents",
"ALONE": "Seul",
"COUPLE": "En couple",
"CREATE": "En colocation"
},
"fr": {
"title": "Information du locataire",
"second-title": "Documents",
"ALONE": "Seul",
"COUPLE": "En couple",
"CREATE": "En colocation"
}
}
</i18n>
