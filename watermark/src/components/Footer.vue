<script setup lang="ts"></script>

<template>
  <footer class="fr-footer" role="contentinfo" id="footer" tabindex="-1">
    <div class="fr-container">
      <div class="fr-footer__body">
        <div class="fr-footer__brand">
          <p class="fr-logo">
            république
            <br />française
          </p>
          <img
            src="./../assets/logo-betagouvfr.svg"
            class="fr-footer__logo logo-beta"
            alt="beta.gouv.fr"
          />
        </div>
        <div class="fr-footer__content">
          <p class="fr-footer__content-desc">
            FiligraneFacile est géré par
            <a
              href="https://www.dossierfacile.logement.gouv.fr"
              target="_blank"
              rel="noreferrer noopener"
              >DossierFacile</a
            >, propulsé par la
            <a
              href="https://www.ecologie.gouv.fr/direction-generale-lamenagement-du-logement-et-nature-dgaln"
              title="direction générale de l'aménagement, du logement et de la nature - Nouvelle fenêtre"
              target="_blank"
              rel="noreferrer noopener"
              >direction générale de l'aménagement, du logement et de la
              nature</a
            >.
            <br />
            Le code source est disponible en licence libre.
          </p>
          <ul class="fr-footer__content-list">
            <li class="fr-footer__content-item">
              <a
                class="fr-footer__content-link"
                href="https://legifrance.gouv.fr"
                >legifrance.gouv.fr</a
              >
            </li>
            <li class="fr-footer__content-item">
              <a class="fr-footer__content-link" href="https://gouvernement.fr"
                >gouvernement.fr</a
              >
            </li>
            <li class="fr-footer__content-item">
              <a
                class="fr-footer__content-link"
                href="https://service-public.fr"
                >service-public.fr</a
              >
            </li>
            <li class="fr-footer__content-item">
              <a class="fr-footer__content-link" href="https://data.gouv.fr"
                >data.gouv.fr</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="fr-footer__bottom">
        <ul class="fr-footer__bottom-list">
          <li class="fr-footer__bottom-item">
            <a
              class="fr-footer__bottom-link"
              target="_blank"
              rel="noreferrer"
              href="https://beta.gouv.fr/"
            >
              Les startups d'Etat
            </a>
          </li>
          <li class="fr-footer__bottom-item">
            <a class="fr-footer__bottom-link" href="/accessibilite">
              Accessibilité : non conforme
            </a>
          </li>
          <li class="fr-footer__bottom-item">
            <a class="fr-footer__bottom-link" href="/mentions-legales">
              Mentions légales
            </a>
          </li>
          <li class="fr-footer__bottom-item">
            <a
              class="fr-footer__bottom-link"
              href="/conditions-generales-d-utilisation"
            >
              Conditions Générales d'Utilisation
            </a>
          </li>
          <li class="fr-footer__bottom-item">
            <a
              class="fr-footer__bottom-link"
              target="_blank"
              rel="noreferrer"
              href="https://github.com/MTES-MCT/Dossier-Facile-Frontend"
            >
              Code source
            </a>
          </li>
        </ul>
        <div class="fr-footer__bottom-copy">
          <p>
            Sauf mention contraire, tous les contenus de ce site sont sous
            <a
              href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
              target="_blank"
              >licence etalab-2.0</a
            >
          </p>
        </div>
      </div>
    </div>
    <div class="fr-follow">
      <div class="fr-container">
        <div class="fr-grid-row">
          <div class="fr-col-12">
            <div class="fr-follow__social">
              <h2 class="fr-h5">Suivez-nous sur les réseaux sociaux</h2>
              <ul class="fr-btns-group">
                <li>
                  <a
                    class="fr-btn--twitter fr-btn"
                    title="Suivre Dossier facile sur twitter - Ouvre une nouvelle fenêtre"
                    href="https://twitter.com/dossierfacile/"
                    target="_blank"
                  >
                    Suivre Dossier facile sur twitter
                  </a>
                </li>
                <li>
                  <a
                    class="fr-btn--facebook fr-btn"
                    title="Suivre Dossier facile sur facebook - Ouvre une nouvelle fenêtre"
                    href="https://www.facebook.com/DossierFacile/"
                    target="_blank"
                  >
                    Suivre Dossier facile sur facebook
                  </a>
                </li>
                <li>
                  <a
                    class="fr-btn--linkedin fr-btn"
                    lang="en"
                    title="Suivre Filigrane Facile sur linkedin - Ouvre une nouvelle fenêtre"
                    href="https://www.linkedin.com/company/filigranefacile/"
                    target="_blank"
                  >
                    Suivre Filigrane Facile sur linkedin
                  </a>
                </li>
                <li>
                  <a
                    class="fr-btn--instagram fr-btn"
                    title="Suivre Dossier facile sur instagram - Ouvre une nouvelle fenêtre"
                    href="https://www.instagram.com/dossierfacile/"
                    target="_blank"
                  >
                    Suivre Dossier facile sur instagram
                  </a>
                </li>
                <li>
                  <a
                    class="fr-btn--tiktok fr-btn"
                    title="Suivre Dossier facile sur tiktok - Ouvre une nouvelle fenêtre"
                    href="https://www.tiktok.com/@dossierfacile/"
                    target="_blank"
                  >
                    Suivre Dossier facile sur tiktok
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.logo-beta {
  height: 103px;
  width: 300px;
  margin-left: 50px;
}
</style>
