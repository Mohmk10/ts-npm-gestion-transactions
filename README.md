# Gestion Transactions (TypeScript + MySQL)

Une application **CLI** (terminal) pour gérer des **comptes bancaires** (Chèque, Épargne) et leurs **transactions** (Dépôt, Retrait).
Projet minimaliste, typé, et prêt à exécuter localement.

---

## ✨ Fonctionnalités

* Création de comptes **Chèque** ou **Épargne** (blocage configurable pour l’épargne)
* **Dépôts / Retraits** avec règles métiers :

  * Chèque : frais de **8%** appliqués aux dépôts et retraits
  * Épargne : **retrait bloqué** pendant la durée de blocage
* **Liste des transactions** et **filtre par compte**
* Menu CLI simple, boucle robuste, fermeture propre de la DB

---

## 🧱 Stack

* **Node.js** + **TypeScript**
* **MySQL** (via `mysql2/promise`)
* Entrées terminal : `readline-sync`
* Chargement config : `dotenv`
* Runner dev : `tsx`

---

## ✅ Prérequis

* **Node 18+** (ou supérieur)
* **MySQL 8+**
* Accès local à une base (ex. `gestion_tr_mysql`)

---

## 📦 Installation

```bash
git clone https://github.com/Mohmk10/ts-npm-gestion-transactions.git
cd ts-npm-gestion-transactions
npm install
```

---

## ⚙️ Configuration

1. Dupliquer le fichier d’exemple **`.env.example`** → **`.env`**, puis renseigner vos variables :

```ini
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_user
DB_PASS=your_password
DB_NAME=gestion_tr_mysql
```

2. **Créer la base et les tables** (script fourni dans `db/schema.sql`) :

```bash
# crée la base si elle n'existe pas (facultatif mais pratique)
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS gestion_tr_mysql CHARACTER SET utf8mb4;"

# charge le schéma dans la base
mysql -u root -p gestion_tr_mysql < db/schema.sql
```

> Le fichier `db/schema.sql` contient le schéma complet (tables, clés étrangères, index).
> Si la base est déjà créée, exécute simplement la deuxième commande.

---

## ▶️ Lancer le projet

### Mode développement (rapide)

```bash
npm run dev
```

### Build + exécution (comme en production)

```bash
npm run build
npm run start
```

---

## 🗺️ Structure du projet

```text
src/
  entity/
    Compte.ts
    CompteCheque.ts
    CompteEpargne.ts
    Transaction.ts
    TypeCompte.ts
    TypeTransaction.ts
  repository/
    CompteRepository.ts
    CompteRepositoryImpl.ts
    TransactionRepository.ts
    TransactionRepositoryImpl.ts
  services/
    CompteService.ts
    CompteServiceImpl.ts
    TransactionService.ts
    TransactionServiceImpl.ts
  utils/
    Database.ts
    DateFormat.ts
  views/
    CompteView.ts
    TransactionView.ts
    Main.ts
tsconfig.json
package.json
db/
  schema.sql
```

---

## 💻 Utilisation (exemples rapides)

1. **Ajouter un compte**

   * Choisir **1** (Chèque) ou **2** (Épargne)
   * Pour **Épargne** : saisir la **durée de blocage** (en mois)

2. **Ajouter une transaction**

   * Saisir l’**ID** du compte
   * Choisir **1 = Dépôt** ou **2 = Retrait**
   * Les règles métiers s’appliquent automatiquement (frais de 8% pour Chèque, blocage pour Épargne)

3. **Lister & filtrer**

   * Choisir **4** pour tout afficher
   * Puis filtre par ID de compte (menu « Transaction »)

---

## 🧩 Détails techniques importants

* **Enums string** pour coller à MySQL :
  `TypeCompte = "CHEQUE" | "EPARGNE"`
  `TypeTransaction = "DEPOT" | "RETRAIT"`

* Table **`transaction`** : c’est un **mot réservé** SQL → *utiliser des backticks* dans les requêtes (`` `transaction` ``).

* Colonnes **DATE** (`date_ouverture`, `date_debut`, `date_transaction`) :
  insertion en **`YYYY-MM-DD`** via `DateFormat.toSqlDate(...)` pour éviter les décalages de fuseau.

* **Connexion MySQL** : le **pool** est créé une seule fois et **fermé** à la sortie de l’app (option 5 « Quitter » ou `Ctrl+C`).
  Ne pas fermer après chaque requête.

---

## 🧪 Scripts NPM

* `dev` : lance le CLI via **tsx** (développement)
* `build` : compile TypeScript vers `dist/`
* `start` : exécute `dist/views/Main.js`

---

## 🛠️ Dépannage

* **Connexion DB** : vérifier `.env` et l’existence de la base / des tables.
* **Erreur autour de `transaction`** : vérifier l’usage des **backticks** et la **conformité du schéma** (`db/schema.sql`).
* **Terminal capricieux** (entrée qui « gèle »/s’arrête) : utiliser `npm run dev` (tsx).
  Éviter `nodemon` avec `readline-sync`.

---

## 🚀 Roadmap (idées d’amélioration)

* Transactions SQL **atomiques** (BEGIN/COMMIT/ROLLBACK) pour synchroniser l’INSERT + UPDATE solde
* Index sur `` `transaction`(compte_id) `` pour accélérer les filtres
* Tests unitaires (Jest) sur la logique des comptes
* Export CSV des transactions

---