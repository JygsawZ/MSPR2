# Corefeast - Festival de Metalcore, Hardcore et Deathcore

Corefeast est une application web moderne pour la gestion et la présentation d'un festival de musique dédié aux genres Metalcore, Hardcore et Deathcore. L'application est construite avec Next.js, TypeScript, Tailwind CSS et Prisma.

## 🚀 Fonctionnalités

- **Programmation des artistes** : Affichage des artistes par jour avec horaires
- **Plan du festival** : Carte interactive avec les différents points d'intérêt
- **Système de filtrage** : Recherche par nom, filtre par jour, plage horaire et tags
- **Gestion des artistes** : Interface d'administration pour gérer les artistes et leurs performances
- **FAQ** : Section questions fréquentes avec système d'accordéon
- **Authentification** : Système de connexion sécurisé pour l'administration
- **Responsive Design** : Interface adaptative pour tous les appareils

## 🛠️ Technologies utilisées

- **Frontend** :
  - Next.js 15.2.0 (avec Turbopack)
  - React 19.0.0-rc.1
  - TypeScript 5
  - Tailwind CSS 3.4.1
  - DaisyUI 4.12.24
  - React Leaflet 5.0.0-rc.2
  - NextAuth.js 4.24.11
  - React Icons 5.5.0
  - date-fns 4.1.0

- **Backend** :
  - Prisma (ORM)
  - PostgreSQL
  - Next.js API Routes
  - Supabase (pour le stockage des images)
  - bcrypt (pour le hachage des mots de passe)
  - Zod (pour la validation des données)

- **Outils de développement** :
  - ESLint
  - Jest (pour les tests)
  - TypeScript
  - Tailwind CSS Forms

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- PostgreSQL
- npm ou yarn

## 🔧 Installation

1. **Cloner le repository**
```bash
git clone [URL_DU_REPO]
cd nationsounds-app
```

2. **Installer les dépendances**
```bash
npm install
# ou
yarn install
```

3. **Configurer les variables d'environnement**
Créer un fichier `.env` à la racine du projet avec les variables suivantes :
```env
DATABASE_URL="postgresql://user:password@localhost:5432/corefeast"
NEXTAUTH_SECRET="votre_secret_ici"
NEXTAUTH_URL="http://localhost:3000"
SUPABASE_URL="votre_url_supabase"
SUPABASE_ANON_KEY="votre_clé_anon_supabase"
```

4. **Initialiser la base de données**
```bash
npx prisma generate
npx prisma db push
```

5. **Lancer l'application en mode développement**
```bash
npm run dev
# ou
yarn dev
```

L'application sera accessible à l'adresse : `http://localhost:3000`

## 📁 Structure du projet

```
nationsounds-app/
├── src/
│   ├── app/
│   │   ├── admin/           # Pages d'administration
│   │   ├── api/            # Routes API
│   │   ├── components/     # Composants réutilisables
│   │   └── pages/         # Pages publiques
│   ├── lib/               # Utilitaires et configurations
│   └── typescript/        # Types TypeScript
├── prisma/
│   └── schema.prisma      # Schéma de la base de données
├── public/               # Fichiers statiques
└── package.json
```

## 🔐 Configuration de l'authentification

1. Créer un compte administrateur via l'API :
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"votre_mot_de_passe","name":"Admin"}'
```

2. Se connecter à l'interface d'administration via `/admin`

## 🎨 Personnalisation

### Thème
Le thème de l'application utilise DaisyUI et peut être personnalisé en modifiant :
- `tailwind.config.js`
- Les composants individuels
- Les classes DaisyUI

### Images
Les images des artistes et du festival sont stockées sur Supabase et doivent être gérées via l'interface d'administration.

## 📱 Responsive Design

L'application est optimisée pour :
- Mobile (320px et plus)
- Tablette (768px et plus)
- Desktop (1024px et plus)

## 🔍 SEO

L'application utilise les métadonnées Next.js pour l'optimisation SEO. Les métadonnées peuvent être modifiées dans les fichiers de page individuels.

## 🧪 Tests

Pour lancer les tests :
```bash
npm run test
# ou
yarn test
```

## 📦 Production

Pour construire l'application pour la production :
```bash
npm run build
# ou
yarn build
```

Pour démarrer l'application en production :
```bash
npm start
# ou
yarn start
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue ou à nous contacter via les réseaux sociaux du festival. 