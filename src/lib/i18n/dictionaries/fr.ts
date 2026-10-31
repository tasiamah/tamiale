import type { Dictionary } from "./en";

/**
 * Product names stay as they are: The Marina, Onyx, Cognac, Champagne, Smoke
 * and Vision Studio are the house's own words and are not translated in any
 * market. "A Different Perspective." becomes "Un autre regard.", which keeps
 * the double meaning of a viewpoint and a way of looking that the literal
 * translation loses.
 */
const fr: Dictionary = {
  meta: {
    statement: "Un autre regard.",
    description:
      "Tamiale est une maison de lunetterie de luxe contemporaine. La Collection 001 est The Marina, une silhouette architecturale en acétate italien, déclinée en trois verres.",
    keywords: [
      "lunettes de luxe",
      "lunettes de soleil de créateur",
      "montures en acétate",
      "Tamiale",
      "essayage virtuel",
    ],
  },

  nav: {
    collection: "La Collection",
    visionStudio: "Vision Studio",
    house: "La Maison",
    journal: "Journal",
    privateClient: "Client Privé",
    myTamiale: "Mon Tamiale",
  },

  navSummary: {
    collection: "Toutes les montures, modèles uniques, éditions limitées",
    visionStudio: "Essayage virtuel, conseils de taille, vue en 3D",
    house: "Philosophie, matériaux, savoir-faire",
    journal: "Récits éditoriaux, campagnes, collaborations",
    privateClient: "Conseillers, entretien, sorties privées",
    myTamiale: "Commandes, montures enregistrées, passeports numériques",
  },

  header: {
    skipToContent: "Aller au contenu",
    home: "Tamiale, accueil",
    menu: "Menu",
    close: "Fermer",
    bag: "Panier",
    language: "Langue",
  },

  footer: {
    blurb:
      "Une maison de lunetterie contemporaine. Dessinée à Amsterdam, fabriquée en Italie, éditée en séries numérotées.",
    shippingTo: "Livraison vers",
    clientCare: "Service client",
    theHouse: "La Maison",
    legal: "Mentions légales",
    shipping: "Livraison",
    returns: "Retours",
    warranty: "Garantie et réparations",
    contact: "Contact",
    philosophy: "Philosophie",
    craftsmanship: "Savoir-faire",
    journal: "Journal",
    digitalPassport: "Passeport numérique",
    privacy: "Confidentialité",
    terms: "Conditions",
    accessibility: "Accessibilité",
    cameraData: "Caméra et données faciales",
    rights: "Tous droits réservés.",
  },

  commerce: {
    metaDescription: "{name} paraît en {count} expressions de verre, en {edition}, expédiée en {month}.",
    frontElevationMm: "Vue de face, en millimètres",
    drawingPlaceholder: "Provisoire, en attente du plan d'usine",
    lensExpression: "Expression du verre",
    transmission: "Transmission",
    filterCategory: "Catégorie de filtre",
    lens: "Verre",
    reserve: "Réserver",
    reserveFor: "Réserver · {price}",
    reserveThisPair: "Réserver cette paire · {price}",
    spokenFor: "Déjà attribuée",
    expressionSpokenFor: "Cette déclinaison est déjà attribuée",
    tryItOn: "Essayer",
    seeItOnYourFace: "La voir sur votre visage",
    fullSpecification: "Fiche technique complète",
    fullCollection: "Toute la collection",
    ships: "Expédition en {month}",
    shipsFull: "Expédition en {month}.",
    preorderShips: "Précommande · Expédition en {month}",
    saveForLater: "Mettre de côté",
    saved: "Enregistrée",
    speakToAdvisor: "Parler à un conseiller",
    edition: {
      editionOf: "Une édition de {count} en {lens}",
      unsold: "{count} non vendues",
    },
    preorderNote:
      "Réservée aujourd'hui sur l'édition et expédiée en {month}. Annulable avec remboursement intégral à tout moment avant l'expédition.",
    trust: {
      cancelLabel: "Annulation jusqu'à l'expédition",
      cancelDetail: "Remboursement intégral, sans justification",
      deliveryLabel: "Livraison assurée offerte",
      deliveryDetail: "Suivie, sur tous nos marchés",
      returnsLabel: "Retours sous trente jours",
      returnsDetail: "Non portée, dans son étui, à nos frais",
      warrantyLabel: "Garantie de deux ans",
      warrantyDetail: "Réparée de préférence, non remplacée",
    },
    details: {
      measurements: "Dimensions",
      materials: "Matériaux et ferrures",
      delivery: "Livraison et retours",
      deliveryBody:
        "{note}, à partir de {month}. Trente jours pour retourner la paire, non portée et dans son étui, à nos frais. Deux ans contre les défauts de fabrication, la réparation étant proposée avant le remplacement.",
    },
    tabs: {
      studio: "Studio",
      atelier: "Atelier 3D",
      elevation: "Élévation",
    },
    frontElevation: "élévation de face",
  },

  cart: {
    yourBag: "Votre panier",
    close: "Fermer",
    emptyTitle: "Aucune réservation pour l'instant.",
    emptyBody:
      "La Collection 001 est ouverte à la précommande en trois déclinaisons de verre.",
    viewCollection: "Voir la collection",
    remove: "Retirer",
    decrease: "Diminuer la quantité de {name}",
    increase: "Augmenter la quantité de {name}",
    subtotal: "Sous-total",
    subtotalNote: "{tax}. {shipping}, dès l'expédition de l'édition.",
    checkout: "Réserver votre paire",
    checkoutNote:
      "Le paiement est prélevé aujourd'hui. Votre paire est réservée sur l'édition et expédiée à sa sortie.",
    unavailableNote:
      "Le paiement n'est pas encore connecté. Écrivez à {email} et un conseiller réservera la paire pour vous.",
  },

  concierge: {
    interrupted:
      "Quelque chose a interrompu l'échange. Reposez votre question, ou écrivez à info@tamiale.com.",
    title: "Conciergerie",
    open: "Conciergerie",
    close: "Fermer",
    greeting:
      "Bonjour. Je tiens le registre de la Collection 001 : dimensions, verres, dates de sortie et entretien. Demandez directement ; si la question dépasse ce que je sais, je vous passerai un conseiller plutôt que de deviner.",
    placeholder: "Une question sur la taille, les verres ou la livraison",
    send: "Demander",
    thinking: "Consultation du registre…",
    fallback:
      "Cela dépasse ce que je peux répondre avec exactitude, et je préfère ne pas deviner. Un conseiller prendra le relais : écrivez à info@tamiale.com, ou envoyez un mot depuis la page Client Privé, et vous aurez une réponse sous un jour ouvré.",
    fallbackAction: "Écrire à un conseiller",
    suggestions: {
      tailoring: "Quel verre s'accorde à un costume ?",
      widerFace: "Convient-elle à un visage large ?",
      shipping: "Quand la Collection 001 est-elle expédiée ?",
      material: "En quoi la monture est-elle faite ?",
    },
  },

  home: {
    heroLede:
      "Une lunetterie pensée pour celles et ceux qui voient au-delà des conventions. Une silhouette, taillée en Italie, déclinée en trois verres.",
    collectionTitleFirst: "Trois verres.",
    collectionTitleSecond: "Une silhouette.",
    collectionLede:
      "The Marina paraît dans un seul acétate Onyx et trois déclinaisons de verre, chacune avec sa transmission mesurée. Choisir entre elles est une question de lumière, non de forme.",
    visionEyebrow: "Vision Studio",
    visionTitleFirst: "Votre regard.",
    visionTitleSecond: "Votre taille.",
    visionLede:
      "Un miroir numérique plutôt qu'un filtre. Ouvrez la caméra et The Marina se pose là où elle se poserait, à la taille qu'elle aurait, dans le verre que vous envisagez.",
    visionFeatures: {
      tryOnTitle: "Essayage en temps réel",
      tryOnBody:
        "La monture suit votre tête, s'adapte à votre visage et change de verre sur place.",
      fitTitle: "Estimation de la taille",
      fitBody:
        "Largeur du visage et écart du pont lus dans la même vue, comparés aux millimètres publiés.",
      lensTitle: "Vue à travers le verre",
      lensBody:
        "Voyez ce que chacune des trois teintes fait à la lumière devant vous.",
      privacyTitle: "Sur votre appareil",
      privacyBody:
        "Rien ne quitte le navigateur. Aucune image, aucune vidéo, aucun point de repère n'est transmis.",
    },
    visionCta: "Ouvrir le studio",
    craftEyebrow: "Savoir-faire",
    craftTitle: "Ce que les mesures veulent vraiment dire.",
    craftLede:
      "Plutôt que de revendiquer la qualité, la maison publie les chiffres et les procédés qui les produisent. Chaque nombre ci-dessous figure sur le dessin technique.",
    houseEyebrow: "La Maison",
    manifesto:
      "Le vrai luxe n'est jamais accidentel. Il tient à l'équilibre de la forme, de la précision et de l'identité.",
    manifestoTail:
      "Tamiale crée des lunettes pour celles et ceux qui n'ont jamais eu besoin d'une permission pour se distinguer.",
    houseCta: "Lire le dossier de la maison",
    registerEyebrow: "Le Registre",
    registerTitle: "Accès privé.",
    registerLede:
      "Les éditions sont restreintes et proposées au registre de la maison avant toute annonce. Aucune campagne, aucune remise. Simplement un mot lorsqu'une pièce est prête, et la première occasion de la prendre.",
    registerPlaceholder: "vous@exemple.com",
    registerCta: "Demander l'accès",
    registerNote:
      "Un message par saison. Désinscription en un clic. Le registre n'est partagé avec personne.",
    registerThanks: "Vous figurez au registre.",
  },

  collection: {
    theDesign: "Le dessin",
    metaTitle: "La Collection",
    metaDescription:
      "Collection 001 · Les Icônes. The Marina, une silhouette architecturale en acétate Onyx, déclinée en trois expressions de verre et ouverte en précommande.",
    eyebrow: "Collection 001",
    title: "Les Icônes.",
    lede: "La maison ouvre avec une silhouette plutôt qu'un catalogue. The Marina est dessinée comme un hexagone aplati, huit arêtes là où la plupart des montures emploient une courbe, éditée dans un seul acétate Onyx et trois déclinaisons de verre, chacune définie par la lumière qu'elle laisse passer.",
    stats: {
      silhouettes: "Silhouettes éditées",
      expressions: "Déclinaisons de verre",
      edition: "Édition",
      shipping: "Expédition",
    },
    storyEyebrow: "La silhouette",
    openFrame: "Ouvrir la monture",
    upcomingTitleFirst: "Dessinées, et pas",
    upcomingTitleSecond: "encore éditées.",
    upcomingLede:
      "Quatre autres silhouettes complètent la Collection 001. Elles sont en développement et ne peuvent pas être commandées. Le registre de la maison est prévenu dès que l'une est prête, avant tout le monde.",
    inDevelopment: "En développement",
    joinRegister: "Rejoindre le registre",
    breadcrumbCollection: "Collection",
  },

  atelier: {
    threeQuarter: "Trois-quarts",
    front: "Face",
    profile: "Profil",
    plan: "Dessus",
    rear: "Arrière",
    studio: "Studio",
    lamplight: "Lumière de lampe",
    nocturne: "Nocturne",
    rotate: "Faire tourner",
    stop: "Arrêter",
  },

  visionStudio: {
    lens: "Verre",
    opening: "Ouverture du miroir…",
    tryAgain: "Réessayer",
    tracking: "Suivi en cours",
    lookingForFace: "Recherche d'un visage",
    capture: "Capturer",
    transmissionReadout: "{name} · {vlt} % de transmission",
    noCamera: "Aucune caméra n'est disponible sur cet appareil, ou le navigateur refuse de la partager sur cette connexion. Une caméra exige une connexion sécurisée (https).",
    engineFailed: "Le moteur de suivi n'a pas démarré.",
    engineDegraded: "Le moteur de suivi du visage n'a pas pu démarrer sur cet appareil. La caméra reste active, vous pouvez donc utiliser la perspective du verre.",
    estimateMyFit: "Estimer mon ajustement",
    faceWidth: "Largeur du visage",
    bridgeGap: "Écart au pont",
    proportion: "Proportion",
    keepProfile: "Conserver ce profil",
    discard: "Écarter",
    confidenceFair: "correcte",
    confidenceLow: "faible",
    estimateNote: "Estimé à partir d'une seule caméra, en supposant un écart pupillaire moyen. La confiance est {confidence}. Ce n'est pas une mesure et cela ne peut pas garantir l'ajustement réel.",
    estimateNoteLow: "Estimé à partir d'une seule caméra, en supposant un écart pupillaire moyen. La confiance est {confidence}. Placez-vous bien face à la caméra et réessayez. Ce n'est pas une mesure et cela ne peut pas garantir l'ajustement réel.",
    reserveLens: "Réserver {name}",
    recommendation: "Vous avez choisi {style}. Sur cette base, {primary} à {vlt} % de transmission est le plus proche, avec {alternate} en alternative. Cela découle de votre préférence déclarée et de la densité mesurée de chaque verre. Ce n'est pas un jugement sur votre visage.",
    fit: {
      shapes: {
        tapered: "effilées",
        elongated: "allongées",
        square: "carrées",
        rounded: "arrondies",
        balanced: "un ovale équilibré",
      },
      wide: "La façade risque d'être trop large",
      narrow: "La façade risque d'être trop étroite",
      recommended: "À essayer",
      reasonWidth: "Votre visage mesure environ {width} mm d'une tempe à l'autre. {name} est taillée pour {lower} à {upper} mm.",
      reasonBridge: "L'écart entre vos yeux se lit autour de {gap} mm face à un pont de {bridge} mm. À vérifier avec une paire que vous possédez déjà, car le profil du nez compte autant que l'écart.",
      reasonShape: "Vos proportions se lisent comme {shape}. Le sourcil anguleux de The Marina court à l'horizontale sur le visage, et c'est la caractéristique à laquelle on réagit, dans un sens ou dans l'autre.",
    },
    metaTitle: "Vision Studio",
    metaDescription:
      "Essayez The Marina avec votre propre caméra, estimez votre ajustement et comparez les trois verres. Tout tourne sur votre appareil.",
    eyebrow: "Vision Studio",
    titleFirst: "Votre regard.",
    titleSecond: "Votre taille.",
    lede: "Un miroir numérique plutôt qu'un filtre. La monture est tracée à partir de sa propre géométrie d'usine et mise à l'échelle de votre visage : ce que vous voyez est la taille réelle de The Marina.",
    tabMirror: "Miroir numérique",
    tabLens: "Vue à travers le verre",
    mirrorClosed: "Le miroir est fermé.",
    mirrorClosedBody:
      "Ouvrez votre caméra et The Marina se posera là où elle se poserait, à la taille qu'impose votre visage. Le traitement se fait ici, sur votre appareil.",
    openCamera: "Ouvrir la caméra",
    closeCamera: "Fermer la caméra",
    privacyNote:
      "Le suivi du visage s'exécute dans ce navigateur. Aucune image, vidéo ou donnée de repère n'est transmise à Tamiale, et rien n'est conservé sans que vous enregistriez un profil de taille.",
    howThisWorks: "Comment cela fonctionne",
    fitIntelligence: "Conseil de taille",
    fitEstimate: "Estimation de la taille",
    openMirrorFirst: "Ouvrez d'abord le miroir",
    fitPrompt:
      "Le miroir ouvert et le visage face à la caméra, le studio estimera la largeur de votre visage et l'écart du pont, puis les comparera aux millimètres publiés.",
    stated: "Selon la préférence indiquée",
    styles: {
      understated: "Discret",
      understatedNote: "Sobre à distance",
      architectural: "Architectural",
      architecturalNote: "Des arêtes, pas des courbes",
      bold: "Affirmé",
      boldNote: "Vu d'un bout à l'autre d'une pièce",
      classic: "Classique",
      classicNote: "Rien qui le date",
    },
    openFullFrame: "Ouvrir la fiche complète",
    cameraDenied:
      "L'accès à la caméra a été refusé. Vous pouvez l'autoriser depuis l'icône de la barre d'adresse, ou continuer sans, car rien sur ce site n'exige la caméra.",
    estimateCaveat:
      "Une estimation à l'écran, non une mesure. Comparez-la à une paire que vous possédez déjà.",
    simulationCaveat:
      "Une simulation de la teinte à l'écran. Elle ne représente ni la transmission lumineuse certifiée ni la protection UV.",
  },

  house: {
    pillarsEyebrow: "Quatre piliers",
    manifesto: "Tamiale crée des lunettes pour celles et ceux qui n'ont jamais eu besoin d'une permission pour se distinguer.",
    registerHeading: "Rejoindre le registre de la maison.",
    registerLede: "Le registre apprend une sortie avant son annonce, et a la première occasion de la saisir.",
    pillars: [
      {
        title: "Exclusivité",
        body: "Les éditions sont numérotées et restreintes. Quand une expression est épuisée, elle n'est pas rééditée, et la maison ne solde pas ce qu'il reste.",
      },
      {
        title: "Luxe intelligent",
        body: "Vision Studio tourne sur votre appareil, estime au lieu d'affirmer, et le dit. Une technologie qui se survend n'est pas un luxe, c'est un risque.",
      },
      {
        title: "Identité",
        body: "Aucun logo sur la façade. La silhouette est la signature, et le logotype est gravé là où seul celui qui porte la monture le trouvera.",
      },
      {
        title: "Savoir-faire",
        body: "Des mesures publiées, des matières nommées, des transmissions déclarées et une charnière réparable. Tout ce qui est affirmé ici peut être vérifié par un client.",
      },
    ],
    commitments: [
      {
        title: "Réparer avant de remplacer",
        body: "Charnières, branches et verres sont tous réparables. Une monture qui peut être réparée doit l'être.",
      },
      {
        title: "Aucun procédé trompeur",
        body: "Pas de compte à rebours, pas de rareté fabriquée, pas de fenêtre réclamant une adresse avant même que la page ait fini de charger.",
      },
      {
        title: "Technologie honnête",
        body: "Les données faciales ne quittent jamais le navigateur. Les chiffres d'ajustement sont présentés comme des estimations, parce que c'est ce qu'ils sont.",
      },
      {
        title: "Un prix par marché",
        body: "Publié et tenu. Ni converti au cours du jour, ni ajusté selon l'endroit d'où vous avez cliqué.",
      },
    ],
    metaTitle: "La Maison",
    metaDescription:
      "Dessinée à Amsterdam, fabriquée en Italie, éditée en séries numérotées. Les positions que tient la maison, et les quatre choses qu'elle ne fera pas.",
    eyebrow: "La Maison",
    titleFirst: "Le vrai luxe n'est",
    titleSecond: "jamais accidentel.",
    lede: "Tamiale est une maison de lunetterie contemporaine. Dessinée à Amsterdam, fabriquée en Italie, éditée en séries numérotées, et consignée par écrit pour pouvoir être vérifiée.",
    positionEyebrow: "La position",
    positionTitle: "Ce que la maison défend.",
    positionLede:
      "Écrit comme des positions que la maison tient, non comme des slogans.",
    commitmentsEyebrow: "Engagements",
    commitmentsTitle: "Quatre choses que la maison ne fera pas.",
    registerTitleFirst: "Rejoindre le",
    registerTitleSecond: "registre de la maison.",
  },

  journal: {
    metaTitle: "Journal",
    metaDescription:
      "Sur le dessin, le savoir-faire et la possession. Les arguments derrière les objets, écrits par la maison.",
    eyebrow: "Journal",
    title: "Écrits de la maison.",
    lede: "Sur le dessin, le métier et la possession. Non du remplissage pour moteurs de recherche, mais les arguments derrière les objets.",
    readingTime: "{minutes} min",
    continueReading: "Poursuivre la lecture",
    allEntries: "Tous les articles",
  },

  privateClient: {
    metaTitle: "Client Privé",
    metaDescription:
      "Une ligne directe vers un conseiller qui connaît les montures. Accès anticipé aux éditions, entretien par numéro de série et une réponse honnête avant l'achat.",
    eyebrow: "Client Privé",
    titleFirst: "Quelqu'un qui",
    titleSecond: "connaît les montures.",
    lede: "Acheter des lunettes à ce prix sans les poser sur son visage est une hésitation légitime. La maison ne vend qu'en ligne : elle y répond par des millimètres publiés, un miroir que vous ouvrez dans votre navigateur, trente jours pour renvoyer la paire, et un conseiller qui vous dira de ne pas acheter.",
    services: {
      accessTitle: "Accès anticipé",
      accessBody:
        "Les sorties sont proposées au registre avant d'être annoncées. Les éditions sont assez restreintes pour que ce soit la différence entre avoir le choix et en entendre parler.",
      directTitle: "Une ligne directe",
      directBody:
        "Un conseiller, un seul fil, aussi longtemps que la paire vous appartient. Taille, entretien, réparations, et à l'occasion la réponse honnête qu'une monture ne vous convient pas.",
      serviceTitle: "Entretien et réparation",
      serviceBody:
        "Les paires enregistrées sont suivies par leur numéro de série. L'atelier sait quelle charnière, quelle finition et quelle série de production sans vous le demander.",
    },
    enquiriesEyebrow: "Demandes",
    enquiriesTitle: "Écrire à un conseiller.",
    enquiriesLede:
      "Il n'y a ni boutique ni rendez-vous à tenir. Envoyez un mot : un conseiller répondra par écrit sous un jour ouvré, avec les mesures et la réponse honnête plutôt qu'un appel commercial.",
    orWrite: "Ou écrire directement",
    form: {
      elsewhere: "Ailleurs",
      name: "Nom",
      email: "E-mail",
      region: "Où vous êtes",
      interest: "Ce dont vous souhaitez parler",
      measurements:
        "Facultatif. Les dimensions d'une paire que vous possédez déjà sont la chose la plus utile que vous puissiez apporter.",
      submit: "Envoyer le mot",
      sending: "Envoi…",
      thanks: "Bien reçu. Un conseiller écrira sous un jour ouvré.",
      error:
        "L'envoi a échoué. Écrivez à {email} et nous reprendrons la demande là-bas.",
    },
  },

  passport: {
    noRecordTitle: "Aucun passeport pour ce numéro.",
    noRecordBody: "Le registre lie un numéro de série à une pièce au moment de sa fabrication. Un numéro non reconnu signifie donc l'une de trois choses : la paire n'a pas encore été sérialisée, le numéro a été mal saisi, ou la paire n'est pas des nôtres.",
    noRecordSpecimen: "Collection 001 n'est pas entrée en production, aucun numéro de série client n'est donc actif. Le spécimen est",
    backToPassports: "Retour aux passeports",
    askAdvisor: "Demander à un conseiller",
    verified: "Vérifié",
    serviceHistory: "Historique de service",
    request: "Demande",
    bookService: "Demander un entretien",
    warrantyCovers: "Ce que couvre la garantie",
    recordCaveat: "Fiche illustrative. Le registre de production lie chaque numéro de série à une pièce fabriquée en sortie de chaîne, et un enregistrement peut être révoqué ou transféré par la maison. Un code imprimé ne constitue pas à lui seul une preuve d'authenticité.",
    metaTitle: "Passeport numérique",
    metaDescription:
      "Un registre que la maison tient pour une paire plutôt que pour un achat : numéro d'édition, garantie, historique de service et preuve d'achat.",
    eyebrow: "Propriété",
    titleFirst: "Le Passeport",
    titleSecond: "numérique.",
    lede: "Un registre que la maison tient pour une paire plutôt que pour un achat. Il contient le numéro d'édition, la garantie, l'historique d'entretien et la preuve d'achat, et il survit à la perte de votre adresse e-mail.",
    steps: {
      findTitle: "Trouver le numéro de série",
      findBody:
        "Gravé sur la branche gauche intérieure à 0,12 mm de profondeur, et imprimé sur la carte d'authenticité dans l'étui.",
      registerTitle: "L'enregistrer",
      registerBody:
        "Le numéro est lié à l'exemplaire dès sa fabrication. L'enregistrement vous attribue ce lien, et la maison peut le révoquer en cas de litige.",
      keepTitle: "Le garder, ou le transmettre",
      keepBody:
        "Garantie, historique de réparation et preuve d'achat suivent le passeport. Si la paire change de mains, le passeport l'accompagne.",
    },
    lookupLabel: "Rechercher un passeport",
    lookupPlaceholder: "TM-001-00000",
    lookupCta: "Ouvrir le passeport",
    lookupNote:
      "Le registre n'est pas encore lié aux exemplaires de production. Un spécimen est publié afin que l'interface puisse être examinée.",
    specimen: "Spécimen",
    notReal: "À titre indicatif. Produit non enregistré.",
    fields: {
      passport: "Passeport numérique du produit",
      authenticity: "Authenticité",
      registered: "Enregistré",
      serial: "Numéro de série",
      edition: "Édition",
      made: "Fabriquée",
      registeredTo: "Enregistrée au nom de",
      notRegistered: "Pas encore enregistrée",
      warrantyUntil: "Garantie jusqu'au",
    },
    notFoundTitle: "Passeport introuvable.",
    notFoundBody:
      "Ce numéro de série ne figure pas au registre. Vérifiez la gravure sur la branche gauche intérieure, ou écrivez à {email}.",
    backToPassport: "Retour au passeport",
  },

  legal: {
    policies:
      "Politiques",
    updated:
      "Mise à jour le {date}",
    draftNote:
      "Politique provisoire, rédigée d'après les positions que la maison a prises ailleurs sur ce site, puis traduite de l'anglais. Elle n'a pas été revue par un avocat et doit être vérifiée au regard du droit de la consommation de chaque marché avant le lancement.",
  },

  myTamiale: {
    faceWidth: "Largeur du visage",
    proportion: "Proportion",
    estimatedOn: "Estimé dans votre navigateur le {date}. Aucune image n'a été conservée, et ce chiffre n'a jamais été transmis à Tamiale.",
    deleteProfile: "Supprimer ce profil",
    savedSummary: "{vlt} % de transmission · Catégorie {category} · Expédition en {month}",
    metaTitle: "My Tamiale",
    metaDescription:
      "Vos montures enregistrées et votre profil d'ajustement, conservés dans ce navigateur et nulle part ailleurs.",
    eyebrow: "Mon Tamiale",
    title: "Mon Tamiale.",
    lede: "Les montures enregistrées et votre profil de taille résident dans ce navigateur et nulle part ailleurs. Rien ici n'a exigé de compte, et vous pouvez tout supprimer en une seule action.",
    savedFrames: "Montures enregistrées",
    nothingSaved: "Rien d'enregistré pour l'instant.",
    nothingSavedBody:
      "Enregistrez une déclinaison depuis n'importe quelle fiche et elle vous attendra ici. Aucun compte, aucun e-mail, aucun rappel dans trois jours.",
    viewCollection: "Voir la collection",
    fitProfile: "Profil de taille",
    fitProfileBody:
      "Vision Studio peut estimer la largeur de votre visage et l'écart du pont depuis votre caméra et conserver le résultat ici, sur cet appareil uniquement.",
    openVisionStudio: "Ouvrir Vision Studio",
    ordersTitle: "Commandes et passeports",
    ordersBody:
      "Les commandes, le suivi et les passeports enregistrés dépendent d'un compte Tamiale. Les comptes clients sont fournis avec la boutique Shopify et ne sont pas encore reliés à ce déploiement : il n'y a donc rien où se connecter.",
    aboutPassports: "À propos des passeports numériques",
    forget: "Supprimer tout ce qui est conservé ici",
    forgetDone: "Supprimé.",
  },

  notFound: {
    title: "404",
    body: "Cette page ne fait pas partie de la maison.",
    collection: "La collection",
    home: "Retour à l'accueil",
  },

  region: {
    eu: "Europe",
    uk: "Royaume-Uni",
    us: "États-Unis",
    ae: "Émirats arabes unis",
    taxEu: "TVA incluse",
    taxUk: "TVA et droits inclus",
    taxUs: "Taxe de vente calculée au paiement",
    taxAe: "TVA et droits inclus",
    shipEu: "Livraison assurée offerte, 2 à 3 jours ouvrés",
    shipUk: "Livraison assurée offerte, 2 à 4 jours ouvrés",
    shipUs: "Livraison assurée offerte, 3 à 5 jours ouvrés",
    shipAe: "Livraison assurée offerte, 2 à 4 jours ouvrés",
    label: "Livraison vers",
    vatIncluded: "TVA incluse",
  },
};

export default fr;
