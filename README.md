# CodeBranch — Frontend

Frontend de la plateforme **CodeBranch**. Construit avec Next.js (App Router), React Query, shadcn/ui et une architecture feature-first.

---

## Stack technique

| Domaine        | Technologie                          |
|----------------|--------------------------------------|
| Framework      | Next.js 16 (App Router)              |
| UI             | React 19, shadcn/ui, TailwindCSS     |
| Données        | TanStack React Query                 |
| Formulaires    | React Hook Form, Zod                 |
| Tests          | Vitest, Testing Library, MSW        |
| Icônes         | lucide-react                         |

---

## Prérequis

- **Node.js** 20+
- **pnpm** (recommandé), npm, yarn ou bun

---

## Installation

```bash
# Cloner le dépôt (si ce n'est pas déjà fait)
git clone https://github.com/lazarefortune/codebranch-frontend
cd codebranch-frontend

# Installer les dépendances
pnpm install
```

---

## Configuration

### Variables d'environnement

Copier le fichier d'exemple et renseigner les variables :

```bash
cp .env.example .env.local
```

| Variable               | Description |
|------------------------|-------------|
| `NEXT_PUBLIC_API_URL`  | URL de l’API backend (ex. `http://localhost:4000`). Obligatoire en production. |
| `NEXT_PUBLIC_API_MODE` | En dev : `api` (backend réel) ou `mock` (simulation). Par défaut : `api`. |
| `NODE_ENV`             | `development` ou `production`. |

Détails du mode mock : voir [`src/shared/api/mocks/README.md`](src/shared/api/mocks/README.md).

---

## Scripts

| Commande           | Description                    |
|--------------------|--------------------------------|
| `pnpm dev`         | Serveur de développement      |
| `pnpm build`       | Build de production            |
| `pnpm start`       | Démarrer le build en production |
| `pnpm lint`        | Linter ESLint                  |
| `pnpm type-check`  | Vérification TypeScript        |
| `pnpm test`        | Lancer les tests (Vitest)      |
| `pnpm test:watch`  | Tests en mode watch            |
| `pnpm test:ui`     | Interface Vitest UI            |

---

## Démarrage

```bash
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

---

## Structure du projet

- **app/** : routing et assemblage de composants, pas de logique métier.
- **features/** : hooks, services, schémas Zod et composants par domaine.
- **shared/** : API, UI, providers et hooks réutilisables.

---

## Tests

Les tests sont colocalisés avec le code (ex. `useLogin.ts` → `useLogin.test.ts` ou `__tests__/`).

```bash
pnpm test        # Exécution unique
pnpm test:watch  # Mode watch
pnpm test:ui     # Interface Vitest
```

- Hooks et schémas Zod sont couverts en priorité.
- Les appels API sont simulés avec MSW en test.

---

## Linting et types

```bash
pnpm lint         # ESLint
pnpm type-check   # TypeScript (tsc --noEmit)
```
