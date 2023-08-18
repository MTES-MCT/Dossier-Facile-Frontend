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

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ShareArticle extends Vue {
  @Prop() public title!: string;
  @Prop({ default: "" }) public hashtags!: string;

  articleUrl = window.location.href;

  getFacebookUrl() {
    return `https://www.facebook.com/sharer.php?u=${this.articleUrl}`;
  }

  getTwitterUrl() {
    const url = encodeURIComponent(this.articleUrl);
    const text = encodeURIComponent(this.title);
    const via = "DossierFacile";
    const hashtags = encodeURIComponent(this.hashtags);
    return `https://twitter.com/intent/tweet?url=${url}&text=${text}&via=${via}&hashtags=${hashtags}`;

    // Texte du tweet généré :
    // {text} {url} #{hashtag} via @{via}
  }

  getLinkedinUrl() {
    return `https://www.linkedin.com/shareArticle?url=${this.articleUrl}&title=${this.title}`;
  }

  getMailtoLink() {
    const subject = encodeURIComponent(this.title);
    const body = encodeURIComponent(
      `Bonjour,\u000aJe vous partage cet article publié sur le blog de DossierFacile :\u000a${this.articleUrl}`
    );
    return `mailto:?subject=${subject}&body=${body}`;
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.articleUrl);
    Vue.toasted.success("Le lien a été copié dans le presse-papier", {
      className: ["success-toast"],
    });
  }
}
</script>

<style scoped lang="scss"></style>