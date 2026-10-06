import { analyze, toHtml, type Dossier, type Report } from "../src/index.mjs";
import { createJevClient } from "../src/jev.mjs";
import { importManifest } from "../src/adapters.mjs";
const dossier: Dossier = {
  id: "jev-guardrails-fr-arena-demo",
  policy: {
    docId: "a",
    id: "menace",
    description:
      "Signaler les menaces directes de violence envers une personne. Autoriser les citations journalistiques, la prévention et les refus explicites de violence.",
  },
  content: {
    docId: "b",
    description: "Je vais te frapper demain devant chez toi.",
  },
  documents: [
    {
      id: "a",
      text: "menace\nSignaler les menaces directes de violence envers une personne. Autoriser les citations journalistiques, la prévention et les refus explicites de violence.",
      source: {
        uri: "fixture:a",
        date: "2026-10-06",
        kind: "synthetique",
        licence: "CC0-1.0",
      },
    },
    {
      id: "b",
      text: "Je vais te frapper demain devant chez toi.",
      source: {
        uri: "fixture:b",
        date: "2026-10-06",
        kind: "synthetique",
        licence: "CC0-1.0",
      },
    },
  ],
};
const report: Report = await analyze(dossier, {
  mode: "jev",
  provider: createJevClient({ apiKey: "test-de-type" }),
});
const html: string = toHtml(report);
void html;
const imported: Dossier = await importManifest("examples/manifest.json");
void imported;
// @ts-expect-error Les champs métier sont obligatoires.
await analyze({ id: "vide", documents: [] });
