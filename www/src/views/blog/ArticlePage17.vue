<template>
  <BlogArticle title="Que vérifier lors de la visite d'un logement ?" date="25 Avril 2023">
    <p>
      Lorsque vous voulez emménager dans un nouveau logement, il y a de nombreuses choses à vérifier
      lors de la visite d’un bien. Au premier coup d'œil, le bien à louer peut sembler parfait,
      cependant il est important de prêter attention aux points suivants :
    </p>
    <BlogPostImage :src="image" />

    <ol>
      <li>
        <h2 class="fr-h6">Le quartier</h2>
        <p>
          Avant la visite, faites un tour dans le quartier pour évaluer d’éventuelles nuisances
          sonores, telles que les commerces et les routes passantes.
        </p>
      </li>

      <li>
        <h2 class="fr-h6">L'isolation phonique et thermique</h2>
        <p>
          Il est essentiel de contrôler l'isolation phonique et thermique du logement. N'hésitez pas
          à demander le DPE (Diagnostic de Performance Énergétique) pour savoir si le logement est
          une passoire thermique, car
          <a href="/blog/passoires-thermiques-top-depart-du-gel-des-loyers"
            >à partir de 2023, ces derniers ne pourront plus être loués</a
          >.
        </p>
      </li>

      <li>
        <h2 class="fr-h6">Les équipements</h2>
        <p>
          Demandez si l'électricité, l'eau chaude et le chauffage sont compris dans le loyer. Vous
          pouvez également demander les anciennes factures du précédent locataire pour vous faire
          une idée plus précise. N'oubliez pas de demander comment le lieu est chauffé (électrique,
          gaz, fioul) et si le chauffage est collectif ou non. Concernant l'eau chaude et la
          pression de l'eau, vous pouvez ouvrir plusieurs robinets simultanément afin de vérifier le
          bon débit et le bon fonctionnement de l'eau chaude.
        </p>
      </li>

      <li>
        <h2 class="fr-h6">L'état général du logement</h2>
        <p>
          Assurez-vous qu'il n'y a pas de moisissures apparentes, signe d'une mauvaise ventilation.
          Pour vérifier l'insonorisation du bien, essayez de le visiter en fin de journée, quand il
          y a le plus de monde présent dans l'immeuble.
        </p>
      </li>

      <li>
        <h2 class="fr-h6">Les conditions de location</h2>
        <p>
          Vérifiez si le logement est loué meublé ou non meublé, ainsi que si les animaux sont
          acceptés et, le cas échéant, lesquels. Renseignez-vous également sur la présence d'une
          place de stationnement privée.
        </p>
      </li>

      <li>
        <h2 class="fr-h6">Le montant des charges</h2>
        <p>
          Demandez le montant des charges afin d'évaluer au mieux le coût total de votre futur
          logement et d'éviter les mauvaises surprises.
        </p>
      </li>
    </ol>

    <p>
      Enfin, si vous êtes éligible aux APL (Aides Personnalisées au Logement), n'hésitez pas à
      demander si le logement est conventionné, ce qui vous permettra de les toucher.
    </p>

    <p>
      <b>Astuce :</b> Préparez vos questions en amont de la visite du logement afin d'être certain
      de ne rien oublier.
    </p>

    <p>
      En suivant ces conseils, vous pourrez trouver un logement qui répond à vos besoins et à vos
      attentes. Bonne visite !
    </p>
  </BlogArticle>
</template>

<script setup lang="ts">
import BlogArticle from '@/views/blog/BlogArticle.vue'
import { useSeoMeta } from '@unhead/vue'
import image from '@images/blog-article17.webp'
import BlogPostImage from '@/components/BlogPostImage.vue'

const title = "Que vérifier lors de la visite d'un logement ?"
const description =
  'Lorsque vous voulez emménager dans un nouveau logement, il y a de nombreuses choses à vérifier lors de la visite d’un bien.'
const siteTitle = import.meta.env.VITE_SITE_TITLE
const seoTitle = `${title} - ${siteTitle}`

useSeoMeta({
  title: title,
  description: description,
  ogTitle: seoTitle,
  ogImage: image,
  ogDescription: description,
  twitterTitle: seoTitle,
  twitterImage: image,
  twitterDescription: description
})
</script>
