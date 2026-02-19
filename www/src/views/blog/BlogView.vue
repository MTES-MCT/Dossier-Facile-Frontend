<template>
  <section class="blog">
    <h1>{{ t('blog-title') }}</h1>
    <ul>
      <BlogExtractTile
        title="2 millions de comptes créés sur DossierFacile : une nouvelle étape majeure !"
        :image="article29Img"
        publication-date="13 juin 2025"
        path="/blog/2-millions-comptes-dossierfacile"
      >
        DossierFacile franchit un cap symbolique avec plus de 2 millions de comptes créés. Une
        confiance renouvelée dans le service public et une adoption accélérée qui démontrent
        l'efficacité d'une startup d'État au service de l'intérêt général.
      </BlogExtractTile>
      <BlogExtractTile
        title="Étudiant étranger et recherche de logement : guide pratique"
        :image="article24Img"
        publication-date="12 mai 2025"
        path="/blog/etudiant-etranger-logement"
      >
        Guide pratique pour les étudiants étrangers à la recherche d'un logement en France :
        conseils, démarches, solutions pour le garant, prévention des arnaques et aides au logement.
        Simplifiez vos démarches avec DossierFacile.
      </BlogExtractTile>
      <BlogExtractTile
        title="Dossier de location : Comment éviter les arnaques à la location : guide complet pour les propriétaires ?"
        :image="article13Img"
        publication-date="10 avril 2025"
        path="/blog/eviter-les-arnaques-location"
      >
        La location d'un bien immobilier est une excellente manière de générer des revenus, mais
        elle comporte aussi certains risques, notamment celui des arnaques. Faux locataires, faux
        paiements, ou encore escroqueries sur les plateformes de location en ligne
      </BlogExtractTile>
      <BlogExtractTile
        title="Dossier de location : Comment monter son dossier de location en tant qu'auto-entrepreneur ?"
        :image="article19Img"
        publication-date="17 février 2025"
        path="/blog/documents-auto-entrepreneur"
      >
        Être auto-entrepreneur est une aventure excitante, mais cela peut parfois rendre certaines
        démarches, comme louer un logement, un peu plus complexes.
      </BlogExtractTile>
      <BlogExtractTile
        title="Dossier de location : Comment choisir son garant et les documents à fournir pour votre dossier locatif"
        :image="article25Img"
        publication-date="24 décembre 2024"
        path="/blog/documents-garants"
      >
        Guide complet sur les documents à fournir pour le garant de votre dossier de location.
        Découvrez les justificatifs nécessaires pour constituer un dossier locataire solide avec
        garant, que ce soit pour une personne physique, Visale ou une entreprise.
      </BlogExtractTile>
      <BlogExtractTile
        title="Guide étape par étape pour trouver un appartement idéal"
        :image="article24Img"
        publication-date="27 septembre 2024"
        path="/blog/guide-etape-par-etape-pour-trouver-appartement-ideal"
      >
        Trouver un appartement idéal n'est pas facile. Il faut chercher, comparer, visiter,
        négocier... Heureusement, nous avons créé un guide étape par étape pour vous simplifier la
        vie. Quel que soit votre profil, vous y trouverez des conseils utiles, des astuces et des
        exemples. Suivez le guide !
      </BlogExtractTile>
      <BlogExtractTile
        title="[Propriétaires] Comment détecter une fausse fiche de paie ?"
        :image="article23Img"
        publication-date="19 Avril 2024"
        path="/blog/proprietaire-comment-detecter-fausse-fiche-paie"
      >
        Dans le monde de l'immobilier locatif, la vérification des fiches de paie est une étape
        cruciale pour les propriétaires et les agences immobilières afin d'évaluer la solvabilité
        des locataires potentiels. Cependant, avec l'augmentation des tentatives de fraude, la
        détection des fausses fiches de paie est devenue une compétence essentielle pour assurer des
        locations transparentes. Dans cet article, nous allons explorer des techniques pour repérer
        les signes de potentielles falsifications.
      </BlogExtractTile>
      <BlogExtractTile
        title="DossierFacile.fr devient enfin DossierFacile.logement.gouv.fr !"
        :image="article22Img"
        publication-date="11 Octobre 2023"
        path="/blog/dossierfacile-devient-dossierfacile-logement-gouv-fr"
      >
        DossierFacile est donc enfin accessible depuis l’URL DossierFacile.logement.gouv.fr, une
        adresse qui reflète mieux notre mission de service public
      </BlogExtractTile>
      <BlogExtractTile
        title="Le Guide Complet des Aides pour les Étudiant·e·s en Recherche de Logements en France"
        :image="article21Img"
        publication-date="21 Septembre 2023"
        path="/blog/guide-aide-etudiant-logement"
      >
        La recherche d'un logement constitue l'une des étapes cruciales de votre parcours
        universitaire. Chez DossierFacile, nous en avons conscience et nous sommes dévoués à vous
        faciliter cette démarche. Voici un guide exhaustif des aides publiques (État, collectivités,
        autres organismes publics) disponibles en France pour t’accompagner dans ta quête de
        logement.
      </BlogExtractTile>
      <BlogExtractTile
        title="DossierFacile lance FiligraneFacile, le service permettant d’ajouter un filigrane à n’importe quel document !"
        :image="article20Img"
        publication-date="10 Août 2023"
        path="/blog/dossierfacile-lance-filigrane-facile"
      >
        Logement, travail, assurance... Nous envoyons tous les jours des documents personnels dans
        la nature, sans les protéger. Tombés entre de mauvaises mains, ces documents peuvent servir
        à usurper notre identité, et on a vite fait de se retrouver avec des crédits dans tous les
        sens qu'on n’a jamais contractés.
      </BlogExtractTile>
      <BlogExtractTile
        title="Tout ce que vous devez savoir avant de quitter votre logement"
        :image="article19Img"
        publication-date="31 Mai 2023"
        path="/blog/tout-ce-que-vous-devez-savoir-avant-de-quitter-votre-logement"
      >
        Déménager, c’est souvent le parcours du combattant, entre les recherches de logement, la
        résiliation du bail, les démarches administratives… Alors pour éviter le stress et les
        déconvenues, nous vous avons préparé un petit récapitulatif des étapes, pour ne rien
        oublier. Suivez le guide !
      </BlogExtractTile>
      <BlogExtractTile
        title="Un garant ? Qui ? Comment ? Pourquoi ?  "
        :image="article18Img"
        publication-date="9 Mai 2023"
        path="/blog/un-garant-qui-comment-pourquoi"
      >
        Dans la constitution d’un dossier de location, le choix d’un garant fait souvent figure de
        passage obligé. Qui peut se porter garant ? Qu’est-ce qu’une garantie de loyer impayé ?
        Comment faire pour l’intégrer à son dossier de location ? Découvrez nos réponses à toutes
        vos questions.
      </BlogExtractTile>
      <BlogExtractTile
        title="Que vérifier lors de la visite d'un logement ?"
        :image="article17Img"
        publication-date="25 Avril 2023"
        path="/blog/que-verifier-lors-de-la-visite-d-un-logement"
      >
        Lorsque vous voulez emménager dans un nouveau logement, il y a de nombreuses choses à
        vérifier lors de la visite d’un bien. Au premier coup d'œil, le bien à louer peut sembler
        parfait, cependant il est important de prêter attention aux points suivants...
      </BlogExtractTile>
      <BlogExtractTile
        title="Passoires thermiques : top départ du gel des loyers"
        :image="article15Img"
        publication-date="5 janvier 2023"
        path="/blog/passoires-thermiques-top-depart-du-gel-des-loyers"
      >
        Depuis le 24 août 2022, les propriétaires bailleurs de logements classés F et G
        (consommation énergétique comprise entre 331 et 420 kWh/m²/an pour les F, et au-dessus pour
        les G) communément appelés
        <span class="fr-text--bold">« passoires énergétiques »</span>, sont désormais obligés de
        réaliser des travaux s’ils veulent augmenter les loyers à la signature d’un nouveau bail,
        lors du renouvellement du bail ou dans le cadre d’une révision annuelle même prévue au
        contrat...
      </BlogExtractTile>
      <BlogExtractTile
        title="DossierFacile engagé dans la protection de vos données personnelles"
        :image="article14Img"
        publication-date="24 octobre 2022"
        path="/blog/engage-dans-la-protection-de-vos-donnees-personnelles"
      >
        <p>
          Une « donnée personnelle » désigne « toute information se rapportant à une personne
          physique identifiée ou identifiable ». Par exemple :
        </p>
        <ul>
          <li>un nom et prénom</li>
          <li>un identifiant (numéro client, numéro de téléphone...)</li>
          <li>une caractéristique (sexe, âge, revenu, état de santé...)</li>
        </ul>
      </BlogExtractTile>
      <BlogExtractTile
        title="L’usurpation d’identité en France : comment la prévenir et comment agir ?"
        :image="article13Img"
        publication-date="1 Juin 2022"
        path="/blog/usurpation-d-identite-en-france-comment-prevenir-agir"
      >
        L’usurpation d’identité consiste à utiliser, sans votre accord, des informations permettant
        de vous identifier. Il peut s'agir, par exemple, de vos nom et prénom, de votre adresse
        électronique, ou encore de photographies. C’est un problème qui touche plusieurs centaines
        de milliers de Français chaque année pour un total de 474 millions d’euros extorqués...
      </BlogExtractTile>
      <BlogExtractTile
        title="Au secours, mon ascenseur est en panne ! Les droits du locataire en copropriété"
        :image="article12Img"
        publication-date="14 Avril 2022"
        path="/blog/au-secours-mon-ascenceur-est-en-panne"
      >
        Vous vivez au 6e étage de l’immeuble et l’ascenseur est en panne depuis plusieurs mois ?
        Petit rappel : la vie en copropriété réunit plusieurs types d'intervenants : les occupants,
        propriétaires ou locataires, le conseil syndical, composé de copropriétaires et le syndic,
        chargé d'assurer la bonne gestion de l'ensemble.
      </BlogExtractTile>
      <BlogExtractTile
        title="La caution locative : changements en vue pour 2022"
        :image="article11Img"
        publication-date="14 Mars 2022"
        path="/blog/la-caution-locative-changement-en-vue-pour-2022"
      >
        La caution est une personne ou un organisme qui s'engage par écrit, à travers un acte de
        cautionnement, à payer votre loyer si vous ne le faites pas. Il s’agit le plus souvent d’un
        parent ou d’un proche. Si la caution ne rembourse pas les dettes locatives...
      </BlogExtractTile>
      <BlogExtractTile
        title="Quand les journalistes parlent de DossierFacile"
        :image="article10Img"
        publication-date="14 Février 2022"
        path="/blog/quand-les-journalistes-parlent-de-dossierfacile"
      >
        Constituer son dossier de location est une étape indispensable pour trouver le logement de
        ses rêves et pourtant c’est un parcours semé d’embûches ! DossierFacile est le service
        public numérique gratuit et indispensable pour constituer et partager sereinement son
        dossier. En pleine croissance, le service a fait l’objet de nombreux articles. Revue de
        presse.
      </BlogExtractTile>
      <BlogExtractTile
        title="Le loyer : tout ce qu’il faut savoir quand on est locataire ou bailleur"
        :image="article9Img"
        publication-date="29 Novembre 2021"
        path="/blog/loyer-locataire-ou-bailleur"
      >
        Le montant du loyer d'un logement, qu’il soit loué vide ou meublé, est en principe fixé
        librement par le propriétaire.
        <br class="fr-mb-3w" />
        Toutefois, les communes situées en zone tendue sont soumises à l'encadrement des loyers.
        Dans ces villes, le loyer est plafonné lors de la mise en location du logement (cas d'un
        nouveau locataire) et lors du renouvellement du bail (cas du même locataire).
      </BlogExtractTile>
      <BlogExtractTile
        title="Comment justifier son domicile"
        :image="article8Img"
        publication-date="02 Juin 2021"
        path="/blog/comment-justifier-son-domicile"
      >
        Dans un article précédent, nous avons vu les pièces nécessaires à la constitution d’un
        dossier de location, mais l’une d’entre elles est plus compliquée à fournir car elle varie
        d’un candidat l’autre : le justificatif de domicile. On peut distinguer
        <b>quatre cas</b> « classiques » mais il en existe en fait bien plus… Chez DossierFacile,
        nous vous faisons la promesse que quelle que soit votre situation, nous vous aiderons à
        aller au bout !
      </BlogExtractTile>
      <BlogExtractTile
        title="Tout comprendre à la vie en colocation"
        :image="article7Img"
        publication-date="03 Mai 2021"
        path="/blog/tout-comprendre-a-la-vie-en-colocation"
      >
        Devant la hausse des loyers, de nombreux locataires choisissent aujourd'hui de partager un
        logement afin de diviser le coût de la location. Pour le bailleur, la colocation permet de
        louer plus facilement un grand logement et de bénéficier d’une solidarité entre les
        locataires.
        <br class="fr-mb-3w" />
        Que ce soit entre amis, en famille ou bien avec des inconnus, la colocation obéit toutefois
        à de nombreuses règles que nous allons vous présenter.
      </BlogExtractTile>
      <BlogExtractTile
        title="DossierFacile fait peau neuve"
        :image="article6Img"
        publication-date="06 Avril 2021"
        path="/blog/dossierfacile-fait-peau-neuve"
      >
        Afin de mieux répondre aux besoins de nos locataires et propriétaires, le service
        DossierFacile fait peau neuve avec un nouveau site ! Un parcours utilisateur plus simple, un
        design plus recherché, une visualisation plus claire… Le tout pour un service toujours plus
        efficace ! On est très fiers de vous présenter le nouveau DossierFacile ! Notre objectif ?
        Faciliter le téléchargement de vos pièces justificatives : un gain de temps pour vous, pour
        nous, et pour votre futur propriétaire !
      </BlogExtractTile>
      <BlogExtractTile
        title="5 conseils pour trouver l’appartement de ses rêves en région parisienne (ou ailleurs…)"
        :image="article5Img"
        publication-date="30 Mars 2021"
        path="/blog/5-conseils-pour-trouver-l-appartement-de-ses-reves-en-region-parisienne"
      >
        Trouver l’appartement de ses rêves à Paris ou en région parisienne est un vrai défi : la
        capitale est pleine de charme, et par conséquent... très attractive. De plus en plus de
        personnes souhaitent s’installer à Paris, et l’offre y est rare, rendant difficile la
        recherche d’un appartement à louer (ou même à acheter). Dans cet article, les équipes de
        DossierFacile te livrent leurs cinq conseils pour trouver l’appartement parisien de vos
        rêves.
      </BlogExtractTile>
      <BlogExtractTile
        title="5 astuces pour booster votre dossier de location"
        :image="article4Img"
        publication-date="25 Mars 2021"
        path="/blog/5-astuces-pour-booster-votre-dossier-de-location"
      >
        En pleine crise sanitaire, il est encore plus difficile que d’habitude de trouver un
        logement de location. Pour se distinguer des autres, un seul moyen : constituer un dossier
        de location clair, cohérent et complet. En effet, c’est par le dossier de location que le
        propriétaire prend connaissance des informations qui vous sont relatives. C’est le seul
        moyen pour lui de comparer les différents candidats. Alors voici 5 astuces pour booster
        votre dossier de location.
      </BlogExtractTile>
      <BlogExtractTile
        title="Pourquoi Dossier Facile est-il gratuit ?"
        :image="article3Img"
        publication-date="21 Juillet 2020"
        path="/blog/pourquoi-dossierfacile-est-il-gratuit"
      >
        Dossier facile est une start-up qui propose une solution simple et gratuite pour remettre la
        confiance au cœur du processus de location : un dossier labélisé, propre et clair, transmis
        sous la forme efficace d’un lien numérique. Cependant, efficacité et gratuité vont rarement
        de pair. Alors pourquoi votre dossier de location est-il gratuit ?
      </BlogExtractTile>
      <BlogExtractTile
        title="Constituer votre Dossier Facile"
        :image="article2Img"
        publication-date="12 Décembre 2019"
        path="/blog/constituer-votre-dossierFacile"
      >
        Dans un contexte de pénurie de logements, le dossier de location est devenu un facteur
        démarquant. Mais comment constituer un dossier de location qui regroupe tous les documents
        nécessaires sans tomber dans le désordre d’un pdf de cinquante pages ? Existe-t-il un outil
        facile et gratuit ?
      </BlogExtractTile>
      <BlogExtractTile
        title="Quelles pièces justificatives fournir pour mon dossier de location ?"
        :image="article1Img"
        publication-date="14 Novembre 2019"
        path="/blog/quelles-pieces-justificatives-fournir-pour-mon-dossier-de-location"
      >
        A cause de l’augmentation de la demande immobilière, il devient de plus en plus difficile de
        trouver un bon appartement à louer. Dans cette recherche, le dossier est un facteur
        démarquant. Comment constituer mon dossier de location ? Que peut demander le propriétaire ?
        Bien que la loi encadre ces pratiques, un grand flou règne encore souvent autour des
        éléments qu’il faut fournir pour avoir un dossier de location complet, clair et cohérent.
      </BlogExtractTile>
      <BlogExtractTile
        title="Créez votre dossier de location en ligne avec DossierFacile"
        :image="article0Img"
        publication-date="21 mars 2019"
        path="/blog/locatio-devient-dossier-facile"
      >
        Votre dossier locatif numérique certifié par l'État, anciennement Locatio
        <br class="fr-mb-3w" />
        Grâce à DossierFacile, ex-Locatio, vous pouvez monter facilement et gratuitement votre
        dossier de location en ligne.
      </BlogExtractTile>
    </ul>
  </section>
</template>

<script setup lang="ts">
import BlogExtractTile from './BlogExtractTile.vue'
import { useI18n } from 'vue-i18n'
import article0Img from '../../assets/cover-features.webp'
import article1Img from '@images/blog-article.webp'
import article2Img from '@images/blog-article2.webp'
import article3Img from '@images/blog-article3.webp'
import article4Img from '@images/blog-article4.webp'
import article5Img from '@images/blog-article5.webp'
import article6Img from '@images/blog-article6.webp'
import article7Img from '@images/blog-article7.webp'
import article8Img from '@images/blog-article8.webp'
import article9Img from '@images/blog-article9.webp'
import article10Img from '@images/blog-article10.webp'
import article11Img from '@images/blog-article11.webp'
import article12Img from '@images/blog-article12.webp'
import article13Img from '@images/blog-article13.webp'
import article14Img from '@images/blog-article14.webp'
import article15Img from '@images/blog-article15.webp'
import article17Img from '@images/blog-article17.webp'
import article18Img from '@images/blog-article18.webp'
import article19Img from '@images/blog-article19.webp'
import article20Img from '@images/blog-article20.webp'
import article21Img from '@images/blog-article21.webp'
import article22Img from '@images/blog-article22.webp'
import article23Img from '@images/blog-article23.webp'
import article24Img from '@images/blog-article24.webp'
import article25Img from '@images/blog-article25.webp'
import article29Img from '@images/blog-article29.png'

import { useSeoMeta } from '@unhead/vue'

useSeoMeta({
  title: 'Le blog de DossierFacile',
  description:
    'Venez découvrir nos articles de blog pour vous éclairer sur les points d’éventuelle difficulté que vous rencontrez en créant votre dossier de location'
})

const { t } = useI18n()
</script>

<style scoped>
.blog {
  margin-top: 3.5rem;
  margin-inline: auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  max-width: 78rem;
  @media (min-width: 576px) {
    padding-inline: 1rem;
  }
}

.blog h1 {
  @media (max-width: 575px) {
    padding-inline: 1rem;
  }
}

.blog > ul {
  list-style: none;
  padding: 0;
}
</style>
