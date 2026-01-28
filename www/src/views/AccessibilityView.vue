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
              <strong>DossierFacile</strong> :
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
              révèle que 75% des critères RGAA sont respectés.
            </p>
            <p>Dans le détail :</p>
            <ul>
              <li>Nombre de critères conformes : 45</li>
              <li>Nombre de critères non applicables : 46</li>
              <li>Nombre de critères non conformes : 15</li>
            </ul>

            <h2>Contenus non accessibles</h2>
            <p class="fr-mb-0">Liste des critères non conformes :</p>
            <ul>
              <li v-for="criteria in nonCompliantCriteria" :key="criteria.id">
                <span class="text-bold fr-mr-1w align-number">{{ criteria.id }}</span>
                <span>{{ criteria.title }}</span>
              </li>
            </ul>

            <br />

            <h3>Contenus non soumis à l’obligation d’accessibilité</h3>
            <ul>
              <li>
                Les fichiers disponibles dans des formats bureautiques publiés avant le 23 septembre
                2018 ;
              </li>
              <li>
                Les contenus audio et vidéo préenregistrés publiés avant le 23 septembre 2020 ;
              </li>
              <li>
                Les contenus de tiers qui ne sont ni financés ni développés par l’organisme concerné
                et qui ne sont pas sous son contrôle (cadre en ligne et lecteur vidéo Youtube,
                bandeau cookie).
              </li>
            </ul>

            <h2>Établissement de cette Déclaration d'accessibilité</h2>
            <p>Cette déclaration a été établie le 15 mars 2023.</p>
            <p>Technologies utilisées pour la réalisation du site web :</p>
            <ul>
              <li>HTML 5</li>
              <li>CSS 3</li>
              <li>JavaScript</li>
            </ul>
            <p>
              Les tests des pages web ont été effectués avec les combinaisons de navigateurs web et
              lecteurs d’écran suivants :
            </p>
            <ul>
              <li>Voiceover + Safari sur osX 10.15.4</li>
              <li>Firefox 79 + NVDA 2020.1 sur Windows 10</li>
              <li>Firefox 79 + Jaws 2019</li>
            </ul>
            <p>Les outils suivants ont été utilisés lors de l’évaluation :</p>
            <ul>
              <li>Color Contrast Analyser</li>
              <li>HeadingsMap</li>
              <li>Web developer</li>
              <li>ARC Toolkit</li>
              <li>Stylus</li>
            </ul>
            <p>Pages du site ayant fait l’objet de la vérification de conformité :</p>
            <ul>
              <li v-for="page in pagesVerified" :key="page.url">
                <a :href="page.url">{{ page.name }}</a>
              </li>
            </ul>

            <h2>Retour d'information et contact</h2>
            <p>
              Si vous n’arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter le
              responsable du site internet pour être orienté vers une alternative accessible ou
              obtenir le contenu sous une autre forme.
            </p>
            <p>
              Contacter :<br />
              <span class="text-bold">
                Ministère de la Transition écologique,<br />
                Direction générale de l’Aménagement, du Logement et de la Nature,<br />
                Direction de l’habitat, de l’urbanisme et des paysages,<br />
                Service DossierFacile </span
              ><br />
              <a href="mailto:contact@dossierfacile.logement.gouv.fr"
                >contact@dossierfacile.logement.gouv.fr</a
              >
            </p>

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
                Contacter le défenseur des droits par téléphone :
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

const REGISTER_URL = import.meta.env.VITE_REGISTER_URL

const nonCompliantCriteria = [
  {
    id: '1.2',
    title:
      'Chaque image de décoration est-elle correctement ignorée par les technologies d’assistance ?'
  },
  {
    id: '1.6',
    title:
      'Chaque image porteuse d’information a-t-elle, si nécessaire, une description détaillée ?'
  },
  {
    id: '3.1',
    title:
      'Dans chaque page web, l’information ne doit pas être donnée uniquement par la couleur. Cette règle est-elle respectée ?'
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
    id: '8.7',
    title:
      'Dans chaque page web, chaque changement de langue est-il indiqué dans le code source (hors cas particuliers) ?'
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
    id: '10.11',
    title:
      'Pour chaque page web, les contenus peuvent-ils être présentés sans avoir recours à la fois à un défilement vertical pour une fenêtre ayant une hauteur de 256px, ou à un défilement horizontal pour une fenêtre ayant une largeur de 320px (hors cas particuliers) ?'
  },
  { id: '11.1', title: 'Chaque champ de formulaire a-t-il une étiquette ?' },
  {
    id: '11.9',
    title:
      'Dans chaque formulaire, l’intitulé de chaque bouton est-il pertinent (hors cas particuliers) ?'
  },
  {
    id: '11.10',
    title:
      'Dans chaque formulaire, le contrôle de saisie est-il utilisé de manière pertinente (hors cas particuliers) ?'
  },
  {
    id: '11.11',
    title:
      'Dans chaque formulaire, le contrôle de saisie est-il accompagné, si nécessaire, de suggestions facilitant la correction des erreurs de saisie ?'
  },
  {
    id: '11.13',
    title:
      'La finalité d’un champ de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l’utilisateur ?'
  },
  {
    id: '12.8',
    title: 'Dans chaque page web, l’ordre de tabulation est-il cohérent ?'
  }
]

const pagesVerified = [
  {
    name: 'Accueil',
    url: 'https://www.dossierfacile.logement.gouv.fr/'
  },
  {
    name: 'Blog',
    url: 'https://www.dossierfacile.logement.gouv.fr/blog'
  },
  {
    name: 'En savoir plus',
    url: 'https://www.dossierfacile.logement.gouv.fr/information/'
  },
  {
    name: 'Mentions légales',
    url: 'https://www.dossierfacile.logement.gouv.fr/mentions-legales/'
  },
  {
    name: 'Contact',
    url: 'https://www.dossierfacile.logement.gouv.fr/contact'
  },
  {
    name: 'Espace Propriétaire',
    url: 'https://proprietaire.dossierfacile.logement.gouv.fr/'
  },
  {
    name: 'Statistiques',
    url: 'https://www.dossierfacile.logement.gouv.fr/stats/'
  },
  {
    name: 'Connexion « Mon dossier »',
    url: REGISTER_URL
  },
  {
    name: 'Locataire',
    url: 'https://locataire.dossierfacile.logement.gouv.fr/nom-locataire'
  },
  {
    name: 'Type locataire',
    url: 'https://locataire.dossierfacile.logement.gouv.fr/type-locataire'
  },
  {
    name: 'Documents locataire',
    url: 'https://locataire.dossierfacile.logement.gouv.fr/documents-locataire/1'
  },
  {
    name: 'Validation dossier',
    url: 'https://locataire.dossierfacile.logement.gouv.fr/validation-dossier'
  },
  {
    name: 'Mon compte Locataire',
    url: 'https://locataire.dossierfacile.logement.gouv.fr/account'
  },
  {
    name: 'Connexion Propriétaire',
    url: 'https://proprietaire.dossierfacile.logement.gouv.fr/login'
  },
  {
    name: 'Ma propriété',
    url: 'https://proprietaire.dossierfacile.logement.gouv.fr/'
  },
  {
    name: 'Mon compte propriétaire : Mes informations personnelles',
    url: 'https://proprietaire.dossierfacile.logement.gouv.fr/proprietaire'
  }
]
</script>

<style scoped lang="scss">
ul {
  margin-bottom: 1em;
}

.align-number {
  font-variant-numeric: tabular-nums;
}
</style>
