"use server";

export type FormResult = {
  status: "idle" | "ok" | "pending-connection" | "error";
  message: string;
};

export const IDLE: FormResult = { status: "idle", message: "" };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Client registrations are forwarded to whichever CRM or ESP the house runs.
 * Nothing is written locally, because a luxury client list does not belong
 * in an application log, so with no destination configured the form says so
 * plainly rather than pretending to have captured an address.
 */
async function forward(
  kind: string,
  payload: Record<string, string>,
): Promise<FormResult> {
  const endpoint = process.env.CLIENT_REGISTER_WEBHOOK_URL;

  if (!endpoint) {
    return {
      status: "pending-connection",
      message:
        "The client register is not yet connected to this deployment, so this request was not recorded. Write to info@tamiale.com in the meantime.",
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.CLIENT_REGISTER_WEBHOOK_TOKEN
          ? {
              Authorization: `Bearer ${process.env.CLIENT_REGISTER_WEBHOOK_TOKEN}`,
            }
          : {}),
      },
      body: JSON.stringify({ kind, ...payload, receivedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`register responded ${response.status}`);
  } catch (error) {
    console.error(`[tamiale] ${kind} registration failed:`, error);
    return {
      status: "error",
      message:
        "We could not record that just now. Please try again, or write to info@tamiale.com.",
    };
  }

  return { status: "ok", message: "" };
}

export async function requestPrivateAccess(
  _previous: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const email = String(formData.get("email") ?? "").trim();
  if (!EMAIL.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const result = await forward("private-access", { email });
  return result.status === "ok"
    ? {
        status: "ok",
        message:
          "You are on the list. You will hear from the house before the next release is announced.",
      }
    : result;
}

export async function requestEnquiry(
  _previous: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const region = String(formData.get("region") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (name.length < 2) {
    return { status: "error", message: "Please tell us your name." };
  }
  if (!EMAIL.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const result = await forward("enquiry", {
    name,
    email,
    region,
    note: note.slice(0, 1000),
  });
  return result.status === "ok"
    ? {
        status: "ok",
        message: `Thank you, ${name.split(" ")[0]}. An advisor will write within one working day to arrange a time.`,
      }
    : result;
}
