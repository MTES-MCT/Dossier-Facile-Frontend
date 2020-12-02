<template>
  <div class="rf-mb-12w">
    <section class="imagebg text-center">
      <div class="rf-container">
        <div class="rf-grid-row height-40">
          <div class="rf-col-md-10 rf-col-lg-8">
            <h2 class="color--white">Questions fréquemment posées</h2>
            <p class="color--white">
              <b>
                Vous avez rencontré une difficulté ? Découvrez toutes<br />nos
                réponses</b
              ><br />
            </p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="rf-container rf-mt-7w">
        <div class="rf-grid-row">
          <div class="rf-col-md-4 col rf-pr-7w">
            <div class="tab__title rf-p-2w" :class="{selected: section === 0}" @click="section = 0">
              <span class="type--uppercase">CRÉATION DE MON COMPTE</span >
            </div>
            <div class="tab__title rf-p-2w" :class="{selected: section === 1}" @click="section = 1">
              <span class="type--uppercase">VALIDATION DE MON COMPTE</span>
            </div>
            <div class="tab__title rf-p-2w" :class="{selected: section === 2}" @click="section = 2">
              <span class="type--uppercase" >INFORMATIONS COMPLÉMENTAIRES</span >
            </div>
            <div class="tab__title rf-p-2w" :class="{selected: section === 3}" @click="section = 3">
              <span class="type--uppercase">MES DONNÉES PERSONNELLES</span>
            </div>
          </div>
          <div class="rf-col-md-8">
          <ul
            class="rf-accordion-group"
            id="rf-accordion-group-0"
            v-show="section === 0"
          >
            <li class="rf-accordion-group__item">
              <accordion-element id="rf-accordion-group-0-body-0">
                <template v-slot:header>
                  <header>
                    Est-il obligatoire de passer par DossierFacile ?
                  </header>
                </template>
                <template v-slot:body>
                  Absolument pas : notre plateforme ne revêt aucun caractère
                  obligatoire, nous sommes seulement là pour vous aider !
                </template>
              </accordion-element>
            </li>
            <li class="rf-accordion-group__item">
              <AccordionElement id="rf-accordion-group-0-body-1">
                <template v-slot:header>
                  <header>
                    Je suis propriétaire : dois-je m’inscrire sur DossierFacile
                    pour recevoir des dossiers DossierFacile ?
                  </header>
                </template>
                <template v-slot:body>
                  <p>
                    Aucune inscription n'est nécessaire pour recevoir des
                    dossiers DossierFacile : les liens sont envoyés par mail
                    comme les dossiers traditionnels.
                  </p>
                  <p>
                    Si le locataire vous a fourni un lien complet, vous pouvez
                    ouvrir et télécharger les pièces très facilement. Un lien
                    DossierFacile c'est comme une pièce jointe, la qualité « 3C
                    » en plus !
                  </p>
                </template>
              </AccordionElement>
            </li>
            <li class="rf-accordion-group__item">
              <accordion-element id="rf-accordion-group-0-body-2">
                <template v-slot:header>
                  <header>
                    Quelles pièces sont demandées aux locataires ?
                  </header>
                </template>
                <template v-slot:body>
                  <a download href="/assets/pdf/Listedocuments.pdf"
                    >Télécharger la liste des pièces demandées :
                    Listedocuments.pdf</a
                  >
                  <p>
                    DossierFacile demande uniquement les pièces prévues par la
                    loi:
                  </p>

                  <p></p>
                  <ol style="margin-left: 1em">
                    <li>
                      <b>Une pièce d’identité en cours de validité</b><br />

                      Sont acceptés : carte nationale d’identité, passeport,
                      titre de séjour recto-verso, récépissé de renouvellement
                      de titre de séjour accompagné de l’ancien titre
                      recto-verso, permis de conduire
                    </li>
                    <li>
                      <b>Un justificatif de domicile:</b>

                      vos 3 dernières quittances de loyer OU votre avis de taxe
                      foncière OU une attestation sur l’honneur d’hébergement,
                      récente (moins de 3 mois) datée et signée, de la part de
                      votre hébergeant OU une attestation d’élection de domicile
                      <br />
                      Sont refusés : les factures en votre nom, les avis de taxe
                      d’habitation, les RIB
                    </li>
                    <li>
                      <b>Un justificatif de votre activité professionnelle</b>

                      <ul
                        style="
                          list-style-type: circle !important;
                          margin-left: 2em;
                        "
                      >
                        <li>
                          <b>CDI, CDD, CTT: </b>
                          toutes les pages de votre contrat de travail signé OU
                          une attestation de votre employeur datant de moins de
                          3 mois
                        </li>
                        <li>
                          <b>Etudiant: </b>
                          un certificat de scolarité OU une copie de votre carte
                          étudiante
                        </li>
                        <li>
                          <b>Stagiaire: </b>
                          une convention de stage
                        </li>
                        <li>
                          <b>Retraité: </b>
                          une attestation de droit à une pension OU vos
                          bulletins de pension
                        </li>
                        <li>
                          <b>Fonction publique: </b>
                          un arrêté de nomination OU une attestation de votre
                          employeur
                        </li>
                        <li>
                          <b>Indépendant: </b>
                          une attestation d’inscription au statut
                          d’auto-entrepreneur OU un extrait kbis de votre
                          société OU une attestation d’emploi couvrant les trois
                          derniers mois
                        </li>
                        <li>
                          <b>Chômage: </b>
                          une attestation d’ouverture de droit ARE
                        </li>
                        <li>
                          <b>Chômage: </b>
                          un document justifiant votre activité ces trois
                          derniers mois
                        </li>
                      </ul>
                    </li>
                    <li>
                      <b>De justificatifs de vos ressources parmi: </b>

                      <ul
                        style="
                          list-style-type: circle !important;
                          margin-left: 2em;
                        "
                      >
                        <li>Vos 3 dernières fiches de paie</li>
                        <li>
                          Vos 3 derniers versements de prestations sociales
                          (ARE, CAF, Crous, bourse etc.)
                        </li>
                        <li>Votre dernier bulletin de retraite</li>
                        <li>
                          Justificatif d’autres types de ressources Sont refusés
                          : les RIB.
                        </li>
                      </ul>
                    </li>
                    <li>
                      <b>Un avis d’imposition complet </b>
                      à votre nom si vous en disposez
                    </li>
                  </ol>
                </template>
              </accordion-element>
            </li>
            <li class="rf-accordion-group__item">
              <AccordionElement id="rf-accordion-group-0-body-3">
                <template v-slot:header>
                  <header>Je suis marié ou en couple : comment faire ?</header>
                </template>
                <template v-slot:body>
                  <p>
                    Vos dossiers de location sont liés, choisissez donc le mode
                    « colocation ».
                  </p>
                  <p>
                    Lorsque vous envoyez un message à un propriétaire, veillez
                    néanmoins à préciser que vous êtes en couple, et non en
                    colocation « classique ».
                  </p>
                </template>
              </AccordionElement>
            </li>
            <li class="rf-accordion-group__item">
              <AccordionElement id="rf-accordion-group-0-body-4">
                <template v-slot:header>
                  <header>
                    Je souhaite créer un dossier en mode « colocation » : est-ce
                    que mes colocataires doivent aussi créer un dossier
                    DossierFacile ?
                  </header>
                </template>
                <template v-slot:body>
                  <p>
                    Oui, cela facilitera grandement la vie de vos futurs
                    propriétaires !
                  </p>
                  <p>
                    Tous les colocataires pourront ajouter des pièces de façon
                    individuelle, tout en étant bien identifiés comme faisant
                    partie d’une même colocation.
                  </p>
                  <p>
                    Le résultat ? Une procédure simple pour vous, et un dossier
                    final bien organisé pour les propriétaires !
                  </p>
                </template>
              </AccordionElement>
            </li>
            <li class="rf-accordion-group__item">
              <AccordionElement id="rf-accordion-group-0-body-5">
                <template v-slot:header>
                  <header>
                    Je suis étranger, puis-je bénéficier du service ?
                  </header>
                </template>
                <template v-slot:body>
                  <p>
                    Bien sûr ! Toutefois il faut que vous disposiez de toutes
                    les pièces nécessaires (c’est pourquoi nous ne sommes pas
                    encore en mesure de traiter toutes les demandes de
                    locataires étrangers).
                  </p>
                  <p>
                    Par ailleurs, nous ne pouvons malheureusement pas encore
                    accepter les documents en langue non française.
                  </p>
                </template>
              </AccordionElement>
            </li>
            <li class="rf-accordion-group__item">
              <AccordionElement id="rf-accordion-group-0-body-6">
                <template v-slot:header>
                  <header>
                    Je rentre en France après avoir vécu à l’étranger : je ne
                    possède pas de quittances de loyer !
                  </header>
                </template>
                <template v-slot:body>
                  Nous vous proposons d'ajouter une note dans la catégorie «
                  justificatif de domicile » déclarant sur l’honneur aux
                  propriétaires que vous avez résidé à l’étranger pendant X
                  années et que vous ne possédez donc pas de quittances de
                  loyer.
                </template>
              </AccordionElement>
            </li>
            <li class="rf-accordion-group__item">
              <AccordionElement id="rf-accordion-group-0-body-7">
                <template v-slot:header>
                  <header>Quelles pièces sont demandées aux garants ?</header>
                </template>
                <template v-slot:body>
                  <a download href="/assets/pdf/Listedocuments.pdf"
                    >Télécharger la liste des pièces demandées :
                    Listedocuments.pdf</a
                  ><br />
                  <p>
                    <b>Si votre garant est un garant classique :</b>
                  </p>
                  <p></p>
                  <ol style="margin-left: 1em">
                    <li>Une <b>pièce d’identité</b> du garant</li>
                    <li>
                      Un <b>justificatif de domicile</b> du garant (facture,
                      taxe foncière…)
                    </li>
                    <li>
                      Un
                      <b>justificatif d’activité professionnelle</b>
                      du garant (fiche de paie, bilan comptable, bulletin de
                      retraite…)
                    </li>
                    <li>
                      Un <b>justificatif de ressources</b> du garant (fiche de
                      paie, bilan comptable, attestation de versements, avis
                      d’imposition…)
                    </li>
                    <li>Un <b>avis d’imposition</b> au nom du garant</li>
                  </ol>
                  <br />
                  <p style="margin-top: 10px">
                    <b>Si votre garant est un organisme :</b>
                  </p>
                  <ol style="margin-left: 1em">
                    <li>
                      Un
                      <b>certificat ou un visa en cours de validité</b>
                      délivré par l’organisme qui se porte garant pour vous
                    </li>
                  </ol>
                </template>
              </AccordionElement>
            </li>
          </ul>
          <ul
            class="rf-accordion-group"
            id="rf-accordion-group-1"
            v-show="section === 1"
          >
            <li class="rf-accordion-group__item">
              <accordion-element id="rf-accordion-group-1-body-0">
                <template v-slot:header>
                  <header>
                    J'ai ajouté toutes mes pièces mais je n'arrive pas à valider
                    mon dossier : que faire ?
                  </header>
                </template>
                <template v-slot:body>
                  1) Si vous n'avez pas de garant, vérifiez que vous avez bien
                  décoché l'option « garant ».<br />2) Vérifiez que l'adresse
                  mail renseignée est bien correcte et n'a pas déjà été utilisée
                  pour créer un compte.<br />3) Vérifiez vos emails : peut-être
                  avez-vous déjà reçu un mail de DossierFacile vous confirmant
                  la création de votre compte !<br />4) Contactez-nous à
                  contact@dossierfacile.fr et décrivez-nous votre situation.
                  Nous vous répondrons dans les meilleurs délais.
                </template>
              </accordion-element>
            </li>
            <li class="rf-accordion-group__item">
              <accordion-element id="rf-accordion-group-1-body-1">
                <template v-slot:header>
                  <header>
                    Mon dossier était validé et maintenant il ne l’est plus !
                  </header>
                </template>
                <template v-slot:body>
                  <p>
                    Si vous avez modifié certaines informations ou certains
                    documents c’est normal : votre dossier doit repasser à
                    l’étude pour que nous vérifions ces nouvelles données.
                  </p>
                  <p>
                    Si vous n’avez rien modifié c’est sûrement que les documents
                    fournis sont maintenant « dépassés » : par exemple, si nous
                    venons de changer de mois il faut que vous ajoutiez vos
                    documents du mois qui vient de s’écouler.
                  </p>
                </template>
              </accordion-element>
            </li>
            <li class="rf-accordion-group__item">
              <accordion-element id="rf-accordion-group-1-body-2">
                <template v-slot:header>
                  <header>
                    J’ai reçu un message me disant que mon compte était validé
                    et pourtant
                  </header>
                </template>
                <template v-slot:body>
                  1) Si vous êtes en colocation c’est sûrement que le dossier de
                  votre colocataire n’a pas encore été validé.<br />2) Si vous
                  n’êtes pas en colocation contactez-nous à l’adresse
                  contact@dossierfacile.fr et nous vous répondrons dans les
                  meilleurs délais.
                </template>
              </accordion-element>
            </li>
          </ul>

          <ul
            class="rf-accordion-group"
            id="rf-accordion-group-2"
            v-show="section === 2"
          >
            <li class="rf-accordion-group__item">
              <accordion-element id="rf-accordion-group-2-body-0">
                <template v-slot:header>
                  <header>
                    Besoin d’informations complémentaires sur DossierFacile ?
                  </header>
                </template>
                <template v-slot:body>
                  <p>Rendez-vous dans l’onglet « En Savoir Plus » !</p>
                </template>
              </accordion-element>
            </li>
            <li class="rf-accordion-group__item">
              <accordion-element id="rf-accordion-group-2-body-1">
                <template v-slot:header>
                  <header>Des questions relatives au logement ?</header>
                </template>
                <template v-slot:body>
                  Renseignez-vous auprès de l’ANIL ou de votre ADIL.
                </template>
              </accordion-element>
            </li>
            <li class="rf-accordion-group__item">
              <accordion-element id="rf-accordion-group-2-body-2">
                <template v-slot:header>
                  <header>Je n’arrive pas à me connecter, que faire ?</header>
                </template>
                <template v-slot:body>
                  Vérifiez que votre E-mail est similaire à celui utilisé lors
                  de la création de votre compte. Attention aux fautes de frappe
                  !
                </template>
              </accordion-element>
            </li>
          </ul>

          <ul
            class="rf-accordion-group"
            id="rf-accordion-group-3"
            v-show="section === 3"
          >
            <li class="rf-accordion-group__item">
              <accordion-element id="rf-accordion-group-3-body-0">
                <template v-slot:header>
                  <header>Mes données sont-elles sécurisées ?</header>
                </template>
                <template v-slot:body>
                  <p>
                    La sécurité des données personnelles est une priorité pour
                    nous.
                  </p>
                  <p>
                    Nous nous engageons à protéger les informations que vous
                    nous fournissez. Les comptes locataires et propriétaires
                    sont enregistrés dans un centre de données sécurisé. Seules
                    nos équipes techniques peuvent y accéder.
                  </p>
                  <p>
                    Vos données personnelles ne seront jamais revendues, et
                    elles ne seront pas non plus communiquées à des tiers sans
                    votre accord express.
                  </p>
                </template>
              </accordion-element>
            </li>
            <li class="rf-accordion-group__item">
              <accordion-element id="rf-accordion-group-3-body-1">
                <template v-slot:header>
                  <header>Que fait-on de mes données ?</header>
                </template>
                <template v-slot:body>
                  <p>Pièces justificatives</p>
                  <p>
                    DossierFacile conserve vos pièces justificatives tant que
                    votre compte reste actif (c’est-à-dire que vous vous
                    connectez).
                  </p>
                  <p>
                    Au bout de trois semaines d’inactivité consécutives, vos
                    pièces sont automatiquement supprimées.
                  </p>
                  <p>Données personnelles</p>
                  <p>
                    Vos données personnelles sont anonymisées (suppression des
                    noms et prénoms permettant de vous identifier) et sont
                    conservées pendant 2 ans à compter de la création de votre
                    compte.
                  </p>
                </template>
              </accordion-element>
            </li>
            <li class="rf-accordion-group__item">
              <accordion-element id="rf-accordion-group-3-body-2">
                <template v-slot:header>
                  <header>Pourquoi conserver des données anonymes ?</header>
                </template>
                <template v-slot:body>
                  <p>
                    Cela nous permet d’améliorer notre service en mesurant
                    l'impact et la diffusion territoriale de DossierFacile et en
                    analysant les usages (notamment pour déterminer les options
                    les plus pertinentes à vous proposer en fonction des usages
                    les plus fréquents).
                  </p>
                  <p>
                    Elles nous permettent également de mesurer l'évolution du
                    marché du logement : vitesses d'attribution des logements, «
                    files d'attente » dans les zones tendues, comparaison de
                    l'offre et de la demande.
                  </p>
                  <p>
                    Enfin, nous collectons également des données anonymes
                    d'audience (qui nous aident à déterminer la durée
                    d'utilisation du service et les pages à améliorer en
                    priorité).
                  </p>
                  <p>
                    Nous nous engageons à ne jamais exploiter les informations
                    que vous nous transmettrez dans un but commercial ou
                    publicitaire.
                  </p>
                </template>
              </accordion-element>
            </li>
            <li class="rf-accordion-group__item">
              <accordion-element id="rf-accordion-group-3-body-3">
                <template v-slot:header>
                  <header>
                    Que faire si je ne souhaite pas que mes données anonymes
                    soient conservées ?
                  </header>
                </template>
                <template v-slot:body>
                  <p>
                    Vous avez évidemment un droit d'accès, de rectification et
                    de suppression de vos données.
                  </p>
                  <p>
                    Pour l'exercer, envoyez-nous un courriel en précisant la
                    date et l'heure précise de création de votre compte (comme
                    nous n'enregistrons pas d'éléments nominatifs, seuls ces
                    éléments peuvent nous permettre de retrouver votre compte).
                  </p>
                </template>
              </accordion-element>
            </li>
          </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AccordionElement from "../components/AccordionElement.vue";

@Component({
  mounted: function () {
    const localScript = document.createElement("script");
    localScript.setAttribute("src", "/js/all.js");
    document.head.appendChild(localScript);
  },
  components: {
    AccordionElement,
  },
})
export default class Faq extends Vue {
  section = 0;
}
</script>

<style scoped lang="scss">
@import "df-shared/src/scss/_variables.scss";

a {
  color: $light-blue;
}

.height-40 {
  height: auto;
  align-items: center;
  justify-content: center;
  @media (min-height: 600px) and (min-width: 767px) {
    height: 40vh;
  }
}

.imagebg {
  width: 100%;
  top: 0;
  left: 0;
  background-size: cover !important;
  background-position: 50% 50% !important;
  background-image: url("../assets/images/faq/livres_bleu_fonc_C3_A9.jpg");
  z-index: 0;
}

ul {
  margin-top: 0;
  margin-bottom: 0;
}
li {
  margin-top: 0;
  margin-bottom: 0;
}

.tab__title {
  border: 1px solid black;
  cursor: pointer;
  :hover {
    color: $light-blue;
  }
}

.selected {
  color: $light-blue;
}
</style>