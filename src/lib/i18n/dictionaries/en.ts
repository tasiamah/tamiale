/**
 * The English dictionary is the source of truth. Its shape becomes the
 * `Dictionary` type, so `fr.ts` and `de.ts` will not compile until every key
 * here has a translation. A missing string is a build error rather than a
 * sentence of English sitting in the middle of a French page.
 *
 * Long-form content (frames, journal, legal, the concierge answers) is not
 * here. It lives in src/lib/content/<locale> because it is prose rather than
 * interface, and because none of it is needed by Client Components.
 */
const en = {
  meta: {
    statement: "A Different Perspective.",
    description:
      "Tamiale is a contemporary luxury eyewear house. Collection 001 is The Marina, an architectural silhouette in Italian acetate, released in three lens expressions.",
    keywords: [
      "luxury eyewear",
      "designer sunglasses",
      "acetate frames",
      "Tamiale",
      "virtual try-on",
    ],
  },

  nav: {
    collection: "The Collection",
    visionStudio: "Vision Studio",
    house: "The House",
    journal: "Journal",
    privateClient: "Private Client",
    myTamiale: "My Tamiale",
  },

  navSummary: {
    collection: "All frames, individual designs, limited editions",
    visionStudio: "Virtual try-on, fit recommendations, 3D viewing",
    house: "Philosophy, materials, craftsmanship",
    journal: "Editorial stories, campaigns, collaborations",
    privateClient: "Advisors, service, private releases",
    myTamiale: "Orders, saved frames, digital passports",
  },

  header: {
    skipToContent: "Skip to content",
    home: "Tamiale home",
    menu: "Menu",
    close: "Close",
    bag: "Bag",
    language: "Language",
  },

  footer: {
    blurb:
      "A contemporary eyewear house. Designed in Amsterdam, made in Italy, released in numbered editions.",
    shippingTo: "Shipping to",
    clientCare: "Client Care",
    theHouse: "The House",
    legal: "Legal",
    shipping: "Shipping",
    returns: "Returns",
    warranty: "Warranty & Repairs",
    contact: "Contact",
    philosophy: "Philosophy",
    craftsmanship: "Craftsmanship",
    journal: "Journal",
    digitalPassport: "Digital Passport",
    privacy: "Privacy",
    terms: "Terms",
    accessibility: "Accessibility",
    cameraData: "Camera & Face Data",
    rights: "All rights reserved.",
  },

  commerce: {
    metaDescription: "{name} is released in {count} lens expressions, in {edition}, shipping {month}.",
    frontElevationMm: "Front elevation, millimetres",
    drawingPlaceholder: "Placeholder pending the factory drawing",
    lensExpression: "Lens expression",
    transmission: "Transmission",
    filterCategory: "Filter category",
    lens: "Lens",
    reserve: "Reserve",
    reserveFor: "Reserve · {price}",
    reserveThisPair: "Reserve this pair · {price}",
    spokenFor: "Spoken for",
    expressionSpokenFor: "This expression is spoken for",
    tryItOn: "Try it on",
    seeItOnYourFace: "See it on your face",
    fullSpecification: "Full specification",
    fullCollection: "The full collection",
    ships: "Ships {month}",
    shipsFull: "Ships {month}.",
    preorderShips: "Pre-order · Ships {month}",
    saveForLater: "Save for later",
    saved: "Saved",
    speakToAdvisor: "Speak to an advisor",
    edition: {
      editionOf: "An edition of {count} in {lens}",
      unsold: "{count} unsold",
    },
    preorderNote:
      "Reserved from the edition today and dispatched in {month}. Cancellable for a full refund at any point before it ships.",
    trust: {
      cancelLabel: "Cancel any time before it ships",
      cancelDetail: "Full refund, no reason needed",
      deliveryLabel: "Complimentary insured delivery",
      deliveryDetail: "Tracked, in every market we serve",
      returnsLabel: "Thirty-day returns",
      returnsDetail: "Unworn, in the case, at our cost",
      warrantyLabel: "Two-year warranty",
      warrantyDetail: "Repaired by preference, not replaced",
    },
    details: {
      measurements: "Measurements",
      materials: "Materials and hardware",
      delivery: "Delivery and returns",
      deliveryBody:
        "{note}, from {month}. Thirty days to return, unworn and in its case, at our cost. Two years against manufacturing defects, with repair offered before replacement.",
    },
    tabs: {
      studio: "Studio",
      atelier: "3D Atelier",
      elevation: "Elevation",
    },
    frontElevation: "front elevation",
  },

  cart: {
    yourBag: "Your bag",
    close: "Close",
    emptyTitle: "Nothing reserved yet.",
    emptyBody: "Collection 001 is open for pre-order in three lens expressions.",
    viewCollection: "View the collection",
    remove: "Remove",
    decrease: "Decrease quantity of {name}",
    increase: "Increase quantity of {name}",
    subtotal: "Subtotal",
    subtotalNote: "{tax}. {shipping} once the edition ships.",
    checkout: "Reserve your pair",
    checkoutNote:
      "You are charged today. Your pair is reserved from the edition and dispatched when it is released.",
    unavailableNote:
      "Checkout is not connected yet. Write to {email} and an advisor will reserve the pair for you.",
  },

  concierge: {
    interrupted:
      "Something interrupted that. Please ask again, or write to clients@tamiale.com.",
    title: "Concierge",
    open: "Concierge",
    close: "Close",
    greeting:
      "Good day. I hold the register for Collection 001: measurements, lenses, release dates and care. Ask directly; if it is outside what I know, I will pass you to an advisor rather than guess.",
    placeholder: "Ask about fit, lenses or delivery",
    send: "Ask",
    thinking: "Consulting the register…",
    fallback:
      "That is outside what I can answer accurately, and I would rather not guess. An advisor can take it from here: write to clients@tamiale.com, or send a note from the private client page, and you will have a reply within one working day.",
    fallbackAction: "Write to an advisor",
    suggestions: {
      tailoring: "Which lens suits tailoring?",
      widerFace: "Will this fit a wider face?",
      shipping: "When does Collection 001 ship?",
      material: "What is the frame made of?",
    },
  },

  home: {
    heroLede:
      "Eyewear conceived for those who see beyond convention. One silhouette, cut in Italy, released in three lenses.",
    collectionTitleFirst: "Three lenses.",
    collectionTitleSecond: "One silhouette.",
    collectionLede:
      "The Marina is released in a single Onyx acetate and three lens expressions, each with its own measured transmission. Choosing between them is a question of light, not of shape.",
    visionEyebrow: "Vision Studio",
    visionTitleFirst: "Your perspective.",
    visionTitleSecond: "Your fit.",
    visionLede:
      "A digital mirror rather than a filter. Open the camera and the Marina sits where it would sit, at the size it would be, in the lens you are considering.",
    visionFeatures: {
      tryOnTitle: "Real-time try-on",
      tryOnBody:
        "The frame tracks your head, scales to your face and changes lens in place.",
      fitTitle: "Fit estimate",
      fitBody:
        "Face width and bridge gap read from the same view, compared against the published millimetres.",
      lensTitle: "Lens perspective",
      lensBody: "See what each of the three tints does to the light in front of you.",
      privacyTitle: "On your device",
      privacyBody:
        "Nothing leaves the browser. No image, no video, no landmark is uploaded.",
    },
    visionCta: "Open the studio",
    craftEyebrow: "Craftsmanship",
    craftTitle: "What the measurements actually mean.",
    craftLede:
      "Rather than claim quality, the house publishes the figures and the processes behind them. Every number below appears on the technical drawing.",
    houseEyebrow: "The House",
    manifesto:
      "True luxury is never accidental. It is found in the balance of form, precision and identity.",
    manifestoTail:
      "Tamiale creates eyewear for individuals who never needed permission to stand apart.",
    houseCta: "Read the house file",
    registerEyebrow: "The Register",
    registerTitle: "Private access.",
    registerLede:
      "Editions are small and are offered to the house register before they are announced. No campaigns and no discounts. Just a note when something is ready, and the first opportunity to take it.",
    registerPlaceholder: "you@example.com",
    registerCta: "Request access",
    registerNote:
      "One note a season. Unsubscribe in a single click. We do not share the register with anyone.",
    registerThanks: "You are on the register.",
  },

  collection: {
    theDesign: "The design",
    metaTitle: "The Collection",
    metaDescription:
      "Collection 001 · The Icons. The Marina, an architectural silhouette in Onyx acetate, released in three lens expressions and open for pre-order.",
    eyebrow: "Collection 001",
    title: "The Icons.",
    lede: "The house opens with one silhouette rather than a catalogue. The Marina is drawn as a flattened hexagon, eight edges where most frames use a curve, released in a single Onyx acetate with three lens expressions, each specified by the light it lets through.",
    stats: {
      silhouettes: "Silhouettes released",
      expressions: "Lens expressions",
      edition: "Edition",
      shipping: "Shipping",
    },
    storyEyebrow: "The silhouette",
    openFrame: "Open the frame",
    upcomingTitleFirst: "Drawn, and not",
    upcomingTitleSecond: "yet released.",
    upcomingLede:
      "Four further silhouettes complete Collection 001. They are in development and cannot be ordered. The house register is told when each one is ready, before anyone else.",
    inDevelopment: "In development",
    joinRegister: "Join the register",
    breadcrumbCollection: "Collection",
  },

  atelier: {
    threeQuarter: "Three-quarter",
    front: "Front",
    profile: "Profile",
    plan: "Plan",
    rear: "Rear",
    studio: "Studio",
    lamplight: "Lamplight",
    nocturne: "Nocturne",
    rotate: "Rotate",
    stop: "Stop",
  },

  visionStudio: {
    lens: "Lens",
    opening: "Opening the mirror…",
    tryAgain: "Try again",
    tracking: "Tracking",
    lookingForFace: "Looking for a face",
    capture: "Capture",
    transmissionReadout: "{name} · {vlt}% transmission",
    noCamera: "No camera is available on this device, or the browser will not share one over this connection. A camera needs a secure (https) connection.",
    engineFailed: "The tracking engine did not start.",
    engineDegraded: "The face tracking engine could not start on this device. The camera is still live, so you can use lens perspective.",
    estimateMyFit: "Estimate my fit",
    faceWidth: "Face width",
    bridgeGap: "Bridge gap",
    proportion: "Proportion",
    keepProfile: "Keep this profile",
    discard: "Discard",
    confidenceFair: "fair",
    confidenceLow: "low",
    estimateNote: "Estimated from a single camera, assuming an average pupil distance. Confidence is {confidence}. It is not a measurement and cannot guarantee physical fit.",
    estimateNoteLow: "Estimated from a single camera, assuming an average pupil distance. Confidence is {confidence}. Face the camera squarely and try again. It is not a measurement and cannot guarantee physical fit.",
    reserveLens: "Reserve {name}",
    recommendation: "You chose {style}. Against that, {primary} at {vlt}% transmission is the closer match, with {alternate} as the alternative. This follows your stated preference and the measured density of each lens. It is not a judgement about your face.",
    fit: {
      shapes: {
        tapered: "tapered",
        elongated: "elongated",
        square: "square",
        rounded: "rounded",
        balanced: "a balanced oval",
      },
      wide: "The front is likely to sit wide",
      narrow: "The front is likely to sit narrow",
      recommended: "Recommended to try",
      reasonWidth: "Your face measures an estimated {width} mm temple to temple. {name} is cut for {lower} to {upper} mm.",
      reasonBridge: "The bridge gap between your eyes reads at about {gap} mm against a {bridge} mm bridge. Worth checking against a pair you already own, since the nose profile matters as much as the gap.",
      reasonShape: "Your proportions read as {shape}. The Marina's angular brow runs level across the face, which is the characteristic most people respond to either way.",
    },
    metaTitle: "Vision Studio",
    metaDescription:
      "Try the Marina on through your own camera, estimate your fit and compare the three lenses. Everything runs on your device.",
    eyebrow: "Vision Studio",
    titleFirst: "Your perspective.",
    titleSecond: "Your fit.",
    lede: "A digital mirror rather than a filter. The frame is drawn from its own factory geometry and scaled to your face, so what you see is the size the Marina will actually be.",
    tabMirror: "Digital mirror",
    tabLens: "Lens perspective",
    mirrorClosed: "The mirror is closed.",
    mirrorClosedBody:
      "Open your camera and the Marina will sit where it would sit, at the size your own face implies. Processing happens here, on your device.",
    openCamera: "Open the camera",
    closeCamera: "Close the camera",
    privacyNote:
      "Face tracking runs in this browser. No image, video or landmark is transmitted to Tamiale, and nothing is kept unless you save a fit profile.",
    howThisWorks: "How this works",
    fitIntelligence: "Fit intelligence",
    fitEstimate: "Fit estimate",
    openMirrorFirst: "Open the mirror first",
    fitPrompt:
      "With the mirror open and your face square to the camera, the studio will estimate your face width and bridge gap and compare them with the published millimetres.",
    stated: "For your stated preference",
    styles: {
      understated: "Understated",
      understatedNote: "Quiet at a distance",
      architectural: "Architectural",
      architecturalNote: "Edges, not curves",
      bold: "Bold",
      boldNote: "Seen across a room",
      classic: "Classic",
      classicNote: "Nothing to date it",
    },
    openFullFrame: "Open the full frame",
    cameraDenied:
      "Camera access was declined. You can grant it from the icon in the address bar, or carry on shopping without it, because nothing on this site requires the camera.",
    estimateCaveat:
      "A screen estimate, not a measurement. Compare it against a pair you already own.",
    simulationCaveat:
      "A screen simulation of the tint. It does not represent certified light transmission or UV performance.",
  },

  house: {
    pillarsEyebrow: "Four pillars",
    manifesto: "Tamiale creates eyewear for individuals who never needed permission to stand apart.",
    registerHeading: "Join the house register.",
    registerLede: "The register hears about a release before it is announced, and has the first opportunity to take it.",
    pillars: [
      {
        title: "Exclusivity",
        body: "Editions are numbered and small. When an expression is gone it is not reissued, and the house does not discount what is left.",
      },
      {
        title: "Intelligent luxury",
        body: "Vision Studio runs on your device, estimates rather than asserts, and says so. Technology that oversells itself is not a luxury; it is a liability.",
      },
      {
        title: "Identity",
        body: "No logo on the front. The silhouette is the signature, and the wordmark is engraved where only the wearer will find it.",
      },
      {
        title: "Craftsmanship",
        body: "Published measurements, named materials, declared transmission figures, and a serviceable hinge. Everything stated here is something a customer can verify.",
      },
    ],
    commitments: [
      {
        title: "Repair before replacement",
        body: "Hinges, temples and lenses are all serviceable. A frame that can be fixed should be.",
      },
      {
        title: "No dark patterns",
        body: "No countdown timers, no fabricated scarcity, no pop-up asking for an address before the page has loaded.",
      },
      {
        title: "Honest technology",
        body: "Face data never leaves the browser. Fit figures are labelled as estimates because that is what they are.",
      },
      {
        title: "One price per market",
        body: "Published and held. Not converted at the spot rate, not adjusted by where you clicked from.",
      },
    ],
    metaTitle: "The House",
    metaDescription:
      "Designed in Amsterdam, made in Italy, released in numbered editions. The positions the house holds, and the four things it will not do.",
    eyebrow: "The House",
    titleFirst: "True luxury is",
    titleSecond: "never accidental.",
    lede: "Tamiale is a contemporary eyewear house. Designed in Amsterdam, made in Italy, released in numbered editions, and written down so it can be checked.",
    positionEyebrow: "The position",
    positionTitle: "What the house is for.",
    positionLede: "Written as positions the house holds, rather than slogans.",
    commitmentsEyebrow: "Commitments",
    commitmentsTitle: "Four things the house will not do.",
    registerTitleFirst: "Join the",
    registerTitleSecond: "house register.",
  },

  journal: {
    metaTitle: "Journal",
    metaDescription:
      "On design, craft and ownership. The arguments behind the objects, written by the house.",
    eyebrow: "Journal",
    title: "Writing from the house.",
    lede: "On design, craft and ownership. Not search-engine filler, but the arguments behind the objects.",
    readingTime: "{minutes} min",
    continueReading: "Continue reading",
    allEntries: "All entries",
  },

  privateClient: {
    metaTitle: "Private Client",
    metaDescription:
      "A direct line to an advisor who knows the frames. Early access to editions, service against your serial, and an honest answer before you buy.",
    eyebrow: "Private Client",
    titleFirst: "Someone who",
    titleSecond: "knows the frames.",
    lede: "Buying eyewear at this price without putting it on your face is a reasonable thing to hesitate over. The house sells online only, so it answers that hesitation with published millimetres, a mirror you can open in your browser, thirty days to send the pair back, and an advisor who will tell you not to buy.",
    services: {
      accessTitle: "Early access",
      accessBody:
        "Releases are offered to the register before they are announced. Editions are small enough that this is the difference between having the choice and reading about it.",
      directTitle: "A direct line",
      directBody:
        "One advisor, one thread, for as long as you own the pair. Sizing, service, repairs, and the occasional honest answer that a frame is not right for you.",
      serviceTitle: "Service and repair",
      serviceBody:
        "Registered pairs are serviced against their serial. The workshop knows which hinge, which finish and which production run without asking you.",
    },
    enquiriesEyebrow: "Enquiries",
    enquiriesTitle: "Write to an advisor.",
    enquiriesLede:
      "There are no boutiques and no appointments to keep. Send a note and an advisor will reply within one working day, in writing, with the measurements and the honest answer rather than a sales call.",
    orWrite: "Or write directly",
    form: {
      elsewhere: "Elsewhere",
      name: "Name",
      email: "Email",
      region: "Where you are",
      interest: "What you would like to discuss",
      measurements: "Optional. Measurements from a pair you already own are the single most useful thing you can bring.",
      submit: "Send the note",
      sending: "Sending…",
      thanks: "Received. An advisor will write within one working day.",
      error: "That did not send. Write to {email} and we will pick it up there.",
    },
  },

  passport: {
    noRecordTitle: "No passport for that serial.",
    noRecordBody: "The registry binds a serial to a unit when it is manufactured, so an unrecognised serial means one of three things: the pair has not been serialised yet, the number was mistyped, or the pair is not ours.",
    noRecordSpecimen: "Collection 001 has not entered production, so no customer serial is live. The specimen record is",
    backToPassports: "Back to passports",
    askAdvisor: "Ask an advisor",
    verified: "Verified",
    serviceHistory: "Service history",
    request: "Request",
    bookService: "Request a service",
    warrantyCovers: "What the warranty covers",
    recordCaveat: "Illustrative record. The production registry binds each serial to a manufactured unit at the line, and a registration can be revoked or transferred by the house. A printed code on its own is not proof of authenticity.",
    metaTitle: "Digital Passport",
    metaDescription:
      "A record the house keeps for a pair rather than for a purchase: edition number, warranty, service history and proof of purchase.",
    eyebrow: "Ownership",
    titleFirst: "The Digital",
    titleSecond: "Passport.",
    lede: "A record the house keeps for a pair rather than for a purchase. It holds the edition number, the warranty, the service history and the proof of purchase, and it survives the loss of your email.",
    steps: {
      findTitle: "Find the serial",
      findBody:
        "Engraved into the inner left temple at a depth of 0.12 mm, and printed on the authenticity card in the case.",
      registerTitle: "Register it",
      registerBody:
        "The serial is bound to the unit when it is made. Registering claims that binding to you, and the house can revoke it if a claim is disputed.",
      keepTitle: "Keep it, or pass it on",
      keepBody:
        "Warranty, repair history and proof of purchase follow the passport. If the pair changes hands, the passport transfers with it.",
    },
    lookupLabel: "Look up a passport",
    lookupPlaceholder: "TM-001-00000",
    lookupCta: "Open passport",
    lookupNote:
      "The registry is not yet bound to production units. One specimen record is published so the interface can be reviewed.",
    specimen: "Specimen",
    notReal: "Illustrative. Not a registered product.",
    fields: {
      passport: "Digital product passport",
      authenticity: "Authenticity",
      registered: "Registered",
      serial: "Serial",
      edition: "Edition",
      made: "Made",
      registeredTo: "Registered to",
      notRegistered: "Not yet registered",
      warrantyUntil: "Warranty until",
    },
    notFoundTitle: "No such passport.",
    notFoundBody:
      "That serial is not in the registry. Check the engraving on the inner left temple, or write to {email}.",
    backToPassport: "Back to the passport",
  },

  legal: {
    policies:
      "Policies",
    updated:
      "Updated {date}",
    draftNote:
      "Draft policy, written to the positions the house has taken elsewhere on this site. It has not been reviewed by counsel and must be checked against consumer law in each market before launch.",
  },

  myTamiale: {
    faceWidth: "Face width",
    proportion: "Proportion",
    estimatedOn: "Estimated in your browser on {date}. No image was kept, and this figure was never sent to Tamiale.",
    deleteProfile: "Delete this profile",
    savedSummary: "{vlt}% transmission · Category {category} · Ships {month}",
    metaTitle: "My Tamiale",
    metaDescription:
      "Saved frames and your fit profile, kept in this browser and nowhere else.",
    eyebrow: "My Tamiale",
    title: "My Tamiale.",
    lede: "Saved frames and your fit profile live in this browser and nowhere else. Nothing here required an account, and you can delete all of it in one action.",
    savedFrames: "Saved frames",
    nothingSaved: "Nothing saved yet.",
    nothingSavedBody:
      "Save an expression from any frame page and it will wait here. No account, no email, no reminder in three days.",
    viewCollection: "View the collection",
    fitProfile: "Fit profile",
    fitProfileBody:
      "Vision Studio can estimate your face width and bridge gap from your camera and keep the result here, on this device only.",
    openVisionStudio: "Open Vision Studio",
    ordersTitle: "Orders and passports",
    ordersBody:
      "Orders, tracking and registered passports sit behind a Tamiale account. Customer accounts are provisioned with the Shopify storefront and are not connected to this deployment yet, so there is nothing to sign in to.",
    aboutPassports: "About digital passports",
    forget: "Delete everything stored here",
    forgetDone: "Deleted.",
  },

  notFound: {
    title: "404",
    body: "This page is not part of the house.",
    collection: "The collection",
    home: "Return home",
  },

  region: {
    eu: "Europe",
    uk: "United Kingdom",
    us: "United States",
    ae: "United Arab Emirates",
    taxEu: "VAT included",
    taxUk: "VAT and duties included",
    taxUs: "Sales tax calculated at checkout",
    taxAe: "VAT and duties included",
    shipEu: "Complimentary insured delivery, 2 to 3 working days",
    shipUk: "Complimentary insured delivery, 2 to 4 working days",
    shipUs: "Complimentary insured delivery, 3 to 5 working days",
    shipAe: "Complimentary insured delivery, 2 to 4 working days",
    label: "Shipping to",
    vatIncluded: "VAT included",
  },
};

export type Dictionary = typeof en;

export default en;
