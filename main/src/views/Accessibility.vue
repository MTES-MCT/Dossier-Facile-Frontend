<template>
  <section class="fr-mb-12w">
    <article>
      <div class="fr-container">
        <div class="fr-grid-row justify-content-center">
          <div class="fr-col-md-10 fr-col-lg-8 fr-mt-5w">
            <h1>Déclaration d’accessibilité</h1>
            <p>
              Dossier Facile s’engage à rendre ses sites internet, intranet,
              extranet accessibles conformément à l’article 47 de la loi n°
              2005-102 du 11 février 2005 et du Décret n° 2019-768 du 24 juillet
              2019.
            </p>
            <p>
              Cette déclaration d’accessibilité s’applique au site
              <strong>DossierFacile</strong
              ><span> (<span>https://www.dossierfacile.fr</span>)</span> et vise
              à présenter la politique d'accessibilité du site.
            </p>

            <h2>Qu'est-ce que l'accessibilité numérique ?</h2>
            <p>
              Un site web accessible est un site qui permet à tous les
              internautes d'accéder à ses contenus sans difficulté, y compris
              aux personnes qui présentent un handicap et utilisent des
              logiciels ou matériels spécialisés. Il peut permettre, par
              exemple, la navigation avec des outils de synthèse vocale, plages
              braille... ou encore une navigation sans souris, etc.
            </p>

            <h2>État de conformité</h2>
            <p>
              Le site <strong>DossierFacile</strong
              ><span> (<span>https://www.dossierfacile.fr</span>)</span> n’est
              pas en conformité avec le Référentiel Général d’Amélioration de
              l’Accessibilité (RGAA 4.1). Les non-conformités et les éventuelles
              dérogations sont énumérées ci-dessous.
            </p>

            <h2>Résultats des tests</h2>
            <p>
              L’audit de conformité réalisé par la société Numerik-ea révèle que
              50.85 % des critères RGAA sont respectés. Ce pourcentage
              correspond à :
            </p>
            <ul>
              <li>30 critères conformes</li>
              <li>29 critères non conformes</li>
              <li>47 critères non applicables</li>
            </ul>

            <h2>Contenus non accessibles</h2>
            <p>Liste des critères non conformes :</p>
            <table>
              <tr
                v-for="criteria in nonCompliantCriteria"
                v-bind:key="criteria.id"
              >
                <td class="text-bold">{{ criteria.id }}</td>
                <td>{{ criteria.title }}</td>
              </tr>
            </table>

            <br />

            <h3>Contenus non soumis à l’obligation d’accessibilité</h3>
            <ul>
              <li>
                Les fichiers disponibles dans des formats bureautiques publiés
                avant le 23 septembre 2018 ;
              </li>
              <li>
                Les contenus audio et vidéo préenregistrés publiés avant le 23
                septembre 2020 ;
              </li>
              <li>
                Les contenus de tiers qui ne sont ni financés ni développés par
                l’organisme concerné et qui ne sont pas sous son contrôle (cadre
                en ligne et lecteur vidéo Youtube, bandeau cookie).
              </li>
            </ul>

            <h2>Établissement de cette Déclaration d'accessibilité</h2>
            <p>Cette déclaration a été établie le 27 septembre 2021.</p>
            <p>Technologies utilisées pour la réalisation du site web :</p>
            <ul>
              <li>HTML 5</li>
              <li>CSS 3</li>
              <li>JavaScript</li>
            </ul>
            <p>
              Les tests des pages web ont été effectués avec les combinaisons de
              navigateurs web et lecteurs d’écran suivants :
            </p>
            <ul>
              <li>Voiceover + Safari sur osX 10.15.4</li>
              <li>Firefox 79 + NVDA 2020.1 sur Windows 10</li>
              <li>Firefox 79 + Jaws 2019</li>
            </ul>
            <p>
              Les outils suivants ont été utilisés lors de l’évaluation :
            </p>
            <ul>
              <li>Color Contrast Analyser</li>
              <li>Web Developer Toolbar</li>
              <li>Axe</li>
              <li>Arc Toolkit</li>
            </ul>
            <p>
              Pages du site ayant fait l’objet de la vérification de conformité
              :
            </p>
            <ul>
              <li v-for="page in pagesVerified" v-bind:key="page.url">
                <a :href="page.url">{{ page.name }}</a>
              </li>
            </ul>

            <h2>Retour d'information et contact</h2>
            <p>
              Si vous n’arrivez pas à accéder à un contenu ou à un service, vous
              pouvez contacter le responsable du site internet pour être orienté
              vers une alternative accessible ou obtenir le contenu sous une
              autre forme.
            </p>
            <p>
              Contacter :<br />
              <span class="text-bold">
                Ministère de la Transition écologique,<br />
                Direction générale de l’Aménagement, du Logement et de la
                Nature,<br />
                Direction de l’habitat, de l’urbanisme et des paysages,<br />
                Service DossierFacile
              </span>
            </p>

            <p>
              1 place Carpeaux<br />
              92800 Puteaux<br />
              France
            </p>
            <p>+33 1 40 81 21 22</p>

            <h2>Voie de recours</h2>
            <p>
              Cette procédure est à utiliser dans le cas suivant&nbsp;: vous
              avez signalé au responsable du site internet un défaut
              d’accessibilité qui vous empêche d’accéder à un contenu ou à un
              des services du portail et vous n’avez pas obtenu de réponse
              satisfaisante.
            </p>
            <p>Vous pouvez&nbsp;:</p>
            <ul>
              <li>
                Écrire un message au
                <a href="https://formulaire.defenseurdesdroits.fr/"
                  >Défenseur des droits</a
                >
              </li>
              <li>
                Contacter
                <a href="https://www.defenseurdesdroits.fr/saisir/delegues"
                  >le délégué du Défenseur des droits dans votre région</a
                >
              </li>
              <li>
                Envoyer un courrier par la poste (gratuit, ne pas mettre de
                timbre)&nbsp;:<br />
                Défenseur des droits<br />
                Libre réponse 71120<br />
                75342 Paris CEDEX 07
              </li>
            </ul>
          </div>
        </div>
      </div>
    </article>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Accessibility extends Vue {
  nonCompliantCriteria = [
    {
      id: "1.1",
      title:
        "Chaque image porteuse d’information a-t-elle une alternative textuelle ?"
    },
    {
      id: "1.2",
      title:
        "Chaque image de décoration est-elle correctement ignorée par les technologies d’assistance ?"
    },
    {
      id: "1.3",
      title:
        "Pour chaque image porteuse d'information ayant une alternative textuelle, cette alternative est-elle pertinente (hors cas particuliers) ?"
    },
    {
      id: "2.2",
      title:
        "Pour chaque cadre ayant un titre de cadre, ce titre de cadre est-il pertinent ?"
    },
    {
      id: "3.2",
      title:
        "Dans chaque page web, le contraste entre la couleur du texte et la couleur de son arrière-plan est-il suffisamment élevé (hors cas particuliers) ?"
    },
    {
      id: "3.3",
      title:
        "Dans chaque page web, les couleurs utilisées dans les composants d’interface ou les éléments graphiques porteurs d’informations sont-elles suffisamment contrastées (hors cas particuliers) ?"
    },
    {
      id: "5.4",
      title:
        "Pour chaque tableau de données ayant un titre, le titre est-il correctement associé au tableau de données ?"
    },
    {
      id: "6.1",
      title: "Chaque lien est-il explicite (hors cas particuliers) ?"
    },
    {
      id: "6.2",
      title: "Dans chaque page web, chaque lien, a-t-il un intitulé ?"
    },
    {
      id: "7.1",
      title:
        "Chaque script est-il, si nécessaire, compatible avec les technologies d’assistance ?"
    },
    {
      id: "8.2",
      title:
        "Pour chaque page web, le code source généré est-il valide selon le type de document spécifié (hors cas particuliers) ?"
    },
    {
      id: "8.6",
      title:
        "Pour chaque page web ayant un titre de page, ce titre est-il pertinent ?"
    },
    {
      id: "8.9",
      title:
        "Dans chaque page web, les balises ne doivent pas être utilisées uniquement à des fins de présentation. Cette règle est-elle respectée ?"
    },
    {
      id: "9.1",
      title:
        "Dans chaque page web, l’information est-elle structurée par l’utilisation appropriée de titres ?"
    },
    {
      id: "9.2",
      title:
        "Dans chaque page web, la structure du document est-elle cohérente (hors cas particuliers) ?"
    },
    {
      id: "9.3",
      title:
        "Dans chaque page web, chaque liste est-elle correctement structurée ?"
    },
    {
      id: "10.2",
      title:
        "Dans chaque page web, le contenu visible porteur d’information reste-t-il présent lorsque les feuilles de styles sont désactivées ?"
    },
    {
      id: "10.7",
      title:
        "Dans chaque page web, pour chaque élément recevant le focus, la prise de focus est-elle visible ?"
    },
    {
      id: "10.8",
      title:
        "Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance ?"
    },
    {
      id: "10.11",
      title:
        "Pour chaque page web, les contenus peuvent-ils être présentés sans avoir recours à la fois à un défilement vertical pour une fenêtre ayant une hauteur de 256px, ou à un défilement horizontal pour une fenêtre ayant une largeur de 320px (hors cas particuliers) ?"
    },
    { id: "11.1", title: "Chaque champ de formulaire a-t-il une étiquette ?" },
    {
      id: "11.9",
      title:
        "Dans chaque formulaire, l’intitulé de chaque bouton est-il pertinent (hors cas particuliers) ?"
    },
    {
      id: "11.10",
      title:
        "Dans chaque formulaire, le contrôle de saisie est-il utilisé de manière pertinente (hors cas particuliers) ?"
    },
    {
      id: "11.11",
      title:
        "Dans chaque formulaire, le contrôle de saisie est-il accompagné, si nécessaire, de suggestions facilitant la correction des erreurs de saisie ?"
    },
    {
      id: "11.13",
      title:
        "La finalité d’un champ de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l’utilisateur ?"
    },
    {
      id: "12.1",
      title:
        "Chaque ensemble de pages dispose-t-il de deux systèmes de navigation différents, au moins (hors cas particuliers) ?"
    },
    {
      id: "12.6",
      title:
        "Les zones de regroupement de contenus présentes dans plusieurs pages web (zones d’en-tête, de navigation principale, de contenu principal, de pied de page et de moteur de recherche) peuvent-elles être atteintes ou évitées ?"
    },
    {
      id: "12.7",
      title:
        "Dans chaque page web, le texte reste-t-il lisible lorsque la taille des caractères est augmentée jusqu’à 200%, au moins (hors cas particuliers) ?"
    },
    {
      id: "12.8",
      title: "Dans chaque page web, l’ordre de tabulation est-il cohérent ?"
    }
  ];

  pagesVerified = [
    {
      name: "Accueil",
      url: "https://www.dossierfacile.fr/"
    },
    {
      name: "Blog",
      url: "https://www.dossierfacile.fr/blog/"
    },
    {
      name: "En savoir plus",
      url: "https://www.dossierfacile.fr/information/"
    },
    {
      name: "Mentions légales",
      url: "https://www.dossierfacile.fr/mentions-legales/"
    },
    {
      name: "Contact",
      url: "https://www.dossierfacile.fr/contact"
    },
    {
      name: "Espace Propriétaire",
      url: "https://proprietaire.dossierfacile.fr/"
    },
    {
      name: "Statistiques",
      url: "https://www.dossierfacile.fr/stats/"
    },
    {
      name: "Connexion « Mon dossier »",
      url: "https://locataire.dossierfacile.fr/signup"
    },
    {
      name: "Locataire",
      url: "https://locataire.dossierfacile.fr/nom-locataire"
    },
    {
      name: "Type locataire",
      url: "https://locataire.dossierfacile.fr/type-locataire"
    },
    {
      name: "Documents locataire",
      url: "https://locataire.dossierfacile.fr/documents-locataire/1"
    },
    {
      name: "Validation dossier",
      url: "https://locataire.dossierfacile.fr/validation-dossier"
    },
    {
      name: "Mon compte Locataire",
      url: "https://locataire.dossierfacile.fr/account"
    },
    {
      name: "Connexion Propriétaire",
      url: "https://proprietaire.dossierfacile.fr/login"
    },
    {
      name: "Ma propriété",
      url: "https://proprietaire.dossierfacile.fr/"
    },
    {
      name: "Mon compte propriétaire : Mes informations personnelles",
      url: "https://proprietaire.dossierfacile.fr/proprietaire"
    }
  ];
}
</script>

<style scoped lang="scss">
table {
  border-collapse: collapse;
}
td {
  border: 1px solid #dddddd;
  padding: 0.5em;
}
ul {
  margin-bottom: 1em;
}
</style>
