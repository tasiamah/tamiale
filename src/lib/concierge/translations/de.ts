import { theMarina } from "@/lib/catalog/frames";

import type { TranslatedRegister } from "./types";

const lenses = theMarina.colorways
  .map((way) => `${way.name} (${way.vlt} % VLT, Kategorie ${way.filterCategory})`)
  .join(", ");

/**
 * The German register. Terms are additive: the English terms stay in place, so
 * a German visitor who types "preorder" or a model name still reaches the
 * right entry. Umlauts are safe here because retrieval strips them.
 */
const de: TranslatedRegister = {
  price: {
    terms: ["preis", "preise", "kostet", "kosten", "wieviel", "wie viel", "teuer", "euro"],
    answer: `The Marina kostet 420 € in Europa, 360 £ im Vereinigten Königreich, 450 $ in den USA und 1.750 AED in den Emiraten. Jeder Markt hat seinen eigenen veröffentlichten Preis; wir rechnen nicht zum Tageskurs um. Die europäischen und britischen Preise verstehen sich inklusive Mehrwertsteuer.`,
    labels: ["The Marina ansehen"],
  },
  preorder: {
    terms: ["vorbestellung", "vorbestellen", "reservieren", "wann", "lieferung", "liefern", "versand", "versandt", "dauert"],
    answer: `Collection 001 ist zur Vorbestellung geöffnet. Die Abbuchung erfolgt bei der Reservierung, Ihr Paar wird aus der Edition zurückgelegt und im ${theMarina.shipsFrom} versandt. Der Versand ist versichert und in jedem von uns bedienten Markt kostenfrei. Verschiebt sich das Datum, erfahren Sie es vorher, und Sie können bis zum Versand jederzeit mit voller Rückerstattung stornieren.`,
    labels: ["Ein Paar reservieren"],
  },
  sizing: {
    terms: ["grosse", "größe", "masse", "maße", "breite", "steg", "bugel", "bügel", "breit", "schmal", "klein", "passt", "passform"],
    answer: `The Marina misst ${theMarina.geometry.lensWidth} mm Glasbreite, ${theMarina.geometry.bridge} mm Steg und ${theMarina.geometry.templeLength} mm Bügel, bei einer Gesamtfront von ${theMarina.geometry.totalWidth} mm. Sie passt zu einem Gesicht von etwa 128 bis 144 mm von Schläfe zu Schläfe. Stehen auf der Innenseite Ihres jetzigen Bügels drei Zahlen, vergleichen Sie zuerst diese. Das ist die verlässlichste Prüfung, die es gibt.`,
    labels: ["Passform schätzen", "Vollständige Spezifikation"],
  },
  lenses: {
    terms: ["glas", "glaser", "gläser", "tonung", "tönung", "farbe", "farben", "dunkel", "hell"],
    answer: `Drei Ausführungen, alle auf demselben Onyx-Acetat: ${lenses}. Smoke ist das neutralste und dunkelste Glas; Champagne ist das hellste und im Porträt das schmeichelhafteste; Ember ist die Signatur der Edition. Jedes Glas filtert UVA und UVB bis 400 nm.`,
    labels: ["Alle drei vergleichen"],
  },
  difference: {
    terms: ["unterschied", "unterschiede", "vergleich", "vergleichen", "zwischen", "welches"],
    answer: `Collection 001 ist eine einzige Silhouette, die Wahl betrifft also das Glas und nicht die Form. Der praktische Unterschied ist das Licht. Smoke mit 18 % Transmission ist die Sonnenbrille für helles, offenes Licht; Champagne mit 38 % kommt einem getönten Glas nahe und bleibt drinnen und in der Dämmerung angenehm; Ember mit 32 % liegt dazwischen und wärmt graues Wetter auf. Smoke ist Kategorie 3, die beiden anderen Kategorie 2.`,
    labels: ["Nebeneinander sehen"],
  },
  suit: {
    terms: ["anzug", "massgeschneidert", "maßgeschneidert", "formell", "hochzeit", "buro", "büro", "abend", "elegant"],
    answer: `Zum Anzug würde das Haus Sie in Onyx mit Smoke setzen. Das Glas bleibt auf Distanz zurückhaltend, und genau das will man neben einem scharfen Revers. Die kantige Braue der Fassung leistet die Arbeit; das Glas hält sich aus dem Gespräch heraus. Champagne ist die Wahl für den Abend, wenn die Augen sichtbar bleiben sollen.`,
    labels: ["Anprobieren"],
  },
  weight: {
    terms: ["gewicht", "leicht", "schwer", "gramm"],
    answer: `The Marina wiegt mit Gläsern 28 Gramm. Für aus dem Block gefrästes Acetat bei dieser Fronttiefe ist das leicht, und das Gewicht ruht auf dem Steg statt auf den Ohren.`,
    labels: [],
  },
  materials: {
    terms: ["material", "acetat", "kunststoff", "scharnier", "hergestellt", "herstellung", "italien", "qualitat", "qualität", "handwerk"],
    answer: `Die Front wird aus massivem Mazzucchelli-Acetat gefräst, zehn Tage lang über drei Körnungen trommelpoliert und von Hand fertiggestellt. Das Scharnier ist eine deutsche Siebenkammer-Einheit aus Neusilber, in das Acetat eingelassen und austauschbar, ohne die Politur anzutasten. In jedes Endstück werden zwei Nieten von Hand gesetzt.`,
    labels: ["Die Handwerksakte lesen"],
  },
  uv: {
    terms: ["schutz", "polarisiert", "polarisierend", "kategorie", "autofahren", "fahren"],
    answer: `Alle drei Gläser filtern UVA und UVB bis 400 nm und werden mit ihrer Konformitätsdokumentation geliefert. Smoke ist Filterkategorie 3; Ember und Champagne sind Kategorie 2. Keines der drei ist zum Start polarisiert. Kategorie 3 eignet sich zum Fahren bei Tag, nicht jedoch bei Nacht.`,
    labels: [],
  },
  tryon: {
    terms: ["anprobe", "anprobieren", "virtuell", "kamera", "spiegel"],
    answer: `Vision Studio setzt die Fassung durch Ihre eigene Kamera auf Ihr Gesicht und schätzt aus derselben Ansicht Ihre Gesichtsbreite und den Sitz des Stegs. Alles läuft auf Ihrem Gerät. Das Video erreicht unsere Server nie, und nichts wird gespeichert, sofern Sie das Passformprofil nicht behalten möchten.`,
    labels: ["Vision Studio betreten"],
  },
  privacy: {
    terms: ["datenschutz", "daten", "dsgvo", "loschen", "löschen", "biometrisch", "gespeichert"],
    answer: `Der Kamerazugriff wird erst angefragt, wenn Sie im Vision Studio den Knopf drücken, und die Bilder werden in Ihrem Browser verarbeitet. Kein Bild, kein Video und kein Gesichtsmerkmal wird übertragen. Ein Passformprofil wird nur auf Ihren Wunsch gespeichert, bleibt im Speicher Ihres Browsers und lässt sich jederzeit in My Tamiale löschen. Sie können kaufen, ohne die Kamera je zu öffnen.`,
    labels: ["Kamera und Gesichtsdaten"],
  },
  returns: {
    terms: ["ruckgabe", "rückgabe", "rucksendung", "rücksendung", "erstattung", "umtausch", "stornieren", "widerruf", "widerrufsrecht"],
    answer: `Dreißig Tage ab Lieferung, ungetragen und im Originaletui, Rücksendung auf unsere Kosten. Vorbestellungen können bis zum Versand der Edition jederzeit mit voller Rückerstattung storniert werden. Ihr gesetzliches Widerrufsrecht bleibt davon unberührt.`,
    labels: ["Rückgabe im Detail"],
  },
  warranty: {
    terms: ["garantie", "gewahrleistung", "gewährleistung", "reparatur", "reparieren", "kaputt", "defekt"],
    answer: `Zwei Jahre auf Herstellungsfehler, und das stehende Angebot, lieber zu reparieren als zu ersetzen. Scharniere, Bügel und Gläser sind allesamt instand zu setzen. Registrieren Sie die Seriennummer im Innenbügel auf Ihrem digitalen Pass, und die Garantie folgt dem Paar statt dem Beleg.`,
    labels: ["Garantie und Reparaturen"],
  },
  passport: {
    terms: ["pass", "reisepass", "seriennummer", "echtheit", "echt", "registrieren", "eigentum", "falschung", "fälschung", "prufen", "prüfen"],
    answer: `Jedes Paar trägt eine Seriennummer, in den linken Innenbügel graviert und auf die Echtheitskarte gedruckt. Ihre Registrierung erzeugt einen digitalen Pass: Kaufnachweis, Garantie, Servicehistorie und Editionsnummer, übertragbar, wenn das Paar den Besitzer wechselt.`,
    labels: ["Einen Pass anlegen"],
  },
  care: {
    terms: ["pflege", "reinigen", "reinigung", "kratzer", "zerkratzt", "waschen"],
    answer: `Vor dem Abwischen unter kühlem Wasser abspülen, denn die meisten Kratzer entstehen, wenn ein trockenes Tuch Staub über das Glas zieht. Nehmen Sie das mitgelieferte Mikrofasertuch, nie Alkohol oder Glasreiniger, und bewahren Sie das Paar im Etui auf statt auf dem Kopf, denn genau das weitet die Scharniere mit der Zeit.`,
    labels: [],
  },
  advisor: {
    terms: ["berater", "beratung", "privatkunden", "sprechen", "mensch", "boutique", "laden", "geschaeft", "geschäft", "showroom", "persoenlich", "persönlich", "besuchen", "termin", "haendler", "händler"],
    answer: `Das Haus verkauft ausschließlich online, es gibt also keine Boutique zu besuchen und keinen Termin einzuhalten. Ein Berater antwortet innerhalb eines Werktags schriftlich: die Größe im Vergleich zu einer Brille, die Sie bereits besitzen, die Glaswahl, oder ob die Fassung überhaupt zu Ihnen passt. Bis dahin setzt Ihnen das Vision Studio die Fassung im Browser auf, jedes Maß ist veröffentlicht, und jedes Paar kann innerhalb von dreißig Tagen zurück.`,
    labels: ["Einem Berater schreiben"],
  },
  order: {
    terms: ["bestellung", "meine bestellung", "sendungsverfolgung", "status", "wo ist", "rechnung"],
    answer: `Bestell- und Sendungsdetails liegen hinter Ihrem Konto, und ich kann sie erst lesen, wenn Sie angemeldet sind. Melden Sie sich in My Tamiale an, verfolge ich das Paar vom Atelier bis an Ihre Tür; andernfalls trägt die Bestätigungsmail denselben Sendungslink.`,
    labels: ["My Tamiale"],
  },
  collection: {
    terms: ["kollektion", "modelle", "andere fassungen", "neu", "neuheit", "nachste", "nächste"],
    answer: `Eine Silhouette ist erschienen: The Marina, in drei Glasausführungen. Vier weitere sind gezeichnet und in Entwicklung, aber noch nicht bestellbar: The Jordaan, The Bahnhof, The Palm und The Dam. Private Clients sehen jede Veröffentlichung, bevor sie angekündigt wird.`,
    labels: ["Das Register", "Frühen Zugang anfragen"],
  },
};

export default de;
