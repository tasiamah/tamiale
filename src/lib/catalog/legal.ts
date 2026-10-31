/**
 * Policy copy.
 *
 * These are drafts written to the positions the house has taken elsewhere on
 * the site. They are not legal advice and have not been reviewed by counsel;
 * have them checked against consumer law in every market before launch, in
 * particular the EU and UK distance-selling rules on pre-orders.
 */
export type LegalDocument = {
  slug: string;
  title: string;
  summary: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
};

export const legalDocuments: LegalDocument[] = [
  {
    slug: "shipping",
    title: "Shipping",
    summary:
      "Insured, tracked and complimentary in every market the house serves.",
    updated: "2026-10-01",
    sections: [
      {
        heading: "Pre-orders",
        body: [
          "Collection 001 is sold as a pre-order. Payment is taken when you reserve, which is what holds your pair against the edition, and the pair is dispatched in March 2027.",
          "If that date moves you will be told before it passes, not after. A delay of more than thirty days entitles you to cancel for a full refund, and you may cancel for any reason at any point before dispatch.",
        ],
      },
      {
        heading: "Delivery",
        body: [
          "Shipping is complimentary and insured to Europe, the United Kingdom, the United States and the United Arab Emirates. Expect two to three working days in Europe, two to four in the UK and the Emirates, and three to five in the United States, counted from dispatch rather than from order.",
          "A signature is required on delivery. Every parcel is tracked, and the tracking link is sent when the parcel leaves the atelier.",
        ],
      },
      {
        heading: "Duties and taxes",
        body: [
          "Prices in Europe, the United Kingdom and the Emirates include VAT and any import duty. United States prices exclude sales tax, which is calculated at checkout against the delivery address.",
          "The house does not under-declare the value of a parcel, and cannot mark an order as a gift.",
        ],
      },
    ],
  },
  {
    slug: "returns",
    title: "Returns",
    summary: "Thirty days, unworn, in the case, at our cost.",
    updated: "2026-10-01",
    sections: [
      {
        heading: "The window",
        body: [
          "Thirty days from delivery. The pair must be unworn and returned in its case with the authenticity card. Return shipping is paid by the house, and the refund is issued to the original payment method within five working days of the pair arriving back.",
          "This sits on top of, and does not replace, the statutory fourteen-day right of withdrawal under EU and UK distance-selling rules.",
        ],
      },
      {
        heading: "Cancelling a pre-order",
        body: [
          "A pre-order can be cancelled for a full refund at any point before it is dispatched. Write to clients@tamiale.com with the order number; no reason is required and none will be asked for.",
        ],
      },
      {
        heading: "Exchanges",
        body: [
          "To change lens expression, return the pair and reserve the one you want. Because editions are numbered and small, the house cannot hold a second pair against an exchange in progress.",
        ],
      },
    ],
  },
  {
    slug: "warranty",
    title: "Warranty and repairs",
    summary:
      "Two years against manufacturing defects, and a standing offer to repair rather than replace.",
    updated: "2026-10-01",
    sections: [
      {
        heading: "What is covered",
        body: [
          "Two years from delivery against defects in materials and manufacture: hinge failure, delamination of the acetate, lens coating failure, and any fault in assembly.",
          "The warranty does not cover accidental damage, normal wear to the finish, scratches from use, or damage from heat. Leaving a pair on a dashboard will distort acetate, and no house can warrant against that.",
        ],
      },
      {
        heading: "Repair before replacement",
        body: [
          "Hinges, temples and lenses are all serviceable. Where a pair can be repaired it will be, in preference to replacing it, and that applies after the warranty has expired as well, where repairs are charged at cost.",
          "Register the serial engraved on the inner left temple to a Digital Passport and the warranty follows the pair rather than the receipt, including to a second owner.",
        ],
      },
      {
        heading: "Making a claim",
        body: [
          "Write to clients@tamiale.com with the serial and a photograph. An advisor will arrange collection. Nothing in this warranty affects your statutory rights against the seller.",
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy",
    summary:
      "What the house collects, why, and how little of it there is.",
    updated: "2026-10-01",
    sections: [
      {
        heading: "What is collected",
        body: [
          "To fulfil an order: your name, delivery and billing address, email address and the order itself. Payment card details are handled by the payment processor and never reach Tamiale's systems.",
          "If you join the house register, your email address and nothing else.",
        ],
      },
      {
        heading: "What is not collected",
        body: [
          "No camera image, video frame or facial landmark. Vision Studio processes video entirely in your browser; nothing from it is transmitted. A fit profile, if you save one, is written to your own browser storage and can be deleted from My Tamiale.",
          "Saved frames are also held in your browser rather than on a server, which is why they do not require an account.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "Under the GDPR and equivalent legislation you may request a copy of your data, ask for it to be corrected, or ask for it to be erased. Write to clients@tamiale.com and expect a reply within thirty days.",
          "The house does not sell personal data, and does not share the register with anyone.",
        ],
      },
    ],
  },
  {
    slug: "vision-privacy",
    title: "Camera and face data",
    summary:
      "Vision Studio runs on your device. This page explains exactly what that means.",
    updated: "2026-10-01",
    sections: [
      {
        heading: "Where the processing happens",
        body: [
          "The face tracking model and its WebAssembly runtime are served from tamiale.com and executed in your browser. Video frames are read from the camera, measured, drawn over, and discarded. They are never uploaded, and the studio makes no network request once it has loaded.",
          "You can verify this: open your browser's network inspector and use the studio. There is no traffic.",
        ],
      },
      {
        heading: "Consent",
        body: [
          "The camera is requested only when you press the button, never on page load. Declining costs you nothing: every frame can be examined in 3D, every measurement is published, and the entire store works without it.",
        ],
      },
      {
        heading: "What can be stored",
        body: [
          "Only if you press 'keep this profile': an estimated face width, an estimated bridge gap, a one-word description of your proportions and the styling preference you selected. No image. It is written to your browser's local storage, not to a Tamiale server, and 'Delete this profile' in My Tamiale removes it immediately.",
        ],
      },
      {
        heading: "On the accuracy of the estimates",
        body: [
          "A single camera has no sense of absolute scale. Every millimetre the studio reports is derived by assuming your pupillary distance is close to the adult average, which is a sound basis for a recommendation and an unsound one for anything else. The figures are labelled as estimates throughout and should be checked against a pair of glasses you already own.",
        ],
      },
    ],
  },
  {
    slug: "accessibility",
    title: "Accessibility",
    summary: "The standard this site is built to, and where it falls short.",
    updated: "2026-10-01",
    sections: [
      {
        heading: "The target",
        body: [
          "WCAG 2.2 Level AA. In practice that means every control is reachable and operable from a keyboard, focus is always visible, text meets contrast minimums against its background, motion respects the reduced-motion setting, and every image carries a description that says what it shows.",
        ],
      },
      {
        heading: "Known limitations",
        body: [
          "The 3D atelier is a canvas and cannot be read by a screen reader. Every dimension, material and finish it shows is published as text in the specification table on the same page, and the technical elevation carries a full text description.",
          "Vision Studio requires a camera and a face, and is therefore not available to everyone. It is an addition to the shopping experience and never a requirement of it.",
        ],
      },
      {
        heading: "Telling us",
        body: [
          "If something here does not work for you, write to clients@tamiale.com. An accessibility fault is treated as a defect, not a feature request.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of sale",
    summary: "The agreement between you and the house.",
    updated: "2026-10-01",
    sections: [
      {
        heading: "Orders",
        body: [
          "An order is an offer to buy. The contract is formed when the house confirms it by email. If an item is listed in error, at the wrong price, or is no longer available, the order may be declined and anything paid refunded in full.",
        ],
      },
      {
        heading: "Price and payment",
        body: [
          "Prices are published per market and shown in the currency of that market. Payment is taken at the point of order, including on pre-orders, and that payment is what reserves a numbered pair against the edition.",
        ],
      },
      {
        heading: "Product information",
        body: [
          "Measurements, weights and lens transmission figures are published for every frame. Colour reproduction varies between screens and a lens simulation on a display is an approximation of an experience, not a measurement of light transmission or of ultraviolet performance. The conformity documentation supplied with the lenses is the authority.",
        ],
      },
      {
        heading: "Governing law",
        body: [
          "These terms are governed by the law of the Netherlands, without prejudice to the mandatory consumer protections available to you in your own country of residence.",
        ],
      },
    ],
  },
];

export function findLegalDocument(slug: string): LegalDocument | undefined {
  return legalDocuments.find((document) => document.slug === slug);
}
