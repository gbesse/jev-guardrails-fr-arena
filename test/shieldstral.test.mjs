import test from "node:test";
import assert from "node:assert/strict";
import {
  unsafeProbability,
  createShieldstralClient,
} from "../src/shieldstral.mjs";
test("Softmax yes/no stable et scores incomplets refusés", () => {
  assert.ok(
    Math.abs(
      unsafeProbability([
        { token: "yes", logprob: Math.log(0.8) },
        { token: "no", logprob: Math.log(0.2) },
      ]) - 0.8,
    ) < 1e-10,
  );
  assert.throws(
    () => unsafeProbability([{ token: "yes", logprob: -0.1 }]),
    /incomplets/,
  );
});
test("Endpoint distant HTTP refusé", () =>
  assert.throws(
    () =>
      createShieldstralClient({
        endpoint: "http://exemple.fr/v1/chat/completions",
      }),
    /HTTPS/,
  ));
test("Le protocole vLLM produit une décision typée", async () => {
  let payload;
  const p = createShieldstralClient({
    fetchImpl: async (u, options) => {
      payload = JSON.parse(options.body);
      return Response.json({
        model: "mistralai/Shieldstral-1.0-3B",
        usage: { prompt_tokens: 10, completion_tokens: 1 },
        choices: [
          {
            logprobs: {
              content: [
                {
                  top_logprobs: [
                    { token: "yes", logprob: Math.log(0.9) },
                    { token: "no", logprob: Math.log(0.1) },
                  ],
                },
              ],
            },
          },
        ],
      });
    },
  });
  const r = await p.decide({
    questions: {
      q: {
        criteria: { etaye: "violation", ecart: "aucune", a_revoir: "ambigu" },
        instructions: { passage_gauche: "Politique", passage_droit: "Contenu" },
      },
    },
  });
  assert.equal(payload.max_tokens, 1);
  assert.ok(payload.messages[1].content.includes("<Document>"));
  assert.equal(r.answers.q.choice, "etaye");
});
