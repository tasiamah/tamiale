import type { CatalogCopy } from "./types";

const de: CatalogCopy = {
  frames: {
    "the-marina": {
      collection: "Collection 001 · Die Ikonen",
      personality: "Selbstbewusste Eleganz",
      character: "Architektonisch, bestimmt",
      tagline:
        "Eine Studie in souveräner Geometrie, skulpturalen Linien und zurückhaltender Präsenz.",
      story: [
        "The Marina begann als Zeichnung eines Gebäudes, nicht einer Fassung. Ihre Front ist als abgeflachtes Sechseck geschnitten: acht Kanten, wo die meisten Fassungen eine Rundung nehmen, und jede trifft die nächste in einem Winkel, den das Auge quer durch den Raum liest.",
        "Am Bügel gehalten wirkt die Silhouette klein und diszipliniert. Getragen tut sie das Gegenteil. Die erhöhte Brauenlinie sitzt hoch und gerade, und der kantige Rand gibt dem Gesicht einen Horizont.",
        "Das Acetat wird aus dem Block gefräst statt gespritzt. Das dauert länger, kostet mehr Material und ist der einzige Weg, eine so scharfe Kante zu bekommen, die ihre Politur hält. Zwei von Hand gesetzte Nieten markieren das Endstück. Sie tragen, und sie sind die einzige Stelle, an der sich das Haus ein Ornament erlaubt.",
      ],
      shipsFrom: "Dezember 2026",
      edition: "Edition 001",
      measurements: [
        { label: "Glasbreite" },
        { label: "Glashöhe" },
        { label: "Steg" },
        { label: "Bügellänge" },
        { label: "Gesamtbreite der Front" },
        { label: "Fronttiefe", note: "An der Brauenlinie" },
        { label: "Gewicht", note: "Komplett, mit Gläsern" },
        { label: "Empfohlene Gesichtsbreite", note: "Von Schläfe zu Schläfe" },
      ],
      materials: [
        {
          heading: "Aus dem Block gefrästes Acetat",
          body: "Mazzucchelli-Platte, vor dem Schnitt ausgehärtet und abgelagert, dann aus dem vollen Block gefräst. Die Front wird zehn Tage lang über drei Körnungen trommelpoliert und von Hand fertiggestellt, sodass die Politur im Material sitzt und nicht in einem Lack, der sich durchscheuern kann.",
        },
        {
          heading: "Beschläge aus Neusilber",
          body: "Ein Siebenkammer-Scharnier aus deutschem Neusilber, in das Acetat eingelassen statt auf die Oberfläche gestiftet. Es ist für die Lebensdauer der Fassung ausgelegt und kann von jedem Tamiale-Servicepartner getauscht werden, ohne das Finish anzutasten.",
        },
        {
          heading: "Gläser",
          body: "Nylongläser in drei Tönungen, jede mit gemessener Lichttransmission und angegebener Filterkategorie. Alle drei filtern UVA und UVB bis 400 nm und werden mit ihrer Konformitätsdokumentation geliefert.",
        },
        {
          heading: "Gravur",
          body: "Die Wortmarke ist 0,12 mm tief in den linken Innenbügel graviert, neben der Seriennummer, die das Paar mit seinem digitalen Tamiale-Pass verbindet.",
        },
      ],
      colorways: {
        cognac: {
          lensDescription:
            "Ein warmes Bernsteinbraun, an der Braue am dichtesten, zum Wangenknochen hin aufklarend.",
          imageAlt:
            "The Marina in Onyx-Acetat mit Cognac-Verlaufsglas, Dreiviertelansicht im Studio",
        },
        champagne: {
          lensDescription:
            "Die Signatur des Hauses. Ein blasser Goldschleier, der Hauttöne warm und ehrlich hält.",
          imageAlt:
            "The Marina in Onyx-Acetat mit goldenem Champagne-Verlaufsglas, Dreiviertelansicht im Studio",
        },
        smoke: {
          lensDescription:
            "Neutrales Grau. Die treueste Farbwiedergabe der Kollektion.",
          imageAlt:
            "The Marina in Onyx-Acetat mit grauem Smoke-Glas, Dreiviertelansicht im Studio",
        },
      },
    },
  },
  forthcoming: {
    "The Jordaan": {
      personality: "Kreative Eleganz",
      character: "Fein, ausdrucksstark",
    },
    "The Bahnhof": { personality: "Präzision", character: "Klar, strukturiert" },
    "The Palm": {
      personality: "Moderner Glamour",
      character: "Selbstsicher, skulptural",
    },
    "The Dam": {
      personality: "Zeitlose Haltung",
      character: "Klassisch, mit Kante",
    },
  },
  inDevelopment: "In Entwicklung",
};

export default de;
