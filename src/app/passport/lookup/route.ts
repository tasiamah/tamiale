import { redirect } from "next/navigation";

/** Turns the serial typed into the lookup field into a passport URL. */
export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("serial") ?? "";
  const serial = raw.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");

  redirect(serial ? `/passport/${encodeURIComponent(serial)}` : "/passport");
}
