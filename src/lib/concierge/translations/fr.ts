import { theMarina } from "@/lib/catalog/frames";

import type { TranslatedRegister } from "./types";

const lenses = theMarina.colorways
  .map((way) => `${way.name} (${way.vlt} % VLT, catégorie ${way.filterCategory})`)
  .join(", ");

/**
 * The French register. Terms are additive: the English terms stay in place, so
 * a French visitor who types "preorder" or a model name still reaches the
 * right entry. Accents are safe here because retrieval strips them.
 */
const fr: TranslatedRegister = {
  price: {
    terms: ["prix", "coute", "coûte", "combien", "tarif", "cher", "euro", "euros"],
    answer: `The Marina est à 420 € en Europe, 360 £ au Royaume-Uni, 450 $ aux États-Unis et 1 750 AED aux Émirats. Chaque marché a son prix publié ; nous ne convertissons pas au cours du jour. Les prix européens et britanniques incluent la TVA.`,
    labels: ["Voir The Marina"],
  },
  preorder: {
    terms: ["precommande", "précommande", "précommander", "reserver", "réserver", "quand", "livraison", "livre", "expedition", "expédition", "delai", "délai"],
    answer: `Collection 001 est ouverte en précommande. Vous êtes débité à la réservation, votre paire est retenue sur l'édition, et elle part en ${theMarina.shipsFrom}. La livraison est assurée et offerte dans tous les marchés que nous servons. Si la date bouge, vous êtes prévenu avant, et vous pouvez annuler avec remboursement intégral à tout moment avant l'expédition.`,
    labels: ["Réserver une paire"],
  },
  sizing: {
    terms: ["taille", "mesure", "mesures", "largeur", "pont", "branches", "large", "etroit", "étroit", "petit", "grand", "convient", "ajustement"],
    answer: `The Marina mesure ${theMarina.geometry.lensWidth} mm de largeur de verre, ${theMarina.geometry.bridge} mm de pont et ${theMarina.geometry.templeLength} mm de branches, pour une façade totale de ${theMarina.geometry.totalWidth} mm. Elle convient à un visage d'environ 128 à 144 mm d'une tempe à l'autre. Si vos lunettes actuelles portent trois nombres à l'intérieur de la branche, comparez-les d'abord à ceux-ci. C'est la vérification la plus fiable qui soit.`,
    labels: ["Estimer votre ajustement", "Fiche technique complète"],
  },
  lenses: {
    terms: ["verre", "verres", "teinte", "couleur", "couleurs", "coloris", "sombre", "clair", "fonce", "foncé"],
    answer: `Trois expressions, toutes sur la même acétate Onyx : ${lenses}. Smoke est la plus neutre et la plus sombre ; Champagne est la plus claire et la plus flatteuse en portrait ; Ember est la signature de l'édition. Chaque verre filtre les UVA et UVB jusqu'à 400 nm.`,
    labels: ["Comparer les trois"],
  },
  difference: {
    terms: ["difference", "différence", "comparer", "comparaison", "entre", "plutot", "plutôt"],
    answer: `Collection 001 est une silhouette unique : le choix porte donc sur le verre et non sur la forme. La différence pratique est la lumière. Smoke, à 18 % de transmission, est le solaire des lumières vives et ouvertes ; Champagne, à 38 %, se rapproche d'un verre teinté et reste confortable à l'intérieur et au crépuscule ; Ember, à 32 %, se place entre les deux et réchauffe les temps gris. Smoke est catégorie 3, les deux autres catégorie 2.`,
    labels: ["Les voir côte à côte"],
  },
  suit: {
    terms: ["costume", "tailleur", "formel", "mariage", "bureau", "soiree", "soirée", "habille", "habillé"],
    answer: `Avec un costume, la maison vous mettrait en Onyx et Smoke. Le verre reste discret à distance, ce qu'on attend à côté d'un revers net. C'est la ligne anguleuse du sourcil qui travaille ; le verre reste en dehors de la conversation. Champagne est le choix du soir si vous voulez garder les yeux visibles.`,
    labels: ["Les essayer"],
  },
  weight: {
    terms: ["poids", "leger", "léger", "lourd", "grammes"],
    answer: `The Marina pèse 28 grammes, verres compris. Pour une acétate taillée dans la masse à cette épaisseur de façade, c'est léger, et le poids repose sur le pont plutôt que sur les oreilles.`,
    labels: [],
  },
  materials: {
    terms: ["matiere", "matière", "acetate", "acétate", "charniere", "charnière", "fabrique", "fabriqué", "fabrication", "italie", "qualite", "qualité"],
    answer: `La façade est taillée dans un bloc d'acétate Mazzucchelli massif, polie au tonneau pendant dix jours en trois grades et finie à la main. La charnière est une unité allemande à sept barillets en maillechort, encastrée dans l'acétate et remplaçable sans toucher au poli. Deux rivets sont posés à la main dans chaque tenon.`,
    labels: ["Lire le dossier savoir-faire"],
  },
  uv: {
    terms: ["protection", "polarise", "polarisé", "polarisant", "categorie", "catégorie", "conduite", "conduire"],
    answer: `Les trois verres filtrent les UVA et UVB jusqu'à 400 nm et sont fournis avec leur documentation de conformité. Smoke est de catégorie 3 ; Ember et Champagne sont de catégorie 2. Aucun des trois n'est polarisé au lancement. La catégorie 3 convient à la conduite de jour mais pas de nuit.`,
    labels: [],
  },
  tryon: {
    terms: ["essayer", "essayage", "essai", "virtuel", "camera", "caméra", "miroir"],
    answer: `Vision Studio place la monture sur votre visage à travers votre propre caméra, et estime votre largeur de visage et la tenue du pont depuis la même vue. Tout tourne sur votre appareil. La vidéo n'atteint jamais nos serveurs, et rien n'est conservé à moins que vous ne choisissiez de garder le profil d'ajustement.`,
    labels: ["Entrer dans Vision Studio"],
  },
  privacy: {
    terms: ["confidentialite", "confidentialité", "donnees", "données", "vie privee", "vie privée", "rgpd", "supprimer", "biometrique", "biométrique"],
    answer: `L'accès à la caméra n'est demandé qu'au moment où vous appuyez sur le bouton dans Vision Studio, et les images sont traitées dans votre navigateur. Aucune image, vidéo ou repère facial n'est transmis. Un profil d'ajustement n'est enregistré que si vous le demandez, reste dans le stockage de votre navigateur, et peut être supprimé depuis My Tamiale à tout moment. Vous pouvez acheter sans jamais ouvrir la caméra.`,
    labels: ["Caméra et données faciales"],
  },
  returns: {
    terms: ["retour", "retours", "remboursement", "rembourser", "echange", "échange", "annuler", "annulation", "retractation", "rétractation"],
    answer: `Trente jours à compter de la livraison, non portées et dans leur étui d'origine, retour à nos frais. Les précommandes peuvent être annulées avec remboursement intégral à tout moment avant l'expédition de l'édition.`,
    labels: ["Les retours en détail"],
  },
  warranty: {
    terms: ["garantie", "reparation", "réparation", "reparer", "réparer", "casse", "cassé", "service"],
    answer: `Deux ans contre les défauts de fabrication, et l'engagement de réparer plutôt que de remplacer. Charnières, branches et verres sont tous réparables. Enregistrez le numéro de série gravé à l'intérieur de la branche sur votre Passeport numérique et la garantie suit la paire plutôt que le reçu.`,
    labels: ["Garantie et réparations"],
  },
  passport: {
    terms: ["passeport", "serie", "série", "authenticite", "authenticité", "authentique", "enregistrer", "propriete", "propriété", "contrefacon", "contrefaçon", "verifier", "vérifier"],
    answer: `Chaque paire porte un numéro de série gravé à l'intérieur de la branche gauche et imprimé sur la carte d'authenticité. L'enregistrer crée un Passeport numérique : preuve d'achat, garantie, historique de service et numéro d'édition, transférable si la paire change de mains.`,
    labels: ["Ouvrir un passeport"],
  },
  care: {
    terms: ["entretien", "nettoyer", "nettoyage", "rayure", "rayer", "laver"],
    answer: `Rincez à l'eau fraîche avant d'essuyer : la plupart des rayures viennent de la poussière traînée sur le verre par un chiffon sec. Utilisez la microfibre fournie, jamais d'alcool ni de nettoyant pour vitres, et rangez la paire dans son étui plutôt que sur votre tête, ce qui est ce qui desserre les charnières avec le temps.`,
    labels: [],
  },
  appointment: {
    terms: ["rendez-vous", "conseiller", "conseillere", "conseillère", "consultation", "appel video", "appel vidéo", "reserver un creneau", "parler", "humain"],
    answer: `Un essayage privé en vidéo avec un conseiller dure une vingtaine de minutes. Il regardera la monture sur vous, la comparera à vos lunettes actuelles et discutera du choix du verre. Sans obligation d'achat et sans frais.`,
    labels: ["Prendre rendez-vous"],
  },
  order: {
    terms: ["commande", "ma commande", "suivi", "statut", "ou est", "où est", "facture"],
    answer: `Le détail de la commande et du suivi se trouve derrière votre compte, et je ne peux le lire qu'une fois que vous êtes connecté. Si vous vous connectez depuis My Tamiale, je peux suivre la paire de l'atelier jusqu'à votre porte ; sinon, l'e-mail de confirmation porte le même lien de suivi.`,
    labels: ["My Tamiale"],
  },
  collection: {
    terms: ["collection", "modeles", "modèles", "autres montures", "nouveau", "nouveaute", "nouveauté", "prochain"],
    answer: `Une seule silhouette est sortie : The Marina, en trois expressions de verre. Quatre autres sont dessinées et en développement, pas encore commandables : The Jordaan, The Bahnhof, The Palm et The Dam. Les clients privés voient chaque sortie avant son annonce.`,
    labels: ["Le registre", "Demander un accès anticipé"],
  },
};

export default fr;
