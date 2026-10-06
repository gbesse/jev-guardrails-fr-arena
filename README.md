# Arène française : rejouer les politiques de modération

**Compare règles, Jev et un serveur Shieldstral sur les mêmes cas français.**

[![Tests](https://github.com/gbesse/jev-guardrails-fr-arena/actions/workflows/ci.yml/badge.svg)](https://github.com/gbesse/jev-guardrails-fr-arena/actions/workflows/ci.yml) · MIT · Node.js 22/24 · Version expérimentale

Les garde-fous distinguent-ils une menace, une citation et une négation ?

## Essayer en une minute

```sh
git clone https://github.com/gbesse/jev-guardrails-fr-arena.git
cd jev-guardrails-fr-arena
npm ci
npm run demo
npm run demo:import
npm run demo:limite
npm run demo:revue
npm run serve
```

Ouvrir http://127.0.0.1:8812 : choisir un exemple, modifier le JSON, analyser et télécharger le rapport. Aucun compte requis pour les modes hors ligne. Les exemples sont synthétiques et identifiés comme tels. [Parcours de démonstration](docs/demo/index.html).

## Ce qui est développé

Le module métier contient les contrôles propres à ce sujet. Le rapport JSON et HTML conserve chaque résultat, ses pièces et leurs empreintes SHA-256. Les passages sémantiques doivent être présents dans les pièces citées. Les nombres, dates et identifiants sont traités en code ; Jev évalue les rapprochements de sens avec abstention selon la confiance et la marge.

Le mode `regles` laisse les rapprochements sémantiques à revoir. Le mode `extraction` est une baseline lexicale simple, sans OCR ni compréhension fiable des négations. Un statut `etaye` signifie uniquement que les contrôles exécutés sont satisfaits. Dans cette arène, etaye désigne une violation établie de la politique ; ecart désigne une absence de violation. La sortie decisionModeration traduit le résultat.

```js
import {readFile} from 'node:fs/promises';
import {analyze,toHtml} from './src/index.mjs';
const dossier=JSON.parse(await readFile('./examples/dossier.json','utf8'));
const rapport=await analyze(dossier,{mode:'regles'});
console.log(rapport.status,rapport.outputs);
const html=toHtml(rapport);
```

```sh
node bin/jev-guardrails-fr-arena.mjs examples/dossier.json --mode regles --out rapport.json --html rapport.html
```

La CLI renvoie 0 pour `etaye`, 2 pour `ecart`, 3 pour `a_revoir`, 1 pour une erreur. Les scripts de démonstration n’échouent pas lorsqu’ils montrent un dossier à revoir. Les [types du contrat métier](src/index.d.mts) et le [dossier complet](examples/dossier.json) décrivent les champs. [Importer TXT et PDF textuels](docs/imports.md).

`npm run bench:regles` mesure une baseline à mots-clés. `npm run bench:shieldstral` utilise un serveur vLLM explicite. [Installation et limites Shieldstral](docs/shieldstral.md). Faux signalements et violations autorisées à tort doivent être lus séparément.

## Appeler Jev

Créer une `.env` ignorée par Git, permissions 600, avec `TYPESAFE_API_KEY`. Les appels sont payants et transmettent les passages à `api.typesafe.ai`. Le serveur local n’autorise Jev qu’avec le démarrage explicite ci-dessous ; aucune clé n’est envoyée au navigateur.

```sh
node --env-file=.env examples/demo.mjs --live
npm run serve:live
npm run bench:live
```

Modèle fixé `jev-1.13.0`, délai d’expiration, annulation, validation des distributions et réessais bornés. Seuils initiaux configurables, non calibrés. [API TypeSafe](https://docs.typesafe.ai/api) et [limites du modèle](https://docs.typesafe.ai/model-jaggedness/jev-1.13). Le paquet est installable depuis GitHub, sans publication npm : `npm install github:gbesse/jev-guardrails-fr-arena#v0.1.0`.

## Validation et limites

```sh
npm run typecheck
npm test
npm run bench
```

Les tests locaux passent sous Node 22 et 24. Jev retrouve 17/30 statuts globaux attendus dans le test synthétique initial, avec 1 erreur(s) de fournisseur ; la couverture sémantique est de 43.3 %. Les résultats complets et leurs limites sont conservés. La CI exécute les contrôles sous Node 22 et 24. Voir [évaluation et résultats](docs/evaluation.md), [sources](docs/sources.md), [acquisition](docs/acquisition.md) et [les douze projets](docs/serie-fr.md).

Corpus synthétique annoté par l’auteur. Aucun résultat Shieldstral réel sans serveur fourni. Le score mesure l’application de la politique, pas la sûreté universelle d’un agent.

Version initiale : corpus synthétique, sans supériorité SOTA ni trafic démontrés. Les champs normalisés doivent être contrôlés contre les originaux. Code MIT ; exemples CC0. Projet indépendant, sans affiliation aux organismes ou à TypeSafe AI.
