# 🕊️ Daw9.ma - L'Élégance de l'Organisation de Mariage par l'IA

**Daw9.ma** (ذوق) est une plateforme de conciergerie de luxe nouvelle génération, conçue pour transformer l'expérience d'organisation de mariage au Maroc. Alliant tradition et haute technologie, la plateforme utilise l'intelligence artificielle pour offrir des recommandations ultra-personnalisées à partir des inspirations visuelles des futurs mariés.

## ✨ Caractéristiques Principales

### 🧠 Intelligence Artificielle (Matching Prédictif)
- **Analyse de Moodboard** : Analyse automatique des images d'inspiration (OpenAI) pour extraire le style, l'ambiance, la palette de couleurs et le budget prévisionnel.
- **Matching de Catalogue** : Algorithme propriétaire de calcul de similarité pour proposer les prestataires (Traiteurs, Zianas, DJs, etc.) les plus proches du rêve du client.
- **Algorithme "Fuzzy Match"** : Gestion intelligente des synonymes de couleurs et des styles hybrides.

### ⚙️ CI/CD (Automatisation)
- **GitHub Actions** : Workflows automatisés pour le Backend (Maven/Java 17) et le Frontend (NPM/Angular 17).
- **Validation Qualité** : Tests automatisés et vérification du build à chaque push sur `main`.

### 🛍️ Le Panier d'Excellence
- **Sélection Intuitive** : Ajout direct des articles du catalogue ou des suggestions IA.
- **Synchronisation en Temps Réel** : Notifications persistantes via WebSockets pour informer des nouvelles paires de matching ou des confirmations.
- **Gestion de Devis** : Estimation automatique des coûts en fonction du nombre d'invités.

### 💎 Expérience "Luxury"
- **Design Système Premium** : Interface raffinée utilisant des animations "Reveal" fluides, une typographie sérif élégante et un mode sombre/clair harmonieux.
- **Profil Centralisé** : Synchronisation bidirectionnelle entre le profil et les réservations pour une expérience sans friction.

## 🛠️ Stack Technique

### Backend (Architecture Monolithique)
- **Framework** : Spring Boot 3.2.2 (Java 17)
- **Sécurité** : Spring Security & JWT (Authentification / Autorisations par rôles)
- **Base de Données** : MySQL (Persistance des données)
- **Communication** : WebSocket (STOMP) pour les notifications temps réel
- **IA** : Intégration API OpenAI (Analyse d'images & classification)

### Frontend (Modern Angular)
- **Framework** : Angular 17.2+
- **Techniques de pointe** : Angular Signals (Gestion d'état), Standalone Components, Reactive Forms
- **Design** : Vanilla CSS & TailwindCSS (Layouts premium)
- **Icônes** : Material Symbols (Outlined)

---

## 🚀 Installation & Lancement

### Pré-requis
- Java 17+
- Node.js (v18+) & Angular CLI (v17+)
- MySQL Server

### Lancement du Backend
1. Naviguer dans le dossier `backEnd/`
2. Configurer vos secrets dans `src/main/resources/application.properties` (Base de données, Clé API OpenAI)
3. Exécuter la commande :
   ```bash
   mvn clean spring-boot:run
   ```

### Lancement du Frontend
1. Naviguer dans le dossier `frontEnd/`
2. Installer les dépendances : `npm install`
3. Lancer le serveur de développement : `npm start`
4. Accéder à l'application via `http://localhost:4200`

---

## 📁 Structure du Projet

```text
├── backEnd/
│   ├── src/main/java/com/daw9/
│   │   ├── controller/   # Endpoints API
│   │   ├── model/        # Entités & Enums
│   │   ├── repository/   # Accès aux données
│   │   ├── service/      # Logique métier & IA
│   │   └── config/       # Sécurité & WebSocket
│   └── pom.xml
│
└── frontEnd/
    ├── src/app/
    │   ├── core/         # Services & Modèles transversaux
    │   ├── features/     # Modules fonctionnels (Admin, Client, Auth)
    │   └── shared/       # Components & UI système (Skeleton, Toast)
    └── tailwind.config.js
```

## 🔐 Configuration de l'IA (Important)
Pour que l'analyse d'images fonctionne, assurez-vous d'avoir une clé OpenAI valide configurée dans votre environnement. Le prompt de matching a été optimisé pour extraire précisément les types de styles suivants : `TRADITIONNEL`, `MODERNE`, `MINIMALISTE`, `BOHEME`, `MAGHREBIN`.

---
*Développé avec ❤️ pour **Daw9.ma***
