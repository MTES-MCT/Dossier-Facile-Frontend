export const DocumentTypeConstants = {
  IDENTIFICATION_DOCS: [
    {
      key: "identity-card",
      value: "FRENCH_IDENTITY_CARD",
      acceptedProofs: ["Carte d’identité française <b>recto-verso</b>"],
      refusedProofs: [
        "Carte d’identité <b>sans le verso ou périmée</b>",
        "Tout autre document",
      ],
      maxFileCount: 5,
    },
    {
      key: "passport",
      value: "FRENCH_PASSPORT",
      acceptedProofs: ["Passport français (pages 2 et 3)"],
      refusedProofs: ["Tout autre document"],
      maxFileCount: 5,
    },
    {
      key: "permit",
      value: "FRENCH_RESIDENCE_PERMIT",
      acceptedProofs: [
        "Carte de séjour en France temporaire recto-verso en cours de validité, ou périmée si elle est accompagnée du récépissé de la demande de renouvellement de carte de séjour",
        "Visa de travail ou d’études temporaire en France, avec le passeport en complément",
      ],
      refusedProofs: ["Tout autre document"],
      maxFileCount: 5,
    },
    {
      key: "drivers-license",
      value: "DRIVERS_LICENSE",
      acceptedProofs: ["Permis de conduire français ou étranger recto-verso"],
      refusedProofs: ["Tout autre document"],
    },
    {
      key: "other",
      value: "OTHER_IDENTIFICATION",
      acceptedProofs: [
        "Carte d’identité étrangère <b>recto-verso</b>",
        "Passeport étranger (pages 2 et 3)",
        "Carte de résident",
        "Carte de ressortissant d’un État membre de l’UE ou de l’EEE",
        "Justificatif d'identité fourni par France Identité Numérique",
      ],
      refusedProofs: ["Tout autre document"],
      maxFileCount: 5,
    },
  ],

  GUARANTOR_IDENTIFICATION_DOCS: [
    {
      key: "identity-card",
      value: "FRENCH_IDENTITY_CARD",
      acceptedProofs: ["Carte d’identité française <b>recto-verso</b>"],
      refusedProofs: [
        "Carte d’identité <b>sans le verso ou périmée</b>",
        "Tout autre document",
      ],
      maxFileCount: 5,
    },
    {
      key: "passport",
      value: "FRENCH_PASSPORT",
      acceptedProofs: ["Passport français (pages 2 et 3)"],
      refusedProofs: ["Tout autre document"],
      maxFileCount: 5,
    },
    {
      key: "permit",
      value: "FRENCH_RESIDENCE_PERMIT",
      acceptedProofs: [
        "Carte de séjour en France temporaire recto-verso en cours de validité, ou périmée si elle est accompagnée du récépissé de la demande de renouvellement de carte de séjour",
        "Visa de travail ou d’études temporaire en France",
      ],
      refusedProofs: ["Tout autre document"],
      maxFileCount: 5,
    },
    {
      key: "drivers-license",
      value: "DRIVERS_LICENSE",
      acceptedProofs: ["Permis de conduire français ou étranger recto-verso"],
      refusedProofs: ["Tout autre document"],
    },
    {
      key: "other",
      value: "OTHER_IDENTIFICATION",
      acceptedProofs: [
        "Carte d’identité étrangère <b>recto-verso</b>",
        "Passeport étranger (pages 2 et 3)",
        "Carte de résident",
        "Carte de ressortissant d’un État membre de l’UE ou de l’EEE",
        "Justificatif d'identité fourni par France Identité Numérique",
      ],
      refusedProofs: ["Tout autre document"],
      maxFileCount: 5,
    },
  ],

  RESIDENCY_DOCS: [
    {
      key: "tenant",
      value: "TENANT",
      acceptedProofs: [
        "Quittances de loyer des trois derniers mois",
        "Attestation du propriétaire (ou de son mandataire) indiquant que le locataire est à jour de ses loyers et charges",
      ],
      refusedProofs: [
        "Factures",
        "Avis de taxe d’habitation",
        "Relevés de compte bancaire",
      ],
      maxFileCount: 10,
    },
    {
      key: "owner",
      value: "OWNER",
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
      maxFileCount: 10,
    },
    {
      key: "guest",
      value: "GUEST",
      acceptedProofs: [
        "Attestation sur l’honneur du parent <b>datée et signée</b> indiquant que le candidat à la location réside à son domicile, accompagnée d’une pièce d’identité et d’un justificatif de domicile du parent (une simple facture suffit)",
      ],
      refusedProofs: ["Tout autre document"],
      maxFileCount: 10,
    },
    {
      key: "guest-parents",
      value: "GUEST_PARENTS",
      acceptedProofs: [
        "Attestation sur l’honneur de l’hébergeant <b>datée de moins de trois mois et signée</b> indiquant que le candidat à la location réside à son domicile, accompagnée d’une pièce d’identité et d’un justificatif de domicile de l’hébergeant (une simple facture suffit)",
      ],
      refusedProofs: ["Tout autre document"],
      maxFileCount: 10,
    },
    {
      key: "guest-organism",
      value: "GUEST_ORGANISM",
      acceptedProofs: [
        "Attestation d’élection de domicile <b>datée de moins de trois mois et signée</b> de l’organisme d’hébergement (hébergement d’urgence, placement…) indiquant l’adresse de l’hébergement (téléchargeable sur le site <a target='_blank' href='https://www.service-public.fr/simulateur/calcul/16030'>https://www.service-public.fr/simulateur/calcul/16030</a> )",
      ],
      refusedProofs: ["Tout autre document"],
      maxFileCount: 10,
    },
    {
      key: "short-term-rental",
      value: "SHORT_TERM_RENTAL",
      acceptedProofs: [
        "Factures datées, signées de moins de 3 mois de l’organisme de l’hôtel, camping, b&b, etc.",
      ],
      refusedProofs: ["Tout autre document"],
      maxFileCount: 10,
    },
    {
      key: "other-residency",
      value: "OTHER_RESIDENCY",
      acceptedProofs: [],
      refusedProofs: [],
      maxFileCount: 0
    }
  ],

  GUARANTOR_RESIDENCY_DOCS: [
    {
      key: "tenant",
      value: "TENANT",
      acceptedProofs: [
        "Quittances de loyer de moins de trois mois",
        "Facture de moins de trois mois",
        "Dernier avis de taxe d’habitation",
        "Attestation du propriétaire (ou de son mandataire) indiquant que le locataire est à jour de ses loyers et charges",
      ],
      refusedProofs: [
        "Relevés de compte bancaire",
        "Factures de plus de trois mois",
      ],
      maxFileCount: 10,
    },
    {
      key: "owner",
      value: "OWNER",
      acceptedProofs: [
        "Dernier avis de taxe foncière",
        "Facture de moins de trois mois",
        "Titre de propriété de la résidence principale",
      ],
      refusedProofs: [
        "Relevés de compte bancaire",
        "Factures de plus de trois mois",
      ],
      maxFileCount: 10,
    },
    {
      key: "guest",
      value: "GUEST",
      acceptedProofs: [
        "Attestation sur l'honneur de l’hébergeant <b>datée de moins de trois mois et signée</b>",
        "Attestation <b>datée de moins de trois mois et signée</b> de l’organisme d’hébergement (hébergement d’urgence, placement…) indiquant l’adresse de l’hébergement",
      ],
      refusedProofs: ["Tout autre document"],
      maxFileCount: 10,
    },
    {
      key: "guest-organism",
      value: "GUEST_ORGANISM",
      acceptedProofs: [
        "Attestation d’élection de domicile <b>datée de moins de trois mois et signée</b> de l’organisme d’hébergement (hébergement d’urgence, placement…) indiquant l’adresse de l’hébergement (téléchargeable sur le site <a target='_blank' href='https://www.service-public.fr/simulateur/calcul/16030'>https://www.service-public.fr/simulateur/calcul/16030</a> )",
      ],
      refusedProofs: ["Tout autre document"],
      maxFileCount: 10,
    },
    {
      key: "short-term-rental",
      value: "SHORT_TERM_RENTAL",
      acceptedProofs: [
        "Factures datées, signées de moins de 3 mois de l’organisme de l’hôtel, camping, b&b, etc.",
      ],
      refusedProofs: ["Tout autre document"],
      maxFileCount: 10,
    },
    {
      key: "other-residency",
      value: "OTHER_RESIDENCY",
      acceptedProofs: [],
      refusedProofs: [],
      maxFileCount: 0
    }
  ],

  PROFESSIONAL_DOCS: [
    {
      key: "cdi",
      value: "CDI",
      acceptedProofs: [
        "Contrat de travail en cours, complet, daté et signé",
        "Attestation de votre employeur de moins de 3 mois précisant l’emploi et la rémunération proposée et la date d’entrée en fonctions",
      ],
      refusedProofs: [
        "Courrier/mail de confirmation d’embauche",
        "Bulletins de salaire",
        "Relevés de comptes bancaires",
      ],
      maxFileCount: 20,
    },
    {
      key: "cdi-trial",
      value: "CDI_TRIAL",
      acceptedProofs: [
        "Contrat de travail en cours, complet, daté et signé",
        "Attestation de votre employeur de moins de 3 mois précisant l’emploi et la rémunération proposée, la date d’entrée en fonctions envisagée et la durée de la période d’essai.",
      ],
      refusedProofs: [
        "Courrier/mail de confirmation d’embauche",
        "Bulletins de salaire",
        "Relevés de comptes bancaires",
      ],
      maxFileCount: 20,
    },
    {
      key: "cdd",
      value: "CDD",
      acceptedProofs: [
        "Contrat de travail en cours, complet, daté et signé",
        "Attestation de votre employeur de moins de 3 mois précisant l’emploi et la rémunération proposée, la date d’entrée en fonctions et la durée du contrat",
      ],
      refusedProofs: [
        "Courrier/mail de confirmation d’embauche",
        "Bulletins de salaire",
        "Relevés de comptes bancaires",
      ],
      maxFileCount: 20,
    },
    {
      key: "alternation",
      value: "ALTERNATION",
      acceptedProofs: [
        "Contrat d’alternance",
        "Contrat de professionnalisation",
      ],
      refusedProofs: ["Certificat de scolarité"],
      maxFileCount: 20,
    },
    {
      key: "internship",
      value: "INTERNSHIP",
      acceptedProofs: ["Convention de stage"],
      refusedProofs: ["Certificat de scolarité"],
      maxFileCount: 20,
    },
    {
      key: "student",
      value: "STUDENT",
      acceptedProofs: [
        "Carte d’étudiant ou certificat de scolarité pour l’année en cours",
      ],
      refusedProofs: [
        "Courrier/mail de confirmation d’inscription",
        "Attestation de paiement CVEC",
        "Bulletin scolaire",
      ],
      maxFileCount: 20,
    },
    {
      key: "public",
      value: "PUBLIC",
      acceptedProofs: [
        "Arrêté de nomination",
        "Attestation de votre employeur",
      ],
      refusedProofs: ["Bulletins de salaire", "Relevés de comptes bancaires"],
      maxFileCount: 20,
    },
    {
      key: "ctt",
      value: "CTT",
      acceptedProofs: [
        "Contrat de travail complet daté et signé",
        "Attestation de votre employeur précisant l’emploi et la rémunération proposée, la date d’entrée en fonctions envisagée et la durée du contrat",
      ],
      refusedProofs: ["Bulletins de salaire", "Relevés de comptes bancaires"],
      maxFileCount: 20,
    },
    {
      key: "retired",
      value: "RETIRED",
      acceptedProofs: [
        "Bulletin de pension retraite",
        "Attestation de droit à une pension",
        "Titre de pension de retraite",
        "Avis d’imposition complet de moins de 2 ans",
      ],
      refusedProofs: ["Relevés de comptes bancaires"],
      maxFileCount: 20,
    },
    {
      key: "unemployed",
      value: "UNEMPLOYED",
      acceptedProofs: [
        "Attestation d’ouverture de droits à l’ARE",
        "Avis de situation Pôle Emploi de moins de 3 mois",
      ],
      refusedProofs: [
        "Attestation de versement de paiement de cotisations sociales",
      ],
      maxFileCount: 20,
    },
    {
      key: "independent",
      value: "INDEPENDENT",
      acceptedProofs: [
        "Certificat d’identification de l’Insee comportant les numéros d’identification",
        "Attestation d’inscription au statut d’auto-entrepreneur",
        "Carte professionnelle (profession libérale)",
        "Extrait D1 original du registre des métiers de moins de 3 mois (artisan)",
        "Extrait K ou K bis du registre du commerce et des sociétés de moins de 3 mois (commerçant)",
      ],
      refusedProofs: ["Relevés de comptes bancaires"],
      maxFileCount: 20,
    },
    {
      key: "intermittent",
      value: "INTERMITTENT",
      acceptedProofs: [
        "Avis de situation Pôle emploi et contrat de travail éventuel",
      ],
      refusedProofs: [],
      maxFileCount: 20,
    },
    {
      key: "artist",
      value: "ARTIST",
      acceptedProofs: [
        "Avis de situation au répertoire SIRENE de moins de 3 mois",
        "Attestation d’affiliation",
      ],
      refusedProofs: [],
      maxFileCount: 20,
    },
    {
      key: "stay-at-home-parent",
      value: "STAY_AT_HOME_PARENT",
      acceptedProofs: [
        "Attestation de paiement de la CAF",
        "Attestation sur l'honneur qui explique votre situation",
      ],
      refusedProofs: [],
      maxFileCount: 20,
    },
    {
      key: "no-activity",
      value: "NO_ACTIVITY",
      acceptedProofs: [
        "Attestation de paiement de pension",
        "Attestation sur l'honneur qui explique votre situation",
      ],
      refusedProofs: [],
      maxFileCount: 20,
    },
    {
      key: "other",
      value: "OTHER",
      acceptedProofs: [
        "Attestation d’ouverture de droit AAH (adulte en situation de handicap)",
        "Attestation d’ouverture des droits au RSA (mère/père au foyer)",
        "Toute pièce de moins de 3 mois attestant de l’activité professionnelle (autres cas d’activité)",
        "Déclaration de non-activité si vous êtes sans activité",
        "Contrat ou attestation d’engagement en service civique ou volontariat.<br> Photocopie (recto-verso) de votre carte du volontaire",
      ],
      refusedProofs: ["Relevés de comptes bancaires"],
      maxFileCount: 20,
    },
  ],

  GUARANTOR_PROFESSIONAL_DOCS: [
    {
      key: "cdi",
      value: "CDI",
      acceptedProofs: [
        "Bulletin de salaire de moins de 3 mois",
        "Contrat de travail complet daté et signé",
        "Attestation employeur de moins de 3 mois",
      ],
      refusedProofs: [
        "Courrier/mail de confirmation d’embauche",
        "Relevés de comptes bancaires",
      ],
      maxFileCount: 20,
    },
    {
      key: "cdi-trial",
      value: "CDI_TRIAL",
      acceptedProofs: [
        "Bulletin de salaire de moins de 3 mois",
        "Contrat de travail complet daté et signé",
        "Attestation employeur de moins de 3 mois",
      ],
      refusedProofs: [
        "Courrier/mail de confirmation d’embauche",
        "Relevés de comptes bancaires",
      ],
      maxFileCount: 20,
    },
    {
      key: "cdd",
      value: "CDD",
      acceptedProofs: [
        "Bulletin de salaire de moins de 3 mois",
        "Contrat de travail complet daté et signé",
        "Attestation employeur de moins de 3 mois",
      ],
      refusedProofs: [
        "Courrier/mail de confirmation d’embauche",
        "Relevés de comptes bancaires",
      ],
      maxFileCount: 20,
    },
    {
      key: "alternation",
      value: "ALTERNATION",
      acceptedProofs: [
        "Bulletin de salaire de moins de 3 mois",
        "Contrat d’alternance",
      ],
      refusedProofs: [
        "Relevés de comptes bancaires",
        "Certificat de scolarité",
      ],
      maxFileCount: 20,
    },
    {
      key: "internship",
      value: "INTERNSHIP",
      acceptedProofs: ["Convention de stage"],
      refusedProofs: [
        "Relevés de comptes bancaires",
        "Certificat de scolarité",
      ],
      maxFileCount: 20,
    },
    {
      key: "student",
      value: "STUDENT",
      acceptedProofs: [
        "Carte d’étudiant ou certificat de scolarité pour l’année en cours",
      ],
      refusedProofs: [
        "Courrier/mail de confirmation d’inscription",
        "Attestation de paiement CVEC",
        "Bulletin scolaire",
      ],
      maxFileCount: 20,
    },
    {
      key: "public",
      value: "PUBLIC",
      acceptedProofs: [
        "Bulletin de salaire de moins de 3 mois",
        "Arrêté de nomination",
        "Attestation employeur de moins de 3 mois",
      ],
      refusedProofs: ["Relevés de comptes bancaires"],
      maxFileCount: 20,
    },
    {
      key: "ctt",
      value: "CTT",
      acceptedProofs: [
        "Bulletin de salaire de moins de 3 mois",
        "Contrat de travail complet daté et signé",
        "Attestation employeur de moins de 3 mois",
      ],
      refusedProofs: ["Relevés de comptes bancaires"],
      maxFileCount: 20,
    },
    {
      key: "retired",
      value: "RETIRED",
      acceptedProofs: [
        "Bulletin de pension retraite",
        "Attestation de droit à une pension",
        "Un titre de pension de retraite",
        "Avis d’imposition complet de moins de 2 ans avec nom du garant visible",
      ],
      refusedProofs: ["Relevés de comptes bancaires"],
      maxFileCount: 20,
    },
    {
      key: "unemployed",
      value: "UNEMPLOYED",
      acceptedProofs: [
        "Attestation d’ouverture de droits ARE",
        "Avis de situation Pôle Emploi de moins de 3 mois",
      ],
      refusedProofs: [
        "Attestation de versement de paiement de cotisations sociales",
      ],
      maxFileCount: 20,
    },
    {
      key: "independent",
      value: "INDEPENDENT",
      acceptedProofs: [
        "Certificat d’identification de l’Insee comportant les numéros d’identification",
        "Attestation d’inscription au statut d’auto-entrepreneur",
        "Carte professionnelle (profession libérale)",
        "Extrait D1 original du registre des métiers de moins de 3 mois (artisan)",
        "Extrait K ou K bis du registre du commerce et des sociétés de moins de 3 mois (commerçant)",
      ],
      refusedProofs: ["Relevés de comptes bancaires"],
      maxFileCount: 20,
    },
    {
      key: "intermittent",
      value: "INTERMITTENT",
      acceptedProofs: [
        "Avis de situation Pôle emploi et contrat de travail éventuel",
      ],
      refusedProofs: [],
      maxFileCount: 20,
    },
    {
      key: "artist",
      value: "ARTIST",
      acceptedProofs: [
        "Avis de situation au répertoire SIRENE de moins de 3 mois",
        "Attestation d’affiliation",
      ],
      refusedProofs: [],
      maxFileCount: 20,
    },
    {
      key: "stay-at-home-parent",
      value: "STAY_AT_HOME_PARENT",
      acceptedProofs: [
        "Attestation de paiement de la CAF",
        "Attestation sur l'honneur qui explique votre situation",
      ],
      refusedProofs: [],
      maxFileCount: 20,
    },
    {
      key: "no-activity",
      value: "NO_ACTIVITY",
      acceptedProofs: [
        "Attestation de paiement de pension",
        "Attestation sur l'honneur qui explique votre situation",
      ],
      refusedProofs: [],
      maxFileCount: 20,
    },
    {
      key: "other",
      value: "OTHER",
      acceptedProofs: [
        "Attestation d’ouverture de droit AAH (adulte en situation de handicap)",
        "Attestation d’ouverture des droits au RSA (mère/père au foyer)",
        "Toute pièce de moins de 3 mois attestant de l’activité professionnelle (autres cas d’activité)",
        "Déclaration de non-activité si vous êtes sans activité",
      ],
      refusedProofs: ["Relevés de comptes bancaires"],
      maxFileCount: 20,
    },
  ],

  FINANCIAL_DOCS: [
    {
      key: "salary",
      value: "SALARY",
      acceptedProofs: [
        "3 derniers bulletins de salaire",
        "Justificatif de versement des indemnités de stage",
        "2 derniers bilans comptables ou, si nécessaire, attestation des ressources pour l’exercice en cours délivrés par un comptable (non-salariés)",
        "Justificatif de versement des indemnités de stage, de service civique ou la page de votre contrat mentionnant le montant de ces indemnités",
      ],
      refusedProofs: [
        "Pièces trop anciennes",
        "Attestation de l’employeur",
        "Relevés de comptes bancaires",
        "RIB",
        "Avis d’imposition",
      ],
      maxFileCount: 10,
    },
    {
      key: "social-service",
      value: "SOCIAL_SERVICE",
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
      maxFileCount: 10,
    },
    {
      key: "pension",
      value: "PENSION",
      acceptedProofs: [
        "Justificatif de versement des indemnités, retraites, pensions perçues lors des 3 derniers mois ou justificatif de l’ouverture des droits établis par l’organisme payeur",
        "Dernier ou avant-dernier avis d’imposition avec nom et revenus de la pension visibles",
      ],
      refusedProofs: [
        "Pièces trop anciennes",
        "Relevés de comptes bancaires",
        "RIB",
      ],
      maxFileCount: 10,
    },
    {
      key: "rent",
      value: "RENT",
      acceptedProofs: [
        "Justification de revenus fonciers, de rentes viagères ou de revenus de valeurs et capitaux mobiliers",
        "Titre de propriété d’un bien immobilier ou dernier avis de taxe foncière",
        "Dernier ou avant-dernier avis d’imposition avec nom et revenus de la rente visibles",
      ],
      refusedProofs: ["Relevés de comptes bancaires", "RIB"],
      maxFileCount: 10,
    },
    {
      key: "scholarship",
      value: "SCHOLARSHIP",
      acceptedProofs: ["Avis d’attribution de bourse pour l’année en cours"],
      refusedProofs: [
        "Pièces trop anciennes",
        "Relevés de comptes bancaires",
        "RIB",
      ],
      maxFileCount: 10,
    },
    {
      key: "no-income",
      value: "NO_INCOME",
      acceptedProofs: [],
      refusedProofs: [],
      maxFileCount: 0,
    },
  ],

  GUARANTOR_FINANCIAL_DOCS: [
    {
      key: "guarantor_salary",
      value: "SALARY",
      acceptedProofs: [
        "Bulletin de salaire de moins de 3 mois",
        "Attestation de revenus salariés de l’employeur de moins de 3 mois",
        "Justificatif de versement des indemnités de stage",
        "Dernier bilan comptable ou, si nécessaire, attestation des ressources pour l'exercice en cours délivrés par un comptable (non-salariés)",
        "Avis d’imposition complet de moins de 2 ans avec nom du garant visible",
      ],
      refusedProofs: ["Relevés de comptes bancaires"],
      maxFileCount: 10,
    },
    {
      key: "social-service",
      value: "SOCIAL_SERVICE",
      acceptedProofs: [
        "Justificatif de versement des prestations sociales et familiales et allocations (ARE, CAF, Crous, etc.) de moins de 3 mois",
        "Justificatif de l'ouverture des droits établis par l'organisme payeur",
        "Attestation de simulation pour les aides au logement établie par la CAF ou par la MSA pour le garant",
        "Avis d’imposition complet de moins de 2 ans avec nom du garant visible",
      ],
      refusedProofs: ["Relevés de comptes bancaires"],
      maxFileCount: 10,
    },
    {
      key: "pension",
      value: "PENSION",
      acceptedProofs: [
        "Justificatif de versement des indemnités, retraites, pensions perçues lors des 3 derniers mois ou justificatif de l'ouverture des droits établis par l'organisme payeur",
        "Avis d’imposition complet de moins de 2 ans avec nom du garant visible",
      ],
      refusedProofs: ["Relevés de comptes bancaires"],
      maxFileCount: 10,
    },
    {
      key: "rent",
      value: "RENT",
      acceptedProofs: [
        "Justification de revenus fonciers, de rentes viagères ou de revenus de valeurs et capitaux mobiliers",
        "Titre de propriété d’un bien immobilier ou dernier avis de taxe foncière",
        "Avis d’imposition complet de moins de 2 ans avec nom du garant visible",
      ],
      refusedProofs: ["Relevés de comptes bancaires"],
      maxFileCount: 10,
    },
    {
      key: "scholarship",
      value: "SCHOLARSHIP",
      acceptedProofs: ["Avis d’attribution de bourse pour l’année en cours"],
      refusedProofs: ["Relevés de comptes bancaires"],
      maxFileCount: 10,
    },
  ],

  TAX_DOCS: [
    {
      key: "my-name",
      value: "MY_NAME",
      acceptedProofs: ["Avis d’imposition de moins de 2 ans"],
      refusedProofs: [
        "Avis d’imposition incomplet (sans la première page)",
        "Tout avis d’imposition plus ancien",
        "Tout autre document justificatif",
      ],
      maxFileCount: 5,
    },
    {
      key: "my-parents",
      value: "MY_PARENTS",
      acceptedProofs: [],
      refusedProofs: [],
      maxFileCount: 0,
    },
    {
      key: "less-than-year",
      value: "LESS_THAN_YEAR",
      acceptedProofs: [],
      refusedProofs: [],
      maxFileCount: 0,
    },
    {
      key: "other-tax",
      value: "OTHER_TAX",
      acceptedProofs: [],
      refusedProofs: [],
      maxFileCount: 0,
    },
  ],

  GUARANTOR_TAX_DOCS: [
    {
      key: "my-name",
      value: "MY_NAME",
      acceptedProofs: [
        "Avis d’imposition complet de moins de 2 ans avec nom du garant visible",
      ],
      refusedProofs: [
        "Avis d’imposition incomplet (sans la première page)",
        "Tout avis d’imposition plus ancien",
        "Tout autre document justificatif",
      ],
      maxFileCount: 5,
    },
    {
      key: "less-than-year",
      value: "LESS_THAN_YEAR",
      acceptedProofs: [],
      refusedProofs: [],
      maxFileCount: 0,
    },
    {
      key: "other-tax",
      value: "OTHER_TAX",
      acceptedProofs: [],
      refusedProofs: [],
      maxFileCount: 0,
    },
  ],

  REPRESENTATIVE_IDENTIFICATION: [
    {
      key: "identity-card",
      value: "FRENCH_IDENTITY_CARD",
      acceptedProofs: ["Carte d’identité française recto-verso"],
      refusedProofs: [
        "Carte d’identité sans le verso ou périmée",
        "Tout autre document",
      ],
    },
    {
      key: "passport",
      value: "FRENCH_PASSPORT",
      acceptedProofs: ["Passport français (pages 2 et 3)"],
      refusedProofs: ["Tout autre document"],
    },
    {
      key: "permit",
      value: "FRENCH_RESIDENCE_PERMIT",
      acceptedProofs: [
        "Carte de séjour en France temporaire recto-verso en cours de validité, ou périmée si elle est accompagnée du récépissé de la demande de renouvellement de carte de séjour",
        "Visa de travail ou d’études temporaire en France",
      ],
      refusedProofs: ["Tout autre document"],
    },
    {
      key: "drivers-license",
      value: "DRIVERS_LICENSE",
      acceptedProofs: ["Permis de conduire français ou étranger recto-verso"],
      refusedProofs: ["Tout autre document"],
    },
    {
      key: "other",
      value: "OTHER_IDENTIFICATION",
      acceptedProofs: [
        "Carte d’identité étrangère recto-verso",
        "Passeport étranger (pages 2 et 3)",
        "Carte de résident",
        "Carte de ressortissant d’un État membre de l’UE ou de l’EEE",
        "Justificatif d'identité fourni par France Identité Numérique",
      ],
      refusedProofs: ["Tout autre document"],
    },
  ],
};
