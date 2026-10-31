import type { LegalCopy } from "./types";

/**
 * A translation of the English drafts, not an independent French policy.
 * French consumer law differs from the English text's assumptions in places
 * (notably the droit de rétractation), so this needs the same review by
 * counsel that the English does, in this market specifically.
 */
const fr: LegalCopy = {
  shipping: {
    title: "Livraison",
    summary:
      "Assurée, suivie et offerte dans tous les marchés que la maison dessert.",
    sections: [
      {
        heading: "Précommandes",
        body: [
          "Collection 001 est vendue en précommande. Le paiement est prélevé à la réservation, et c'est ce qui retient votre paire sur l'édition ; la paire est expédiée en décembre 2026.",
          "Si cette date bouge, vous en serez informé avant qu'elle ne passe, et non après. Un retard de plus de trente jours vous autorise à annuler avec remboursement intégral, et vous pouvez annuler pour n'importe quelle raison à tout moment avant l'expédition.",
        ],
      },
      {
        heading: "Expédition",
        body: [
          "La livraison est offerte et assurée vers l'Europe, le Royaume-Uni, les États-Unis et les Émirats arabes unis. Comptez deux à trois jours ouvrés en Europe, deux à quatre au Royaume-Uni et aux Émirats, et trois à cinq aux États-Unis, à compter de l'expédition et non de la commande.",
          "Une signature est exigée à la livraison. Chaque colis est suivi, et le lien de suivi est envoyé au départ du colis de l'atelier.",
        ],
      },
      {
        heading: "Droits et taxes",
        body: [
          "Les prix en Europe, au Royaume-Uni et aux Émirats incluent la TVA et tout droit d'importation. Les prix aux États-Unis sont hors taxe de vente, calculée au paiement selon l'adresse de livraison.",
          "La maison ne sous-déclare pas la valeur d'un colis et ne peut pas présenter une commande comme un cadeau.",
        ],
      },
    ],
  },
  returns: {
    title: "Retours",
    summary: "Trente jours, non portées, dans leur étui, à nos frais.",
    sections: [
      {
        heading: "Le délai",
        body: [
          "Trente jours à compter de la livraison. La paire doit être non portée et renvoyée dans son étui avec la carte d'authenticité. Les frais de retour sont pris en charge par la maison, et le remboursement est émis sur le moyen de paiement d'origine dans les cinq jours ouvrés suivant le retour de la paire.",
          "Ce délai s'ajoute au droit légal de rétractation de quatorze jours prévu par les règles européennes et britanniques de vente à distance, et ne le remplace pas.",
        ],
      },
      {
        heading: "Annuler une précommande",
        body: [
          "Une précommande peut être annulée avec remboursement intégral à tout moment avant son expédition. Écrivez à clients@tamiale.com avec le numéro de commande ; aucun motif n'est requis et aucun ne vous sera demandé.",
        ],
      },
      {
        heading: "Échanges",
        body: [
          "Pour changer d'expression de verre, renvoyez la paire et réservez celle que vous voulez. Les éditions étant numérotées et restreintes, la maison ne peut pas retenir une seconde paire pendant un échange en cours.",
        ],
      },
    ],
  },
  warranty: {
    title: "Garantie et réparations",
    summary:
      "Deux ans contre les défauts de fabrication, et l'engagement permanent de réparer plutôt que de remplacer.",
    sections: [
      {
        heading: "Ce qui est couvert",
        body: [
          "Deux ans à compter de la livraison contre les défauts de matière et de fabrication : rupture de charnière, délamination de l'acétate, défaillance du traitement des verres, et tout défaut d'assemblage.",
          "La garantie ne couvre pas les dommages accidentels, l'usure normale de la finition, les rayures dues à l'usage, ni les dommages dus à la chaleur. Laisser une paire sur un tableau de bord déforme l'acétate, et aucune maison ne peut garantir contre cela.",
        ],
      },
      {
        heading: "Réparer avant de remplacer",
        body: [
          "Charnières, branches et verres sont tous réparables. Lorsqu'une paire peut être réparée, elle le sera, de préférence à son remplacement, et cela vaut aussi après l'expiration de la garantie, les réparations étant alors facturées au coût.",
          "Enregistrez le numéro de série gravé à l'intérieur de la branche gauche sur un Passeport numérique et la garantie suit la paire plutôt que le reçu, y compris pour un second propriétaire.",
        ],
      },
      {
        heading: "Faire une réclamation",
        body: [
          "Écrivez à clients@tamiale.com avec le numéro de série et une photographie. Un conseiller organisera l'enlèvement. Rien dans cette garantie n'affecte vos droits légaux à l'égard du vendeur.",
        ],
      },
    ],
  },
  privacy: {
    title: "Confidentialité",
    summary: "Ce que la maison collecte, pourquoi, et à quel point c'est peu.",
    sections: [
      {
        heading: "Ce qui est collecté",
        body: [
          "Pour honorer une commande : votre nom, vos adresses de livraison et de facturation, votre adresse e-mail et la commande elle-même. Les données de carte bancaire sont traitées par le prestataire de paiement et n'atteignent jamais les systèmes de Tamiale.",
          "Si vous rejoignez le registre de la maison : votre adresse e-mail, et rien d'autre.",
        ],
      },
      {
        heading: "Ce qui n'est pas collecté",
        body: [
          "Aucune image de caméra, aucune image vidéo, aucun repère facial. Vision Studio traite la vidéo entièrement dans votre navigateur ; rien n'en est transmis. Un profil d'ajustement, si vous en enregistrez un, est écrit dans le stockage de votre propre navigateur et peut être supprimé depuis My Tamiale.",
          "Les montures enregistrées sont également conservées dans votre navigateur plutôt que sur un serveur, et c'est pourquoi elles n'exigent pas de compte.",
        ],
      },
      {
        heading: "Vos droits",
        body: [
          "Au titre du RGPD et des législations équivalentes, vous pouvez demander une copie de vos données, leur rectification ou leur effacement. Écrivez à clients@tamiale.com et comptez une réponse sous trente jours.",
          "La maison ne vend pas de données personnelles et ne partage le registre avec personne.",
        ],
      },
    ],
  },
  "vision-privacy": {
    title: "Caméra et données faciales",
    summary:
      "Vision Studio tourne sur votre appareil. Cette page explique exactement ce que cela signifie.",
    sections: [
      {
        heading: "Où se fait le traitement",
        body: [
          "Le modèle de suivi du visage et son environnement WebAssembly sont servis depuis tamiale.com et exécutés dans votre navigateur. Les images vidéo sont lues depuis la caméra, mesurées, redessinées, puis écartées. Elles ne sont jamais téléversées, et le studio n'effectue aucune requête réseau une fois chargé.",
          "Vous pouvez le vérifier : ouvrez l'inspecteur réseau de votre navigateur et utilisez le studio. Il n'y a aucun trafic.",
        ],
      },
      {
        heading: "Consentement",
        body: [
          "La caméra n'est demandée qu'au moment où vous appuyez sur le bouton, jamais au chargement de la page. Refuser ne vous coûte rien : chaque monture peut être examinée en 3D, chaque mesure est publiée, et toute la boutique fonctionne sans cela.",
        ],
      },
      {
        heading: "Ce qui peut être conservé",
        body: [
          "Uniquement si vous appuyez sur « conserver ce profil » : une largeur de visage estimée, un écart au pont estimé, une description en un mot de vos proportions et la préférence de style que vous avez choisie. Aucune image. C'est écrit dans le stockage local de votre navigateur, pas sur un serveur Tamiale, et « Supprimer ce profil » dans My Tamiale l'efface immédiatement.",
        ],
      },
      {
        heading: "Sur l'exactitude des estimations",
        body: [
          "Une caméra unique n'a aucune notion d'échelle absolue. Chaque millimètre rapporté par le studio est obtenu en supposant que votre écart pupillaire est proche de la moyenne adulte, ce qui est une base solide pour une recommandation et une base fragile pour quoi que ce soit d'autre. Les chiffres sont présentés comme des estimations d'un bout à l'autre et doivent être vérifiés avec une paire de lunettes que vous possédez déjà.",
        ],
      },
    ],
  },
  accessibility: {
    title: "Accessibilité",
    summary:
      "La norme à laquelle ce site est construit, et là où il reste en deçà.",
    sections: [
      {
        heading: "L'objectif",
        body: [
          "WCAG 2.2 niveau AA. En pratique, cela signifie que chaque commande est atteignable et utilisable au clavier, que le focus est toujours visible, que le texte respecte les minimums de contraste avec son fond, que les animations respectent le réglage de mouvement réduit, et que chaque image porte une description de ce qu'elle montre.",
        ],
      },
      {
        heading: "Limites connues",
        body: [
          "L'atelier 3D est un canvas et ne peut pas être lu par un lecteur d'écran. Chaque dimension, matière et finition qu'il montre est publiée en texte dans le tableau technique de la même page, et la vue technique porte une description textuelle complète.",
          "Vision Studio exige une caméra et un visage, et n'est donc pas accessible à tout le monde. C'est un supplément à l'expérience d'achat, jamais une condition de celle-ci.",
        ],
      },
      {
        heading: "Nous le signaler",
        body: [
          "Si quelque chose ici ne fonctionne pas pour vous, écrivez à clients@tamiale.com. Un défaut d'accessibilité est traité comme un défaut, pas comme une demande d'évolution.",
        ],
      },
    ],
  },
  terms: {
    title: "Conditions de vente",
    summary: "L'accord entre vous et la maison.",
    sections: [
      {
        heading: "Commandes",
        body: [
          "Une commande est une offre d'achat. Le contrat est formé lorsque la maison la confirme par e-mail. Si un article est listé par erreur, au mauvais prix, ou n'est plus disponible, la commande peut être refusée et tout montant versé intégralement remboursé.",
        ],
      },
      {
        heading: "Prix et paiement",
        body: [
          "Les prix sont publiés par marché et affichés dans la devise de ce marché. Le paiement est prélevé au moment de la commande, précommandes comprises, et c'est ce paiement qui réserve une paire numérotée sur l'édition.",
        ],
      },
      {
        heading: "Informations produit",
        body: [
          "Les mesures, les poids et les valeurs de transmission des verres sont publiés pour chaque monture. Le rendu des couleurs varie d'un écran à l'autre, et une simulation de verre sur un écran est une approximation d'une expérience, pas une mesure de la transmission lumineuse ni de la performance contre les ultraviolets. La documentation de conformité fournie avec les verres fait foi.",
        ],
      },
      {
        heading: "Droit applicable",
        body: [
          "Les présentes conditions sont régies par le droit néerlandais, sans préjudice des protections impératives du consommateur dont vous disposez dans votre pays de résidence.",
        ],
      },
    ],
  },
};

export default fr;
