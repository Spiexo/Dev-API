# Fil-Rouge Developpement API

API REST pour la gestion des utilisateurs, de l'authentification, des fonctionnalités administratives et l'intégration de l'API TheSportsDB.

## Fonctionnalités

- Authentification : inscription, connexion, déconnexion, rafraîchissement de token
- Gestion des utilisateurs : profil, édition, suppression
- Gestion administrative : bannir/débannir des utilisateurs
- Tests unitaires avec Jest
- Documentation Swagger

## Installation

1. Cloner le dépôt :

```
git clone https://github.com/Spiexo/Dev-API
```

2. Installer les dépendances :

```
npm install
```
3. Créer un fichier .env avec les variables suivantes :

```
PORT=3000
NODE_ENV=development
JWT_SECRET=jwt_secret_key
JWT_REFRESH_SECRET=refresh_jwt_secret_key
```
4. Le fichier SQLite dev-api.db sera créé automatiquement sinon c'est à creer dans src/config/

## Lancer le projet
```
npx tsc
npm start

```
ou
```
npm run dev
```

Le serveur tourne par défaut sur http://localhost:3000.

Documentation Swagger
Accessible sur : http://localhost:3000/api-docs

Swagger fournit la description complète de toutes les routes, des paramètres et des modèles (User, RegisterRequest, LoginRequest, etc.).

## Routes principales
1. Auth

POST /auth/register : Inscription

POST /auth/login : Connexion

POST /auth/logout : Déconnexion

POST /auth/refresh : Rafraîchir le token

2. Users

GET /user/profil : Obtenir son profil

GET /user/profil/:id : Profil d’un utilisateur

GET /user/users: Récupère tous les utilisateurs avec pagination

PUT /user : Modifier son profil

DELETE /user : Supprimer son compte

3. Admin

POST /admin/ban/:id : Bannir un utilisateur

POST /admin/unban/:id : Débannir un utilisateur

4. Sports

POST /sports/leagues : Récupère toutes les ligues

POST /sports/leagues/:id : Récupère une ligue par ID

POST /sports/teams/:leagues : Récupère les équipes d'une ligue

## Tests
Tests unitaires avec Jest :

```
npx jest --coverage
```