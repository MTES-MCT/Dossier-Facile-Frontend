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
                  <i class="icon color--primary rf-p-1w icon-Pen-4"></i>
                </div>
              </div>
              <div class="row" v-if="user.applicationType">
                <div>
                  <div class="subtitle">Type de location</div>
                  {{ $t(user.applicationType) }}
                </div>
                <div class="edit-step-btn" @click="setStep(1)">
                  <i class="icon color--primary rf-p-1w icon-Pen-4"></i>
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
              <div class="row" v-if="hasDoc('IDENTIFICATION')">
                <div class="subtitle">Pièce d’identité</div>
                <div class="row">
                  <div class="edit-step-btn" @click="setStep(2)">
                    <i class="icon color--primary rf-p-1w icon-Eye-2"></i>
                  </div>
                  <div class="edit-step-btn" @click="setStep(2)">
                    <i class="icon color--primary rf-p-1w icon-Pen-4"></i>
                  </div>
                </div>
              </div>
              <div class="row" v-if="hasDoc('RESIDENCY')">
                <div class="subtitle">Justificatif de domicile</div>
                <div class="row">
                  <div class="edit-step-btn" @click="setStep(2)">
                    <i class="icon color--primary rf-p-1w icon-Eye-2"></i>
                  </div>
                  <div class="edit-step-btn" @click="setStep(2)">
                    <i class="icon color--primary rf-p-1w icon-Pen-4"></i>
                  </div>
                </div>
              </div>
              <div class="row" v-if="hasDoc('PROFESSIONAL')">
                <div class="subtitle">
                  Justificatif de situation professionelle
                </div>
                <div class="row">
                  <div class="edit-step-btn" @click="setStep(2)">
                    <i class="icon color--primary rf-p-1w icon-Eye-2"></i>
                  </div>
                  <div class="edit-step-btn" @click="setStep(2)">
                    <i class="icon color--primary rf-p-1w icon-Pen-4"></i>
                  </div>
                </div>
              </div>
              <div class="row" v-if="hasDoc('FINANCIAL')">
                <div class="subtitle">Justificatif de revenu</div>
                <div class="row">
                  <div class="edit-step-btn" @click="setStep(2)">
                    <i class="icon color--primary rf-p-1w icon-Eye-2"></i>
                  </div>
                  <div class="edit-step-btn" @click="setStep(2)">
                    <i class="icon color--primary rf-p-1w icon-Pen-4"></i>
                  </div>
                </div>
              </div>
              <div class="row" v-if="hasDoc('TAX')">
                <div class="subtitle">Avis d’imposition</div>
                <div class="row">
                  <div class="edit-step-btn" @click="setStep(2)">
                    <i class="icon color--primary rf-p-1w icon-Eye-2"></i>
                  </div>
                  <div class="edit-step-btn" @click="setStep(2)">
                    <i class="icon color--primary rf-p-1w icon-Pen-4"></i>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        <div v-if="hasGuarantor()">
          <a href="#" class="rf-link">
            {{ $t("third-title") }}
          </a>
          <hr />
          <div class="rf-card__desc">
            <section>
              <div class="row" v-if="user.identification">
                <div class="subtitle">Pièce d’identité</div>
                <div class="row">
                  <div class="edit-step-btn" @click="setGuarantorStep(2)">
                    <i class="icon color--primary rf-p-1w icon-Eye-2"></i>
                  </div>
                  <div class="edit-step-btn" @click="setGuarantorStep(2)">
                    <i class="icon color--primary rf-p-1w icon-Pen-4"></i>
                  </div>
                </div>
              </div>
              <div class="row" v-if="user.residency">
                <div class="subtitle">Justificatif de domicile</div>
                <div class="row">
                  <div class="edit-step-btn" @click="setGuarantorStep(2)">
                    <i class="icon color--primary rf-p-1w icon-Eye-2"></i>
                  </div>
                  <div class="edit-step-btn" @click="setGuarantorStep(2)">
                    <i class="icon color--primary rf-p-1w icon-Pen-4"></i>
                  </div>
                </div>
              </div>
              <div class="row" v-if="user.professional">
                <div class="subtitle">
                  Justificatif de situation professionelle
                </div>
                <div class="row">
                  <div class="edit-step-btn" @click="setGuarantorStep(2)">
                    <i class="icon color--primary rf-p-1w icon-Eye-2"></i>
                  </div>
                  <div class="edit-step-btn" @click="setGuarantorStep(2)">
                    <i class="icon color--primary rf-p-1w icon-Pen-4"></i>
                  </div>
                </div>
              </div>
              <div class="row" v-if="user.financial">
                <div class="subtitle">Justificatif de revenu</div>
                <div class="row">
                  <div class="edit-step-btn" @click="setGuarantorStep(2)">
                    <i class="icon color--primary rf-p-1w icon-Eye-2"></i>
                  </div>
                  <div class="edit-step-btn" @click="setGuarantorStep(2)">
                    <i class="icon color--primary rf-p-1w icon-Pen-4"></i>
                  </div>
                </div>
              </div>
              <div class="row" v-if="user.tax">
                <div class="subtitle">Avis d’imposition</div>
                <div class="row">
                  <div class="edit-step-btn" @click="setGuarantorStep(2)">
                    <i class="icon color--primary rf-p-1w icon-Eye-2"></i>
                  </div>
                  <div class="edit-step-btn" @click="setGuarantorStep(2)">
                    <i class="icon color--primary rf-p-1w icon-Pen-4"></i>
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
import NakedCard from "df-shared/src/components/NakedCard.vue";
import { User } from "df-shared/src/models/User";
import { Guarantor } from "df-shared/src/models/Guarantor";

@Component({
  components: { NakedCard },
  computed: {
    ...mapState({
      user: "user",
      tenantStep: "tenantStep",
      selectedGuarantor: "selectedGuarantor"
    })
  }
})
export default class EditSummary extends Vue {
  user!: User;
  selectedGuarantor!: Guarantor;

  setStep(n: number) {
    this.$store.commit("setStep", n);
  }
  hasDocument() {
    return this.user.documents !== undefined && this.user.documents?.length > 0;
  }
  hasDoc(docType: string) {
    return this.user.documents?.find(d => {
      return d.documentCategory === docType;
    });
  }
  hasGuarantor() {
    return (
      this.selectedGuarantor?.documents !== undefined &&
      this.selectedGuarantor.documents.length > 0
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
"second-title": "Documents du locataire",
"third-title": "Documents du garant",
"ALONE": "Seul",
"COUPLE": "En couple",
"GROUP": "En colocation"
},
"fr": {
"title": "Information du locataire",
"second-title": "Documents du locataire",
"third-title": "Documents du garant",
"ALONE": "Seul",
"COUPLE": "En couple",
"GROUP": "En colocation"
}
}
</i18n>
