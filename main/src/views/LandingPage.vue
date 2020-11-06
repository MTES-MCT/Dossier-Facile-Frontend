<template>
  <div class="main-container">
    <section class="cover cover-features imagebg space--sm" data-overlay="1">
      <div class="background-image-holder">
        <img alt="background" src="../assets/cover-features.jpg" />
      </div>
      <div class="container">
        <div class="row">
          <div class="col-md-9 col-lg-7">
            <h1>
              <b> Boostez votre dossier de location avec DossierFacile</b>
            </h1>
            <p class="lead">
              <b>
                DossierFacile accompagne les candidats locataires dans la
                constitution de leur dossier de location pour les aider à mettre
                toutes les chances de leur côté
              </b>
            </p>
            <div class="row">
              <div class="col-md-12">
                <div class="d-flex">
                  <div class="mr-2 mb-2">
                    <router-link
                      class="btn btn--primary type--uppercase"
                      to="/tenant"
                    >
                      <span class="btn__text">Locataire</span>
                    </router-link>
                  </div>
                  <div class="">
                    <router-link
                      class="btn btn--primary type--uppercase"
                      to="/launch"
                    >
                      <span class="btn__text">Professionnel</span>
                    </router-link>
                    <div class="text-center">
                      <router-link to="/owner-info">
                        <span class="font-weight-light color-white">
                          Je suis un propriétaire particulier
                        </span>
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="feature feature-2 boxed boxed--border bg--white">
              <i class="icon color--primary icon-Security-Check"></i>
              <div class="feature__body">
                <h4>Sécurité</h4>
                <p>
                  DossierFacile s’assure que vos données sont protégées ! Elles
                  ne seront jamais communiquées sans votre accord express, ne
                  seront jamais revendues et ne seront jamais stockées au delà
                  de 30 jours. L'Etat à votre service, tout simplement
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature feature-2 boxed boxed--border bg--white">
              <i class="icon color--primary icon-Check"></i>
              <div class="feature__body">
                <h4>Simplicité</h4>
                <p>
                  Notre produit a été construit avec une seule obsession: vous
                  simplifier la vie. Avec DossierFacile vous n’aurez jamais de
                  phobie administrative ;)
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature feature-2 boxed boxed--border bg--white">
              <i class="icon color--primary icon-Handshake"></i>
              <div class="feature__body">
                <h4>Confiance</h4>
                <p>
                  Parce que nous savons que la confiance doit être réciproque,
                  nous nous engageons à agir gratuitement et en toute
                  transparence ainsi qu'à assurer le respect des droits des
                  locataires et des propriétaires<br />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="text-center">
      <div class="container">
        <div class="row">
          <div class="col-md-10 col-lg-8">
            <h1>DossierFacile en chiffres</h1>
            <p class="lead">
              La transparence est une de nos valeurs, nous avons choisi de la
              promouvoir.
            </p>
          </div>
        </div>
      </div>
    </section>

    <a class="in-page-link" id="process-radial-1"></a>
    <section class="text-center">
      <div class="container">
        <div class="row">
          <div class="col-md-4 col-12">
            <div class="feature">
              <div
                class="radial"
                data-bar-width="8"
                data-color="#4a90e2"
                data-size="208"
                data-value="75"
              >
                <span class="h3 radial__label">{{ uploadedDocsCount }}</span>
              </div>
              <p>nombre de documents déposés sur DossierFacile</p>
            </div>
          </div>
          <div class="col-md-4 col-12">
            <div class="feature">
              <div
                class="radial"
                data-bar-width="8"
                data-color="#4a90e2"
                data-size="208"
                :data-value="pctSatisfaction"
              >
                <span class="h3 radial__label">{{ pctSatisfaction }} %</span>
              </div>
              <p>pourcentage d'utilisateurs satisfaits</p>
            </div>
          </div>
          <div class="col-md-4 col-12">
            <div class="feature">
              <div
                class="radial"
                data-bar-width="8"
                data-color="#4a90e2"
                data-size="208"
                data-value="100"
              >
                <span class="h3 radial__label">{{ createdAccountTotal }}</span>
              </div>
              <p>nombre de dossiers DossierFacile créés</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="text-center">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 col-md-10">
            <div class="slider" data-paging="true">
              <ul class="slides">
                <li>
                  <div class="testimonial">
                    <blockquote>
                      “Simple, efficace et pratique : DossierFacile m'a aidé
                      tout au long de ma recherche d'appartement.”
                    </blockquote>
                    <h5>Caroline H.</h5>
                    <span>Etudiante, 19 ans</span>
                  </div>
                </li>
                <li>
                  <div class="testimonial">
                    <blockquote>
                      “Grâce à leur réactivité j'ai pu faire valider mon dossier
                      dans la matinée et l'envoyer aux propriétaires des
                      appartements que je voulais visiter.”
                    </blockquote>
                    <h5>Pierre-Louis C.</h5>
                    <span>Ingénieur, 25 ans</span>
                  </div>
                </li>
                <li>
                  <div class="testimonial">
                    <blockquote>
                      “Je ne réussissais jamais à visiter un appartement avec
                      mon dossier étranger. Grâce à DossierFacile et à Visale,
                      j'ai eu plus de visites !”
                    </blockquote>
                    <h5>Irina S.</h5>
                    <span>Etudiante erasmus, 23 ans</span>
                  </div>
                </li>
                <li>
                  <div class="testimonial">
                    <blockquote>
                      “..., tous mes candidats pour chaque appartement se
                      retrouvent sur mes pages DossierFacile et les dossiers
                      sont déjà ordonnés !”
                    </blockquote>
                    <h5>Hélène G.</h5>
                    <span>Agent indépendante, 43 ans</span>
                  </div>
                </li>
                <li>
                  <div class="testimonial">
                    <blockquote>
                      “Le traitement des dossiers opéré par DossierFacile me
                      permet de consacrer plus de temps à la prospection et de
                      rentrer plus de mandats !”
                    </blockquote>
                    <h5>Antoine F.</h5>
                    <span>Gestionnaire locatif, 29 ans</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class LandingPage extends Vue {
  uploadedDocsCount = 632000;
  pctSatisfaction = 72;
  createdAccountTotal = 233000;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.radial__label {
  font-size: 1rem;
  line-height: 1.5;
}

a {
  box-shadow: none;
}
</style>
