"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Browser-local state that survives a reload and stays in step across tabs.
 *
 * Backed by `useSyncExternalStore` rather than an effect, so the server render
 * and the hydration pass both see the fallback and React swaps in the stored
 * value itself, so there is no mismatch and no cascading render on mount.
 *
 * `fallback` must be referentially stable; declare it at module scope.
 */

type Listener = () => void;

const listeners = new Map<string, Set<Listener>>();
/** getSnapshot must be referentially stable, so parsed values are memoised. */
const cache = new Map<string, { raw: string | null; value: unknown }>();

function notify(key: string) {
  listeners.get(key)?.forEach((listener) => listener());
}

function read<T>(key: string, fallback: T): T {
  const raw = window.localStorage.getItem(key);
  const entry = cache.get(key);
  if (entry && entry.raw === raw) return entry.value as T;

  let value = fallback;
  if (raw !== null) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = fallback;
    }
  }
  cache.set(key, { raw, value });
  return value;
}

export function usePersistentState<T>(
  key: string,
  fallback: T,
): [T, (next: T | ((previous: T) => T)) => void] {
  const subscribe = useCallback(
    (listener: Listener) => {
      let set = listeners.get(key);
      if (!set) {
        set = new Set();
        listeners.set(key, set);
      }
      set.add(listener);

      const onStorage = (event: StorageEvent) => {
        if (event.key === key || event.key === null) {
          cache.delete(key);
          listener();
        }
      };
      window.addEventListener("storage", onStorage);

      return () => {
        set.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
    [key],
  );

  const getSnapshot = useCallback(() => read(key, fallback), [key, fallback]);
  const getServerSnapshot = useCallback(() => fallback, [fallback]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (next: T | ((previous: T) => T)) => {
      const resolved =
        typeof next === "function"
          ? (next as (previous: T) => T)(read(key, fallback))
          : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        // Private browsing and full quotas both throw; the session continues
        // with in-memory state rather than failing in front of the visitor.
      }
      cache.set(key, { raw: JSON.stringify(resolved), value: resolved });
      notify(key);
    },
    [key, fallback],
  );

  return [value, setValue];
}

const noopSubscribe = () => () => {};

/** True once React has taken over on the client. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
