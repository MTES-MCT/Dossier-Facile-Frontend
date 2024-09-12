<template>
  <div class="full-width">
    <section class="s0-background fr-pb-md-5w fr-pt-md-9w fr-pt-3w">
      <div class="fr-container">
        <div class="fr-col-md-8">
          <div class="fr-grid-col">
            <h1 class="fr-h1 fr-mt-3w color--white">
              {{ t("s0.title") }}
            </h1>
            <p class="text-bold color--white">
              {{ t("s0.text") }}<br />
              {{ t("s0.text2") }}
            </p>
            <p>
              <a :href="REGISTER_URL" class="fr-btn fr-mt-2w">
                <span class="text-center full-width">
                  {{ t("button") }}
                </span>
              </a>
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
                  <div class="fr-tile__link">{{ t("s1.h1") }}</div>
                </h2>
                <p class="fr-tile__desc">{{ t("s1.p1") }}</p>
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
                  <div class="fr-tile__link">{{ t("s1.h2") }}</div>
                </h2>
                <p class="fr-tile__desc">{{ t("s1.p2") }}</p>
              </div>
              <div class="fr-tile__img">
                <img src="../assets/icons/sports.svg" class="fr-responsive-img" alt="" />
              </div>
            </div>
          </div>
          <div class="fr-col-md-4 fr-grid-col fr-p-2w">
            <div class="fr-tile fr-enlarge-link">
              <div class="fr-tile__body">
                <h2 class="fr-tile__title">
                  <div class="fr-tile__link">{{ t("s1.h3") }}</div>
                </h2>
                <p class="fr-tile__desc">{{ t("s1.p3") }}</p>
              </div>
              <div class="fr-tile__img">
                <img src="../assets/icons/reading.svg" class="fr-responsive-img" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="fr-pb-5w fr-pt-md-9w fr-pt-3w bg-blue-grey">
      <div class="fr-container">
        <h2 class="fr-h2 s2-title">{{ t("s2.title") }}</h2>
        <div class="fr-grid-row reverse-mobile">
          <div class="fr-col-md-6 fr-grid-col">
            <ol>
              <li>
                <div class="fr-grid-row align-items--center">
                  <p class="step-number">1</p>
                  <h3 class="fr-h4 fr-mb-0">{{ t("s2.h1") }}</h3>
                </div>
                <div>{{ t("s2.p1") }}</div>
                <ul class="fr-pt-2w fr-mb-5w">
                  <li>{{ t("s2.u1a") }}</li>
                  <li>{{ t("s2.u1b") }}</li>
                  <li>{{ t("s2.u1c") }}</li>
                  <li>{{ t("s2.u1d") }}</li>
                  <li>{{ t("s2.u1e") }}</li>
                </ul>
              </li>
              <li>
                <div class="fr-grid-row align-items--center">
                  <p class="step-number">2</p>
                  <h3 class="fr-h4 fr-mb-0">{{ t("s2.h2") }}</h3>
                </div>
                <p>{{ t("s2.p2") }}</p>
              </li>
              <li>
                <div class="fr-grid-row align-items--center">
                  <p class="step-number">3</p>
                  <h3 class="fr-h4 fr-mb-0">{{ t("s2.h3") }}</h3>
                </div>
                <p>{{ t("s2.p3") }}</p>
              </li>
            </ol>
            <a :href="DOCS_URL" target="_blank" class="fr-btn fr-btn--secondary fr-mt-2w">
              <span class="text-center full-width">
                {{ t("docs") }}
              </span>
            </a>
            <a :href="REGISTER_URL" class="fr-btn fr-mt-2w">
              <span class="text-center full-width">
                {{ t("button") }}
              </span>
            </a>
          </div>
          <div class="fr-col-md-6 mx-auto">
            <picture>
              <source
                media="(max-width: 499px)"
                srcset="
                  ../assets/icons/justif-300.webp,
                  ../assets/icons/justif-450.webp 1.5x,
                  ../assets/icons/justif.webp     2x
                "
              />
              <source
                media="(min-width: 500px) and (max-width: 1200px)"
                srcset="../assets/icons/justif-450.webp, ../assets/icons/justif.webp 1.5x"
              />
              <source media="(min-width: 1200px)" srcset="../assets/icons/justif.webp" />
              <img
                loading="lazy"
                src="../assets/icons/justif-300.webp"
                alt=""
                class="justif-img"
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
    <section class="bg--orange fr-pb-md-5w fr-pt-md-9w fr-pt-3w">
      <div class="fr-pt-7w fr-pb-7w">
        <div class="fr-container">
          <h2 class="fr-h2 s3-title">{{ t("s3.title") }}</h2>
          <p>
            {{ t("s3.text1") }}
            <br />
            {{ t("s3.text2") }}
          </p>
          <p>
            {{ t("s3.text3") }}
          </p>
        </div>
      </div>
    </section>
    <section class="fr-pb-md-5w fr-pt-md-9w fr-pt-3w">
      <div class="fr-container fr-mb-7w">
        <h2 class="fr-h2 text-center">
          {{ t("s4.title1") }}
          <span class="color--secondary">{{ validatedDossierCount }}</span>
          {{ t("s4.title3") }}
        </h2>
        <div class="text-center">
          <router-link to="/stats" class="fr-link fr-tag">
            <img src="../assets/icons/stats.webp" class="stats-icon" alt="" />
            {{ t("s4.link") }}
          </router-link>
        </div>
        <div class="fr-grid-row">
          <div class="col fr-p-2w">
            <figure class="fr-quote fr-quote--column">
              <blockquote>
                <p>{{ t("s4.t1") }}</p>
              </blockquote>
              <figcaption>
                <p class="fr-quote__author">{{ t("s4.author1") }}</p>
              </figcaption>
            </figure>
          </div>
          <div class="col fr-p-2w">
            <figure class="fr-quote fr-quote--column">
              <blockquote>
                <p>{{ t("s4.t2") }}</p>
              </blockquote>
              <figcaption>
                <p class="fr-quote__author">{{ t("s4.author2") }}</p>
              </figcaption>
            </figure>
          </div>
          <div class="col fr-p-2w">
            <figure class="fr-quote fr-quote--column">
              <blockquote>
                <p>{{ t("s4.t3") }}</p>
              </blockquote>
              <figcaption>
                <p class="fr-quote__author">{{ t("s4.author3") }}</p>
              </figcaption>
            </figure>
          </div>
        </div>
        <div class="text-center fr-mt-5w fr-mb-5w">
          <p>
            <a :href="REGISTER_URL" class="fr-btn fr-mt-2w">
              <span class="text-center full-width">
                {{ t("button") }}
              </span>
            </a>
          </p>
        </div>
      </div>
    </section>
    <section class="fr-pb-md-5w fr-pt-md-9w fr-pt-3w">
        <AllPartnersComponent :limit="8"></AllPartnersComponent>
        <div class="text-center fr-mt-5w fr-mb-5w">
          <p>
            <a href="/partenaires" class="fr-btn fr-mt-2w">
              <span class="text-center full-width">
                {{ t("all-partners") }}
              </span>
            </a>
          </p>
        </div>
    </section>
    <section class="fr-pb-md-5w fr-pt-md-9w fr-pt-3w institutional-section">
      <AllInstitutionalPartnersComponent :limit="8"></AllInstitutionalPartnersComponent>
        <div class="text-center fr-mt-5w fr-mb-5w">
          <p>
            <a href="/partenaires" class="fr-btn fr-mt-2w">
              <span class="text-center full-width">
                {{ t("all-partners") }}
              </span>
            </a>
          </p>
        </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import AllInstitutionalPartnersComponent from "../components/AllInstitutionalPartnersComponent.vue";
import AllPartnersComponent from "../components/AllPartnersComponent.vue";
import { StatsService } from "../services/StatsService";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useHead } from "@unhead/vue";
import image from "../assets/icons/justif.webp";

const title = "DossierFacile, le dossier de location numérique de l’État";
const description =
  "Avec DossierFacile, créez un dossier de location en ligne complet et vérifié par l'Etat pour trouver votre appartement ou votre logement";
useHead({
  title: title,
  meta: [
    { name: "og:title", content: title },
    { name: "twitter:title", content: title },
    { name: "description", content: description },
    { name: "og:description", content: description },
    { name: "twitter:description", content: description },
    { name: "og:image", content: image },
    { name: "twitter:image", content: image },
  ],
});

const { t } = useI18n();

const REGISTER_URL = import.meta.env.VITE_REGISTER_URL;
const DOCS_URL = `//${import.meta.env.VITE_DOCS_URL}`;

const validatedDossierCount = ref("116000");

onMounted(() => {
  StatsService.getValidatedDossierCount()
    .then((result: { data: string }) => {
      if (result.data) {
        validatedDossierCount.value = result.data;
      }
    })
    .catch(() => {});
});
</script>

<style scoped lang="scss">
.s0-background {
  width: 100%;
  top: 0;
  left: 0;
  background-size: cover !important;
  background-position: 50% 50% !important;
  background-image: url("/cover-features-0119.webp");
  background-color: #6277a0;
  @media (max-width: 768px) {
    background-image: url("/cover-features-mobile-0119.webp");
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
  margin-bottom: 0;
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

ol > li::marker {
  content: "";
}

ol {
  padding-left: 0;
}

.institutional-section {
  background-color: #f5f5fe;
}

.fr-quote--column {
  margin-left: 0;
}
</style>
