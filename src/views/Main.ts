import * as readlineSync from 'readline-sync';
import { CompteService } from "../services/CompteService";
import { CompteServiceImpl } from "../services/CompteServiceImpl";
import { TransactionService } from "../services/TransactionService";
import { TransactionServiceImpl } from "../services/TransactionServiceImpl";
import { CompteView } from "./CompteView";
import { TransactionView } from "./TransactionView";
import { Compte } from '../entity/Compte';
import { Database } from '../utils/Database';

const compteService: CompteService = new CompteServiceImpl();
const transactionService: TransactionService = new TransactionServiceImpl();
const compteView: CompteView = new CompteView();
const transactionView: TransactionView = new TransactionView();

function saisieNumber(message: string): number {
  while (true) {
    const input = readlineSync.question(`\n${message}: `);
    const valeur = parseInt(input, 10);
    if (!isNaN(valeur)) return valeur;
    console.log("\nEntrée invalide. Veuillez saisir un nombre entier.\n");
  }
}

function menuTr(): void {
  console.log("\n=== Menu Transaction ===");
  console.log("1 - Filtrer par compte");
  console.log("2 - Quitter");
}

function menu(): void {
  console.log("\n===== MENU PRINCIPAL =====");
  console.log("1 - Ajouter un compte");
  console.log("2 - Afficher le(s) compte(s)");
  console.log("3 - Ajouter une transaction");
  console.log("4 - Lister les transactions d'un compte");
  console.log("5 - Quitter");
}

async function main() {
  // Fermeture propre si l'utilisateur fait Ctrl+C
  process.on('SIGINT', async () => {
    try {
      console.log("\n\nInterruption reçue. Fermeture de la connexion...");
      await Database.getInstance().close();
    } catch {}
    process.exit(0);
  });

  let choix: number;
  do {
    menu();
    choix = saisieNumber("Faites un choix");

    switch (choix) {
      case 1: {
        const compte = await compteView.saisieCompte(compteService);
        if (compte) {
          const saved = await compteService.addCompte(compte);
          console.log(saved ? "\nCompte enregistré avec succès\n" : "\nLe compte n’a pas été enregistré\n");
        }
        break;
      }
      case 2: {
        const comptes: Compte[] = await compteService.getAllComptes();
        compteView.afficherComptes(comptes);
        break;
      }
      case 3: {
        const id = saisieNumber("Donnez l'ID du compte");
        const compteId = await compteService.getCompteById(id);
        if (compteId != null) {
          const tr = transactionView.saisieTransaction(compteId);
          if (tr) {
            const savedTr = await transactionService.addTransaction(tr);
            console.log(savedTr ? "\nTransaction effectuée avec succès\n" : "\nLa transaction a échoué\n");
          } else {
            console.log("\nLa transaction a échoué\n");
          }
        } else {
          console.log("\nAucun compte trouvé avec cet ID\n");
        }
        break;
      }
      case 4: {
        console.log("\n=== Toutes les transactions ===\n");
        const transactions = await transactionService.getAllTransactions();
        transactionView.afficherTransactions(transactions);

        let a: number;
        do {
          menuTr();
          a = saisieNumber("Choisissez");
          if (a === 1) {
            const id = saisieNumber("Donnez l'ID du compte");
            const compte = await compteService.getCompteById(id);
            if (compte != null) {
              const transCompte = await transactionService.findByCompteId(compte.id);
              transactionView.afficherTransactionsParCompte(compte, transCompte);
            } else {
              console.log("\nAucun compte trouvé avec cet ID.");
            }
          }
        } while (a !== 2);
        break;
      }
      case 5: {
        console.log("\nFin du programme. Merci \n");
        await Database.getInstance().close();
        break;
      }
      default:
        console.log("\nChoix invalide, réessayez\n");
        break;
    }
  } while (choix !== 5);
}

main();
