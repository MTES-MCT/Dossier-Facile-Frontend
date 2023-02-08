<template>
  <div>
    <section class="s0-background fr-pb-md-5w fr-pt-md-9w fr-pt-3w">
      <div class="fr-container">
        <div class="fr-col-md-8">
          <div class="fr-grid-col">
            <h1 :class="getH1Class()" class="fr-mt-3w color--white">
              {{ $t("s0.title") }}
            </h1>
            <p class="text-bold color--white">
              {{ $t("s0.text") }}<br />
              {{ $t("s0.text2") }}
            </p>
            <p>
              <DfButton primary="true" @on-click="gotoTenant">
                {{ $t("button") }}
              </DfButton>
            </p>
          </div>
        </div>
      </div>
    </section>
    <section class="fr-pb-md-5w fr-pt-md-9w fr-pt-3w">
      <div class="fr-container">
        <div class="fr-grid-row">
          <div class="fr-col-md-4 fr-grid-col fr-p-2w">
            <div class="fr-tile fr-enlarge-link">
              <div class="fr-tile__body">
                <h2 class="fr-tile__title">
                  <div class="fr-tile__link">{{ $t("s1.h1") }}</div>
                </h2>
                <p class="fr-tile__desc">{{ $t("s1.p1") }}</p>
              </div>
              <div class="fr-tile__img">
                <img
                  src="../assets/icons/approval.svg"
                  class="fr-responsive-img"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div class="fr-col-md-4 fr-grid-col fr-p-2w">
            <div class="fr-tile fr-enlarge-link">
              <div class="fr-tile__body">
                <h2 class="fr-tile__title">
                  <div class="fr-tile__link">{{ $t("s1.h2") }}</div>
                </h2>
                <p class="fr-tile__desc">{{ $t("s1.p2") }}</p>
              </div>
              <div class="fr-tile__img">
                <img
                  src="../assets/icons/sports.svg"
                  class="fr-responsive-img"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div class="fr-col-md-4 fr-grid-col fr-p-2w">
            <div class="fr-tile fr-enlarge-link">
              <div class="fr-tile__body">
                <h2 class="fr-tile__title">
                  <div class="fr-tile__link">{{ $t("s1.h3") }}</div>
                </h2>
                <p class="fr-tile__desc">{{ $t("s1.p3") }}</p>
              </div>
              <div class="fr-tile__img">
                <img
                  src="../assets/icons/reading.svg"
                  class="fr-responsive-img"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="fr-pb-md-5w fr-pt-md-9w fr-pt-3w bg-blue-grey">
      <div class="fr-container">
        <h2 class="fr-h2 s2-title">{{ $t("s2.title") }}</h2>
        <div class="fr-grid-row reverse-mobile">
          <div class="fr-col-md-6 fr-grid-col">
            <div class="fr-grid-row align-items--center">
              <div class="step-number">1</div>
              <h3 class="fr-h4 fr-mb-0">{{ $t("s2.h1") }}</h3>
            </div>
            <div>{{ $t("s2.p1") }}</div>
            <ul class="fr-pt-2w fr-mb-5w">
              <li>{{ $t("s2.u1a") }}</li>
              <li>{{ $t("s2.u1b") }}</li>
              <li>{{ $t("s2.u1c") }}</li>
              <li>{{ $t("s2.u1d") }}</li>
              <li>{{ $t("s2.u1e") }}</li>
            </ul>

            <div class="fr-grid-row align-items--center">
              <div class="step-number">2</div>
              <h3 class="fr-h4 fr-mb-0">{{ $t("s2.h2") }}</h3>
            </div>
            <p>{{ $t("s2.p2") }}</p>

            <div class="fr-grid-row align-items--center">
              <div class="step-number">3</div>
              <h3 class="fr-h4 fr-mb-0">{{ $t("s2.h3") }}</h3>
            </div>
            <p>{{ $t("s2.p3") }}</p>
            <DfButton class="fr-mt-2w" @on-click="gotoDocs">
              <span class="text-center full-width">
                {{ $t("docs") }}
              </span>
            </DfButton>
            <DfButton class="fr-mt-2w" primary="true" @on-click="gotoTenant">
              <span class="text-center full-width">
                {{ $t("button") }}
              </span>
            </DfButton>
          </div>
          <div class="fr-col-md-6 mx-auto">
            <img src="../assets/icons/justif.webp" alt="" class="justif-img" />
          </div>
        </div>
      </div>
    </section>
    <section class="bg--orange fr-pb-md-5w fr-pt-md-9w fr-pt-3w">
      <div class="fr-pt-7w fr-pb-7w">
        <div class="fr-container">
          <h2 class="fr-h2 s3-title">{{ $t("s3.title") }}</h2>
          <p>
            {{ $t("s3.text1") }}
            <br />
            {{ $t("s3.text2") }}
          </p>
          <p>
            {{ $t("s3.text3") }}
          </p>
          <!--           <router-link to="/tenant">
            {{ $t("s3.link") }}
          </router-link> -->
        </div>
      </div>
    </section>
    <section class="fr-pb-md-5w fr-pt-md-9w fr-pt-3w">
      <div class="fr-container fr-mb-7w">
        <h2 class="fr-h2 text-center">
          {{ $t("s4.title1") }}
          <span class="color--secondary">{{ validatedDossierCount }}</span>
          {{ $t("s4.title3") }}
        </h2>
        <div class="text-center">
          <router-link to="/stats" class="fr-link fr-tag">
            <img src="../assets/icons/stats.webp" class="stats-icon" alt="" />
            {{ $t("s4.link") }}
          </router-link>
        </div>
        <div class="fr-grid-row">
          <div class="col fr-p-2w">
            <blockquote class="bg--blue color--primary quote fr-p-2w">
              <p class="fr-m-0 fr-mb-3w">{{ $t("s4.t1") }}</p>
              <cite>{{ $t("s4.author1") }}</cite>
            </blockquote>
          </div>
          <div class="col fr-p-2w">
            <blockquote class="bg--blue color--primary quote fr-p-2w">
              <p class="fr-m-0 fr-mb-3w">{{ $t("s4.t2") }}</p>
              <cite>{{ $t("s4.author2") }}</cite>
            </blockquote>
          </div>
          <div class="col fr-p-2w">
            <blockquote class="bg--blue color--primary quote fr-p-2w">
              <p class="fr-m-0 fr-mb-3w">{{ $t("s4.t3") }}</p>
              <cite>{{ $t("s4.author3") }}</cite>
            </blockquote>
          </div>
        </div>
        <div class="text-center fr-mt-5w fr-mb-5w">
          <p>
            <DfButton primary="true" @on-click="gotoTenant">
              {{ $t("button") }}
            </DfButton>
          </p>
        </div>
      </div>
    </section>
    <section class="fr-pb-md-5w fr-pt-md-9w fr-pt-3w">
      <div class="fr-container fr-mb-7w">
        <h2 class="fr-h2 text-center">
          {{ $t("s5.title1") }}
          <span class="color--secondary">{{ $t("s5.title2") }}</span>
        </h2>
        <div class="fr-grid-row">
          <LogoPartnerComponent
            :image="require('../assets/logos/monsieur_hugo.webp')"
            height="39px"
            href="https://www.monsieurhugo.com/"
            name="monsieur Hugo"
            width="210px"
          />

          <LogoPartnerComponent
            :image="require('../assets/logos/visale.webp')"
            height="60px"
            href="https://www.visale.fr/"
            name="visale.fr - connecte emploi et logement"
            width="187px"
          />

          <LogoPartnerComponent
            :image="require('../assets/logos/loc_service.webp')"
            height="60px"
            href="https://www.locservice.fr/"
            name="locservice.fr - location et colocation entre particuliers"
            width="144px"
          />

          <LogoPartnerComponent
            :image="require('../assets/logos/colivme.webp')"
            height="60px"
            href="https://www.colivme.com/"
            name="colivme"
            width="174px"
          />
          <LogoPartnerComponent
            :image="require('../assets/logos/anil.webp')"
            href="https://www.anil.org/"
            name="ANIL, l’agence nationale pour l’information sur le logement"
          />
          <LogoPartnerComponent
            :image="require('../assets/logos/clickandrent.webp')"
            height="30px"
            href="https://www.clickandrent.fr/"
            name="click and rent"
            width="209px"
          />

          <LogoPartnerComponent
            :image="require('../assets/logos/qlower.webp')"
            height="30px"
            href="https://www.qlower.com/"
            name="qlower"
            width="148px"
          />

          <LogoPartnerComponent
            :image="require('../assets/logos/jelouebien.webp')"
            height="30px"
            href="https://www.jelouebien.com/"
            name="jelouebien.com"
            width="227px"
          />

          <LogoPartnerComponent
            :image="require('../assets/logos/gererseul.webp')"
            height="44px"
            href="https://www.gererseul.com/"
            name="gererseul – ma gestion locative"
            width="200px"
          />

          <LogoPartnerComponent
            :image="require('../assets/logos/pandaloc.webp')"
            height="60px"
            href="https://www.pandaloc.com/"
            name="pandaloc"
            width="197px"
          />

          <LogoPartnerComponent
            :image="require('../assets/logos/superimmo.webp')"
            height="60px"
            href="https://www.superimmo.com/"
            name="superimmo"
            width="222px"
          />

          <LogoPartnerComponent
            :image="require('../assets/logos/wizi.webp')"
            height="60px"
            href="https://www.wizi.io/"
            name="wizi"
            width="151px"
          />
          <LogoPartnerComponent
            :image="require('../assets/logos/rentila.webp')"
            height="60px"
            href="https://www.rentila.com/"
            name="rentila"
            width="102px"
          />
          <LogoPartnerComponent
            :image="require('../assets/logos/flatsy.webp')"
            height="60px"
            href="https://www.flatsy.fr/"
            name="flatsy"
            width="174px"
          />
          <LogoPartnerComponent
            :image="require('../assets/logos/platoimmo.webp')"
            height="60px"
            href="https://www.plato.immo/"
            name="plato.immo"
            width="133px"
          />
          <LogoPartnerComponent
            height="60px"
            href="https://www.fastt.org/"
            name="fastt"
            width="95px"
          />
          <LogoPartnerComponent
            :image="require('../assets/logos/immoloyer.webp')"
            height="60px"
            href="https://www.immobilierloyer.com/"
            name="immobilier loyer"
            width="208px"
          />
          <LogoPartnerComponent
            height="60px"
            href="https://www.immopad.com/"
            name="immopad"
            width="188px"
          />
          <LogoPartnerComponent
            height="60px"
            href="https://www.mydomus.co/"
            name="mydomus"
            width="214px"
          />
          <LogoPartnerComponent
            height="60px"
            href="https://omnirea.fr/"
            name="omnirea"
            width="172px"
          />
          <LogoPartnerComponent
            :image="require('../assets/logos/emjysoft_gestion_locative.webp')"
            height="60px"
            href="https://www.emjysoft.com/logiciel-gestion-locative/"
            name="emjysoft - gestion locative"
            width="162px"
          />
          <LogoPartnerComponent
            :image="require('../assets/logos/timci.webp')"
            height="60px"
            href="https://www.timci.com"
            name="Timci - gestion de biens"
            width="189px"
          />
          <LogoPartnerComponent
            :image="require('../assets/logos/isp_group.webp')"
            height="60px"
            href="https://www.isp-group.immo/louer/"
            name="ISP Group - Immobilier et consulting"
            width="99px"
          />
          <LogoPartnerComponent
            :image="require('../assets/logos/jsoft.webp')"
            height="60px"
            href="https://www.jsoft.fr/logiciel-gestion-immobiliere/"
            name="JSoft - Logiciel de gestion locative immobilière"
            width="240px"
          />
          <LogoPartnerComponent
            :image="require('../assets/logos/mon_carnet_logement.png')"
            height="60px"
            href="https://moncarnetlogement.fr/"
            name="Mon carnet logement"
            width="194px"
          />
          <LogoPartnerComponent
            :image="require('../assets/logos/izzyhom.png')"
            href="https://www.izzyhom.io/locataire"
            name="IzzyHom"
            height="60px"
            width="60px"
          />
          <LogoPartnerComponent
            :image="require('../assets/logos/partir_de_paris.png')"
            href="https://www.partirdeparis.fr/"
            name="Partir de Paris"
            width="196px"
            height="58px"
          />
          <LogoPartnerComponent
            :image="require('../assets/logos/goodliz.png')"
            href="https://goodliz.com"
            name="GoodLiz"
            height="60px"
            width="77px"
          />
          <LogoPartnerComponent
            :image="require('../assets/logos/pautions.png')"
            href="https://pautions.fr"
            name="Pautions"
            height="58px"
            width="243px"
          />
        </div>
        <div class="text-center fr-mt-5w fr-mb-5w">
          <p>
            <DfButton primary="true" @on-click="gotoTenant">
              {{ $t("button") }}
            </DfButton>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DfButton from "df-shared/src/Button/Button.vue";
import LogoPartnerComponent from "@/components/LogoPartnerComponent.vue";
import { StatsService } from "../services/StatsService";

@Component({
  components: {
    LogoPartnerComponent,
    DfButton
  }
})
export default class LandingPage extends Vue {
  TENANT_URL = `//${process.env.VUE_APP_TENANT_URL}`;
  DOCS_URL = `//${process.env.VUE_APP_DOCS_URL}`;

  validatedDossierCount = "116000";

  getH1Class() {
    return window.innerWidth < 992 ? "fr-h2" : "fr-h1";
  }

  mounted() {
    StatsService.getValidatedDossierCount().then(result => {
      if (result.data) {
        this.validatedDossierCount = result.data;
      }
    });
  }

  gotoTenant() {
    window.location.replace(`${this.TENANT_URL}/signup`);
  }

  gotoDocs() {
    window.open(`${this.DOCS_URL}`, "_blank");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.s0-background {
  width: 100%;
  top: 0;
  left: 0;
  background-size: cover !important;
  background-position: 50% 50% !important;
  background-image: url("../assets/cover-features.webp");
  background-color: #6277a0;
  @media (max-width: 768px) {
    background-image: url("../assets/cover-features-mobile.webp");
  }

  z-index: 0;
}

.s1-icons {
  height: 48px;
}

cite {
  font-weight: bold;
}

.col {
  flex: 1;
  @media (max-width: 768px) {
    flex: auto;
  }
}

blockquote {
  margin: 0;
  height: 100%;
}

.quote {
  border-radius: 6px;
}

.s2-title {
  &:before {
    margin-right: 10px;
    content: url("../assets/icons/survey.svg");
  }
}

.s3-title {
  &:before {
    margin-right: 10px;
    content: url("../assets/icons/lock.svg");
  }
}

ul li {
  display: flex;
  margin-bottom: 0;
}

ul li:before {
  content: "";
  display: inline-block;
  color: limegreen;
  font-size: 1rem;
}

.step-number {
  background-color: var(--primary);
  color: white;
  margin-right: 10px;
  border-radius: 50%;
  display: inline-block;
  height: 25px;
  width: 25px;
  min-width: 25px;
  text-align: center;
  z-index: 1;
}

img {
  max-width: 100%;
  display: block;
}

.partner-logo {
  max-width: 100%;
  max-height: 60px;
  margin: auto;
}

.stats-icon {
  display: inline;
  height: 3rem;
  width: 4rem;
  vertical-align: -0.75rem;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  @media (min-width: 768px) {
    min-height: 100px;
  }
}

.bg-blue-grey {
  background-color: #f2f2f9;
}

.full-width {
  width: 100%;
}

.reverse-mobile {
  @media (max-width: 992px) {
    flex-direction: column-reverse;
  }
}

.justif-img {
  @media (min-width: 1200px) {
    width: 600px;
    height: 572px;
  }
  @media (min-width: 500px) and (max-width: 1200px) {
    width: 450px;
    height: 429px;
  }
  @media (max-width: 500px) {
    width: 300px;
    height: 286px;
  }
}

.fr-responsive-img {
  width: 80px;
  height: 80px;
}
</style>
