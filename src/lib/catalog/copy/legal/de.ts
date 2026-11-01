import type { LegalCopy } from "./types";

/**
 * A translation of the English drafts, not an independent German policy.
 * German law imposes obligations the English text does not anticipate, in
 * particular the Widerrufsbelehrung and the Impressum, so this needs review
 * by counsel in this market specifically before the store opens there.
 */
const de: LegalCopy = {
  shipping: {
    title: "Versand",
    summary:
      "Versichert, nachverfolgt und kostenfrei in jedem Markt, den das Haus bedient.",
    sections: [
      {
        heading: "Vorbestellungen",
        body: [
          "Collection 001 wird als Vorbestellung verkauft. Die Zahlung erfolgt bei der Reservierung, und genau das hält Ihr Paar in der Edition zurück; versandt wird es im Dezember 2026.",
          "Verschiebt sich dieses Datum, erfahren Sie es, bevor es verstreicht, nicht danach. Eine Verzögerung von mehr als dreißig Tagen berechtigt Sie zur Stornierung mit voller Rückerstattung, und Sie können bis zum Versand jederzeit und ohne Grund stornieren.",
        ],
      },
      {
        heading: "Zustellung",
        body: [
          "Der Versand ist kostenfrei und versichert nach Europa, ins Vereinigte Königreich, in die USA und in die Vereinigten Arabischen Emirate. Rechnen Sie mit zwei bis drei Werktagen in Europa, zwei bis vier im Vereinigten Königreich und in den Emiraten und drei bis fünf in den USA, gerechnet ab Versand und nicht ab Bestellung.",
          "Bei der Zustellung ist eine Unterschrift erforderlich. Jedes Paket wird nachverfolgt, und der Sendungslink wird verschickt, sobald das Paket das Atelier verlässt.",
        ],
      },
      {
        heading: "Zölle und Steuern",
        body: [
          "Die Preise in Europa, im Vereinigten Königreich und in den Emiraten verstehen sich inklusive aller Steuern und etwaiger Einfuhrzölle. Die Preise in den USA verstehen sich ohne Sales Tax, die beim Bezahlen anhand der Lieferadresse berechnet wird.",
          "Das Haus deklariert den Wert einer Sendung nicht zu niedrig und kann eine Bestellung nicht als Geschenk kennzeichnen.",
        ],
      },
    ],
  },
  returns: {
    title: "Rückgabe",
    summary: "Dreißig Tage, ungetragen, im Etui, auf unsere Kosten.",
    sections: [
      {
        heading: "Die Frist",
        body: [
          "Dreißig Tage ab Lieferung. Das Paar muss ungetragen sein und im Etui mit der Echtheitskarte zurückgesandt werden. Die Rücksendekosten trägt das Haus, und die Erstattung erfolgt auf das ursprüngliche Zahlungsmittel innerhalb von fünf Werktagen nach Eingang des Paares.",
          "Diese Frist tritt neben das gesetzliche vierzehntägige Widerrufsrecht nach den Fernabsatzregeln der EU und des Vereinigten Königreichs und ersetzt es nicht.",
        ],
      },
      {
        heading: "Eine Vorbestellung stornieren",
        body: [
          "Eine Vorbestellung kann bis zum Versand jederzeit mit voller Rückerstattung storniert werden. Schreiben Sie an info@tamiale.com unter Angabe der Bestellnummer; ein Grund ist nicht erforderlich und wird nicht erfragt.",
        ],
      },
      {
        heading: "Umtausch",
        body: [
          "Um die Glasausführung zu wechseln, senden Sie das Paar zurück und reservieren Sie das gewünschte. Da die Editionen nummeriert und klein sind, kann das Haus während eines laufenden Umtauschs kein zweites Paar zurückhalten.",
        ],
      },
    ],
  },
  warranty: {
    title: "Garantie und Reparaturen",
    summary:
      "Zwei Jahre auf Herstellungsfehler, und das stehende Angebot, zu reparieren statt zu ersetzen.",
    sections: [
      {
        heading: "Was abgedeckt ist",
        body: [
          "Zwei Jahre ab Lieferung auf Material- und Fertigungsfehler: Scharnierbruch, Delamination des Acetats, Versagen der Glasbeschichtung und jeder Montagefehler.",
          "Nicht abgedeckt sind Unfallschäden, normale Abnutzung des Finishs, Gebrauchskratzer und Hitzeschäden. Ein Paar auf dem Armaturenbrett verzieht das Acetat, und dagegen kann kein Haus eine Garantie geben.",
        ],
      },
      {
        heading: "Reparieren statt ersetzen",
        body: [
          "Scharniere, Bügel und Gläser sind allesamt instand zu setzen. Wo sich ein Paar reparieren lässt, wird es repariert und nicht ersetzt, und das gilt auch nach Ablauf der Garantie, wobei Reparaturen dann zu Selbstkosten berechnet werden.",
          "Registrieren Sie die in den linken Innenbügel gravierte Seriennummer auf einem digitalen Pass, und die Garantie folgt dem Paar statt dem Beleg, auch zu einem zweiten Besitzer.",
        ],
      },
      {
        heading: "Einen Anspruch geltend machen",
        body: [
          "Schreiben Sie an info@tamiale.com mit der Seriennummer und einem Foto. Ein Berater veranlasst die Abholung. Diese Garantie lässt Ihre gesetzlichen Gewährleistungsrechte gegenüber dem Verkäufer unberührt.",
        ],
      },
    ],
  },
  privacy: {
    title: "Datenschutz",
    summary: "Was das Haus erhebt, warum, und wie wenig es ist.",
    sections: [
      {
        heading: "Wer verantwortlich ist",
        body: [
          "Tamiale ist eine Marke der A & H Consulting Group LLC, die sie besitzt und die für alles auf dieser Seite Beschriebene Verantwortlicher im Sinne der DSGVO ist.",
          "Fragen zu Ihren Daten und die unten unter Ihre Rechte beschriebenen Anträge richten Sie bitte an info@tamiale.com.",
        ],
      },
      {
        heading: "Was erhoben wird",
        body: [
          "Zur Abwicklung einer Bestellung: Ihr Name, Liefer- und Rechnungsanschrift, E-Mail-Adresse und die Bestellung selbst. Kartendaten werden vom Zahlungsdienstleister verarbeitet und erreichen die Systeme von Tamiale nie.",
          "Wenn Sie dem Hausregister beitreten: Ihre E-Mail-Adresse und sonst nichts.",
        ],
      },
      {
        heading: "Was nicht erhoben wird",
        body: [
          "Kein Kamerabild, kein Videobild, kein Gesichtsmerkmal. Vision Studio verarbeitet das Video vollständig in Ihrem Browser; nichts davon wird übertragen. Ein Passformprofil wird, falls Sie eines speichern, in den Speicher Ihres eigenen Browsers geschrieben und kann in My Tamiale gelöscht werden.",
          "Auch gespeicherte Fassungen liegen in Ihrem Browser und nicht auf einem Server, und deshalb brauchen sie kein Konto.",
        ],
      },
      {
        heading: "Ihre Rechte",
        body: [
          "Nach der DSGVO und entsprechenden Gesetzen können Sie eine Kopie Ihrer Daten verlangen, ihre Berichtigung oder ihre Löschung. Schreiben Sie an info@tamiale.com und rechnen Sie mit einer Antwort innerhalb von dreißig Tagen.",
          "Das Haus verkauft keine personenbezogenen Daten und gibt das Register an niemanden weiter.",
        ],
      },
    ],
  },
  "vision-privacy": {
    title: "Kamera und Gesichtsdaten",
    summary:
      "Vision Studio läuft auf Ihrem Gerät. Diese Seite erklärt genau, was das heißt.",
    sections: [
      {
        heading: "Wo die Verarbeitung stattfindet",
        body: [
          "Das Gesichts-Tracking-Modell und seine WebAssembly-Laufzeit werden von tamiale.com ausgeliefert und in Ihrem Browser ausgeführt. Videobilder werden von der Kamera gelesen, vermessen, überzeichnet und verworfen. Sie werden nie hochgeladen, und das Studio stellt nach dem Laden keine Netzwerkanfrage mehr.",
          "Sie können das überprüfen: Öffnen Sie den Netzwerk-Inspektor Ihres Browsers und benutzen Sie das Studio. Es gibt keinen Datenverkehr.",
        ],
      },
      {
        heading: "Einwilligung",
        body: [
          "Die Kamera wird erst angefragt, wenn Sie den Knopf drücken, nie beim Laden der Seite. Eine Ablehnung kostet Sie nichts: Jede Fassung lässt sich in 3D betrachten, jedes Maß ist veröffentlicht, und der ganze Shop funktioniert ohne sie.",
        ],
      },
      {
        heading: "Was gespeichert werden kann",
        body: [
          "Nur wenn Sie auf „dieses Profil behalten“ drücken: eine geschätzte Gesichtsbreite, ein geschätzter Augenabstand am Steg, eine Beschreibung Ihrer Proportionen in einem Wort und die von Ihnen gewählte Stilvorliebe. Kein Bild. Es wird in den lokalen Speicher Ihres Browsers geschrieben, nicht auf einen Tamiale-Server, und „Dieses Profil löschen“ in My Tamiale entfernt es sofort.",
        ],
      },
      {
        heading: "Zur Genauigkeit der Schätzungen",
        body: [
          "Eine einzelne Kamera hat keinen Sinn für absolute Größe. Jeder Millimeter, den das Studio nennt, ergibt sich aus der Annahme, dass Ihr Pupillenabstand nahe am Erwachsenendurchschnitt liegt, und das ist eine tragfähige Grundlage für eine Empfehlung und eine untragfähige für alles andere. Die Werte sind durchgehend als Schätzungen ausgewiesen und sollten an einer Brille geprüft werden, die Sie bereits besitzen.",
        ],
      },
    ],
  },
  accessibility: {
    title: "Barrierefreiheit",
    summary:
      "Der Standard, auf den diese Seite gebaut ist, und wo sie dahinter zurückbleibt.",
    sections: [
      {
        heading: "Das Ziel",
        body: [
          "WCAG 2.2 Stufe AA. In der Praxis heißt das: Jedes Bedienelement ist per Tastatur erreichbar und bedienbar, der Fokus ist immer sichtbar, Text erfüllt die Kontrastminima gegenüber seinem Hintergrund, Bewegung respektiert die Einstellung für reduzierte Bewegung, und jedes Bild trägt eine Beschreibung dessen, was es zeigt.",
        ],
      },
      {
        heading: "Bekannte Grenzen",
        body: [
          "Das 3D-Atelier ist ein Canvas und kann von einem Screenreader nicht gelesen werden. Jede Abmessung, jedes Material und jedes Finish, das es zeigt, steht auf derselben Seite als Text in der Spezifikationstabelle, und die technische Ansicht trägt eine vollständige Textbeschreibung.",
          "Vision Studio setzt eine Kamera und ein Gesicht voraus und ist daher nicht für alle verfügbar. Es ist eine Ergänzung des Einkaufs und nie eine Voraussetzung dafür.",
        ],
      },
      {
        heading: "Uns Bescheid geben",
        body: [
          "Wenn hier etwas für Sie nicht funktioniert, schreiben Sie an info@tamiale.com. Ein Barrierefreiheitsfehler wird als Mangel behandelt, nicht als Funktionswunsch.",
        ],
      },
    ],
  },
  terms: {
    title: "Verkaufsbedingungen",
    summary: "Die Vereinbarung zwischen Ihnen und dem Haus.",
    sections: [
      {
        heading: "Bestellungen",
        body: [
          "Eine Bestellung ist ein Kaufangebot. Der Vertrag kommt zustande, wenn das Haus sie per E-Mail bestätigt. Ist ein Artikel irrtümlich, zum falschen Preis oder nicht mehr verfügbar gelistet, kann die Bestellung abgelehnt und bereits Gezahltes vollständig erstattet werden.",
        ],
      },
      {
        heading: "Preis und Zahlung",
        body: [
          "Die Preise werden je Markt veröffentlicht und in der Währung dieses Marktes angezeigt. Die Zahlung erfolgt bei der Bestellung, auch bei Vorbestellungen, und diese Zahlung reserviert ein nummeriertes Paar aus der Edition.",
        ],
      },
      {
        heading: "Produktangaben",
        body: [
          "Maße, Gewichte und Transmissionswerte der Gläser sind für jede Fassung veröffentlicht. Die Farbwiedergabe unterscheidet sich von Bildschirm zu Bildschirm, und eine Glassimulation auf einem Display ist die Annäherung an ein Erlebnis, keine Messung der Lichttransmission oder der Leistung gegen Ultraviolett. Maßgeblich ist die mit den Gläsern gelieferte Konformitätsdokumentation.",
        ],
      },
      {
        heading: "Anwendbares Recht",
        body: [
          "Diese Bedingungen unterliegen niederländischem Recht, unbeschadet der zwingenden Verbraucherschutzrechte, die Ihnen in Ihrem Wohnsitzland zustehen.",
        ],
      },
    ],
  },
};

export default de;
