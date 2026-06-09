<template>
  <section class="fr-mb-12w">
    <article>
      <div class="fr-container">
        <div class="fr-grid-row justify-content-center">
          <div class="fr-col-md-10 fr-col-lg-8 fr-mt-5w">
            <h1>Déclaration d’accessibilité</h1>
            <p>
              Le service Dossier Facile s’engage à rendre son site web accessible conformément à
              l’article 47 de la loi n° 2005-102 du 11 février 2005 et du Décret n° 2019-768 du 24
              juillet 2019.
            </p>
            <p>
              Cette déclaration d’accessibilité s’applique au site
              <strong>DossierFacile</strong>&nbsp;:
              <a href="https://www.dossierfacile.logement.gouv.fr"
                >https://www.dossierfacile.logement.gouv.fr</a
              >.
            </p>

            <h2>Qu'est-ce que l'accessibilité numérique ?</h2>
            <p>
              Un site web accessible est un site qui permet à tous les internautes d'accéder à ses
              contenus sans difficulté, y compris aux personnes qui présentent un handicap et
              utilisent des logiciels ou matériels spécialisés. Il peut permettre, par exemple, la
              navigation avec des outils de synthèse vocale, plages braille... ou encore une
              navigation sans souris, etc.
            </p>

            <h2>État de conformité</h2>
            <p>
              Le site <strong>DossierFacile</strong> (<a
                href="https://www.dossierfacile.logement.gouv.fr"
                >https://www.dossierfacile.logement.gouv.fr</a
              >) est en conformité partielle avec le référentiel général d’amélioration de
              l’accessibilité en raison des non-conformités ci-dessous.
            </p>

            <h2>Résultats des tests</h2>
            <p>
              L’audit de conformité au RGAA 4.1 réalisé par la société
              <a
                href="https://www.numerik-ea.fr/"
                title="Numerik-ea - Ouvre une nouvelle fenêtre"
                target="_blank"
                >Numerik-ea</a
              >
              révèle que <strong>56.9&nbsp;%</strong> des critères RGAA sont respectés.
            </p>
            <p>Dans le détail&nbsp;:</p>
            <ul>
              <li>Nombre de critères conformes&nbsp;: 33</li>
              <li>Nombre de critères non applicables&nbsp;: 48</li>
              <li>Nombre de critères non conformes&nbsp;: 25</li>
            </ul>

            <h2>Contenus non accessibles</h2>
            <p class="fr-mb-0">Liste des critères non conformes&nbsp;:</p>
            <ul>
              <li v-for="criteria in nonCompliantCriteria" :key="criteria.id">
                <span class="text-bold fr-mr-1w align-number">{{ criteria.id }}</span>
                <span>{{ criteria.title }}</span>
              </li>
            </ul>

            <h3>Contenus non soumis à l’obligation d’accessibilité</h3>
            <ul>
              <li>
                Les fichiers disponibles dans des formats bureautiques publiés avant le 23 septembre
                2018&nbsp;;
              </li>
              <li>
                Les contenus de tiers qui ne sont ni financés ni développés par l’organisme concerné
                et qui ne sont pas sous son contrôle (cadre en ligne et lecteur vidéo Youtube,
                bandeau cookie).
              </li>
            </ul>

            <h2>Établissement de cette Déclaration d'accessibilité</h2>
            <p>
              Cette déclaration a été établie le <time datetime="2025-06-12">12 juin 2025</time>.
            </p>
            <h3>Technologies utilisées pour la réalisation du site web&nbsp;:</h3>
            <ul>
              <li>HTML 5</li>
              <li>CSS 3</li>
              <li>JavaScript</li>
            </ul>
            <h3>Environnement de test</h3>
            <p>
              Les tests des pages web ont été effectués avec les combinaisons de navigateurs web et
              lecteurs d’écran suivants&nbsp;:
            </p>
            <ul>
              <li>Voiceover et Safari</li>
              <li>Firefox et NVDA</li>
              <li>Firefox et Jaws</li>
            </ul>
            <p>Les outils suivants ont été utilisés lors de l’évaluation&nbsp;:</p>
            <ul>
              <li>WCAG contrast checker​</li>
              <li>HeadingsMap</li>
              <li>Web developer</li>
              <li>ARC Toolkit</li>
              <li>PAC (PDF Accessibility Checker)</li>
            </ul>
            <h3>Pages du site ayant fait l’objet de la vérification de conformité</h3>
            <ul>
              <li v-for="page in pagesVerified" :key="page.url">
                <a :href="page.url">{{ page.name }}</a>
              </li>
            </ul>

            <h2>Retour d'information et contact</h2>
            <p>
              Si vous n’arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter le
              responsable du site web pour être orienté vers une alternative accessible ou obtenir
              le contenu sous une autre forme.
            </p>

            <ul>
              <li>
                Envoyer un message via
                <a href="https://www.dossierfacile.logement.gouv.fr/contact"
                  >le formulaire de contact.</a
                >
              </li>
              <li>
                Contacter&nbsp;:<br />
                <span class="text-bold">
                  Ministère de la Transition écologique,<br />
                  Direction générale de l’Aménagement, du Logement et de la Nature,<br />
                  Direction de l’habitat, de l’urbanisme et des paysages,<br />
                  Service DossierFacile </span
                ><br />
                <a href="mailto:contact@dossierfacile.logement.gouv.fr"
                  >contact@dossierfacile.logement.gouv.fr</a
                >
              </li>
            </ul>

            <h2>Voie de recours</h2>
            <p>
              Cette procédure est à utiliser dans le cas suivant&nbsp;: vous avez signalé au
              responsable du site internet un défaut d’accessibilité qui vous empêche d’accéder à un
              contenu ou à un des services du portail et vous n’avez pas obtenu de réponse
              satisfaisante.
            </p>
            <p>Vous pouvez&nbsp;:</p>
            <ul>
              <li>
                <a
                  href="https://formulaire.defenseurdesdroits.fr/"
                  title="Écrire un message au Défenseur des droits - Ouvre une nouvelle fenêtre"
                  target="_blank"
                  >Écrire un message au Défenseur des droits</a
                >
              </li>
              <li>
                <a
                  href="https://www.defenseurdesdroits.fr/saisir/delegues"
                  title="Contacter le délégué du Défenseur des droits dans votre région - Ouvre une nouvelle fenêtre"
                  target="_blank"
                  >Contacter le délégué du Défenseur des droits dans votre région</a
                >
              </li>
              <li>
                Contacter le défenseur des droits par téléphone&nbsp;:
                <a href="tel:09 69 39 00 00">09 69 39 00 00</a>
              </li>
              <li>
                Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre)&nbsp;:<br />
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

<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'

const title = 'Déclaration accessibilité'
const description = "Déclaration d'accessibilité de DossierFacile"

const siteTitle = import.meta.env.VITE_SITE_TITLE
const seoTitle = `${title} - ${siteTitle}`

useSeoMeta({
  title: title,
  description: description,
  ogTitle: seoTitle,
  ogDescription: description,
  twitterTitle: seoTitle,
  twitterDescription: description
})

const nonCompliantCriteria = [
  {
    id: '1.1',
    title: 'Chaque image porteuse d’information a-t-elle une alternative textuelle ?'
  },
  {
    id: '1.2',
    title:
      'Chaque image de décoration est-elle correctement ignorée par les technologies d’assistance ?'
  },
  {
    id: '1.3',
    title:
      "Pour chaque image porteuse d'information ayant une alternative textuelle, cette alternative est-elle pertinente (hors cas particuliers) ?"
  },
  {
    id: '1.8',
    title:
      'Chaque image texte porteuse d’information, en l’absence d’un mécanisme de remplacement, doit si possible être remplacée par du texte stylé. Cette règle est-elle respectée (hors cas particuliers)?'
  },
  {
    id: '3.2',
    title:
      'Dans chaque page web, le contraste entre la couleur du texte et la couleur de son arrière-plan est-il suffisamment élevé (hors cas particuliers)?'
  },
  {
    id: '5.3',
    title: 'Pour chaque tableau de mise en forme, le contenu linéarisé reste-t-il compréhensible ?'
  },
  {
    id: '5.4',
    title:
      'Pour chaque tableau de données ayant un titre, le titre est-il correctement associé au tableau de données ?'
  },
  {
    id: '5.6',
    title:
      'Pour chaque tableau de données, chaque en-tête de colonnes et chaque en-tête de lignes sont-ils correctement déclarés ?'
  },
  {
    id: '5.8',
    title:
      'Chaque tableau de mise en forme ne doit pas utiliser d’éléments propres aux tableaux de données. Cette règle est-elle respectée ?'
  },
  {
    id: '6.1',
    title: 'Chaque lien est-il explicite (hors cas particuliers) ?'
  },
  {
    id: '7.1',
    title: 'Chaque script est-il, si nécessaire, compatible avec les technologies d’assistance ?'
  },
  {
    id: '7.3',
    title:
      'Chaque script est-il contrôlable par le clavier et par tout dispositif de pointage (hors cas particuliers) ?'
  },
  {
    id: '7.5',
    title:
      'Dans chaque page web, les messages de statut sont-ils correctement restitués par les technologies d’assistance ?'
  },
  {
    id: '8.6',
    title: 'Pour chaque page web ayant un titre de page, ce titre est-il pertinent ?'
  },
  {
    id: '8.9',
    title:
      'Dans chaque page web, les balises ne doivent pas être utilisées uniquement à des fins de présentation. Cette règle est-elle respectée ?'
  },
  {
    id: '9.1',
    title:
      'Dans chaque page web, l’information est-elle structurée par l’utilisation appropriée de titres ?'
  },
  {
    id: '9.3',
    title: 'Dans chaque page web, chaque liste est-elle correctement structurée ?'
  },
  {
    id: '10.2',
    title:
      'Dans chaque page web, le contenu visible porteur d’information reste-t-il présent lorsque les feuilles de styles sont désactivées ?'
  },
  {
    id: '10.11',
    title:
      'Pour chaque page web, les contenus peuvent-ils être présentés sans avoir recours à la fois à un défilement vertical pour une fenêtre ayant une hauteur de 256px, ou à un défilement horizontal pour une fenêtre ayant une largeur de 320px (hors cas particuliers) ?'
  },
  { id: '11.1', title: 'Chaque champ de formulaire a-t-il une étiquette ?' },
  {
    id: '11.2',
    title:
      'Chaque étiquette associée à un champ de formulaire est-elle pertinente (hors cas particuliers) ?'
  },
  {
    id: '11.10',
    title:
      'Dans chaque formulaire, le contrôle de saisie est-il utilisé de manière pertinente (hors cas particuliers) ?'
  },
  {
    id: '11.13',
    title:
      'La finalité d’un champ de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l’utilisateur ?'
  },
  {
    id: '12.8',
    title: 'Dans chaque page web, l’ordre de tabulation est-il cohérent ?'
  },
  {
    id: '13.11',
    title:
      'Dans chaque page web, les actions déclenchées au moyen d’un dispositif de pointage sur un point unique de l’écran peuvent-elles faire l’objet d’une annulation (hors cas particuliers) ?'
  }
]

const pagesVerified = [
  {
    name: 'Accueil',
    url: 'https://www.dossierfacile.logement.gouv.fr'
  },
  {
    name: 'Authentification',
    url: 'https://sso.dossierfacile.logement.gouv.fr/auth'
  },
  {
    name: 'Se connecter sur DossierFacile',
    url: 'https://sso.dossierfacile.logement.gouv.fr/auth/realms/dossier-facile/protocol/openid-connect/auth?client_id=dossier-facile-frontend&redirect_uri=https%3A%2F%2Flocataire.dossierfacile.logement.gouv.fr%2Fnom-locataire&state=7135ccdd-a158-4e48-8ab4-55949259a0ac&response_mode=fragment&response_type=code&scope=openid&nonce=48418481-e7d5-4d50-937c-a9c3a9f7a863&code_challenge=6YIdT1SSN8vNclfRQ9GzsGNLRtOkyU_y-slvcoHrQ9U&code_challenge_method=S256'
  },
  {
    name: 'Contact',
    url: 'https://www.dossierfacile.logement.gouv.fr/contact'
  },
  {
    name: 'Accessibilité',
    url: 'https://www.dossierfacile.logement.gouv.fr/accessibilite'
  },
  {
    name: 'Mentions légales',
    url: 'https://www.dossierfacile.logement.gouv.fr/mentions-legales'
  },
  {
    name: 'Plan du site',
    url: 'https://www.dossierfacile.logement.gouv.fr/plan-du-site'
  },
  {
    name: 'Blog',
    url: 'https://www.dossierfacile.logement.gouv.fr/blog'
  },
  {
    name: 'Qui sommes nous',
    url: 'https://www.dossierfacile.logement.gouv.fr/information'
  },
  {
    name: "S'inscrire sur DossierFacile",
    url: 'https://sso.dossierfacile.logement.gouv.fr/auth/realms/dossier-facile/protocol/openid-connect/registrations?client_id=dossier-facile-frontend&redirect_uri=https%3A%2F%2Flocataire.dossierfacile.logement.gouv.fr%2Fprofile&response_type=code&scope=openid'
  },
  {
    name: 'Partenaires',
    url: 'https://www.dossierfacile.logement.gouv.fr/partenaires'
  },
  {
    name: 'CGU',
    url: 'https://www.dossierfacile.logement.gouv.fr/cgu'
  },
  {
    name: 'Espace Propriétaire',
    url: 'https://proprietaire.dossierfacile.logement.gouv.fr/proprietaire'
  },
  {
    name: 'Article de blog',
    url: 'https://www.dossierfacile.logement.gouv.fr/blog/guide-aide-etudiant-logement'
  },
  {
    name: 'Politique de confidentialité',
    url: 'https://www.dossierfacile.logement.gouv.fr/politique-de-confidentialite'
  }
]
</script>

<style scoped>
ul {
  margin-bottom: 1em;
}

.align-number {
  font-variant-numeric: tabular-nums;
}
</style>
