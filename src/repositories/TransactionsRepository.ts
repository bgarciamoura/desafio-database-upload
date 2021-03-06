import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // TODO
    const transactions = await this.find();
    const { income, outcome } = transactions.reduce(
      (accumulator: Balance, transaction: Transaction) => {
        if (transaction.type === 'outcome') {
          accumulator.outcome += transaction.value;
        } else {
          accumulator.income += transaction.value;
        }
        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const balance = {
      income,
      outcome,
      total: income - outcome,
    } as Balance;

    return balance;
  }
}

export default TransactionsRepository;
