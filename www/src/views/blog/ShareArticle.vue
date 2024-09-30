<template>
  <div class="fr-share fr-mt-6w">
    <p class="fr-share__title">Partager cet article :</p>
    <ul class="fr-share__group">
      <li>
        <a
          class="fr-share__link fr-share__link--facebook"
          title="Partager sur Facebook - nouvelle fenêtre"
          :href="getFacebookUrl()"
          target="_blank"
          rel="noopener"
        >
          Partager sur Facebook
        </a>
      </li>
      <li>
        <a
          class="fr-share__link fr-share__link--twitter"
          title="Partager sur Twitter - nouvelle fenêtre"
          :href="getTwitterUrl()"
          target="_blank"
          rel="noopener"
        >
          Partager sur Twitter
        </a>
      </li>
      <li>
        <a
          class="fr-share__link fr-share__link--linkedin"
          title="Partager sur LinkedIn - nouvelle fenêtre"
          :href="getLinkedinUrl()"
          target="_blank"
          rel="noopener"
        >
          Partager sur LinkedIn
        </a>
      </li>
      <li>
        <a
          class="fr-share__link fr-share__link--mail"
          :href="getMailtoLink()"
          title="Partager par email"
          target="_blank"
        >
          Partager par email
        </a>
      </li>
      <li>
        <button
          class="fr-share__link fr-share__link--copy"
          title="Copier dans le presse-papier"
          @click="copyToClipboard()"
        >
          Copier dans le presse-papier
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, withDefaults } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue3-toastify'

const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    title: string
    hashtags: string
  }>(),
  {
    hashtags: ''
  }
)

const articleUrl = ref('')
if (typeof window !== 'undefined') {
  articleUrl.value = window.location.href
}

function getFacebookUrl() {
  return `https://www.facebook.com/sharer.php?u=${articleUrl.value}`
}

function getTwitterUrl() {
  const url = encodeURIComponent(articleUrl.value)
  const text = encodeURIComponent(props.title)
  const via = 'DossierFacile'
  const hashtags = encodeURIComponent(props.hashtags)
  return `https://twitter.com/intent/tweet?url=${url}&text=${text}&via=${via}&hashtags=${hashtags}`

  // Texte du tweet généré :
  // {text} {url} #{hashtag} via @{via}
}

function getLinkedinUrl() {
  return `https://www.linkedin.com/shareArticle?url=${articleUrl.value}&title=${props.title}`
}

function getMailtoLink() {
  const subject = encodeURIComponent(props.title)
  const body = encodeURIComponent(
    `Bonjour,\u000aJe vous partage cet article publié sur le blog de DossierFacile :\u000a${articleUrl.value}`
  )
  return `mailto:?subject=${subject}&body=${body}`
}

function copyToClipboard() {
  navigator.clipboard.writeText(articleUrl.value)
  toast.success(t('copy-success'))
}
</script>

<style scoped lang="scss"></style>
