# NationSounds - Festival Music App

## Description

NationSounds est une application web dédiée à un festival de musique. Elle permet aux utilisateurs de consulter le running order, de se repérer sur le site du festival, d'acheter des billets, de consulter une FAQ et des articles, ainsi que de recevoir des notifications push. L'application offre également une interface d'administration permettant de gérer les informations affichées dans l'application, de mettre à jour les artistes, de gérer le running order et d'activer/désactiver les notifications push.

## Fonctionnalités

### Pour les utilisateurs :

- **Consultation du running order** : Voir les horaires des artistes pendant le festival.
- **Repérage sur le site** : Une carte interactive avec les scènes, les points d'intérêt et les restaurants.
- **Achat de billets** : Possibilité d'acheter des billets pour le festival.
- **FAQ et articles** : Accès à une FAQ et à des articles informatifs sur le festival.
- **Notifications Push** : Réception de notifications push pour des informations importantes sur l'événement.

### Pour l'administration :

- **Gestion des artistes** : Ajouter, modifier et supprimer des artistes.
- **Gestion du running order** : Modifier l'ordre de passage des artistes.
- **Gestion des notifications** : Activer ou désactiver les notifications push.
- **Interface de gestion (IHM)** : Accès à une interface pour gérer les données et l'authentification.

## Stack Technique

- **Frontend** :
  - **React (avec TypeScript)** : Pour la création de l'interface utilisateur.
  - **Vite** : Outil de construction et de développement pour le projet React.
  - **Tailwind CSS** : Framework CSS pour une conception rapide et réactive de l'interface.
  - **React Leaflet** : Pour la carte interactive.
- **Backend** :

  - **Next.js** : Framework full-stack pour créer le backend et le frontend dans la même application.
  - **Prisma** : ORM pour interagir avec la base de données.
  - **PostgreSQL** : Système de gestion de base de données relationnelle.

- **Base de données** :

  - **Supabase** : Fournisseur de base de données et d'authentification, compatible avec PostgreSQL.
  - **Prisma** : Pour la gestion des migrations et l'accès à la base de données.

- **Autres outils** :
  - **GitHub** : Gestion du code source et des versions.
  - **Vercel** : Déploiement de l'application Next.js.

## Installation

### Prérequis

Avant de commencer, assurez-vous d'avoir installé Node.js et npm (ou yarn) sur votre machine.

1. Clonez ce repository :
   ```bash
   git clone https://github.com/JygsawZ/nationsounds.git
   cd nationsounds
   ```
