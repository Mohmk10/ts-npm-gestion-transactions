import { TypeCompte } from './TypeCompte';
import { Compte } from "./Compte";

export class CompteCheque extends Compte {
  private static readonly FRAIS: number = 0.08;

  constructor(id: number, numero: string, solde: number, dateOuverture: Date) {
    super(id, numero, solde, dateOuverture, TypeCompte.CHEQUE);
  }

  depot(montant: number): void {
    const fact: number = montant * CompteCheque.FRAIS;
    this._solde += montant - fact;
  }

  retrait(montant: number): boolean {
    const fact: number = montant * CompteCheque.FRAIS;
    const montantTotal: number = montant + fact;

    if (this._solde >= montantTotal) {
      this._solde -= montantTotal;
      return true;
    }

    return false;
  }
}