# URL Shortener — Test Technique Fullstack

Application fullstack de raccourcissement d'URLs construite avec **NestJS**, **Next.js**, **Prisma** et **PostgreSQL**, entièrement conteneurisée via **Docker**.

---

## Structure du projet

```
url-shortener/
├── backend/        # API REST NestJS + Prisma
├── frontend/       # Application Next.js
├── docker-compose.yml
└── README.md
```

---

## Prérequis

- [Docker](https://www.docker.com/) et Docker Compose
- [Node.js 22+](https://nodejs.org/) (pour le développement local)

---

## Lancer le projet avec Docker

```bash
docker compose up --build
```

Les trois services démarrent dans cet ordre :
1. `db` — PostgreSQL (port 5432)
2. `backend` — API NestJS, applique les migrations puis démarre (port 3001)
3. `frontend` — Next.js, attend que le backend soit healthy (port 3000)

L'application est disponible sur **http://localhost:3000**.

---

## Développement local (sans Docker)

### Backend

```bash
cd backend
npm install
# Copier et adapter le fichier d'environnement
cp .env.example .env
# Générer le client Prisma
npx prisma generate
# Appliquer les migrations (PostgreSQL doit être démarré)
npx prisma migrate deploy
# Démarrer en mode watch
npm run start:dev
```

Le backend est accessible sur **http://localhost:3001**.

### Frontend

```bash
cd frontend
npm install
npx prisma generate
npm run dev
```

Le frontend est accessible sur **http://localhost:3000**.

---

## API Backend

| Méthode | Endpoint              | Description                          |
|---------|-----------------------|--------------------------------------|
| POST    | `/urls`               | Créer un lien raccourci              |
| GET     | `/urls`               | Lister tous les liens                |
| GET     | `/urls?userId=1`      | Liens d'un utilisateur               |
| GET     | `/urls/:shortCode`    | Détails d'un lien                    |
| DELETE  | `/urls/test-reset`    | Vider la base (désactivé en prod)    |

### Exemple — Créer un lien

```bash
curl -X POST http://localhost:3001/urls \
  -H "Content-Type: application/json" \
  -d '{ "longUrl": "https://example.com", "ttl": "24h" }'
```

---

## Lancer les tests

### Tests fonctionnels backend (Jest + Supertest)

```bash
cd backend
npm install
npm run test
```

Ces tests vérifient les endpoints HTTP réels avec une vraie base de données de test.

### Tests E2E frontend (Playwright)

```bash
cd frontend
npm install
npx playwright install
npx playwright test
```

#### Avec interface graphique

```bash
npx playwright test --ui
```

#### Depuis Docker (backend requis)

```bash
# Lancer l'application complète
docker compose up -d

# Puis dans le dossier frontend
cd frontend && npm run test
```

---

## Fonctionnalités

- Raccourcir une URL longue avec génération automatique d'un code court
- Choisir un code personnalisé (optionnel, max 10 caractères)
- Définir une durée de validité : 24h, 7 jours ou permanent (compte requis)
- Redirection automatique vers l'URL originale via le code court
- Historique des liens pour les utilisateurs connectés
- Authentification email/mot de passe (NextAuth + bcrypt)
- Inscription et connexion avec validation des champs

---

## Choix techniques

- **NestJS** pour le backend : architecture modulaire claire (controllers, services, DTOs avec validation `class-validator`)
- **Prisma** côté backend uniquement pour la gestion des URLs — le frontend garde Prisma uniquement pour l'authentification (NextAuth)
- **Séparation des responsabilités** : le backend gère toute la logique métier des liens, le frontend se concentre sur l'UI et l'auth
- **Migrations au runtime** : `prisma migrate deploy` s'exécute au démarrage du conteneur backend, pas au build
- **Tailwind CSS** pour le styling du frontend

---

## Sécurité

- Validation systématique des entrées via `class-validator` (format URL, longueur du code, TTL)
- Mots de passe hashés avec `bcrypt`
- CORS configuré pour n'autoriser que le frontend
- Endpoint de reset de base désactivé en `NODE_ENV=production`
- Gestion des liens expirés côté backend
