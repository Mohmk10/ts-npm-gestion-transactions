import * as readlineSync from 'readline-sync';
import { CompteService } from '../services/CompteService';
import { Compte } from '../entity/Compte';
import { CompteCheque } from '../entity/CompteCheque';
import { CompteEpargne } from '../entity/CompteEpargne';

export class CompteView {
  public saisieString(message: string): string {
    let valeur: string;
    while (true) {
      const input = readlineSync.question(`\n${message}: `);
      if (input.trim() !== '') { valeur = input; break; }
      else { console.error("Veuillez saisir une valeur non vide."); }
    }
    return valeur;
  }

  public saisieNumber(message: string): number {
    while (true) {
      const input = readlineSync.question(`\n${message}: `);
      const valeur = parseInt(input, 10);
      if (!isNaN(valeur)) return valeur;
      console.log("\nEntrée invalide. Veuillez saisir un nombre entier.\n");
    }
  }

  async saisieCompte(compteService: CompteService): Promise<Compte | null> {
    const num: string = this.saisieString("Entrez le Numéro");

    if (await compteService.numeroExiste(num)) {
      console.log("\nCe numéro existe déjà. Choisissez-en un autre\n");
      return null;
    }

    console.log(`\n1 - Ajout de compte de Chèque`);
    console.log(`\n2 - Ajout de compte d'Epargne`);

    let type: number;
    do {
      type = this.saisieNumber("Choisissez");
      if (type != 1 && type != 2) console.log("\nVeuillez choisir entre 1 & 2");
    } while (type != 1 && type != 2);

    const dateActuelle: Date = new Date();
    if (type == 1) {
      return new CompteCheque(0, num, 0, dateActuelle);
    } else {
      const dureeBlocage: number = this.saisieNumber("Entrez la durée de blocage (en mois)");
      return new CompteEpargne(0, num, 0, dateActuelle, dateActuelle, dureeBlocage);
    }
  }

  public afficherCompteParId(compte: Compte): void {
    if (!compte) console.log("\nAucun compte trouvé avec cet ID\n");
    else console.log(compte.toString());
  }

  public afficherComptes(comptes: Compte[]): void {
    if (!comptes || comptes.length === 0) console.log("\nLe tableau de Comptes est vide\n");
    else for (const c of comptes) console.log(c.toString());
  }
}
