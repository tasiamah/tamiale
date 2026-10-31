import { NextResponse } from "next/server";

import { respond } from "@/lib/concierge/respond";

const MAX_QUESTION_LENGTH = 500;

/**
 * The register answers directly. An LLM, when configured, is allowed to
 * rephrase the retrieved entry conversationally. It is never given licence to
 * supply facts of its own, because the facts it would invent here are
 * measurements and shipping dates.
 */
export async function POST(request: Request) {
  let question: unknown;
  try {
    ({ question } = (await request.json()) as { question?: unknown });
  } catch {
    return NextResponse.json({ error: "Malformed request" }, { status: 400 });
  }

  if (typeof question !== "string" || question.trim().length === 0) {
    return NextResponse.json({ error: "Ask a question" }, { status: 400 });
  }

  const reply = respond(question.slice(0, MAX_QUESTION_LENGTH));
  const polished = await polish(question, reply.answer);

  return NextResponse.json(
    { answer: polished, actions: reply.actions, source: reply.source },
    { headers: { "Cache-Control": "no-store" } },
  );
}

async function polish(question: string, answer: string): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return answer;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
        max_output_tokens: 320,
        instructions:
          "You are an advisor at Tamiale, a luxury eyewear house. Rewrite the " +
          "SOURCE answer so it reads as a reply to the customer's question. " +
          "Understated, precise, never effusive, never a sales pitch. British " +
          "English. Under 90 words. You may only use facts present in SOURCE: " +
          "do not add measurements, prices, dates, materials or claims. If " +
          "SOURCE does not answer the question, say so and offer an advisor.",
        input: `QUESTION: ${question}\n\nSOURCE: ${answer}`,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) return answer;
    const data = (await response.json()) as { output_text?: string };
    return data.output_text?.trim() || answer;
  } catch {
    // An unreachable model must never cost the visitor their answer.
    return answer;
  }
}
