import * as readlineSync from 'readline-sync';
import { Compte } from '../entity/Compte';
import { Transaction } from '../entity/Transaction';
import { TypeTransaction } from '../entity/TypeTransaction';
import { TypeCompte } from '../entity/TypeCompte';

export class TransactionView {

  public saisieNumber(message: string): number {
    while (true) {
      const input = readlineSync.question(`\n${message}: `);
      const valeur = parseInt(input, 10);
      if (!isNaN(valeur)) return valeur;
      console.log("\nEntrée invalide. Veuillez saisir un nombre entier.\n");
    }
  }

  public saisieTransaction(compte: Compte): Transaction | null {
    let montant: number;
    while (true) {
      montant = this.saisieNumber("Entrez un montant");
      if (montant <= 0) { console.log("Le montant doit être supérieur à 0"); continue; }
      break;
    }

    console.log("\n=== Type de transaction ===");
    console.log("1 - DÉPÔT");
    console.log("2 - RETRAIT");

    let choix: number;
    do {
      choix = this.saisieNumber("Faites un choix");
      if (choix != 1 && choix != 2) console.log("\n Veuillez choisir entre 1 & 2");
    } while (choix != 1 && choix != 2);

    const type: TypeTransaction = (choix == 1) ? TypeTransaction.DEPOT : TypeTransaction.RETRAIT;

    if (type == TypeTransaction.DEPOT) {
      compte.depot(montant);
    } else {
      const ok: boolean = compte.retrait(montant);
      if (!ok) {
        // Infos distinctes par type
        console.log((compte as any).type === TypeCompte.CHEQUE ? "\nFonds insuffisants" : "\nFonds insuffisants ou Blocage épargne");
        return null;
      }
    }

    const dateActuelle: Date = new Date();
    return new Transaction(0, montant, dateActuelle, type, compte);
  }

  public afficherTransactions(transactions: Transaction[]): void {
    if (!transactions || transactions.length === 0) console.log("\nAucune transaction trouvée\n");
    else for (const t of transactions) console.log(t.toString());
  }

  public afficherTransactionsParCompte(compte: Compte, transactions: Transaction[]): void {
    console.log("\n=== Transactions du compte " + (compte as any).numero + " ===");
    if (!transactions || transactions.length === 0) { console.log("\nAucune transaction trouvée pour ce compte\n"); return; }
    for (const t of transactions) console.log(t.toString());
  }
}
