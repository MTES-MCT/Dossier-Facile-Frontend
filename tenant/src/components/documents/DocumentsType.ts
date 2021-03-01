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
]