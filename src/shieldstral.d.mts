import type { Provider } from "./index.mjs";
export function unsafeProbability(tokens: unknown): number;
export function createShieldstralClient(options?: {
  endpoint?: string;
  fetchImpl?: typeof fetch;
}): Provider;
