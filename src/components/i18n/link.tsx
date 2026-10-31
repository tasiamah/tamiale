"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";

import { useHref } from "@/components/i18n/dictionary-provider";

type Props = Omit<ComponentProps<typeof NextLink>, "href"> & { href: string };

/**
 * `next/link` with the active locale pushed onto the front of the path.
 *
 * Every in-app link goes through this. Without it a French visitor clicking
 * "The Collection" would land on /collection, be redirected by the proxy,
 * and only stay in French because the cookie happened to agree. Anything
 * absolute (http, mailto, tel) or a bare fragment is passed straight to
 * `next/link` untouched.
 */
export function Link({ href, ...props }: Props) {
  const localise = useHref();
  return <NextLink href={localise(href)} {...props} />;
}
