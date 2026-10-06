import { MODEL, validateChoiceResponse } from "./jev.mjs";
export function unsafeProbability(tokens) {
  if (!Array.isArray(tokens)) throw new TypeError("Logprobabilités requises");
  const scores = {};
  for (const t of tokens) {
    const key = String(t.token ?? "")
      .trim()
      .toLowerCase()
      .replace(/^["']|["'.]$/g, "");
    if (
      (key === "yes" || key === "no") &&
      Number.isFinite(t.logprob) &&
      t.logprob <= 0
    )
      scores[key] = Math.max(scores[key] ?? -Infinity, t.logprob);
  }
  if (!Number.isFinite(scores.yes) || !Number.isFinite(scores.no))
    throw new TypeError(
      "Scores yes/no incomplets : abstention, aucun score inventé",
    );
  const m = Math.max(scores.yes, scores.no);
  return (
    Math.exp(scores.yes - m) /
    (Math.exp(scores.yes - m) + Math.exp(scores.no - m))
  );
}
export function createShieldstralClient({
  endpoint = process.env.SHIELDSTRAL_URL ??
    "http://127.0.0.1:8000/v1/chat/completions",
  fetchImpl = globalThis.fetch,
} = {}) {
  const u = new URL(endpoint);
  if (
    u.protocol !== "https:" &&
    !(
      u.protocol === "http:" &&
      ["127.0.0.1", "localhost", "[::1]"].includes(u.hostname)
    )
  )
    throw new TypeError("Endpoint HTTPS ou boucle locale requis");
  return {
    model: "mistralai/Shieldstral-1.0-3B",
    async decide({ questions, signal }) {
      const answers = Object.create(null);
      let input_tokens = 0,
        output_tokens = 0;
      for (const [id, q] of Object.entries(questions)) {
        const i = q.instructions;
        const response = await fetchImpl(u, {
          method: "POST",
          redirect: "error",
          signal: signal
            ? AbortSignal.any([signal, AbortSignal.timeout(30000)])
            : AbortSignal.timeout(30000),
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            model: "mistralai/Shieldstral-1.0-3B",
            messages: [
              {
                role: "system",
                content:
                  "Judge whether the Document meets the requirements based on the Query and the Instruction provided. Answer yes or no.",
              },
              {
                role: "user",
                content:
                  "<Instruct>: " +
                  i.passage_gauche +
                  "\n\n<Query>: Does the Document violate this policy?\n\n<Document>: " +
                  i.passage_droit,
              },
            ],
            max_tokens: 1,
            temperature: 0,
            logprobs: true,
            top_logprobs: 20,
          }),
        });
        if (!response.ok)
          throw new Error("Shieldstral HTTP " + response.status);
        const raw = await response.json();
        if (raw.model !== "mistralai/Shieldstral-1.0-3B")
          throw new TypeError("Modèle Shieldstral inattendu");
        const p = unsafeProbability(
          raw.choices?.[0]?.logprobs?.content?.[0]?.top_logprobs,
        );
        const probabilities = { etaye: p, ecart: 1 - p, a_revoir: 0 };
        const choice = p >= 0.5 ? "etaye" : "ecart";
        answers[id] = {
          type: "choice",
          choice,
          confidence: Math.max(p, 1 - p),
          probabilities,
        };
        if (
          !Number.isSafeInteger(raw.usage?.prompt_tokens) ||
          raw.usage.prompt_tokens < 0 ||
          !Number.isSafeInteger(raw.usage?.completion_tokens) ||
          raw.usage.completion_tokens < 0
        )
          throw new TypeError("Usage Shieldstral manquant");
        input_tokens += raw.usage.prompt_tokens;
        output_tokens += raw.usage.completion_tokens;
      }
      return validateChoiceResponse(
        {
          model: "mistralai/Shieldstral-1.0-3B",
          answers,
          usage: { input_tokens, output_tokens },
        },
        questions,
        "mistralai/Shieldstral-1.0-3B",
      );
    },
  };
}
