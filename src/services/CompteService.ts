import { Compte } from "../entity/Compte";

export interface CompteService {
  addCompte(compte: Compte): Promise<Compte | null>;
  numeroExiste(numero: string): Promise<boolean>;
  getCompteById(id: number): Promise<Compte | null>;
  getAllComptes(): Promise<Compte[]>;
}