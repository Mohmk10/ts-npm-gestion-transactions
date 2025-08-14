import { Transaction } from '../entity/Transaction';
import { CompteRepository } from '../repository/CompteRepository';
import { CompteRepositoryImpl } from '../repository/CompteRepositoryImpl';
import { TransactionRepository } from '../repository/TransactionRepository';
import { TransactionRepositoryImpl } from '../repository/TransactionRepositoryImpl';
import { TransactionService } from './TransactionService';

export class TransactionServiceImpl implements TransactionService {
  private readonly transactionRepository: TransactionRepository = new TransactionRepositoryImpl();
  private readonly compteRepository: CompteRepository = new CompteRepositoryImpl();

  async addTransaction(transaction: Transaction): Promise<Transaction | null> {

    const savedTransaction = await this.transactionRepository.save(transaction);
    if (savedTransaction) {
      await this.compteRepository.updateSolde(transaction.compte.id, transaction.compte.solde);
    }
    return savedTransaction;
  }

  getTransactionById(id: number): Promise<Transaction | null> { return this.transactionRepository.findById(id); }

  findByCompteId(compteId: number): Promise<Transaction[]> { return this.transactionRepository.findByCompteId(compteId); }

  getAllTransactions(): Promise<Transaction[]> { return this.transactionRepository.findAll(); }
  
}
