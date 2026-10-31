import type { GuideCopy } from "./types";

const fr: GuideCopy = {
  metaTitle: "Lunettes de soleil selon la forme du visage",
  metaDescription:
    "Quelles lunettes de soleil pour votre visage : ce que prétendent les conventions sur les formes, leurs limites, et les deux mesures à prendre.",
  eyebrow: "Guide",
  title: "Les lunettes de soleil et la forme de votre visage",
  standfirst:
    "Ce que prétendent les conventions sur les formes de visage, où elles cessent d'être utiles, et les deux mesures qui valent mieux que toutes.",
  intro: [
    "Chaque maison de lunetterie publie son tableau des formes de visage, et la plupart sont écrits comme de la physique. Les visages ronds appellent des montures anguleuses. Les visages carrés, des montures rondes. Les visages ovales, apparemment, appellent tout.",
    "Ce sont des conventions, pas des mesures. Elles décrivent une habitude de goût largement partagée, ce qui existe réellement et mérite d'être connu, mais personne n'a démontré qu'une règle de forme prédit ce que vous aimerez dans le miroir. Les deux choses qui se mesurent vraiment sont la largeur d'une monture et l'endroit où elle se pose sur le nez, et ce sont les deux seules que ce guide traite comme des faits.",
    "Suit la convention énoncée simplement, avec ses limites indiquées, puis une façon de vous mesurer pour pouvoir la contredire.",
  ],
  shapesHeading: "Cinq formes, et ce que l'on en dit réellement",
  recogniseLabel: "Comment la reconnaître",
  conventionLabel: "Ce que dit la convention",
  marinaLabel: "Ce que donne The Marina",
  shapes: {
    oval: {
      name: "Ovale",
      recognise:
        "Les pommettes sont le point le plus large, le front dépasse légèrement la mâchoire, et la ligne de la tempe au menton s'incurve sans former d'angle. Le visage est nettement plus long que large.",
      convention:
        "Que presque toutes les montures conviennent. C'est moins un compliment que l'aveu que le tableau n'a plus rien à dire.",
      marina:
        "Une ligne de sourcil droite donne à un visage ovale une horizontale, la seule chose que cette forme ne fournit pas d'elle-même. The Marina est une façade moyenne et non surdimensionnée : elle tend donc à paraître proportionnée plutôt que déclarative.",
    },
    round: {
      name: "Rond",
      recognise:
        "La largeur et la longueur sont proches, les joues sont pleines, et la mâchoire tourne sans angle visible.",
      convention:
        "Des montures anguleuses, au motif qu'une droite contraste avec une courbe et que le contraste flatte.",
      marina:
        "C'est le cas pour lequel la convention a été écrite : huit arêtes droites et un sourcil de niveau face à un visage qui n'a ni l'un ni l'autre. Que cela se lise comme une structure ou comme une sévérité relève du goût, et c'est précisément pourquoi il vaut la peine de le voir sur son propre visage avant de trancher.",
    },
    square: {
      name: "Carré",
      recognise:
        "La mâchoire est large et tourne à angle visible, la racine des cheveux est droite, et la largeur à la mâchoire est proche de celle aux tempes.",
      convention:
        "Des montures arrondies ou ovales, pour adoucir la mâchoire.",
      marina:
        "La convention s'y oppose. Dans les faits, l'épaule chanfreinée de The Marina forme un angle plus doux que la mâchoire qu'elle surplombe, et une monture dont les angles sont plus doux que ceux du visage peut se lire comme un choix plutôt que comme une répétition. C'est la forme pour laquelle l'essayage compte le plus.",
    },
    heart: {
      name: "Cœur",
      recognise:
        "Le front et les pommettes sont larges, le menton est étroit et pointu, et la racine des cheveux peut plonger au centre.",
      convention:
        "Des montures qui ne sont pas lourdes du haut, pour que la largeur ne soit pas toute rassemblée au-dessus des yeux.",
      marina:
        "Le sourcil est la partie la plus lourde de cette monture, ce que la convention lui reproche. Le contrepoids est la largeur : la façade n'est pas large, elle s'achève donc près de la pommette plutôt qu'au-delà.",
    },
    oblong: {
      name: "Allongé",
      recognise:
        "La longueur l'emporte nettement sur la largeur, les joues sont plates plutôt que pleines, et le front et la mâchoire mesurent à peu près la même chose.",
      convention:
        "Des montures plus hautes, pour couper le visage à l'horizontale et le raccourcir.",
      marina:
        "Le verre est d'une hauteur moyenne et non généreuse : The Marina ne répond donc qu'à moitié. Le sourcil de niveau fait le travail horizontal demandé ; la hauteur, non.",
    },
  },
  measureHeading: "Mesurez-vous d'abord",
  measure: [
    "Un nom de forme est une approximation. Deux chiffres n'en sont pas, et les deux se prennent devant un miroir avec un mètre ruban en moins d'une minute. Ce sont aussi les chiffres que toute l'industrie imprime sur ses fiches techniques : ils permettent de comparer des montures entre marques plutôt que des adjectifs.",
  ],
  measureSteps: [
    {
      title: "D'une tempe à l'autre",
      body: "Mesurez en ligne droite au point le plus large du visage, en général juste au-dessus des oreilles. La largeur totale d'une monture doit tomber à environ cinq millimètres près de ce chiffre. Chaque fiche produit ici publie sa largeur totale.",
    },
    {
      title: "L'écart entre les yeux",
      body: "La distance entre les coins internes des yeux. C'est le chiffre qui décide si une monture reste en place ou glisse, et il compte davantage que la largeur totale. Le profil du nez compte autant que l'écart : prenez ce nombre comme un point de départ.",
    },
    {
      title: "Une paire que vous possédez déjà",
      body: "La référence la plus fiable dont vous disposez. Lisez les trois chiffres imprimés à l'intérieur de la branche de vos lunettes actuelles et confrontez-les à ceux publiés ici. Cette comparaison vaut mieux que n'importe quel tableau, y compris celui-ci.",
    },
  ],
  caveat:
    "Rien de tout cela n'est une prescription. Les conventions ci-dessus sont rapportées parce qu'elles sont répandues, non parce qu'elles ont été démontrées, et la maison ne vous dira pas qu'une forme de visage vous oblige à porter une forme de monture. Les chiffres sont la part à laquelle se fier.",
  cta: {
    heading: "Essayez, puis décidez",
    body: "Vision Studio ouvre votre caméra dans le navigateur, estime la largeur de votre visage et l'écart entre vos yeux, et place la monture là où elle se poserait. Rien n'est envoyé, et rien n'est conservé sans votre demande.",
    label: "Ouvrir Vision Studio",
  },
};

export default fr;
