import "server-only";

import { theMarina } from "@/lib/catalog/frames";

/**
 * The passport registry.
 *
 * In production this is a row in Postgres written when a unit is serialised on
 * the line, and a lookup here is a read against that row. The binding is what
 * carries the weight: a QR code or a printed serial can be copied, so the
 * registry has to be the authority, and a registration has to be revocable.
 *
 * Until that service exists, one specimen record is published so the
 * interface and the contract can be reviewed end to end.
 */
export type PassportRecord = {
  serial: string;
  frameHandle: string;
  colorwayId: string;
  edition: string;
  editionNumber: number;
  editionSize: number;
  manufacturedAt: string;
  registeredTo: string | null;
  registeredAt: string | null;
  warrantyUntil: string;
  status: "registered" | "unregistered" | "revoked";
  serviceHistory: { date: string; event: string }[];
};

const REGISTRY: PassportRecord[] = [
  {
    serial: "TM-001-00417",
    frameHandle: theMarina.handle,
    colorwayId: "champagne",
    edition: "Edition 001",
    editionNumber: 17,
    editionSize: 150,
    manufacturedAt: "2026-10-22",
    registeredTo: "A. Specimen",
    registeredAt: "2026-12-14",
    warrantyUntil: "2028-12-14",
    status: "registered",
    serviceHistory: [
      { date: "2026-12-14", event: "Registered by first owner" },
      { date: "2027-08-02", event: "Nose pads replaced, house service" },
    ],
  },
];

export function findPassport(serial: string): PassportRecord | undefined {
  const normalised = serial.trim().toUpperCase();
  return REGISTRY.find((record) => record.serial === normalised);
}

export const SPECIMEN_SERIAL = REGISTRY[0].serial;
