import { DocumentType } from "df-shared/src/models/Document";

export const IDENTIFICATION_DOCS: DocumentType[] = [
  {
    key: "identity-card",
    value: "FRENCH_IDENTITY_CARD",
    explanationText:
      "Attention veillez à ajouter votre pièce <b>recto-verso !</b>",
    acceptedProofs: ["Carte d’identité française <b>recto-verso</b>"],
    refusedProofs: [
      "Carte d’identité <b>sans le verso ou périmée</b>",
      "Tout autre document",
    ],
    maxFileCount: 3,
  },
  {
    key: "passport",
    value: "FRENCH_PASSPORT",
    acceptedProofs: ["Passport français (pages 2 et 3)"],
    refusedProofs: ["Tout autre document"],
    maxFileCount: 3,
  },
  {
    key: "permit",
    value: "FRENCH_RESIDENCE_PERMIT",
    acceptedProofs: [
      "Carte de séjour en France temporaire recto-verso en cours de validité, ou périmée si elle est accompagnée du récépissé de la demande de renouvellement de carte de séjour",
      "Visa de travail ou d’études temporaire en France",
    ],
    refusedProofs: ["Tout autre document"],
    maxFileCount: 3,
  },
  {
    key: "other",
    value: "OTHER_IDENTIFICATION",
    acceptedProofs: [
      "Carte d’identité étrangère <b>recto-verso</b>",
      "Passeport étranger (pages 2 et 3)",
      "Permis de conduire français ou étranger <b>recto-verso</b>",
      "Carte de résident",
      "Carte de ressortissant d’un État membre de l’UE ou de l’EEE",
    ],
    refusedProofs: ["Tout autre document"],
    maxFileCount: 3,
  },
];

export const RESIDENCY_DOCS: DocumentType[] = [
  {
    key: "tenant",
    value: "TENANT",
    explanationText:
      "J’ajoute mes <b>quittances de loyer pour les trois derniers mois.</b>",
    acceptedProofs: [
      "Quittances de loyer des trois derniers mois",
      "Attestation du propriétaire (ou de son mandataire) indiquant que le locataire est à jour de ses loyers et charges",
    ],
    refusedProofs: [
      "Factures",
      "Avis de taxe d’habitation",
      "Relevés de compte bancaire",
    ],
    maxFileCount: 3,
  },
  {
    key: "owner",
    value: "OWNER",
    explanationText:
      "J’ajoute un <b>avis de taxe foncière de moins d’un an.</b>",
    acceptedProofs: [
      "Dernier avis de taxe foncière",
      "Titre de propriété de la résidence principale",
    ],
    refusedProofs: [
      "Appel de fonds pour charges de copropriété",
      "Factures",
      "Avis de taxe d’habitation",
      "Relevés de compte bancaire",
    ],
    maxFileCount: 2,
  },
  {
    key: "guest",
    value: "GUEST",
    explanationText:
      "J’ajoute une <b>attestation sur l’honneur d’hébergement à titre gratuit, " +
      "une copie de la pièce d’identité et un justificatif de domicile de mon " +
      "hébergeant</b> (une facture suffit). Vous pouvez utiliser un modèle en ligne " +
      "sur le site service-public.fr",
    acceptedProofs: [
      "Attestation sur l’honneur du parent <b>datée et signée</b> indiquant que le candidat à la location réside à son domicile, accompagnée d’une pièce d’identité et d’un justificatif de domicile du parent (une simple facture suffit)",
    ],
    refusedProofs: ["Tout autre document"],
    maxFileCount: 2,
  },
  {
    key: "guest-parents",
    value: "GUEST_PARENTS",
    explanationText:
      "J’ajoute une <b>attestation sur l’honneur d’hébergement à titre gratuit, " +
      "une copie de la pièce d’identité et un justificatif de domicile du " +
      "parent</b> (une facture suffit). Vous pouvez utiliser un modèle en ligne sur " +
      "le site service-public.fr",
    acceptedProofs: [
      "Attestation sur l’honneur de l’hébergeant <b>datée de moins de trois mois et signée</b> indiquant que le candidat à la location réside à son domicile, accompagnée d’une pièce d’identité et d’un justificatif de domicile de l’hébergeant (une simple facture suffit)",
      "Attestation d’élection de domicile <b>datée de moins de trois mois et signée</b> de l’organisme d’hébergement (hébergement d’urgence, placement…) indiquant l’adresse de l’hébergement (téléchargeable sur le site <a target='_blank' href='https://www.service-public.fr/simulateur/calcul/16030'>https://www.service-public.fr/simulateur/calcul/16030</a> ) ",
    ],
    refusedProofs: ["Tout autre document"],
    maxFileCount: 2,
  },
];