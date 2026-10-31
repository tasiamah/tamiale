import type { Dictionary } from "./en";

/**
 * As in French, the house's own words are left alone: The Marina, Onyx,
 * Cognac, Champagne, Smoke, Vision Studio. "A Different Perspective." becomes
 * "Ein anderer Blick.", which carries both the viewpoint and the act of
 * looking, where "Perspektive" would only carry the first.
 */
const de: Dictionary = {
  meta: {
    statement: "Ein anderer Blick.",
    description:
      "Tamiale ist ein zeitgenössisches Haus für Luxusbrillen. Kollektion 001 ist The Marina, eine architektonische Silhouette aus massivem Acetat in drei Gläsern.",
    keywords: [
      "Luxusbrillen",
      "Designer-Sonnenbrillen",
      "Acetatfassungen",
      "Tamiale",
      "virtuelle Anprobe",
    ],
  },

  nav: {
    collection: "Die Kollektion",
    visionStudio: "Vision Studio",
    house: "Das Haus",
    journal: "Journal",
    privateClient: "Privatkunden",
    myTamiale: "Mein Tamiale",
  },

  navSummary: {
    collection: "Alle Fassungen, einzelne Entwürfe, limitierte Editionen",
    visionStudio: "Virtuelle Anprobe, Passform-Empfehlung, 3D-Ansicht",
    house: "Philosophie, Materialien, Handwerkskunst",
    journal: "Redaktionelle Beiträge, Kampagnen, Kooperationen",
    privateClient: "Berater, Betreuung, private Veröffentlichungen",
    myTamiale: "Bestellungen, gemerkte Fassungen, digitale Pässe",
  },

  header: {
    skipToContent: "Zum Inhalt springen",
    announcement: "Versicherter Versand weltweit inklusive",
    home: "Tamiale, Startseite",
    menu: "Menü",
    close: "Schließen",
    bag: "Warenkorb",
    language: "Sprache",
  },

  footer: {
    blurb:
      "Ein zeitgenössisches Brillenhaus. Entworfen in Zürich, in nummerierten Editionen veröffentlicht.",
    shippingTo: "Lieferung nach",
    clientCare: "Kundenservice",
    theHouse: "Das Haus",
    legal: "Rechtliches",
    shipping: "Versand",
    returns: "Rückgabe",
    warranty: "Garantie und Reparatur",
    contact: "Kontakt",
    philosophy: "Philosophie",
    craftsmanship: "Handwerkskunst",
    journal: "Journal",
    digitalPassport: "Digitaler Pass",
    privacy: "Datenschutz",
    terms: "AGB",
    accessibility: "Barrierefreiheit",
    cameraData: "Kamera- und Gesichtsdaten",
    rights: "Alle Rechte vorbehalten.",
  },

  commerce: {
    metaDescription: "{name} erscheint in {count} Glasausführungen, in {edition}, Versand im {month}.",
    frontElevationMm: "Frontansicht, in Millimetern",
    drawingPlaceholder: "Vorläufig, bis die Fertigungszeichnung vorliegt",
    lensExpression: "Glasausführung",
    transmission: "Transmission",
    filterCategory: "Filterkategorie",
    lens: "Glas",
    reserve: "Reservieren",
    reserveFor: "Reservieren · {price}",
    reserveThisPair: "Dieses Paar reservieren · {price}",
    spokenFor: "Bereits vergeben",
    expressionSpokenFor: "Diese Ausführung ist bereits vergeben",
    tryItOn: "Anprobieren",
    seeItOnYourFace: "Auf Ihrem Gesicht sehen",
    fullSpecification: "Vollständige Spezifikation",
    fullCollection: "Die ganze Kollektion",
    ships: "Versand ab {month}",
    shipsFull: "Versand ab {month}.",
    preorderShips: "Vorbestellung · Versand ab {month}",
    saveForLater: "Für später merken",
    saved: "Gemerkt",
    speakToAdvisor: "Mit einem Berater sprechen",
    edition: {
      editionOf: "Eine Edition von {count} in {lens}",
      unsold: "{count} unverkauft",
    },
    preorderNote:
      "Heute aus der Edition reserviert und im {month} versandt. Bis zum Versand jederzeit mit voller Rückerstattung stornierbar.",
    trust: {
      cancelLabel: "Stornierung bis zum Versand",
      cancelDetail: "Volle Rückerstattung, ohne Angabe von Gründen",
      deliveryLabel: "Versicherter Versand inklusive",
      deliveryDetail: "Mit Sendungsverfolgung, in allen Märkten",
      returnsLabel: "Rückgabe innerhalb von dreißig Tagen",
      returnsDetail: "Ungetragen, im Etui, auf unsere Kosten",
      warrantyLabel: "Zwei Jahre Garantie",
      warrantyDetail: "Bevorzugt repariert, nicht ersetzt",
    },
    details: {
      measurements: "Maße",
      materials: "Materialien und Beschläge",
      delivery: "Versand und Rückgabe",
      deliveryBody:
        "{note}, ab {month}. Dreißig Tage Rückgaberecht, ungetragen und im Etui, auf unsere Kosten. Zwei Jahre auf Fertigungsfehler, wobei Reparatur vor Ersatz angeboten wird.",
    },
    tabs: {
      studio: "Studio",
      atelier: "3D-Atelier",
      elevation: "Aufriss",
    },
    frontElevation: "Vorderansicht",
  },

  cart: {
    yourBag: "Ihr Warenkorb",
    close: "Schließen",
    emptyTitle: "Noch nichts reserviert.",
    emptyBody:
      "Kollektion 001 ist in drei Glasausführungen zur Vorbestellung geöffnet.",
    viewCollection: "Kollektion ansehen",
    remove: "Entfernen",
    decrease: "Menge von {name} verringern",
    increase: "Menge von {name} erhöhen",
    subtotal: "Zwischensumme",
    subtotalNote: "{tax}. {shipping}, sobald die Edition versandt wird.",
    checkout: "Ihr Paar reservieren",
    checkoutNote:
      "Die Zahlung erfolgt heute. Ihr Paar wird aus der Edition reserviert und bei Veröffentlichung versandt.",
    unavailableNote:
      "Die Kasse ist noch nicht angebunden. Schreiben Sie an {email}, und ein Berater reserviert das Paar für Sie.",
  },

  concierge: {
    interrupted:
      "Etwas hat das unterbrochen. Fragen Sie bitte noch einmal, oder schreiben Sie an info@tamiale.com.",
    title: "Concierge",
    open: "Concierge",
    close: "Schließen",
    greeting:
      "Guten Tag. Ich führe das Register der Kollektion 001: Maße, Gläser, Erscheinungstermine und Pflege. Fragen Sie direkt; liegt es außerhalb meines Wissens, gebe ich Sie an einen Berater weiter, statt zu raten.",
    placeholder: "Fragen Sie nach Passform, Gläsern oder Lieferung",
    send: "Fragen",
    thinking: "Das Register wird eingesehen…",
    fallback:
      "Das liegt außerhalb dessen, was ich genau beantworten kann, und ich möchte nicht raten. Ein Berater übernimmt gern: Schreiben Sie an info@tamiale.com, oder senden Sie eine Nachricht über die Privatkundenseite, und Sie haben innerhalb eines Werktags eine Antwort.",
    fallbackAction: "Einem Berater schreiben",
    suggestions: {
      tailoring: "Welches Glas passt zum Anzug?",
      widerFace: "Passt sie auf ein breiteres Gesicht?",
      shipping: "Wann wird Kollektion 001 versandt?",
      material: "Woraus besteht die Fassung?",
    },
  },

  home: {
    heroLede:
      "Brillen für alle, die über Konventionen hinausblicken. Eine Silhouette, in Zürich entworfen, in drei Gläsern veröffentlicht.",
    collectionTitleFirst: "Drei Gläser.",
    collectionTitleSecond: "Eine Silhouette.",
    collectionLede:
      "The Marina erscheint in einem einzigen Onyx-Acetat und drei Glasausführungen, jede mit ihrer gemessenen Transmission. Die Wahl zwischen ihnen ist eine Frage des Lichts, nicht der Form.",
    visionEyebrow: "Vision Studio",
    visionTitleFirst: "Ihr Blick.",
    visionTitleSecond: "Ihre Passform.",
    visionLede:
      "Ein digitaler Spiegel statt eines Filters. Öffnen Sie die Kamera, und The Marina sitzt dort, wo sie säße, in der Größe, die sie hätte, im Glas, das Sie erwägen.",
    visionFeatures: {
      tryOnTitle: "Anprobe in Echtzeit",
      tryOnBody:
        "Die Fassung folgt Ihrem Kopf, passt sich Ihrem Gesicht an und wechselt das Glas an Ort und Stelle.",
      fitTitle: "Passform-Schätzung",
      fitBody:
        "Gesichtsbreite und Stegabstand aus derselben Ansicht gelesen und mit den veröffentlichten Millimetern verglichen.",
      lensTitle: "Blick durch das Glas",
      lensBody:
        "Sehen Sie, was jede der drei Tönungen mit dem Licht vor Ihnen macht.",
      privacyTitle: "Auf Ihrem Gerät",
      privacyBody:
        "Nichts verlässt den Browser. Kein Bild, kein Video, kein Messpunkt wird übertragen.",
    },
    visionCta: "Studio öffnen",
    craftEyebrow: "Handwerkskunst",
    craftTitle: "Was die Maße tatsächlich bedeuten.",
    craftLede:
      "Statt Qualität zu behaupten, veröffentlicht das Haus die Zahlen und die Verfahren dahinter. Jede Zahl unten steht auf der technischen Zeichnung.",
    houseEyebrow: "Das Haus",
    manifesto:
      "Wahrer Luxus entsteht nie zufällig. Er liegt im Gleichgewicht von Form, Präzision und Identität.",
    manifestoTail:
      "Tamiale macht Brillen für Menschen, die nie eine Erlaubnis brauchten, um aus der Reihe zu fallen.",
    houseCta: "Die Hausakte lesen",
    registerEyebrow: "Das Register",
    registerTitle: "Privater Zugang.",
    registerLede:
      "Die Editionen sind klein und werden dem Register des Hauses angeboten, bevor sie angekündigt werden. Keine Kampagnen, keine Rabatte. Nur eine Nachricht, wenn etwas fertig ist, und die erste Gelegenheit, es zu nehmen.",
    registerPlaceholder: "sie@beispiel.com",
    registerCta: "Zugang anfragen",
    registerNote:
      "Eine Nachricht pro Saison. Abmeldung mit einem Klick. Das Register wird mit niemandem geteilt.",
    registerThanks: "Sie stehen im Register.",
  },

  collection: {
    theDesign: "Der Entwurf",
    metaTitle: "Die Kollektion",
    metaDescription:
      "Collection 001 · Die Ikonen. The Marina, eine architektonische Silhouette in Onyx-Acetat, in drei Glasausführungen und zur Vorbestellung geöffnet.",
    eyebrow: "Kollektion 001",
    title: "Die Ikonen.",
    lede: "Das Haus eröffnet mit einer Silhouette statt mit einem Katalog. The Marina ist als abgeflachtes Sechseck gezeichnet, acht Kanten dort, wo die meisten Fassungen eine Kurve verwenden, veröffentlicht in einem einzigen Onyx-Acetat und drei Glasausführungen, jede bestimmt durch das Licht, das sie durchlässt.",
    stats: {
      silhouettes: "Veröffentlichte Silhouetten",
      expressions: "Glasausführungen",
      edition: "Edition",
      shipping: "Versand",
    },
    storyEyebrow: "Die Silhouette",
    openFrame: "Fassung öffnen",
    upcomingTitleFirst: "Gezeichnet und noch",
    upcomingTitleSecond: "nicht veröffentlicht.",
    upcomingLede:
      "Vier weitere Silhouetten vervollständigen Kollektion 001. Sie sind in Entwicklung und können nicht bestellt werden. Das Register des Hauses erfährt vor allen anderen, wenn eine fertig ist.",
    inDevelopment: "In Entwicklung",
    joinRegister: "Dem Register beitreten",
    breadcrumbCollection: "Kollektion",
  },

  atelier: {
    threeQuarter: "Dreiviertel",
    front: "Front",
    profile: "Profil",
    plan: "Draufsicht",
    rear: "Rückseite",
    studio: "Studio",
    lamplight: "Lampenlicht",
    nocturne: "Nocturne",
    rotate: "Drehen",
    stop: "Stopp",
  },

  visionStudio: {
    lens: "Glas",
    opening: "Spiegel wird geöffnet…",
    tryAgain: "Erneut versuchen",
    tracking: "Wird verfolgt",
    lookingForFace: "Suche nach einem Gesicht",
    capture: "Aufnehmen",
    transmissionReadout: "{name} · {vlt} % Transmission",
    noCamera: "Auf diesem Gerät ist keine Kamera verfügbar, oder der Browser gibt sie über diese Verbindung nicht frei. Eine Kamera braucht eine sichere Verbindung (https).",
    engineFailed: "Das Tracking ist nicht gestartet.",
    engineDegraded: "Das Gesichts-Tracking konnte auf diesem Gerät nicht starten. Die Kamera läuft weiter, Sie können also die Glasperspektive nutzen.",
    estimateMyFit: "Passform schätzen",
    faceWidth: "Gesichtsbreite",
    bridgeGap: "Augenabstand am Steg",
    proportion: "Proportion",
    keepProfile: "Dieses Profil behalten",
    discard: "Verwerfen",
    confidenceFair: "brauchbar",
    confidenceLow: "gering",
    estimateNote: "Geschätzt aus einer einzelnen Kamera, bei angenommenem durchschnittlichem Pupillenabstand. Die Zuverlässigkeit ist {confidence}. Das ist keine Messung und kann den tatsächlichen Sitz nicht garantieren.",
    estimateNoteLow: "Geschätzt aus einer einzelnen Kamera, bei angenommenem durchschnittlichem Pupillenabstand. Die Zuverlässigkeit ist {confidence}. Blicken Sie gerade in die Kamera und versuchen Sie es erneut. Das ist keine Messung und kann den tatsächlichen Sitz nicht garantieren.",
    reserveLens: "{name} reservieren",
    recommendation: "Sie haben {style} gewählt. Dazu passt {primary} mit {vlt} % Transmission am ehesten, {alternate} ist die Alternative. Das folgt Ihrer angegebenen Vorliebe und der gemessenen Dichte jedes Glases. Es ist kein Urteil über Ihr Gesicht.",
    fit: {
      shapes: {
        tapered: "schmal zulaufend",
        elongated: "länglich",
        square: "eckig",
        rounded: "rund",
        balanced: "ein ausgewogenes Oval",
      },
      wide: "Die Front dürfte zu breit sitzen",
      narrow: "Die Front dürfte zu schmal sitzen",
      recommended: "Zum Anprobieren empfohlen",
      reasonWidth: "Ihr Gesicht misst geschätzt {width} mm von Schläfe zu Schläfe. {name} ist für {lower} bis {upper} mm geschnitten.",
      reasonBridge: "Der Abstand zwischen Ihren Augen liegt bei etwa {gap} mm gegenüber einem Steg von {bridge} mm. Prüfen Sie das an einer Brille, die Sie schon besitzen, denn das Nasenprofil zählt ebenso viel wie der Abstand.",
      reasonShape: "Ihre Proportionen lesen sich als {shape}. Die kantige Braue von The Marina läuft waagerecht über das Gesicht, und das ist das Merkmal, auf das die meisten so oder so reagieren.",
    },
    metaTitle: "Vision Studio",
    metaDescription:
      "Probieren Sie The Marina mit Ihrer eigenen Kamera an, schätzen Sie Ihre Passform und vergleichen Sie die drei Gläser. Alles läuft auf Ihrem Gerät.",
    eyebrow: "Vision Studio",
    titleFirst: "Ihr Blick.",
    titleSecond: "Ihre Passform.",
    lede: "Ein digitaler Spiegel statt eines Filters. Die Fassung wird aus ihrer eigenen Fertigungsgeometrie gezeichnet und auf Ihr Gesicht skaliert, sodass Sie die Größe sehen, die The Marina tatsächlich hat.",
    tabMirror: "Digitaler Spiegel",
    tabLens: "Blick durch das Glas",
    mirrorClosed: "Der Spiegel ist geschlossen.",
    mirrorClosedBody:
      "Öffnen Sie Ihre Kamera, und The Marina sitzt dort, wo sie säße, in der Größe, die Ihr Gesicht vorgibt. Die Verarbeitung geschieht hier, auf Ihrem Gerät.",
    openCamera: "Kamera öffnen",
    closeCamera: "Kamera schließen",
    privacyNote:
      "Die Gesichtserkennung läuft in diesem Browser. Kein Bild, Video oder Messpunkt wird an Tamiale übertragen, und nichts wird gespeichert, sofern Sie kein Passform-Profil sichern.",
    howThisWorks: "So funktioniert es",
    fitIntelligence: "Passform-Beratung",
    fitEstimate: "Passform-Schätzung",
    openMirrorFirst: "Öffnen Sie zuerst den Spiegel",
    fitPrompt:
      "Bei geöffnetem Spiegel und dem Gesicht frontal zur Kamera schätzt das Studio Ihre Gesichtsbreite und den Stegabstand und vergleicht sie mit den veröffentlichten Millimetern.",
    stated: "Zu Ihrer angegebenen Vorliebe",
    styles: {
      understated: "Zurückhaltend",
      understatedNote: "Aus der Ferne ruhig",
      architectural: "Architektonisch",
      architecturalNote: "Kanten, keine Kurven",
      bold: "Markant",
      boldNote: "Quer durch den Raum zu sehen",
      classic: "Klassisch",
      classicNote: "Nichts, was es datiert",
    },
    openFullFrame: "Vollständige Fassung öffnen",
    cameraDenied:
      "Der Kamerazugriff wurde abgelehnt. Sie können ihn über das Symbol in der Adressleiste erteilen oder ohne ihn weiter einkaufen, denn nichts auf dieser Seite setzt die Kamera voraus.",
    estimateCaveat:
      "Eine Schätzung am Bildschirm, keine Messung. Vergleichen Sie sie mit einer Fassung, die Sie bereits besitzen.",
    simulationCaveat:
      "Eine Bildschirmsimulation der Tönung. Sie bildet weder die zertifizierte Lichttransmission noch den UV-Schutz ab.",
  },

  house: {
    pillarsEyebrow: "Vier Säulen",
    manifesto: "Tamiale macht Brillen für Menschen, die nie eine Erlaubnis brauchten, um herauszustechen.",
    registerHeading: "Dem Hausregister beitreten.",
    registerLede: "Das Register erfährt von einer Veröffentlichung, bevor sie angekündigt wird, und hat die erste Gelegenheit, zuzugreifen.",
    pillars: [
      {
        title: "Exklusivität",
        body: "Die Editionen sind nummeriert und klein. Ist eine Ausführung vergriffen, wird sie nicht neu aufgelegt, und das Haus reduziert nicht, was übrig bleibt.",
      },
      {
        title: "Intelligenter Luxus",
        body: "Vision Studio läuft auf Ihrem Gerät, schätzt statt zu behaupten, und sagt das auch. Technik, die sich überverkauft, ist kein Luxus, sondern ein Risiko.",
      },
      {
        title: "Identität",
        body: "Kein Logo auf der Front. Die Silhouette ist die Signatur, und die Wortmarke ist dort graviert, wo nur die Trägerin sie findet.",
      },
      {
        title: "Handwerkskunst",
        body: "Veröffentlichte Maße, benannte Materialien, angegebene Transmissionswerte und ein reparierbares Scharnier. Alles, was hier steht, kann ein Kunde nachprüfen.",
      },
    ],
    commitments: [
      {
        title: "Reparieren statt ersetzen",
        body: "Scharniere, Bügel und Gläser sind allesamt instand zu setzen. Eine Fassung, die sich reparieren lässt, sollte repariert werden.",
      },
      {
        title: "Keine Dark Patterns",
        body: "Keine Countdowns, keine erfundene Knappheit, kein Pop-up, das nach einer Adresse fragt, bevor die Seite geladen ist.",
      },
      {
        title: "Ehrliche Technik",
        body: "Gesichtsdaten verlassen den Browser nie. Passformwerte sind als Schätzungen ausgewiesen, weil sie genau das sind.",
      },
      {
        title: "Ein Preis je Markt",
        body: "Veröffentlicht und gehalten. Nicht zum Tageskurs umgerechnet, nicht danach angepasst, von wo aus Sie geklickt haben.",
      },
    ],
    metaTitle: "Das Haus",
    metaDescription:
      "In Zürich entworfen, in nummerierten Editionen veröffentlicht. Die Positionen des Hauses und die vier Dinge, die es nicht tun wird.",
    eyebrow: "Das Haus",
    titleFirst: "Wahrer Luxus entsteht",
    titleSecond: "nie zufällig.",
    lede: "Tamiale ist ein zeitgenössisches Brillenhaus. Entworfen in Zürich, in nummerierten Editionen veröffentlicht und schriftlich festgehalten, damit es überprüfbar bleibt.",
    positionEyebrow: "Die Haltung",
    positionTitle: "Wofür das Haus steht.",
    positionLede:
      "Geschrieben als Haltungen, die das Haus vertritt, nicht als Slogans.",
    commitmentsEyebrow: "Verpflichtungen",
    commitmentsTitle: "Vier Dinge, die das Haus nicht tun wird.",
    registerTitleFirst: "Dem Register des",
    registerTitleSecond: "Hauses beitreten.",
  },

  journal: {
    metaTitle: "Journal",
    metaDescription:
      "Über Entwurf, Handwerk und Besitz. Die Argumente hinter den Objekten, vom Haus geschrieben.",
    eyebrow: "Journal",
    title: "Texte aus dem Haus.",
    lede: "Über Entwurf, Handwerk und Besitz. Keine Fülltexte für Suchmaschinen, sondern die Argumente hinter den Objekten.",
    readingTime: "{minutes} Min.",
    continueReading: "Weiterlesen",
    allEntries: "Alle Beiträge",
  },

  privateClient: {
    metaTitle: "Private Client",
    metaDescription:
      "Eine direkte Leitung zu einem Berater, der die Fassungen kennt. Früher Zugang zu Editionen, Betreuung über die Seriennummer und eine ehrliche Auskunft vor dem Kauf.",
    eyebrow: "Privatkunden",
    titleFirst: "Jemand, der die",
    titleSecond: "Fassungen kennt.",
    lede: "Eine Brille zu diesem Preis zu kaufen, ohne sie aufgesetzt zu haben, ist ein nachvollziehbares Zögern. Das Haus verkauft ausschließlich online und begegnet diesem Zögern mit veröffentlichten Millimetern, einem Spiegel, den Sie im Browser öffnen, dreißig Tagen Rückgaberecht und einem Berater, der Ihnen vom Kauf abrät.",
    services: {
      accessTitle: "Früher Zugang",
      accessBody:
        "Veröffentlichungen werden dem Register angeboten, bevor sie angekündigt werden. Die Editionen sind klein genug, dass dies den Unterschied macht zwischen der Wahl und der Nachricht davon.",
      directTitle: "Eine direkte Leitung",
      directBody:
        "Ein Berater, ein Gesprächsfaden, solange Ihnen das Paar gehört. Größe, Pflege, Reparaturen und gelegentlich die ehrliche Auskunft, dass eine Fassung nicht die richtige für Sie ist.",
      serviceTitle: "Pflege und Reparatur",
      serviceBody:
        "Registrierte Paare werden über ihre Seriennummer betreut. Die Werkstatt weiß ohne Nachfrage, welches Scharnier, welche Oberfläche und welche Produktionsserie.",
    },
    enquiriesEyebrow: "Anfragen",
    enquiriesTitle: "Einem Berater schreiben.",
    enquiriesLede:
      "Es gibt keine Boutiquen und keine Termine einzuhalten. Senden Sie eine Nachricht, und ein Berater antwortet innerhalb eines Werktags schriftlich, mit den Maßen und der ehrlichen Auskunft statt eines Verkaufsgesprächs.",
    orWrite: "Oder schreiben Sie direkt",
    form: {
      elsewhere: "Anderswo",
      name: "Name",
      email: "E-Mail",
      region: "Wo Sie sind",
      interest: "Worüber Sie sprechen möchten",
      measurements:
        "Optional. Die Maße einer Brille, die Sie bereits besitzen, sind das Nützlichste, was Sie mitbringen können.",
      submit: "Nachricht senden",
      sending: "Wird gesendet…",
      thanks:
        "Erhalten. Ein Berater schreibt innerhalb eines Werktags.",
      error:
        "Das Senden ist fehlgeschlagen. Schreiben Sie an {email}, und wir nehmen es dort auf.",
    },
  },

  passport: {
    noRecordTitle: "Kein Pass zu dieser Seriennummer.",
    noRecordBody: "Das Register bindet eine Seriennummer bei der Fertigung an ein Stück. Eine unbekannte Nummer bedeutet daher eines von drei Dingen: Das Paar ist noch nicht serialisiert, die Nummer wurde vertippt, oder das Paar stammt nicht von uns.",
    noRecordSpecimen: "Collection 001 ist nicht in Produktion, es ist also keine Kundenseriennummer aktiv. Der Musterdatensatz ist",
    backToPassports: "Zurück zu den Pässen",
    askAdvisor: "Einen Berater fragen",
    verified: "Geprüft",
    serviceHistory: "Servicehistorie",
    request: "Anfrage",
    bookService: "Service anfragen",
    warrantyCovers: "Was die Garantie abdeckt",
    recordCaveat: "Beispielhafter Datensatz. Das Produktionsregister bindet jede Seriennummer am Band an ein gefertigtes Stück, und eine Registrierung kann vom Haus widerrufen oder übertragen werden. Ein gedruckter Code allein ist kein Echtheitsnachweis.",
    metaTitle: "Digitaler Pass",
    metaDescription:
      "Ein Eintrag, den das Haus für ein Paar führt statt für einen Kauf: Editionsnummer, Garantie, Servicehistorie und Kaufnachweis.",
    eyebrow: "Eigentum",
    titleFirst: "Der digitale",
    titleSecond: "Pass.",
    lede: "Ein Eintrag, den das Haus für ein Paar führt und nicht für einen Kauf. Er enthält die Editionsnummer, die Garantie, die Servicehistorie und den Kaufnachweis, und er überlebt den Verlust Ihrer E-Mail-Adresse.",
    steps: {
      findTitle: "Die Seriennummer finden",
      findBody:
        "In den inneren linken Bügel graviert, 0,12 mm tief, und auf der Echtheitskarte im Etui gedruckt.",
      registerTitle: "Registrieren",
      registerBody:
        "Die Seriennummer wird bei der Fertigung an das Exemplar gebunden. Die Registrierung überträgt diese Bindung auf Sie, und das Haus kann sie bei einem Streitfall widerrufen.",
      keepTitle: "Behalten oder weitergeben",
      keepBody:
        "Garantie, Reparaturhistorie und Kaufnachweis folgen dem Pass. Wechselt das Paar den Besitzer, geht der Pass mit über.",
    },
    lookupLabel: "Einen Pass nachschlagen",
    lookupPlaceholder: "TM-001-00000",
    lookupCta: "Pass öffnen",
    lookupNote:
      "Das Register ist noch nicht an Produktionsexemplare gebunden. Ein Musterdatensatz ist veröffentlicht, damit die Oberfläche geprüft werden kann.",
    specimen: "Muster",
    notReal: "Beispielhaft. Kein registriertes Produkt.",
    fields: {
      passport: "Digitaler Produktpass",
      authenticity: "Echtheit",
      registered: "Registriert",
      serial: "Seriennummer",
      edition: "Edition",
      made: "Gefertigt",
      registeredTo: "Registriert auf",
      notRegistered: "Noch nicht registriert",
      warrantyUntil: "Garantie bis",
    },
    notFoundTitle: "Kein solcher Pass.",
    notFoundBody:
      "Diese Seriennummer steht nicht im Register. Prüfen Sie die Gravur am inneren linken Bügel, oder schreiben Sie an {email}.",
    backToPassport: "Zurück zum Pass",
  },

  legal: {
    policies:
      "Richtlinien",
    updated:
      "Aktualisiert am {date}",
    draftNote:
      "Vorläufige Richtlinie, geschrieben nach den Positionen, die das Haus an anderer Stelle auf dieser Seite vertritt, und aus dem Englischen übersetzt. Sie wurde nicht juristisch geprüft und muss vor dem Start am Verbraucherrecht jedes Marktes gemessen werden.",
  },

  myTamiale: {
    faceWidth: "Gesichtsbreite",
    proportion: "Proportion",
    estimatedOn: "Am {date} in Ihrem Browser geschätzt. Es wurde kein Bild gespeichert, und dieser Wert wurde nie an Tamiale übermittelt.",
    deleteProfile: "Dieses Profil löschen",
    savedSummary: "{vlt} % Transmission · Kategorie {category} · Versand im {month}",
    metaTitle: "My Tamiale",
    metaDescription:
      "Gespeicherte Fassungen und Ihr Passformprofil, nur in diesem Browser und nirgendwo sonst.",
    eyebrow: "Mein Tamiale",
    title: "Mein Tamiale.",
    lede: "Gemerkte Fassungen und Ihr Passform-Profil liegen in diesem Browser und nirgendwo sonst. Nichts davon hat ein Konto verlangt, und Sie können alles in einem Schritt löschen.",
    savedFrames: "Gemerkte Fassungen",
    nothingSaved: "Noch nichts gemerkt.",
    nothingSavedBody:
      "Merken Sie sich eine Ausführung von einer beliebigen Fassungsseite, und sie wartet hier. Kein Konto, keine E-Mail, keine Erinnerung in drei Tagen.",
    viewCollection: "Kollektion ansehen",
    fitProfile: "Passform-Profil",
    fitProfileBody:
      "Vision Studio kann Ihre Gesichtsbreite und den Stegabstand über Ihre Kamera schätzen und das Ergebnis hier behalten, ausschließlich auf diesem Gerät.",
    openVisionStudio: "Vision Studio öffnen",
    ordersTitle: "Bestellungen und Pässe",
    ordersBody:
      "Bestellungen, Sendungsverfolgung und registrierte Pässe liegen hinter einem Tamiale-Konto. Kundenkonten werden mit dem Shopify-Storefront bereitgestellt und sind mit dieser Installation noch nicht verbunden, es gibt also nichts, wo man sich anmelden könnte.",
    aboutPassports: "Über digitale Pässe",
    forget: "Alles hier Gespeicherte löschen",
    forgetDone: "Gelöscht.",
  },

  notFound: {
    title: "404",
    body: "Diese Seite gehört nicht zum Haus.",
    collection: "Die Kollektion",
    home: "Zur Startseite",
  },

  region: {
    eu: "Europa",
    uk: "Vereinigtes Königreich",
    us: "USA",
    ae: "Vereinigte Arabische Emirate",
    taxEu: "inkl. Steuern",
    taxUk: "inkl. Steuern und Zöllen",
    taxUs: "Sales Tax wird beim Bezahlen berechnet",
    taxAe: "inkl. Steuern und Zöllen",
    shipEu: "Kostenfreier versicherter Versand, 2 bis 3 Werktage",
    shipUk: "Kostenfreier versicherter Versand, 2 bis 4 Werktage",
    shipUs: "Kostenfreier versicherter Versand, 3 bis 5 Werktage",
    shipAe: "Kostenfreier versicherter Versand, 2 bis 4 Werktage",
    label: "Lieferung nach",
  },
};

export default de;
