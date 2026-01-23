# Configuration des mocks API

Ce projet utilise un système de mock fetch direct pour simuler l'API backend en développement.

## Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# URL de l'API backend (OBLIGATOIRE en production)
# En dev : Si non défini, utilise "/api/v1" par défaut
# Exemple: http://localhost:4000/api/v1
NEXT_PUBLIC_API_URL=

# Mode API (uniquement en développement)
# "mock" : Utilise le mock fetch pour simuler l'API (par défaut)
# "api" : Utilise l'API réelle
NEXT_PUBLIC_API_MODE=

# Node environment
NODE_ENV=development
```

## Comportement

### URL de l'API

- **Si `NEXT_PUBLIC_API_URL` est défini** : Utilisé en prod et dev
- **En production** : `NEXT_PUBLIC_API_URL` est **OBLIGATOIRE** (erreur si non défini)

### Mode mock vs API (développement uniquement)

Le mode ne change **pas** l'URL utilisée, seulement si le mock intercepte les requêtes :

#### Mode "mock" (par défaut)

- Le mock fetch intercepte toutes les requêtes vers `/api/v1/*`
- Aucune connexion au backend réel nécessaire
- Les codes de vérification et tokens sont affichés dans la console

**Utilisation :**
```env
NEXT_PUBLIC_API_MODE=mock
```

#### Mode "api"

- Le mock fetch n'intercepte pas les requêtes
- Les requêtes passent par le proxy Next.js vers le backend réel
- Nécessite que le backend soit lancé

**Utilisation :**
```env
NEXT_PUBLIC_API_MODE=api
```

## Notes

- Le mock est automatiquement désactivé en production
- MSW est toujours utilisé pour les tests (dans `vitest.config.ts`)
- Les données du mock sont stockées en mémoire (perdues au rechargement)
