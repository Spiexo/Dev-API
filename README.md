# fil-rouge — API

Description
- API backend pour le projet "fil-rouge". Fournit les endpoints REST pour la gestion des ressources (auth, users, items, etc.). README synthétique pour installation, configuration et lancement.

Prérequis
- Git
- Node.js >= 16 (ou Python 3.8+) selon l'implémentation du projet
- npm ou yarn (si Node.js)
- Docker (optionnel)
- Une base de données (Postgres, MySQL, MongoDB) si nécessaire

Installation (depuis le dépôt local)
1. Ouvrir un terminal à la racine du projet.
2. Installer les dépendances (exemple Node.js) :
```bash
# avec npm
npm install

# ou avec yarn
yarn
```

Configuration
- Créer un fichier `.env` à la racine en se basant sur `.env.example` (s'il existe). Exemple minimal :
```
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/filrouge
JWT_SECRET=changeme
NODE_ENV=development
```
- Remplacer les valeurs par celles de l'environnement local.

Lancer le projet

Node.js (développement)
```bash
# démarrer en mode développement (avec reload si nodemon présent)
npm run dev

# ou
npm start
```

Python (Flask/FastAPI) — exemple
```bash
# créer et activer un venv
python -m venv .venv
# Windows
.venv\Scripts\activate
# Unix
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Docker (optionnel)
```bash
# construire
docker build -t fil-rouge-api .

# lancer (avec variables d'environnement)
docker run --env-file .env -p 3000:3000 fil-rouge-api
```

Exemples d'utilisation (curl)
```bash
# vérifier que le serveur répond
curl http://localhost:3000/health

# requête POST de connexion (exemple)
curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email":"exemple@test.com","password":"pwd"}'
```

Tests
- Lancer la suite de tests (si présente) :
```bash
# Node
npm test

# Python (pytest)
pytest
```

Structure recommandée (exemple)
```
/src
    /controllers
    /models
    /routes
    /services
    app.js (ou main.py)
.env
package.json (ou pyproject/requirements.txt)
README.md
```