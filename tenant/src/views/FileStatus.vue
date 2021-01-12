<template>
  <div>
    <div layout:fragment="content" th:remove="tag">
      <div class="main-container">
        <section class="text-center pt-5">
          <div class="container pt-4">
            <div class="row">
              <div class="col-md-10 col-lg-8">
                <h1>{{ $t("title") }}</h1>
                <h5 class="w-60 mx-auto font-weight-normal text-lead-color">
                  Votre lien sera généré dès que votre dossier sera validé. Vous
                  êtes actuellement à l'étape TODO

                    <span v-if="user.status === 'TO_PROCESS'"> dossier complété. </span>
                    <span v-if="user.status === 'VALIDATED'"> dossier validé. </span>
                    <span v-if="user.status === 'DECLINED'"> dossier étudié. </span>
                    <span v-if="!user.status || user.status === 'INCOMPLETE'"> dossier créé. </span>
                </h5>

                <div class="mt-5">
                  <span>{{ $t('subtitle', [user.firstName, user.lastName, user.situation+'TODO', user.salary+'TODO'])}}</span>
                  <router-link to="/profile"> (Modifier)</router-link><br />
                  <span>{{ $t('last-update', [user.lastUpdate])}}TODO</span>
                </div>
                <div
                  class="d-flex flex-column"
                  v-if="user.status == 'VALIDATED'"
                >
                  <div class="mt-5 modal-instance">
                    <div class="modal-trigger">
                      <a
                        class="btn btn--primary type--uppercase"
                        href="#"
                        v-if="user.appartmentSharing.status === 'VALIDATED'"
                      >
                        <span class="btn__text"> envoyer mon dossier </span>
                      </a>
                    </div>
                    <div>
                      <a
                        class="btn btn--primary type--uppercase"
                        data-tooltip="Pour envoyer votre lien-dossier, tous les comptes de votre colocation doivent être validés"
                        v-if="user.appartmentSharing.status !== 'VALIDATED'"
                      >
                        <span class="btn__text"> envoyer mon dossier </span>
                      </a>
                    </div>

                    <div class="modal-container" id="dossier-modal">
                      <div class="modal-content" data-width="80%">
                        <div class="boxed boxed--lg">
                          <h2>
                            Mon lien dossier :
                            <b class="text-lead-color">
                              <span>{{ getFileLink() }}</span>
                            </b>
                          </h2>
                          <hr class="short" />
                          <p class="lead pr-5">
                            Copiez votre lien dossier unique et envoyez-le à
                            votre propriétaire pour lui donner accès à
                            l'ensemble des pièces de votre dossier.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mt-3 modal-instance">
                    <div class="modal-trigger">
                      <a
                        class="font-weight-normal"
                        href="#"
                        v-if="user.appartmentSharing.status === 'VALIDATED'"
                      >
                        envoyer mon lien synthèse
                      </a>
                    </div>
                    <div>
                      <a
                        class="font-weight-normal text-primary"
                        data-tooltip="Pour envoyer votre lien-dossier, tous les comptes de votre colocation doivent être validés"
                        v-if="user.appartmentSharing.status !== 'VALIDATED'"
                      >
                        envoyer mon lien synthèse
                      </a>
                    </div>

                    <div class="modal-container" id="synthese-modal">
                      <div class="modal-content" data-width="80%">
                        <div class="boxed boxed--lg">
                          <h2>
                            Mon lien-synthèse :
                            <b class="text-lead-color">
                              <span>{{ getPublicFileLink() }}</span>
                            </b>
                          </h2>
                          <hr class="short" />
                          <p class="lead pr-5">
                            Contactez votre propriétaire en ajoutant votre
                            lien-synthèse unique et augmentez de 25% vos chances
                            d'obtenir une visite pour l'appartement de vos rêves
                            !
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mt-4 w-75 mx-auto">
                    <p>
                      En envoyant votre dossier vous donnez accès au
                      propriétaire à l'intégralité de votre dossier. En envoyant
                      une synthèse vous donnez accès à votre nom, votre prénom
                      et au montant total des revenus mensuels. Le propriétaire
                      n'aura pas accès aux pièces de votre dossier, mais la
                      mention DossierFacile lui indiquera que votre dossier est
                      complet et en ordre ! os
                    </p>
                  </div>
                </div>
                <div class="boxed-warning" v-if="oldUpdateDocument()">
                  <h4>Attention</h4>
                  <p>
                    Vous avez mis à jour votre dossier pour la dernière fois le
                    <span>{{ user.lastUpdate }} TODO"</span
                    >. Afin qu'il reste! <b>convaincant</b>, il est important de
                    <b>maintenir à jour vos justificatifs</b>.<br />
                    <a href="#suivi-dossier">Je mets à jour mes documents</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div class="container">
            <div class="process-2 row">
              <div class="col-md-3">
                <div
                  class="process__item"
                  :class="{'process__item_active': user.status === 'INCOMPLETE' }"
                >
                  <h5>Dossier créé</h5>
                  <p>
                    Votre dossier a été créé, merci de faire confiance à
                    DossierFacile ! Maintenant, il vous reste encore à ajouter
                    toutes vos pièces.
                  </p>
                </div>
              </div>
              <div class="col-md-3">
                <div
                  class="process__item"
                  :class="{'process__item_active': user.status === 'TO_PROCESS'}"
                >
                  <h5>Dossier complété</h5>
                  <p>
                    Votre dossier est complet, merci pour votre efficacité ! Il
                    va maintenant passer par la série de tests DossierFacile...
                  </p>
                </div>
              </div>
              <div class="col-md-3">
                <div
                  class="process__item"
                  :class="{'process__item_active': user.status === 'DECLINED'}"
                >
                  <h5>Dossier étudié</h5>
                  <p>
                    Votre dossier est actuellement à l'étude. Pour correspondre
                    avec les équipes DossierFacile n'oubliez pas d'aller
                    regarder votre onglet "messagerie" !
                  </p>
                </div>
              </div>
              <div class="col-md-3">
                <div
                  class="process__item"
                  :class="{'process__item_active': user.status === 'VALIDATED'}"
                >
                  <h5>Dossier validé</h5>
                  <p>
                    Super, votre dossier est à présent validé ! Maintenant vous
                    pouvez envoyer vos liens en toute sécurité : nous vous
                    souhaitons bon courage pour vos recherches !
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="text-center">
          <div class="bg--secondary">
            <div class="container">
              <div class="row">
                <div class="col-md-9 col-lg-7">
                  <h2 id="mes-pieces" style="margin-top: 50px">
                    Les pièces de mon dossier
                  </h2>
                  <p>Pour bien comprendre...</p>
                </div>
              </div>
              <div class="row mt-5 text-left">
                <div class="col-md-12 col-lg-12">
                  <div class="row">
                    <div
                      class="col-md-4"
                      data-container="body"
                      data-content="Votre pièce a été validée ! Si vous la modifiez, elle ne le sera plus et sera soumise à nouveau à nos équipes de validation"
                      data-placement="top"
                      data-toggle="popover"
                      data-trigger="hover"
                    >
                      <div class="feature feature-2 boxed boxed--border">
                        <i class="icon icon-Yes text-success"></i>
                        <div class="feature__body">
                          <p>
                            Votre pièce est validée ! Plus besoin d’y toucher
                          </p>
                        </div>
                      </div>
                      <!--end feature-->
                    </div>
                    <div
                      class="col-md-4"
                      data-container="body"
                      data-content="Votre pièce a bien été modifiée : elle sera traitée très bientôt par nos équipes"
                      data-placement="top"
                      data-toggle="popover"
                      data-trigger="hover"
                    >
                      <div class="feature feature-2 boxed boxed--border">
                        <i class="icon icon-Hour text-warning"></i>
                        <div class="feature__body">
                          <p>
                            Nous sommes en cours de traitement de cette pièce
                          </p>
                        </div>
                      </div>
                      <!--end feature-->
                    </div>
                    <div
                      class="col-md-4"
                      data-container="body"
                      data-content="Regardez ci-dessous pour voir quelles pièces ont été refusées et doivent être modifiées"
                      data-placement="top"
                      data-toggle="popover"
                      data-trigger="hover"
                    >
                      <div class="feature feature-2 boxed boxed--border">
                        <i class="icon icon-Close text-danger"></i>
                        <div class="feature__body">
                          <p>
                            Vous devez modifier votre pièce afin que nous
                            validions votre dossier
                          </p>
                        </div>
                      </div>
                      <!--end feature-->
                    </div>
                    <div
                      class="col-md-12 text-center"
                      style="margin-bottom: 25px"
                    >
                      <p>
                        Je modifie les pièces de mon dossier pour être sûr de
                        mettre toutes les chances de mon côté !
                      </p>
                    </div>
                    <div class="col-md-4">
                      <div
                        class="feature feature-4 boxed boxed--lg boxed--border"
                      >
                        <i class="icon icon-Male"></i>
                        <div
                          th:replace="include/file-status-profile:: status(1)"
                        ></div>
                        <h4>Votre pièce en cours de validité</h4>
                        <hr />
                        <div
                          th:replace="include/file-status-profile:: file-message(1)"
                        ></div>

                        <a
                          class="btn btn--secondary view-file"
                          id="link-file-1"
                          target="_blank"
                          th:href="${tenant.getUpload1Route()}"
                        >
                          <span class="btn__text">Voir </span>
                        </a>
                        <a
                          class="btn btn--primary"
                          data-id="1"
                          href="#"
                          th:classappend="${tenant.isValidated()?'modal-tenant-validated-button':'modal-file-button'}"
                          title="Attention ! Si vous modifiez une pièce déjà validée, votre dossier sera réétudié…"
                        >
                          <span class="btn__text">Modifier </span>
                        </a>
                      </div>
                      <!--end feature-->
                      <div
                        class="progress-horizontal progress-horizontal--sm mb-5 hidden"
                        id="progress1"
                      >
                        <div
                          class="progress-horizontal__bar"
                          data-value="0"
                          id="progressBar1"
                        ></div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div
                        class="feature feature-4 boxed boxed--lg boxed--border"
                      >
                        <i class="icon icon-Warehouse"></i>
                        <div
                          th:replace="include/file-status-profile:: status(2)"
                        ></div>
                        <h4>Votre justificatif de domicile</h4>
                        <hr />
                        <div
                          th:replace="include/file-status-profile:: file-message(2)"
                        ></div>

                        <a
                          class="btn btn--secondary view-file"
                          id="link-file-2"
                          target="_blank"
                          th:href="${tenant.getUpload2Route()}"
                        >
                          <span class="btn__text">Voir </span>
                        </a>
                        <a
                          class="btn btn--primary"
                          data-id="2"
                          href="#"
                          th:classappend="${tenant.isValidated()?'modal-tenant-validated-button':'modal-file-button'}"
                          title="Attention ! Si vous modifiez une pièce déjà validée, votre dossier sera réétudié…"
                        >
                          <span class="btn__text">Modifier </span>
                        </a>
                      </div>
                      <!--end feature-->
                      <div
                        class="progress-horizontal progress-horizontal--sm mb-5 hidden"
                        id="progress2"
                      >
                        <div
                          class="progress-horizontal__bar"
                          data-value="0"
                          id="progressBar2"
                        ></div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div
                        class="feature feature-4 boxed boxed--lg boxed--border"
                      >
                        <i class="icon icon-File"></i>
                        <div
                          th:replace="include/file-status-profile:: status(3)"
                        ></div>
                        <h4>Votre justificatif de situation professionnelle</h4>
                        <hr />
                        <div
                          th:replace="include/file-status-profile:: file-message(3)"
                        ></div>

                        <a
                          class="btn btn--secondary view-file"
                          id="link-file-3"
                          target="_blank"
                          th:href="${tenant.getUpload3Route()}"
                        >
                          <span class="btn__text">Voir </span>
                        </a>
                        <a
                          class="btn btn--primary"
                          data-id="3"
                          href="#"
                          th:classappend="${tenant.isValidated()?'modal-tenant-validated-button':'modal-file-button'}"
                          title="Attention ! Si vous modifiez une pièce déjà validée, votre dossier sera réétudié…"
                        >
                          <span class="btn__text">Modifier </span>
                        </a>
                      </div>
                      <!--end feature-->
                      <div
                        class="progress-horizontal progress-horizontal--sm mb-5 hidden"
                        id="progress3"
                      >
                        <div
                          class="progress-horizontal__bar"
                          data-value="0"
                          id="progressBar3"
                        ></div>
                      </div>
                    </div>
                    <div
                      class="col-md-4"
                      v-if="!isStudent()"
                    >
                      <div
                        class="feature feature-4 boxed boxed--lg boxed--border"
                      >
                        <i class="icon icon-Folder-WithDocument"></i>
<!--                        TODO <div
                          th:replace="include/file-status-profile:: status(4)"
                        ></div> -->
                        <h4>Votre avis d’imposition</h4>
                        <hr />
<!--                       TODO  <div
                          th:replace="include/file-status-profile:: file-message(4)"
                        ></div> -->

                        <a
                          class="btn btn--secondary view-file"
                          id="link-file-4"
                          target="_blank"
                          th:href="${tenant.getUpload4Route()}"
                        >
                          <span class="btn__text">Voir </span>
                        </a>
                        <a
                          class="btn btn--primary"
                          data-id="4"
                          href="#"
                          th:classappend="${tenant.isValidated()?'modal-tenant-validated-button':'modal-file-button'}"
                          title="Attention ! Si vous modifiez une pièce déjà validée, votre dossier sera réétudié…"
                        >
                          <span class="btn__text">Modifier </span>
                        </a>
                      </div>
                      <!--end feature-->
                      <div
                        class="progress-horizontal progress-horizontal--sm mb-5 hidden"
                        id="progress4"
                      >
                        <div
                          class="progress-horizontal__bar"
                          data-value="0"
                          id="progressBar4"
                        ></div>
                      </div>
                    </div>
                    <div class="col-md-4" th:if="${tenant.getSalary()==0}">
                      <div
                        class="feature feature-4 boxed boxed--lg boxed--border"
                      >
                        <i
                          class="icon icon-Money-Bag opacity-disabled-file4-without-salary"
                        ></i>
                        <span
                          class="cursor-pointer material-icons md-48 pull-right"
                          data-container="body"
                          data-content="Vous avez indiqué ne pas percevoir de revenus, vous n’avez donc pas de justificatif de ressources à fournir"
                          data-placement="right"
                          data-toggle="popover"
                          data-trigger="hover"
                          >help</span
                        >
                        <h4 class="opacity-disabled-file4-without-salary">
                          Votre justificatif de ressources
                        </h4>
                        <hr />
                        <a
                          class="btn btn--secondary view-file4-without-salary disabled"
                        >
                          <span class="btn__text">Voir </span>
                        </a>
                        <a
                          class="btn btn--primary button-file4-without-salary disabled"
                        >
                          <span class="btn__text">Modifier </span>
                        </a>
                      </div>
                    </div>
                    <div class="col-md-4" th:if="${tenant.getSalary()!=0}">
                      <div
                        class="feature feature-4 boxed boxed--lg boxed--border"
                      >
                        <i class="icon icon-Money-Bag"></i>
                        <div
                          th:replace="include/file-status-profile:: status(5)"
                        ></div>
                        <h4>Votre justificatif de ressources</h4>
                        <hr />
                        <div
                          th:replace="include/file-status-profile:: file-message(5)"
                        ></div>

                        <a
                          class="btn btn--secondary view-file"
                          id="link-file-5"
                          target="_blank"
                          th:href="${tenant.getUpload5Route()}"
                        >
                          <span class="btn__text">Voir </span>
                        </a>
                        <a
                          class="btn btn--primary"
                          data-id="5"
                          href="#"
                          th:classappend="${tenant.isValidated()?'modal-tenant-validated-button':'modal-file-button'}"
                          title="Attention ! Si vous modifiez une pièce déjà validée, votre dossier sera réétudié…"
                        >
                          <span class="btn__text">Modifier </span>
                        </a>
                      </div>
                      <!--end feature-->
                      <div
                        class="progress-horizontal progress-horizontal--sm mb-5 hidden"
                        id="progress5"
                      >
                        <div
                          class="progress-horizontal__bar"
                          data-value="0"
                          id="progressBar5"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row mt-5" th:if="${tenant.getGuarantor()!=null}">
                <div class="col-md-9 col-lg-7">
                  <h2 id="pieces-garant">Les pièces de mon garant</h2>
                </div>
              </div>
              <div
                class="row mt-5 text-left"
                th:if="${tenant.getGuarantor()!=null}"
              >
                <div class="col-md-12 col-lg-12">
                  <div
                    class="row"
                    th:if="${tenant.getGuarantor().getGuarantorType().name()=='VISALE'}"
                  >
                    <div class="col-md-4">
                      <div
                        class="feature feature-4 boxed boxed--lg boxed--border"
                      >
                        <i class="icon icon-Male"></i>
                        <div
                          th:replace="include/file-status-profile:: status(6)"
                        ></div>
                        <h4>Votre attestation Visale</h4>
                        <hr />
                        <div
                          th:replace="include/file-status-profile:: file-message(6)"
                        ></div>

                        <a
                          class="btn btn--secondary view-file"
                          id="link-file-6"
                          target="_blank"
                          th:href="${tenant.getGuarantor().getUpload1Route()}"
                        >
                          <span class="btn__text">Voir </span>
                        </a>
                        <a
                          class="btn btn--primary"
                          data-id="6"
                          href="#"
                          th:classappend="${tenant.isValidated()?'modal-tenant-validated-button':'modal-file-button'}"
                          title="Attention ! Si vous modifiez une pièce déjà validée, votre dossier sera réétudié…"
                        >
                          <span class="btn__text">Modifier </span>
                        </a>
                      </div>
                      <!--end feature-->
                      <div
                        class="progress-horizontal progress-horizontal--sm mb-5 hidden"
                        id="progress6"
                      >
                        <div
                          class="progress-horizontal__bar"
                          data-value="0"
                          id="progressBar6"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="row"
                    th:if="${tenant.getGuarantor().getGuarantorType().name()=='LOCATIO'}"
                  >
                    <div class="col-md-4">
                      <div
                        class="feature feature-4 boxed boxed--lg boxed--border"
                      >
                        <i class="icon icon-Male"></i>
                        <div
                          th:replace="include/file-status-profile:: status(6)"
                        ></div>
                        <h4>
                          La pièce d’identité recto verso de votre garant en
                          cours de validité
                        </h4>
                        <hr />
                        <div
                          th:replace="include/file-status-profile:: file-message(6)"
                        ></div>

                        <a
                          class="btn btn--secondary view-file"
                          id="link-file-6"
                          target="_blank"
                          th:href="${tenant.getGuarantor().getUpload1Route()}"
                        >
                          <span class="btn__text">Voir </span>
                        </a>
                        <a
                          class="btn btn--primary"
                          data-id="6"
                          href="#"
                          th:classappend="${tenant.isValidated()?'modal-tenant-validated-button':'modal-file-button'}"
                          title="Attention ! Si vous modifiez une pièce déjà validée, votre dossier sera réétudié…"
                        >
                          <span class="btn__text">Modifier </span>
                        </a>
                      </div>
                      <!--end feature-->
                      <div
                        class="progress-horizontal progress-horizontal--sm mb-5 hidden"
                        id="progress6"
                      >
                        <div
                          class="progress-horizontal__bar"
                          data-value="0"
                          id="progressBar6"
                        ></div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div
                        class="feature feature-4 boxed boxed--lg boxed--border"
                      >
                        <i class="icon icon-Warehouse"></i>
                        <div
                          th:replace="include/file-status-profile:: status(7)"
                        ></div>
                        <h4>Le justificatif de domicile de votre garant</h4>
                        <hr />
                        <div
                          th:replace="include/file-status-profile:: file-message(7)"
                        ></div>

                        <a
                          class="btn btn--secondary view-file"
                          id="link-file-7"
                          target="_blank"
                          th:href="${tenant.getGuarantor().getUpload2Route()}"
                        >
                          <span class="btn__text">Voir </span>
                        </a>
                        <a
                          class="btn btn--primary"
                          data-id="7"
                          href="#"
                          th:classappend="${tenant.isValidated()?'modal-tenant-validated-button':'modal-file-button'}"
                          title="Attention ! Si vous modifiez une pièce déjà validée, votre dossier sera réétudié…"
                        >
                          <span class="btn__text">Modifier </span>
                        </a>
                      </div>
                      <!--end feature-->
                      <div
                        class="progress-horizontal progress-horizontal--sm mb-5 hidden"
                        id="progress7"
                      >
                        <div
                          class="progress-horizontal__bar"
                          data-value="0"
                          id="progressBar7"
                        ></div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div
                        class="feature feature-4 boxed boxed--lg boxed--border"
                      >
                        <i class="icon icon-File"></i>
                        <div
                          th:replace="include/file-status-profile:: status(8)"
                        ></div>
                        <h4>
                          Le justificatif de situation professionnelle de votre
                          garant
                        </h4>
                        <hr />
                        <div
                          th:replace="include/file-status-profile:: file-message(8)"
                        ></div>

                        <a
                          class="btn btn--secondary view-file"
                          id="link-file-8"
                          target="_blank"
                          th:href="${tenant.getGuarantor().getUpload3Route()}"
                        >
                          <span class="btn__text">Voir </span>
                        </a>
                        <a
                          class="btn btn--primary"
                          data-id="8"
                          href="#"
                          th:classappend="${tenant.isValidated()?'modal-tenant-validated-button':'modal-file-button'}"
                          title="Attention ! Si vous modifiez une pièce déjà validée, votre dossier sera réétudié…"
                        >
                          <span class="btn__text">Modifier </span>
                        </a>
                      </div>
                      <!--end feature-->
                      <div
                        class="progress-horizontal progress-horizontal--sm mb-5 hidden"
                        id="progress8"
                      >
                        <div
                          class="progress-horizontal__bar"
                          data-value="0"
                          id="progressBar8"
                        ></div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div
                        class="feature feature-4 boxed boxed--lg boxed--border"
                      >
                        <i class="icon icon-Folder-WithDocument"></i>
                        <div
                          th:replace="include/file-status-profile:: status(9)"
                        ></div>
                        <h4>L’avis d’imposition de votre garant</h4>
                        <hr />
                        <div
                          th:replace="include/file-status-profile:: file-message(9)"
                        ></div>

                        <a
                          class="btn btn--secondary view-file"
                          id="link-file-9"
                          target="_blank"
                          th:href="${tenant.getGuarantor().getUpload4Route()}"
                        >
                          <span class="btn__text">Voir </span>
                        </a>
                        <a
                          class="btn btn--primary"
                          data-id="9"
                          href="#"
                          th:classappend="${tenant.isValidated()?'modal-tenant-validated-button':'modal-file-button'}"
                          title="Attention ! Si vous modifiez une pièce déjà validée, votre dossier sera réétudié…"
                        >
                          <span class="btn__text">Modifier </span>
                        </a>
                      </div>
                      <!--end feature-->
                      <div
                        class="progress-horizontal progress-horizontal--sm mb-5 hidden"
                        id="progress9"
                      >
                        <div
                          class="progress-horizontal__bar"
                          data-value="0"
                          id="progressBar9"
                        ></div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div
                        class="feature feature-4 boxed boxed--lg boxed--border"
                      >
                        <i class="icon icon-Money-Bag"></i>
                        <div
                          th:replace="include/file-status-profile:: status(10)"
                        ></div>
                        <h4>Le justificatif de ressources de votre garant</h4>
                        <hr />
                        <div
                          th:replace="include/file-status-profile:: file-message(10)"
                        ></div>

                        <a
                          class="btn btn--secondary view-file"
                          id="link-file-10"
                          target="_blank"
                          th:href="${tenant.getGuarantor().getUpload5Route()}"
                        >
                          <span class="btn__text">Voir </span>
                        </a>
                        <a
                          class="btn btn--primary"
                          data-id="10"
                          href="#"
                          th:classappend="${tenant.isValidated()?'modal-tenant-validated-button':'modal-file-button'}"
                          title="Attention ! Si vous modifiez une pièce déjà validée, votre dossier sera réétudié…"
                        >
                          <span class="btn__text">Modifier </span>
                        </a>
                      </div>
                      <!--end feature-->
                      <div
                        class="progress-horizontal progress-horizontal--sm mb-5 hidden"
                        id="progress10"
                      >
                        <div
                          class="progress-horizontal__bar"
                          data-value="0"
                          id="progressBar10"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div class="d-flex justify-content-center">
            <div class="w-25 mx-2">
              <div
                class="feature feature-1 boxed boxed--border bg--white d-flex px-3"
              >
                <div class="w-25">
                  <img
                    alt="visale"
                    class="w-100 img-fluid"
                    src="/assets/images/visale.png"
                  />
                </div>
                <div class="w-75 ml-2">
                  <p>
                    VISALE: Gratuit et entièrement dématerialisé, Visale est
                    votre garant pour louer votre logement !
                  </p>
                  <a class="text-bleu-clair" href="https://www.visale.fr/#!/">
                    Obtenez votre visa
                  </a>
                </div>
              </div>
            </div>

            <div class="w-25 mx-2">
              <div
                class="feature feature-1 boxed boxed--border bg--white d-flex px-3"
              >
                <div class="w-20 d-flex">
                  <h3 class="text-primary font-weight-bold mx-auto">3C</h3>
                </div>
                <div class="w-80 ml-2">
                  <p>
                    Rassurer votre propriétaire grâce au standard « 3C »et
                    <b> augmentez de 24% vos chances d’obtenir une visite </b>
                    pour l’appartement de vos rêves !
                  </p>
                </div>
              </div>
            </div>

            <div class="w-25 mx-2">
              <div
                class="feature feature-1 boxed boxed--border bg--white d-flex px-3"
              >
                <div class="w-25 text-center">
                  <img
                    alt="anil"
                    class="w-60 img-fluid"
                    src="/assets/images/anil.png"
                  />
                </div>
                <div class="w-75 ml-2">
                  <p>
                    ANIL: Pour toutes questions relatives au logement,
                    renseignez-vous auprès de l'ANIL ou de votre ADIL.
                  </p>
                  <a class="text-bleu-clair" th:href="@{~/information}">
                    En savoir plus
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          th:if="${tenants.size() == 1} and ${tenant.getEmail() == tenantCreate.getEmail()}"
        >
          <div class="container">
            <div class="row justify-content-center">
              <div class="modal-instance">
                <a
                  class="btn modal-trigger"
                  href="#"
                  style="border-color: #3483de !important"
                >
                  <span class="btn__text color--primary"
                    >Je souhaite me mettre en colocation !</span
                  >
                </a>
                <div
                  class="modal-container"
                  th:attrappend="data-autoshow = ${showModalWithError!=null?'1':''}"
                >
                  <div class="modal-content section-modal">
                    <section class="unpad">
                      <div class="container">
                        <div class="row justify-content-center">
                          <div class="col-md-9 col-lg-7">
                            <div class="feature feature-1">
                              <div
                                class="feature__body boxed boxed--lg boxed--border"
                              >
                                <div
                                  class="modal-close modal-close-cross"
                                ></div>
                                <div class="text-block">
                                  <h3>
                                    Rentrez les informations de votre nouveau
                                    colocataire
                                  </h3>
                                </div>
                                <form
                                  onsubmit="return validate_form()"
                                  th:action="@{/locataire/addTenant}"
                                  th:method="post"
                                  th:object="${tenantDTO2}"
                                >
                                  <div class="row">
                                    <div class="col-md-4">Nom :</div>
                                    <div class="col-md-8">
                                      <input
                                        placeholder="Nom"
                                        th:field="*{lastName}"
                                        type="text"
                                      />
                                    </div>
                                    <div class="col-md-4">Prénom :</div>
                                    <div class="col-md-8">
                                      <input
                                        placeholder="Prénom"
                                        th:field="*{firstName}"
                                        type="text"
                                      />
                                    </div>
                                    <div class="col-md-4">Adresse e-mail :</div>
                                    <div class="col-md-8">
                                      <input
                                        placeholder="E-mail"
                                        th:field="*{email}"
                                        type="text"
                                      />
                                      <span
                                        class="color--error"
                                        th:if="${errorMessage!=null}"
                                        th:text="${errorMessage}"
                                      ></span>
                                    </div>
                                  </div>
                                  <div class="row justify-content-center">
                                    <div class="col-md-6">
                                      <button
                                        class="btn btn-block btn--primary"
                                        type="submit"
                                      >
                                        AJOUTER
                                      </button>
                                    </div>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <th:block th:if="${tenants.size() > 1}">
          <section class="switchable" id="ma-colocation">
            <div class="container">
              <div class="row justify-content-around">
                <div class="col-md-7 col-lg-6">
                  <h2>Ma colocation</h2>
                  <p class="lead">
                    Votre lien dossier ne sera généré qu'une fois que les
                    dossiers de tous les membres de la colocation auront été
                    validés
                  </p>
                  <p>
                    Par respect du RGPD et des données personnelles, vous ne
                    pouvez pas ajouter les documents de vos colocataires. Tous
                    les membres de la colocation ont reçu un mail à l'adresse
                    indiquée pour ajouter eux-mêmes leurs documents.
                  </p>

                  <div class="mt-5">
                    <div
                      class="modal-instance"
                      th:if="${tenant.getEmail() == tenantCreate.getEmail()}"
                    >
                      <a class="modal-trigger" href="#">
                        <span>Mon colocataire n’a pas reçu son e-mail ?</span>
                      </a>
                      <div class="modal-container">
                        <div class="modal-content section-modal">
                          <section class="unpad">
                            <div class="container">
                              <div class="row justify-content-center">
                                <div class="col-md-10 col-12">
                                  <div class="feature feature-1">
                                    <div
                                      class="feature__body boxed boxed--lg boxed--border text-center"
                                    >
                                      <div
                                        class="modal-close modal-close-cross"
                                      ></div>
                                      <div class="text-block">
                                        <h3>
                                          Nous allons renvoyer un e-mail à votre
                                          colocataire. Attention, pensez à
                                          vérifier vos courriers indésirables.
                                        </h3>
                                      </div>
                                      <form
                                        th:action="@{/locataire/sendEmailAgain}"
                                        th:method="post"
                                      >
                                        <div class="row">
                                          <div
                                            class="col-md-4"
                                            th:each="tenant: ${tenants}"
                                          >
                                            <div class="input-radio">
                                              <th:block
                                                th:if="${tenant.getEmail() != tenantCreate.getEmail()}"
                                              >
                                                <span
                                                  class="input__label"
                                                  th:text="${tenant.getFullName()}"
                                                ></span>
                                                <input
                                                  name="tenant"
                                                  required="required"
                                                  th:id="'radio-input'+${tenant.getId()}"
                                                  th:value="${tenant.getId()}"
                                                  type="radio"
                                                />
                                                <label
                                                  th:for="'radio-input'+${tenant.getId()}"
                                                ></label>
                                              </th:block>
                                            </div>
                                          </div>
                                          <div class="offset-4 col-md-4">
                                            <button
                                              class="btn btn--primary type--uppercase"
                                              type="submit"
                                            >
                                              Renvoyer un mail
                                            </button>
                                          </div>
                                        </div>
                                      </form>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="pt-5 col-md-4 col-lg-3"
                  th:if="${tenants.size() > 1}"
                >
                  <div class="d-flex">
                    <div class="mr-2" th:if="${tenantCreate.isValidated()}">
                      <i class="icon icon-Yes icon--sm text-success"></i>
                    </div>
                    <div class="mr-2" th:unless="${tenantCreate.isValidated()}">
                      <i class="icon icon-Hour icon--sm text-warning"></i>
                    </div>
                    <div>
                      <span
                        ><i
                          class="icon color--primary icon-Administrator icon--sm"
                        ></i
                      ></span>
                    </div>
                    <div class="ml-4 text-block">
                      <h5>Créateur colocation</h5>
                      <p th:text="${tenantCreate.getEmail()}"></p>
                    </div>
                  </div>

                  <div class="d-flex" th:each="joinTenant: ${tenants}">
                    <th:block
                      th:if="${joinTenant.getEmail() != tenantCreate.getEmail()}"
                    >
                      <div class="mr-2" th:if="${joinTenant.isValidated()}">
                        <i class="icon icon-Yes icon--sm text-success"></i>
                      </div>
                      <div class="mr-2" th:unless="${joinTenant.isValidated()}">
                        <i class="icon icon-Hour icon--sm text-warning"></i>
                      </div>
                      <div>
                        <span
                          ><i
                            class="icon color--primary icon-Administrator icon--sm"
                          ></i
                        ></span>
                      </div>
                      <div class="ml-4 text-block">
                        <h5 th:text="${joinTenant.getFullName()}"></h5>
                        <p th:text="${joinTenant.getEmail()}"></p>
                      </div>
                      <div
                        class="modal-instance"
                        th:if="${tenant.getEmail() == tenantCreate.getEmail()}"
                      >
                        <a class="modal-trigger" href="#">
                          <span
                            ><i
                              class="color--error fa fa-trash-alt icon--xs"
                            ></i
                          ></span>
                        </a>
                        <div class="modal-container">
                          <div class="modal-content section-modal">
                            <section class="unpad">
                              <div class="container">
                                <div class="row justify-content-center">
                                  <div class="col-md-10 col-lg-8">
                                    <div class="feature feature-1">
                                      <div
                                        class="feature__body boxed boxed--lg boxed--border text-center"
                                      >
                                        <div
                                          class="modal-close modal-close-cross"
                                        ></div>
                                        <div class="text-block">
                                          <h3>
                                            Êtes vous sûr de vouloir retirer
                                            <span
                                              th:text="${joinTenant.getFullName()}"
                                            ></span>
                                            de votre colocation ?
                                          </h3>
                                        </div>
                                        <form
                                          th:action="@{/locataire/join/}+${joinTenant.id}+'/delete'"
                                          th:method="post"
                                        >
                                          <div
                                            class="row justify-content-center"
                                          >
                                            <div class="col-md-6">
                                              <button
                                                class="btn btn-block btn--primary"
                                                type="submit"
                                              >
                                                VALIDER
                                              </button>
                                            </div>
                                          </div>
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </section>
                          </div>
                        </div>
                      </div>
                    </th:block>
                  </div>
                  <div
                    class="modal-instance"
                    th:if="${tenant.getEmail() == tenantCreate.getEmail()}"
                  >
                    <a class="modal-trigger" href="#">
                      <span>+ J’ajoute un colocataire</span>
                    </a>
                    <div
                      class="modal-container"
                      th:attrappend="data-autoshow = ${showModalWithError!=null?'1':''}"
                    >
                      <div class="modal-content section-modal">
                        <section class="unpad">
                          <div class="container">
                            <div class="row justify-content-center">
                              <div class="col-md-9 col-lg-7">
                                <div class="feature feature-1">
                                  <div
                                    class="feature__body boxed boxed--lg boxed--border"
                                  >
                                    <div
                                      class="modal-close modal-close-cross"
                                    ></div>
                                    <div class="text-block">
                                      <h3>
                                        Rentrez les informations de votre
                                        nouveau colocataire
                                      </h3>
                                    </div>
                                    <form
                                      onsubmit="return validate_form()"
                                      th:action="@{/locataire/addTenant}"
                                      th:method="post"
                                      th:object="${tenantDTO2}"
                                    >
                                      <div class="row">
                                        <div class="col-md-4">Nom :</div>
                                        <div class="col-md-8">
                                          <input
                                            placeholder="Nom"
                                            th:field="*{lastName}"
                                            type="text"
                                          />
                                        </div>
                                        <div class="col-md-4">Prénom :</div>
                                        <div class="col-md-8">
                                          <input
                                            placeholder="Prénom"
                                            th:field="*{firstName}"
                                            type="text"
                                          />
                                        </div>
                                        <div class="col-md-4">
                                          Adresse e-mail :
                                        </div>
                                        <div class="col-md-8">
                                          <input
                                            placeholder="E-mail"
                                            th:field="*{email}"
                                            type="text"
                                          />
                                          <span
                                            class="color--error"
                                            th:if="${errorMessage!=null}"
                                            th:text="${errorMessage}"
                                          ></span>
                                        </div>
                                      </div>
                                      <div class="row justify-content-center">
                                        <div class="col-md-6">
                                          <button
                                            class="btn btn-block btn--primary"
                                            type="submit"
                                          >
                                            AJOUTER
                                          </button>
                                        </div>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </th:block>
        <section class="text-center" id="modifier-mes-informations">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-md-8 col-lg-6">
                <h2>Mes informations</h2>
                <p>
                  Pour modifier vos informations personnelles : changez les
                  directement dans les champs puis cliquez sur modifier
                </p>
              </div>
              <div class="col-md-10 col-lg-10 mt-5">
                <form
                  class="text-left"
                  enctype="multipart/form-data"
                  id="modifier-profile-form"
                  method="post"
                  onsubmit="return notEmptyFiles()"
                  th:action="@{/locataire/mon-compte}"
                  th:object="${tenantDTO}"
                >
                  <div class="row">
                    <div class="col-md-6">
                      <label>Votre nom de famille :</label>
                      <input
                        placeholder="Ex : Dupont"
                        th:field="*{lastName}"
                        type="text"
                      />
                    </div>
                    <div class="col-md-6">
                      <label>Votre revenu mensuel net (avant impôts) :</label>
                      <input
                        placeholder="Ex : 2000"
                        th:field="*{salary}"
                        type="number"
                      />
                    </div>
                    <div class="col-md-6">
                      <label>Votre prénom :</label>
                      <input
                        placeholder="Ex : Jean-Michel"
                        th:field="*{firstName}"
                        type="text"
                      />
                    </div>
                    <div class="col-md-6">
                      <label>Votre email :</label>
                      <input
                        disabled="disabled"
                        placeholder="Ex : exemplel@exemple.fr"
                        th:field="*{email}"
                        type="email"
                      />
                    </div>
                    <div class="col-md-6">
                      <label>Votre situation :</label>
                      <div class="input-select">
                        <select th:field="*{situation}">
                          <option
                            th:each="tenantSituation, iter: ${T(fr.gouv.common.enums.TenantSituation).values()}"
                            th:text="#{${tenantSituation.getLabel()}}"
                            th:value="${iter.index}"
                          ></option>
                        </select>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <label>Numéro de téléphone :</label>
                      <input
                        placeholder="06 07 08 09 10"
                        th:field="*{telephone}"
                        type="tel"
                      />
                    </div>
                  </div>
                  <div class="row mt-5 text-center justify-content-center">
                    <div class="col-md-3">
                      <div class="input-radio text-center">
                        <div>Je n'ai pas de garant</div>
                        <input
                          th:field="*{guarantorType}"
                          th:value="${T(fr.gouv.common.enums.GuarantorType).NONE}"
                          type="radio"
                        />
                        <label></label>
                      </div>
                    </div>

                    <div class="col-md-3">
                      <div class="input-radio text-center">
                        <div>J’ai un garant classique<br /></div>
                        <input
                          th:field="*{guarantorType}"
                          th:value="${T(fr.gouv.common.enums.GuarantorType).LOCATIO}"
                          type="radio"
                        />
                        <label></label>
                      </div>
                    </div>

                    <div class="col-md-5">
                      <div class="input-radio text-center">
                        <div>
                          Mon garant est un organisme (Visale par exemple)
                        </div>
                        <input
                          id="guarantorType"
                          th:field="*{guarantorType}"
                          th:value="${T(fr.gouv.common.enums.GuarantorType).VISALE}"
                          type="radio"
                        />
                        <label> </label>
                      </div>
                    </div>
                  </div>
                  <!--begin visale guarantor-->
                  <div class="visale-guarantor-form hidden">
                    <div class="row">
                      <div class="col-md-12 pt-4">
                        <input
                          accept="image/*, .pdf"
                          class="hidden guarantor-file-input"
                          th:field="*{guarantor.files[0]}"
                          type="file"
                        />
                        <a
                          class="btn btn--primary btn--icon guarantor-file-button"
                          href="#"
                        >
                          <span class="btn__text"
                            ><i class="icon-Add-File"></i> Ajouter un
                            document</span
                          >
                        </a>
                        <span class="ml-3 my-auto"><b>Visa</b></span>
                      </div>
                    </div>
                  </div>
                  <!--begin classic guarantor-->
                  <div class="classic-guarantor-form">
                    <div class="container classic-guarantor-name hidden">
                      <div class="row">
                        <div class="col-md-6">
                          <label>Nom de famille :</label>
                          <input
                            placeholder="Ex : Dupont"
                            th:field="*{guarantor.lastName}"
                            type="text"
                          />
                        </div>
                        <div class="col-md-6">
                          <label>Prénom :</label>
                          <input
                            placeholder="Ex : Jean-Michel"
                            th:field="*{guarantor.firstName}"
                            type="text"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="row classic-guarantor-files hidden">
                      <div class="col-md-12 pt-4">
                        <input
                          accept="image/*, .pdf"
                          class="hidden guarantor-file-input"
                          th:field="*{guarantor.files[0]}"
                          type="file"
                        />
                        <a
                          class="btn btn--primary btn--icon guarantor-file-button"
                          href="#"
                        >
                          <span class="btn__text"
                            ><i class="icon-Add-File"></i> Ajouter un
                            document</span
                          >
                        </a>
                        <span class="ml-3 my-auto"
                          ><b>Pièce d’identité</b> (recto verso)</span
                        >
                      </div>
                      <div class="col-md-12 pt-4">
                        <input
                          accept="image/*, .pdf"
                          class="hidden guarantor-file-input"
                          th:field="*{guarantor.files[1]}"
                          type="file"
                        />
                        <a
                          class="btn btn--primary btn--icon guarantor-file-button"
                          href="#"
                        >
                          <span class="btn__text"
                            ><i class="icon-Add-File"></i> Ajouter un
                            document</span
                          >
                        </a>
                        <span class="ml-3 my-auto"
                          ><b>Justificatif de domicile </b>(taxe foncière ou
                          facture si propriétaire, trois dernières quittances de
                          loyer si locataire)</span
                        >
                      </div>
                      <div class="col-md-12 pt-4">
                        <input
                          accept="image/*, .pdf"
                          class="hidden guarantor-file-input"
                          th:field="*{guarantor.files[2]}"
                          type="file"
                        />
                        <a
                          class="btn btn--primary btn--icon guarantor-file-button"
                          href="#"
                        >
                          <span class="btn__text"
                            ><i class="icon-Add-File"></i> Ajouter un
                            document</span
                          >
                        </a>
                        <span class="ml-3 my-auto"
                          ><b> Contrat de travail </b> ou attestation de pension
                          de retraite ou arrêté de nomination si fonctionnaire
                          <br />ou extrait Kbis si indépendant</span
                        >
                      </div>
                      <div class="col-md-12 pt-4">
                        <input
                          accept="image/*, .pdf"
                          class="hidden guarantor-file-input"
                          th:field="*{guarantor.files[3]}"
                          type="file"
                        />
                        <a
                          class="btn btn--primary btn--icon guarantor-file-button"
                          href="#"
                        >
                          <span class="btn__text"
                            ><i class="icon-Add-File"></i> Ajouter un
                            document</span
                          >
                        </a>
                        <span class="ml-3 my-auto"
                          ><b> Avis d’imposition</b></span
                        >
                      </div>
                      <div class="col-md-12 pt-4">
                        <input
                          accept="image/*, .pdf"
                          class="hidden guarantor-file-input"
                          th:field="*{guarantor.files[4]}"
                          type="file"
                        />
                        <a
                          class="btn btn--primary btn--icon guarantor-file-button"
                          href="#"
                        >
                          <span class="btn__text"
                            ><i class="icon-Add-File"></i> Ajouter un
                            document</span
                          >
                        </a>
                        <span class="ml-3 my-auto"
                          ><b>Justificatif de ressources</b> (trois dernières
                          fiches de paie ou attestation de versement de pension
                          si retraité)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="row text-center">
                    <div class="col-md-6 mt-5 text-center">
                      <div class="col-md-12 text-center" id="file-errors"></div>
                      <button class="btn btn--primary" type="submit">
                        Modifier mes informations
                      </button>
                    </div>
                  </div>
                </form>
                <div class="row">
                  <div class="col-md-10 col-lg-8">
                    <div class="modal-instance">
                      <a class="modal-trigger text-danger" href="#">
                        <span class="btn__text">Supprimer mon compte</span>
                      </a>
                      <div class="modal-container">
                        <div class="modal-content section-modal">
                          <section class="unpad">
                            <div class="container">
                              <div class="row justify-content-center">
                                <div class="col-md-6 col-12">
                                  <div class="feature feature-1">
                                    <div
                                      class="feature__body boxed boxed--lg boxed--border text-center"
                                    >
                                      <div
                                        class="modal-close modal-close-cross"
                                      ></div>
                                      <div class="text-block">
                                        <h3>Attention !</h3>
                                        <div class="text-left">
                                          <p>
                                            Vous êtes sur le point de supprimer
                                            votre compte
                                          </p>
                                          <p>
                                            Cette action est irréversible et
                                            toutes vos données seront supprimées
                                            (dossier locataires, biens)
                                          </p>
                                        </div>
                                      </div>
                                      <form
                                        th:action="@{/locataire/delete}"
                                        th:if="${tenantDTO.getTenantType().name()=='CREATE'} or ${tenantDTO.getTenantType().name()=='ALONE'}"
                                        th:method="post"
                                      >
                                        <div class="row">
                                          <div class="col-md-6">
                                            <div
                                              class="btn btn--primary btn-block modal-close"
                                            >
                                              <span class="btn__text"
                                                >Annuler</span
                                              >
                                            </div>
                                          </div>
                                          <div class="col-md-6">
                                            <button
                                              class="btn btn-block"
                                              type="submit"
                                            >
                                              Supprimer
                                            </button>
                                          </div>
                                        </div>
                                      </form>

                                      <form
                                        th:action="@{/locataire/join/delete}"
                                        th:if="${tenantDTO.getTenantType().name()=='JOIN'}"
                                        th:method="post"
                                      >
                                        <div class="row">
                                          <div class="col-md-6">
                                            <div
                                              class="btn btn--primary btn-block modal-close"
                                            >
                                              <span class="btn__text"
                                                >Annuler</span
                                              >
                                            </div>
                                          </div>
                                          <div class="col-md-6">
                                            <button
                                              class="btn btn-block"
                                              type="submit"
                                            >
                                              Supprimer
                                            </button>
                                          </div>
                                        </div>
                                      </form>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div
        class="notification success-notification pos-right pos-bottom col-md-4 col-lg-3"
        data-animation="from-bottom"
        data-autoshow="1"
        th:if="${addJoinTenant}"
      >
        <div class="boxed boxed--border border--round box-shadow">
          <div class="text-block">
            <h5>
              <span th:text="${joinTenantName}"></span> a bien été ajouté. Un
              mail lui a été envoyé !
            </h5>
          </div>
        </div>
        <div class="notification-close-cross notification-close"></div>
      </div>
      <div
        class="notification success-notification pos-right pos-bottom col-md-4 col-lg-3"
        data-animation="from-bottom"
        data-autoshow="1"
        th:if="${deleteJoinTenant}"
      >
        <div class="boxed boxed--border border--round box-shadow">
          <div class="text-block">
            <h5>
              <span th:text="${joinTenantName}"></span> a bien été supprimé
            </h5>
          </div>
        </div>
        <div class="notification-close-cross notification-close"></div>
      </div>
      <div
        class="notification success-notification pos-right pos-bottom col-md-4 col-lg-3"
        data-animation="from-bottom"
        data-autoshow="200"
        th:if="${sendEmailAgain}"
      >
        <div class="boxed boxed--border border--round box-shadow">
          <div class="text-block">
            <h5>Nous avons bien renvoyé un e-mail à votre colocataire !</h5>
            <p>Il devrait le recevoir d’ici quelques secondes...</p>
          </div>
        </div>
        <div class="notification-close-cross notification-close"></div>
      </div>
      <div
        class="notification success-notification pos-right pos-top col-md-4 col-lg-3"
        data-animation="from-top"
        data-autohide="2000"
        data-autoshow="200"
        th:if="${notification}"
      >
        <div class="boxed boxed--border border--round box-shadow">
          <div class="text-block">
            <h5>Modifications enregistrées !</h5>
            <p>
              Vos modifications ont bien été prises en compte et sont désormais
              appliquées.
            </p>
          </div>
        </div>
        <div class="notification-close-cross notification-close"></div>
      </div>
      <div class="hidden">
        <form
          enctype="multipart/form-data"
          id="form-file"
          method="post"
          th:action="@{/file}"
          th:object="${fileDTO}"
        >
          <input
            accept="image/*, .pdf"
            class="hidden"
            th:field="*{file}"
            type="file"
          />
          <input th:field="*{number}" type="hidden" />
          <input th:field="*{fileActionUploadType}" type="hidden" />
        </form>
      </div>
      <div
        class="notification success-notification pos-right pos-top col-md-4 col-lg-3"
        data-animation="from-top"
        data-autohide="2000"
      >
        <div class="boxed boxed--border border--round box-shadow">
          <div class="text-block">
            <h5>Modifications enregistrées !</h5>
            <p>
              Vos modifications ont bien été prises en compte et sont désormais
              appliquées.
            </p>
          </div>
        </div>
        <div class="notification-close-cross notification-close"></div>
      </div>
      <div
        class="notification error-notification pos-right pos-top col-md-4 col-lg-3"
        data-animation="from-top"
        data-autohide="2000"
      >
        <div class="boxed boxed--border border--round box-shadow">
          <div class="text-block">
            <h5>Modifications annulées !</h5>
            <p>
              Un problème est survenu et nous n'avons pas pu prendre en compte
              vos modifications. Merci de réessayer.
            </p>
          </div>
        </div>
        <div class="notification-close-cross notification-close"></div>
      </div>
      <div class="modal-container modal-file">
        <div class="modal-content section-modal">
          <section class="unpad">
            <div class="container">
              <div class="row justify-content-center">
                <div class="col-md-8 col-12">
                  <div class="feature feature-1">
                    <div
                      class="feature__body boxed boxed--lg boxed--border text-center"
                    >
                      <div class="modal-close modal-close-cross"></div>
                      <div class="text-block">
                        <h3>Je modifie mon document</h3>
                        <div class="text-center">
                          <p>
                            Vous pouvez ajouter un document ou modifier le
                            document actuel
                          </p>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-6">
                          <div
                            class="btn btn--primary btn-block modal-close file-modal mb-2"
                            data-action="ADD"
                            data-id="1"
                          >
                            <span class="btn__text">Ajouter un document</span>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div
                            class="btn btn--primary btn-block modal-close file-modal"
                            data-action="EDIT"
                            data-id="1"
                          >
                            <span class="btn__text">Remplacer le document</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div class="modal-container modal-tenant-validated">
        <div class="modal-content text-center" data-width="80%">
          <div class="boxed boxed--lg">
            <h2 th:text="#{confirm.modify.account.message1}"></h2>
            <!--<hr class="short"/>-->
            <p class="my-5 lead text-dark">
              <span th:text="#{confirm.modify.account.message2}"></span>
              <span th:text="#{confirm.modify.account.message3}"></span>
            </p>

            <div class="d-flex justify-content-center">
              <a
                class="btn btn--primary w-25 mx-5 modal-close"
                data-id="0"
                href="#"
                id="modal-yes"
              >
                <span class="btn__text"> Oui </span>
              </a>

              <div class="btn btn--primary w-25 mx-5 modal-close">
                <span class="btn__text"> Non </span>
              </div>
            </div>
          </div>
          <div class="modal-close modal-close-cross"></div>
        </div>
      </div>

      <div
        class="modal-container modal-tenant-validated"
        data-autoshow="1"
        th:if="${modalInfoSuperFacile}"
      >
        <div class="modal-content text-center">
          <div class="boxed boxed--lg">
            <h2 th:text="#{${title}}"></h2>
            <p class="my-5 lead text-dark">
              <span th:text="#{super.facile.modal.subtitle}"></span>
            </p>

            <div class="btn btn--primary modal-close">
              <span class="btn__text text-uppercase">continuer</span>
            </div>
          </div>
          <div class="modal-close modal-close-cross"></div>
        </div>
      </div>
      <a
        class="profile-floating-button hidden-sm hidden-xs btn btn--sm type--uppercase btn--primary bg-orange border-0"
        th:href="@{/locataire/super-facile}"
        th:if="${tenant.isButtonFloatingProfile()} and ${tenant.stepSuperFacile.name()!='COMPLETE_ENTERPRISE'}"
      >
        <span class="btn__text">Devenir SuperFacile</span>
      </a>
      <div
        class="notification success-notification pos-right pos-bottom hidden-lg hidden-md col-md-4 col-lg-3"
        data-animation="from-bottom"
        data-autoshow="200"
        data-cookie="super_facile_cookies_message_dismissed"
        th:if="${tenant.isButtonFloatingProfile()} and ${tenant.stepSuperFacile.name()!='COMPLETE_ENTERPRISE'}"
      >
        <div
          class="boxed boxed--border border--round box-shadow"
          style="opacity: 0.95"
        >
          <div class="text-block text-center mt-3">
            <a
              class="btn btn--sm type--uppercase btn--primary bg-orange border-0"
              th:href="@{/locataire/super-facile}"
            >
              <span class="btn__text">Devenir SuperFacile</span>
            </a>
          </div>
        </div>
        <div class="notification-close-cross notification-close"></div>
      </div>
    </div>
<!--     <div layout:fragment="javascripts" th:remove="tag">
      <script src="/js/modify-profile.js"></script>
      <script src="/js/replace-update-file.js"></script>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ValidationProvider } from "vee-validate";
import { mapState } from "vuex";
import { User } from "df-shared/src/models/User";
import { DfDocument } from "df-shared/src/models/DfDocument";

@Component({
  components: { ValidationProvider },
  computed: {
    ...mapState({
      user: "user",
    }),
  },
})
export default class FileStatus extends Vue {
  user!: User;

  getFileLink() {
    return `https://${process.env.VUE_APP_TENANT_URL}/dossier-locataire/${this.user?.apartmentSharing?.token}`;
  }

  getPublicFileLink() {
    return `https://${process.env.VUE_APP_TENANT_URL}/dossier-locataire/${this.user?.apartmentSharing?.tokenPublic}`;
  }

  oldUpdateDocument() {
    // TODO
    const now = new Date()
    const lastMonth = new Date(now.getDate() - 30);
    const lastUpdate = new Date(this.user.lastUpdate || new Date())
    return lastUpdate < lastMonth;
  }

  isStudent() {
    const doc = this.user.documents?.find((d: DfDocument) => {return d.documentCategory === 'PROFESSIONAL'});
    return doc?.documentSubCategory === 'STUDENT'
  }
}
</script>

<i18n>
{
  "en": {
      "title": "Suivi de mon dossier",
      "subtitle": "Vous avez indiqué être {0} {1}, être en {2} et gagner {3}.",
      "last-update": "Dernière mise à jour du dossier le {0}"
  },
  "fr": {
      "title": "Suivi de mon dossier",
      "subtitle": "Vous avez indiqué être {0} {1}, être en {2} et gagner {3}.",
      "last-update": "Dernière mise à jour du dossier le {0}"
  }
}
</i18n>
