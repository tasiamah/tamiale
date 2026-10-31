import type { CatalogCopy } from "./types";

const fr: CatalogCopy = {
  frames: {
    "the-marina": {
      collection: "Collection 001 · Les Icônes",
      personality: "Sophistication affirmée",
      character: "Architectural, imposant",
      tagline:
        "Une étude de géométrie assumée, aux lignes sculptées et à la présence retenue.",
      story: [
        "The Marina est née du dessin d'un bâtiment, pas d'une monture. Sa façade est taillée en hexagone aplati : huit arêtes là où la plupart des montures emploient une courbe, chacune rejoignant la suivante selon un angle que l'œil lit d'un bout à l'autre d'une pièce.",
        "Tenue par la branche, la silhouette paraît petite et disciplinée. Portée, elle fait l'inverse. La ligne de sourcil relevée se tient haute et droite, et le cerclage anguleux donne un horizon au visage.",
        "L'acétate est taillée dans la masse plutôt qu'injectée, ce qui est plus lent, gaspille davantage de matière, et reste la seule façon d'obtenir une arête aussi nette qui garde son poli. Deux rivets posés à la main marquent le tenon. Ils sont structurels, et c'est le seul endroit où la maison s'autorise un ornement.",
      ],
      shipsFrom: "mars 2027",
      edition: "Édition 001",
      measurements: [
        { label: "Largeur de verre" },
        { label: "Hauteur de verre" },
        { label: "Pont" },
        { label: "Longueur de branche" },
        { label: "Largeur totale de façade" },
        { label: "Épaisseur de façade", note: "À la ligne de sourcil" },
        { label: "Poids", note: "Complète, verres compris" },
        { label: "Largeur de visage conseillée", note: "D'une tempe à l'autre" },
      ],
      materials: [
        {
          heading: "Acétate italienne taillée dans la masse",
          body: "Plaque Mazzucchelli, séchée et reposée avant la coupe, puis taillée dans le bloc plein. La façade est polie au tonneau pendant dix jours en trois grades d'abrasif et finie à la main, de sorte que le poli vit dans la matière plutôt que dans un vernis qui finit par s'user.",
        },
        {
          heading: "Quincaillerie en maillechort",
          body: "Une charnière à sept barillets en maillechort allemand, encastrée dans l'acétate plutôt que fixée en surface. Elle est prévue pour la durée de vie de la monture et peut être remplacée par n'importe quel partenaire de service Tamiale sans toucher à la finition.",
        },
        {
          heading: "Verres",
          body: "Verres en nylon en trois teintes, chacune avec une transmission lumineuse mesurée et une catégorie de filtre déclarée. Les trois filtrent les UVA et UVB jusqu'à 400 nm et sont fournis avec leur documentation de conformité.",
        },
        {
          heading: "Gravure",
          body: "Le logotype est gravé à l'intérieur de la branche gauche sur 0,12 mm de profondeur, à côté du numéro de série qui lie la paire à son Passeport numérique Tamiale.",
        },
      ],
      colorways: {
        ember: {
          lensDescription:
            "Un dégradé rouge chaud qui brûle au sourcil et s'éclaircit vers la pommette.",
          imageAlt:
            "The Marina en acétate Onyx avec un verre dégradé rouge Ember, vue de trois quarts en studio",
        },
        champagne: {
          lensDescription:
            "La signature de la maison. Un voile d'or pâle qui garde les carnations chaudes et justes.",
          imageAlt:
            "The Marina en acétate Onyx avec un verre dégradé doré Champagne, vue de trois quarts en studio",
        },
        smoke: {
          lensDescription:
            "Gris neutre. Le rendu des couleurs le plus fidèle de la collection.",
          imageAlt:
            "The Marina en acétate Onyx avec un verre gris Smoke, vue de trois quarts en studio",
        },
      },
    },
  },
  forthcoming: {
    "The Jordaan": {
      personality: "Élégance créative",
      character: "Raffiné, expressif",
    },
    "The Bahnhof": { personality: "Précision", character: "Net, structuré" },
    "The Palm": {
      personality: "Glamour contemporain",
      character: "Assuré, sculptural",
    },
    "The Dam": {
      personality: "Allure intemporelle",
      character: "Classique, avec du mordant",
    },
  },
  inDevelopment: "En développement",
};

export default fr;
