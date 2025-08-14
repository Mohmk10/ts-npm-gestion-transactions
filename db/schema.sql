-- ============================================
--  Schéma BDD — Gestion Transactions (TypeScript + MySQL)
--  Compatible avec le code du repo (enums string, noms de colonnes)
-- ============================================

-- (Optionnel) Créer la base si absente puis l’utiliser
CREATE DATABASE IF NOT EXISTS `gestion_tr_mysql`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;
USE `gestion_tr_mysql`;

-- --------------------------------------------
-- Table: compte (mère)
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS `compte` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `numero` VARCHAR(50) NOT NULL UNIQUE,
  `solde` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `date_ouverture` DATE NOT NULL,
  `type` ENUM('CHEQUE','EPARGNE') NOT NULL
) ENGINE=InnoDB;

-- --------------------------------------------
-- Table: compte_cheque (hérite de compte)
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS `compte_cheque` (
  `id_compte` INT PRIMARY KEY,
  CONSTRAINT `fk_compte_cheque`
    FOREIGN KEY (`id_compte`) REFERENCES `compte`(`id`)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
) ENGINE=InnoDB;

-- --------------------------------------------
-- Table: compte_epargne (hérite de compte)
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS `compte_epargne` (
  `id_compte` INT PRIMARY KEY,
  `date_debut` DATE NOT NULL,
  `duree` INT NOT NULL,
  CONSTRAINT `fk_compte_epargne`
    FOREIGN KEY (`id_compte`) REFERENCES `compte`(`id`)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
) ENGINE=InnoDB;

-- --------------------------------------------
-- Table: transaction (mot réservé → backticks)
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS `transaction` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `montant` DECIMAL(12,2) NOT NULL,
  `date_transaction` DATE NOT NULL,
  `type` ENUM('DEPOT','RETRAIT') NOT NULL,
  `compte_id` INT NOT NULL,
  CONSTRAINT `fk_transaction_compte`
    FOREIGN KEY (`compte_id`) REFERENCES `compte`(`id`)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
) ENGINE=InnoDB;

-- Index utile pour accélérer les recherches par compte
-- (À exécuter une seule fois ; si tu relances souvent ce fichier, commente cette ligne)
CREATE INDEX `idx_transaction_compte_id` ON `transaction` (`compte_id`);

-- --------------------------------------------
-- (Optionnel) Script de reset pour repartir de zéro
-- (Décommente *manuellement* si tu veux purger)
-- --------------------------------------------
-- SET FOREIGN_KEY_CHECKS = 0;
-- DROP TABLE IF EXISTS `transaction`;
-- DROP TABLE IF EXISTS `compte_epargne`;
-- DROP TABLE IF EXISTS `compte_cheque`;
-- DROP TABLE IF EXISTS `compte`;
-- SET FOREIGN_KEY_CHECKS = 1;
