
export const DocumentTypeConstants = {
  IDENTIFICATION_DOCS: [
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
  ],

  RESIDENCY_DOCS: [
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
  ],

  PROFESSIONAL_DOCS: [
    {
      key: "cdi",
      value: "CDI",
      explanationText:
        "J’ajoute mon contrat de travail en cours, complet et signé.\n" +
        "Et si vous n’avez pas de contrat de travail ? Vous pouvez joindre une attestation de votre employeur signée et datée de moins de 3 mois.",
      acceptedProofs: [
        "Contrat de travail en cours, complet, daté et signé",
        "Attestation de votre employeur de moins de 3 mois précisant l’emploi et la rémunération proposée et la date d’entrée en fonctions",
      ],
      refusedProofs: [
        "Courrier/mail de confirmation d’embauche",
        "Bulletins de salaire",
        "Relevés de comptes bancaires",
      ],
      maxFileCount: 10,
    },
    {
      key: "cdi-trial",
      value: "CDI_TRIAL",
      explanationText:
        "J’ajoute mon contrat de travail en cours, complet et signé.\n" +
        "Et si vous n’avez pas de contrat de travail ? Vous pouvez joindre une attestation de votre employeur signée et datée de moins de 3 mois.",
      acceptedProofs: [
        "Contrat de travail en cours, complet, daté et signé",
        "Attestation de votre employeur de moins de 3 mois précisant l’emploi et la rémunération proposée, la date d’entrée en fonctions envisagée et la durée de la période d’essai.",
      ],
      refusedProofs: [
        "Courrier/mail de confirmation d’embauche",
        "Bulletins de salaire",
        "Relevés de comptes bancaires",
      ],
      maxFileCount: 10,
    },
    {
      key: "cdd",
      value: "CDD",
      explanationText:
        "J’ajoute mon contrat de travail en cours, complet et signé.\n" +
        "Et si vous n’avez pas de contrat de travail ? Vous pouvez joindre une attestation de votre employeur signée et datée de moins de 3 mois.",
      acceptedProofs: [
        "Contrat de travail en cours, complet, daté et signé",
        "Attestation de votre employeur de moins de 3 mois précisant l’emploi et la rémunération proposée, la date d’entrée en fonctions et la durée du contrat",
      ],
      refusedProofs: [
        "Courrier/mail de confirmation d’embauche",
        "Bulletins de salaire",
        "Relevés de comptes bancaires",
      ],
      maxFileCount: 10,
    },
    {
      key: "alternation",
      value: "ALTERNATION",
      explanationText:
        "J’ajoute mon contrat d’alternance en cours, complet et signé.",
      acceptedProofs: [
        "Contrat d’alternance",
        "Contrat de professionnalisation",
      ],
      refusedProofs: ["Certificat de scolarité"],
      maxFileCount: 10,
    },
    {
      key: "internship",
      value: "INTERNSHIP",
      explanationText:
        "J’ajoute ma convention de stage en cours, complète et signée.",
      acceptedProofs: ["Convention de stage"],
      refusedProofs: ["Certificat de scolarité"],
      maxFileCount: 10,
    },
    {
      key: "student",
      value: "STUDENT",
      explanationText:
        "J’ajoute une copie de ma carte d’étudiant ou un certificat de scolarité pour l’année en cours.",
      acceptedProofs: [
        "Carte d’étudiant ou certificat de scolarité pour l’année en cours",
      ],
      refusedProofs: [
        "Courrier/mail de confirmation d’inscription",
        "Attestation de paiement CVEC",
        "Bulletin scolaire",
      ],
      maxFileCount: 10,
    },
    {
      key: "public",
      value: "PUBLIC",
      explanationText: "J’ajoute un arrêté de nomination.",
      acceptedProofs: [
        "Arrêté de nomination",
        "Attestation de votre employeur",
      ],
      refusedProofs: ["Bulletins de salaire", "Relevés de comptes bancaires"],
      maxFileCount: 10,
    },
    {
      key: "ctt",
      value: "CTT",
      explanationText:
        "J’ajoute mon contrat de travail en cours, complet et signé.\n" +
        "Et si vous n’avez pas de contrat de travail ? Vous pouvez joindre une attestation de votre employeur signée et datée de moins de 3 mois.",
      acceptedProofs: [
        "Contrat de travail complet daté et signé",
        "Attestation de votre employeur précisant l’emploi et la rémunération proposée, la date d’entrée en fonctions envisagée et la durée du contrat",
      ],
      refusedProofs: ["Bulletins de salaire", "Relevés de comptes bancaires"],
      maxFileCount: 10,
    },
    {
      key: "retired",
      value: "RETIRED",
      explanationText:
        "J’ajoute un bulletin de pension retraite. Et si vous n’en avez pas? Vous pouvez joindre votre dernier avis d’imposition complet de moins de 2 ans.",
      acceptedProofs: [
        "Bulletin de pension retraite",
        "Attestation de droit à une pension",
        "Titre de pension de retraite",
        "Avis d’imposition complet de moins de 2 ans",
      ],
      refusedProofs: ["Relevés de comptes bancaires"],
      maxFileCount: 10,
    },
    {
      key: "unemployed",
      value: "UNEMPLOYED",
      explanationText:
        "J’ajoute une attestation d’ouverture de droits à l’ARE ou un avis de situation Pôle Emploi de moins de 3 mois.",
      acceptedProofs: [
        "Attestation d’ouverture de droits à l’ARE",
        "Avis de situation Pôle Emploi de moins de 3 mois",
      ],
      refusedProofs: [
        "Attestation de versement de paiement de cotisations sociales",
      ],
      maxFileCount: 10,
    },
    {
      key: "independent",
      value: "INDEPENDENT",
      explanationText:
        "J’ajoute mon justificatif d’activité professionnelle indépendante en fonction de mon type d’activité.",
      acceptedProofs: [
        "Certificat d’identification de l’Insee comportant les numéros d’identification",
        "Attestation d’inscription au statut d’auto-entrepreneur",
        "Carte professionnelle (profession libérale)",
        "Extrait D1 original du registre des métiers de moins de 3 mois (artisan)",
        "Extrait K ou K bis du registre du commerce et des sociétés de moins de 3 mois (commerçant)",
      ],
      refusedProofs: ["Relevés de comptes bancaires"],
      maxFileCount: 10,
    },
    {
      key: "other",
      value: "OTHER",
      explanationText:
        "J’ajoute un document de moins de 3 mois justifiant de mon activité professionnelle.",
      acceptedProofs: [
        "Attestation d’ouverture de droit AAH (adulte en situation de handicap)",
        "Attestation d’ouverture des droits au RSA (mère/père au foyer)",
        "Toute pièce de moins de 3 mois attestant de l’activité professionnelle (autres cas d’activité)",
        "Déclaration de non-activité si vous êtes sans activité",
      ],
      refusedProofs: ["Relevés de comptes bancaires"],
      maxFileCount: 10,
    },
  ],

  FINANCIAL_DOCS: [
    {
      key: "salary",
      value: "SALARY",
      explanationText:
        "J’ajoute mes trois derniers bulletins de salaire, ou un justificatif de mes indemnités de stage, ou mes deux derniers bilans comptables (non-salariés).",
      acceptedProofs: [
        "3 derniers bulletins de salaire",
        "Justificatif de versement des indemnités de stage",
        "2 derniers bilans comptables ou, si nécessaire, attestation des ressources pour l’exercice en cours délivrés par un comptable (non-salariés)",
      ],
      refusedProofs: [
        "Pièces trop anciennes",
        "Attestation de l’employeur",
        "Relevés de comptes bancaires",
        "RIB",
        "Avis d’imposition",
      ],
      maxFileCount: 3,
    },
    {
      key: "social-service",
      value: "SOCIAL_SERVICE",
      explanationText:
        "J’ajoute mes trois derniers justificatifs de versement de prestations sociales (ARE, CAF, Crous…), un justificatif d’ouverture des droits, ou une attestation de simulation pour les aides au logement.",
      acceptedProofs: [
        "3 derniers justificatifs de versement des prestations sociales et familiales et allocations (ARE, CAF, Crous, etc.)",
        "Justificatif de l’ouverture des droits établis par l’organisme payeur",
        "Attestation de simulation pour les aides au logement établie par la CAF ou par la MSA pour le locataire",
      ],
      refusedProofs: [
        "Pièces trop anciennes",
        "Relevés de comptes bancaires",
        "RIB",
        "Avis d’imposition",
      ],
      maxFileCount: 3,
    },
    {
      key: "rent",
      value: "RENT",
      explanationText:
        "J’ajoute un justificatif de paiement de rente, ou un avis d’imposition avec noms et revenus de la rente visibles.",
      acceptedProofs: [
        "Justification de revenus fonciers, de rentes viagères ou de revenus de valeurs et capitaux mobiliers",
        "Titre de propriété d’un bien immobilier ou dernier avis de taxe foncière",
        "Dernier ou avant-dernier avis d’imposition avec nom et revenus de la rente visibles",
      ],
      refusedProofs: ["Relevés de comptes bancaires", "RIB"],
      maxFileCount: 3,
    },
    {
      key: "pension",
      value: "PENSION",
      explanationText:
        "J’ajoute un bulletin de pension, une attestation de pension, ou un avis d’imposition avec noms et revenus de la pension visibles.",
      acceptedProofs: [
        "Justificatif de versement des indemnités, retraites, pensions perçues lors des 3 derniers mois ou justificatif de l’ouverture des droits établis par l’organisme payeur",
        "Dernier ou avant-dernier avis d’imposition avec nom et revenus de la pension visibles",
      ],
      refusedProofs: [
        "Pièces trop anciennes",
        "Relevés de comptes bancaires",
        "RIB",
      ],
      maxFileCount: 3,
    },
    {
      key: "trading",
      value: "TRADING",
      explanationText: "J’ajoute un avis d’attribution de bourse.",
      acceptedProofs: ["Avis d’attribution de bourse pour l’année en cours"],
      refusedProofs: [
        "Pièces trop anciennes",
        "Relevés de comptes bancaires",
        "RIB",
      ],
      maxFileCount: 3,
    },
  ]
}