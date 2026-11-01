/**
 * What a form says back, and the nothing it says before it is used.
 *
 * These live apart from the actions themselves because a `"use server"`
 * module may only export async functions. Exporting a constant beside them
 * compiles without complaint and then throws when the action module is first
 * instantiated, which is to say on submit, in production, having never
 * failed in review.
 */
export type FormResult = {
  status: "idle" | "ok" | "error" | "pending-connection";
  message: string;
};

export const IDLE: FormResult = { status: "idle", message: "" };
