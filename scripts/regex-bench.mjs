import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { regexModeration } from "../src/domain.mjs";
const raw = await readFile(
  new URL("../corpus/cases.json", import.meta.url),
  "utf8",
);
const cases = JSON.parse(raw).filter((c) => c.split === "test");
const rows = cases.map((c) => ({
  id: c.input.id,
  expected: c.expected,
  actual: regexModeration(c.input),
}));
const result = {
  method: "regex-menace-fr",
  corpusSha256: createHash("sha256").update(raw).digest("hex"),
  n: rows.length,
  accuracy: rows.filter((r) => r.actual === r.expected).length / rows.length,
  falseFlags: rows.filter((r) => r.actual === "etaye" && r.expected !== "etaye")
    .length,
  falseAllows: rows.filter(
    (r) => r.actual === "ecart" && r.expected === "etaye",
  ).length,
  rows,
  limits: [
    "Baseline lexicale volontairement simple ; aucune compréhension du contexte.",
  ],
};
await writeFile(
  new URL("../reports/regex-test.json", import.meta.url),
  JSON.stringify(result, null, 2) + "\n",
);
console.log(JSON.stringify(result, null, 2));
