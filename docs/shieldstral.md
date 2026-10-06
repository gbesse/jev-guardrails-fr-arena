# Comparer avec Shieldstral

Shieldstral 1.0 est un modèle à héberger soi-même, sans endpoint de l’API Mistral. Suivre le [guide officiel](https://docs.mistral.ai/resources/cookbooks/mistral-moderation-shieldstral_policy_moderation) pour servir `mistralai/Shieldstral-1.0-3B` avec vLLM, support des logprobabilités activé. Définir `SHIELDSTRAL_URL` si l’adresse diffère de `http://127.0.0.1:8000/v1/chat/completions`, puis lancer `npm run bench:shieldstral`.

La requête utilise la même politique et le même contenu que Jev, dans le format Instruct / Query / Document. Le softmax est calculé seulement si les scores yes et no sont tous deux disponibles. Sinon le cas est une erreur fournisseur avec revue explicite. Le score binaire est transposé en violation / absence de violation ; l’abstention provient des seuils communs, pas d’une troisième sortie native de Shieldstral.

L’adaptateur est testé avec des réponses simulées. Aucun benchmark réel Shieldstral n’a été exécuté sans serveur GPU disponible. Le protocole, les modèles, les seuils et les limites doivent être conservés avec tout résultat publié.
